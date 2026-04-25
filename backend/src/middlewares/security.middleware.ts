import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import type { Request, RequestHandler } from "express";

export const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
});

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
  standardHeaders: true,
  legacyHeaders: false
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many login attempts. Please try again later." }
});

export const mongoSanitizeMiddleware = mongoSanitize();
export const hppMiddleware = hpp();

export const xssSanitizer: RequestHandler = (req, _res, next) => {
  const sanitizeObject = (value: unknown): unknown => {
    if (typeof value === "string") {
      return value.replace(/<script.*?>.*?<\/script>/gi, "").trim();
    }
    if (Array.isArray(value)) {
      return value.map((item) => sanitizeObject(item));
    }
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, nested]) => [key, sanitizeObject(nested)])
      );
    }
    return value;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query) as Request["query"];
  req.params = sanitizeObject(req.params) as Request["params"];
  next();
};
