import type { NextFunction, Request, Response } from "express";
import { writeActivityLog } from "../services/activity-log.service.js";

export function auditTrail(req: Request, res: Response, next: NextFunction): void {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }

  res.on("finish", () => {
    if (!req.authUser || res.statusCode >= 400) {
      return;
    }

    void writeActivityLog({
      actor: req.authUser._id.toString(),
      action: `${req.method} ${req.originalUrl}`,
      entityType: "api",
      ip: req.ip,
      userAgent: req.get("user-agent"),
      metadata: {
        statusCode: res.statusCode,
        requestId: req.requestId
      }
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.warn("Activity log write skipped:", (error as Error).message);
    });
  });
  next();
}
