import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "node:path";
import routes from "./routes/index.js";
import { env } from "./config/env.js";
import { AppError } from "./utils/app-error.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js";
import {
  apiRateLimiter,
  helmetMiddleware,
  hppMiddleware,
  mongoSanitizeMiddleware,
  xssSanitizer
} from "./middlewares/security.middleware.js";
import { requestIdMiddleware } from "./middlewares/request-id.middleware.js";
import { csrfProtection, issueCsrfToken } from "./middlewares/csrf.middleware.js";
import { maintenanceModeGuard } from "./middlewares/maintenance.middleware.js";
import { auditTrail } from "./middlewares/audit.middleware.js";

export function createApp() {
  const app = express();

  app.use(helmetMiddleware);
  app.use(cors({ origin: env.corsOrigins, credentials: true }));
  app.use(compression());
  app.use(morgan("combined"));
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(requestIdMiddleware);
  app.use(apiRateLimiter);
  app.use(mongoSanitizeMiddleware);
  app.use(hppMiddleware);
  app.use(xssSanitizer);

  app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "Bogura Kothon API healthy" });
  });

  app.get("/api/v1/csrf-token", issueCsrfToken);

  app.use("/uploads", express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));
  app.use("/api/v1", maintenanceModeGuard);
  app.use("/api/v1", auditTrail);
  app.use("/api/v1", (req, res, next) => {
    const isMutation = !["GET", "HEAD", "OPTIONS"].includes(req.method);
    const isAuthRoute = req.path.startsWith("/auth");
    if (isMutation && !isAuthRoute) {
      csrfProtection(req, res, next);
      return;
    }
    next();
  });
  app.use("/api/v1", routes);

  app.use((error: unknown, _req: express.Request, _res: express.Response, next: express.NextFunction) => {
    if ((error as Error)?.message === "Invalid CSRF token") {
      next(new AppError("Invalid CSRF token", 403));
      return;
    }
    next(error as Error);
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
