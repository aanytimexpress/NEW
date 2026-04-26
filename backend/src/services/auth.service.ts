import speakeasy from "speakeasy";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env.js";
import { ROLES, type Locale, type Role } from "../constants/roles.js";
import { UserModel, type UserDocument } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/jwt.js";
import { serializeAuthUser } from "../utils/serialize-auth-user.js";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  locale?: Locale;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: ReturnType<typeof serializeAuthUser>;
}

export async function signup(input: SignupInput) {
  const existing = await UserModel.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new AppError("Email already registered", StatusCodes.CONFLICT);
  }

  const user = await UserModel.create({
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password,
    role: ROLES.SUBSCRIBER,
    locale: input.locale ?? "bn"
  });

  return issueAuthSession(user);
}

export async function login(input: {
  email: string;
  password: string;
  otpCode?: string;
  sourceIp?: string;
}) {
  const user = await UserModel.findOne({ email: input.email.toLowerCase() }).select(
    "+password +twoFASecret"
  );
  if (!user) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  if (!user.isActive) {
    throw new AppError("Account disabled", StatusCodes.FORBIDDEN);
  }

  const passwordValid = await user.comparePassword(input.password);
  if (!passwordValid) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  if (user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN) {
    const allowedIps = [...env.adminIpWhitelist, ...user.adminIpWhitelist];
    if (input.sourceIp && !allowedIps.includes(input.sourceIp)) {
      throw new AppError("Admin login blocked by IP whitelist", StatusCodes.FORBIDDEN);
    }
  }

  if (user.is2FAEnabled) {
    const otpValid =
      !!input.otpCode &&
      speakeasy.totp.verify({
        secret: user.twoFASecret ?? "",
        encoding: "base32",
        token: input.otpCode,
        window: 1
      });

    if (!otpValid) {
      throw new AppError("2FA token required or invalid", StatusCodes.UNAUTHORIZED);
    }
  }

  user.lastLoginAt = new Date();
  await user.save();

  return issueAuthSession(user);
}

export async function refreshSession(refreshToken: string) {
  if (!refreshToken) {
    throw new AppError("Refresh token missing", StatusCodes.UNAUTHORIZED);
  }

  const payload = verifyRefreshToken(refreshToken);
  if (payload.type !== "refresh") {
    throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
  }

  const user = await UserModel.findById(payload.sub);
  if (!user || !user.isActive) {
    throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
  }

  if (user.passwordChangedAt && payload.iat) {
    const passwordChangedAtInSeconds = Math.floor(user.passwordChangedAt.getTime() / 1000);
    if (passwordChangedAtInSeconds > payload.iat) {
      throw new AppError("Refresh token expired after password change", StatusCodes.UNAUTHORIZED);
    }
  }

  return issueAuthSession(user);
}

export async function setupTwoFactor(userId: string) {
  const user = await UserModel.findById(userId).select("+twoFASecret");
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  const secret = speakeasy.generateSecret({
    issuer: env.TOTP_ISSUER,
    name: user.email
  });

  user.twoFASecret = secret.base32;
  user.is2FAEnabled = false;
  await user.save();

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url
  };
}

export async function verifyAndEnableTwoFactor(userId: string, otpCode: string) {
  const user = await UserModel.findById(userId).select("+twoFASecret");
  if (!user || !user.twoFASecret) {
    throw new AppError("2FA setup not found", StatusCodes.NOT_FOUND);
  }

  const isValid = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: "base32",
    token: otpCode,
    window: 1
  });

  if (!isValid) {
    throw new AppError("Invalid OTP code", StatusCodes.BAD_REQUEST);
  }

  user.is2FAEnabled = true;
  await user.save();
}

function issueAuthTokens(userId: string, role: Role) {
  const accessToken = signAccessToken(userId, role);
  const refreshToken = signRefreshToken(userId, role);
  return { accessToken, refreshToken };
}

function issueAuthSession(user: UserDocument): AuthSession {
  return {
    ...issueAuthTokens(user._id.toString(), user.role),
    user: serializeAuthUser(user)
  };
}
