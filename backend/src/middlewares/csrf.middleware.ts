import { randomBytes, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const CSRF_COOKIE = "_csrf";
const CSRF_HEADER = "x-csrf-token";

export function issueCsrfToken(req: Request, res: Response): void {
  const existing = req.cookies?.[CSRF_COOKIE];
  const token = existing || randomBytes(32).toString("hex");
  if (!existing) {
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });
  }
  res.status(200).json({ success: true, csrfToken: token });
}

export function csrfProtection(req: Request, _res: Response, next: NextFunction): void {
  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.get(CSRF_HEADER);

  if (!cookieToken || !headerToken) {
    next(new Error("Invalid CSRF token"));
    return;
  }

  const a = Buffer.from(cookieToken);
  const b = Buffer.from(headerToken);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    next(new Error("Invalid CSRF token"));
    return;
  }

  next();
}
