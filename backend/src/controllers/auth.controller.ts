import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/async-handler.js";
import {
  login,
  refreshSession,
  setupTwoFactor,
  signup,
  verifyAndEnableTwoFactor
} from "../services/auth.service.js";
import { clearAuthCookies, setAuthCookies } from "../utils/auth-cookies.js";
import { serializeAuthUser } from "../utils/serialize-auth-user.js";

export const signupController = asyncHandler(async (req: Request, res: Response) => {
  const session = await signup(req.body);
  setAuthCookies(res, req, session);
  res.status(StatusCodes.CREATED).json({ success: true, data: { user: session.user } });
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const sourceIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? req.ip;
  const session = await login({ ...req.body, sourceIp });
  setAuthCookies(res, req, session);
  res.status(StatusCodes.OK).json({ success: true, data: { user: session.user } });
});

export const refreshController = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  const session = await refreshSession(refreshToken);
  setAuthCookies(res, req, session);
  res.json({ success: true, data: { user: session.user } });
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  clearAuthCookies(res, req);
  res.status(StatusCodes.OK).json({ success: true });
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
  res.status(StatusCodes.OK).json({ success: true, data: serializeAuthUser(user) });
});
