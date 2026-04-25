import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../models/user.model.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/app-error.js";
import type { Role } from "../constants/roles.js";
import { hasPermission, type Permission } from "../config/permissions.js";

function getToken(req: Request): string | null {
  const bearer = req.headers.authorization;
  if (bearer?.startsWith("Bearer ")) {
    return bearer.replace("Bearer ", "").trim();
  }
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken as string;
  }
  return null;
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const token = getToken(req);
  if (!token) {
    next(new AppError("Authentication required", StatusCodes.UNAUTHORIZED));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await UserModel.findById(payload.sub).select("+password +twoFASecret");
    if (!user || !user.isActive) {
      throw new AppError("Invalid user", StatusCodes.UNAUTHORIZED);
    }
    req.authUser = user;
    next();
  } catch {
    next(new AppError("Invalid or expired access token", StatusCodes.UNAUTHORIZED));
  }
}

export function requireRole(roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      next(new AppError("Authentication required", StatusCodes.UNAUTHORIZED));
      return;
    }

    if (!roles.includes(req.authUser.role)) {
      next(new AppError("Forbidden", StatusCodes.FORBIDDEN));
      return;
    }

    next();
  };
}

export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      next(new AppError("Authentication required", StatusCodes.UNAUTHORIZED));
      return;
    }

    if (!hasPermission(req.authUser.role, permission)) {
      next(new AppError("Insufficient permission", StatusCodes.FORBIDDEN));
      return;
    }

    next();
  };
}
