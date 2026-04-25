import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/async-handler.js";
import { login, refreshSession, setupTwoFactor, signup, verifyAndEnableTwoFactor } from "../services/auth.service.js";
import { env } from "../config/env.js";

const baseCookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: "lax" as const,
  path: "/"
};

function resolveCookieOptions(req: Request) {
  const configuredDomain = env.COOKIE_DOMAIN.trim();
  if (!configuredDomain) {
    return baseCookieOptions;
  }

  const normalizedDomain = configuredDomain.replace(/^\./, "");
  const host = req.hostname.replace(/^\./, "");
  if (normalizedDomain === "localhost" || normalizedDomain === "127.0.0.1") {
    return baseCookieOptions;
  }

  if (host === normalizedDomain || host.endsWith(`.${normalizedDomain}`)) {
    return {
      ...baseCookieOptions,
      domain: configuredDomain
    };
  }

  return baseCookieOptions;
}

export const signupController = asyncHandler(async (req: Request, res: Response) => {
  const cookieOptions = resolveCookieOptions(req);
  const tokens = await signup(req.body);
  res
    .cookie("accessToken", tokens.accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 })
    .cookie("refreshToken", tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 30
    })
    .status(StatusCodes.CREATED)
    .json({ success: true });
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const sourceIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? req.ip;
  const cookieOptions = resolveCookieOptions(req);
  const tokens = await login({ ...req.body, sourceIp });
  res
    .cookie("accessToken", tokens.accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 })
    .cookie("refreshToken", tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 30
    })
    .status(StatusCodes.OK)
    .json({ success: true });
});

export const refreshController = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  const cookieOptions = resolveCookieOptions(req);
  const tokens = await refreshSession(refreshToken);
  res
    .cookie("accessToken", tokens.accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 })
    .cookie("refreshToken", tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 30
    })
    .json({ success: true });
});

export const logoutController = asyncHandler(async (_req: Request, res: Response) => {
  const cookieOptions = resolveCookieOptions(_req);
  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(StatusCodes.OK)
    .json({ success: true });
});

export const setupTwoFactorController = asyncHandler(async (req: Request, res: Response) => {
  const payload = await setupTwoFactor(req.authUser!._id.toString());
  res.status(StatusCodes.OK).json({ success: true, data: payload });
});

export const verifyTwoFactorController = asyncHandler(async (req: Request, res: Response) => {
  await verifyAndEnableTwoFactor(req.authUser!._id.toString(), req.body.otpCode);
  res.status(StatusCodes.OK).json({ success: true });
});

export const meController = asyncHandler(async (req: Request, res: Response) => {
  const user = req.authUser!;
  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      locale: user.locale,
      avatarUrl: user.avatarUrl
    }
  });
});
