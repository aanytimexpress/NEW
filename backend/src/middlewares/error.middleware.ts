import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/app-error.js";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  const payload = {
    success: false,
    message: error.message,
    ...(error instanceof AppError && error.details ? { details: error.details } : {})
  };

  res.status(statusCode).json(payload);
}
