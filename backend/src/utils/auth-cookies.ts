import type { CookieOptions, Request, Response } from "express";
import { env } from "../config/env.js";

export const AUTH_COOKIE_NAMES = {
  accessToken: "accessToken",
  refreshToken: "refreshToken"
} as const;

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: "lax",
  path: "/"
};

export function resolveAuthCookieOptions(req: Request): CookieOptions {
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

export function setAuthCookies(
  res: Response,
  req: Request,
  tokens: { accessToken: string; refreshToken: string }
): void {
  const cookieOptions = resolveAuthCookieOptions(req);

  res.cookie(AUTH_COOKIE_NAMES.accessToken, tokens.accessToken, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 15
  });
  res.cookie(AUTH_COOKIE_NAMES.refreshToken, tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24 * 30
  });
}

export function clearAuthCookies(res: Response, req: Request): void {
  const cookieOptions = resolveAuthCookieOptions(req);

  res.clearCookie(AUTH_COOKIE_NAMES.accessToken, cookieOptions);
  res.clearCookie(AUTH_COOKIE_NAMES.refreshToken, cookieOptions);
}
