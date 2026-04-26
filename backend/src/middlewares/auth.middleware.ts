import type { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { hasAnyPermission, hasPermission, type Permission } from "../config/permissions.js";
import { ADMIN_ROLES, NEWSROOM_ROLES, type Role } from "../constants/roles.js";
import { ArticleModel } from "../models/article.model.js";
import { UserModel } from "../models/user.model.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/app-error.js";
import { enforceAdminIpWhitelist } from "./admin-ip.middleware.js";

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
    if (payload.type !== "access") {
      throw new AppError("Invalid access token", StatusCodes.UNAUTHORIZED);
    }

    const user = await UserModel.findById(payload.sub).select("+password +twoFASecret");
    if (!user || !user.isActive) {
      throw new AppError("Invalid user", StatusCodes.UNAUTHORIZED);
    }

    if (user.passwordChangedAt && payload.iat) {
      const passwordChangedAtInSeconds = Math.floor(user.passwordChangedAt.getTime() / 1000);
      if (passwordChangedAtInSeconds > payload.iat) {
        throw new AppError("Session expired after password change", StatusCodes.UNAUTHORIZED);
      }
    }

    req.authUser = user;
    next();
  } catch {
    next(new AppError("Invalid or expired access token", StatusCodes.UNAUTHORIZED));
  }
}

export function requireRole(roles: readonly Role[]) {
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

export function requireAnyPermission(permissions: readonly Permission[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      next(new AppError("Authentication required", StatusCodes.UNAUTHORIZED));
      return;
    }

    if (!hasAnyPermission(req.authUser.role, permissions)) {
      next(new AppError("Insufficient permission", StatusCodes.FORBIDDEN));
      return;
    }

    next();
  };
}

export function requireNewsroomAccess(): RequestHandler[] {
  return [requireAuth, requireRole(NEWSROOM_ROLES)];
}

export function requireNewsroomPermission(permission: Permission): RequestHandler[] {
  return [...requireNewsroomAccess(), requirePermission(permission)];
}

export function requireAdminAccess(): RequestHandler[] {
  return [requireAuth, requireRole(ADMIN_ROLES), enforceAdminIpWhitelist];
}

export function requireAdminPermission(permission: Permission): RequestHandler[] {
  return [...requireAdminAccess(), requirePermission(permission)];
}

export async function requireArticleUpdateAccess(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.authUser) {
    next(new AppError("Authentication required", StatusCodes.UNAUTHORIZED));
    return;
  }

  const article = await ArticleModel.findById(req.params.id).select("author");
  if (!article) {
    next(new AppError("Article not found", StatusCodes.NOT_FOUND));
    return;
  }

  if (hasPermission(req.authUser.role, "articles:update:any")) {
    req.authArticle = article;
    next();
    return;
  }

  const ownsArticle = article.author.toString() === req.authUser._id.toString();
  if (ownsArticle && hasPermission(req.authUser.role, "articles:update:own")) {
    req.authArticle = article;
    next();
    return;
  }

  next(new AppError("You cannot edit this article", StatusCodes.FORBIDDEN));
}
