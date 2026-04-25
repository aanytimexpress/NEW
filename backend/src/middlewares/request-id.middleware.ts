import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  req.requestId = req.headers["x-request-id"]?.toString() ?? randomUUID();
  res.setHeader("x-request-id", req.requestId);
  next();
}
