import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { Role } from "../constants/roles.js";

interface TokenPayload {
  sub: string;
  role: Role;
  type: "access" | "refresh";
}

export function signAccessToken(userId: string, role: Role): string {
  const expiresIn = env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"];
  return jwt.sign({ sub: userId, role, type: "access" }, env.JWT_ACCESS_SECRET, {
    expiresIn
  });
}

export function signRefreshToken(userId: string, role: Role): string {
  const expiresIn = env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"];
  return jwt.sign({ sub: userId, role, type: "refresh" }, env.JWT_REFRESH_SECRET, {
    expiresIn
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}
