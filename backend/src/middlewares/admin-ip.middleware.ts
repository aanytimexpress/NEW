import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env.js";
import { ROLES } from "../constants/roles.js";
import { AppError } from "../utils/app-error.js";

export function enforceAdminIpWhitelist(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.authUser) {
    next(new AppError("Authentication required", StatusCodes.UNAUTHORIZED));
    return;
  }

  if (req.authUser.role !== ROLES.SUPER_ADMIN && req.authUser.role !== ROLES.ADMIN) {
    next();
    return;
  }

  const sourceIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? req.ip;
  const allowedIps = [...env.adminIpWhitelist, ...req.authUser.adminIpWhitelist];
  if (!allowedIps.includes(sourceIp)) {
    next(new AppError("Admin login blocked by IP whitelist", StatusCodes.FORBIDDEN));
    return;
  }
  next();
}
