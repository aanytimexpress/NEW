import type { NextFunction, Request, Response } from "express";
import { isDatabaseReady } from "../config/database.js";
import { SettingModel } from "../models/setting.model.js";

let cachedMaintenance = false;
let checkedAt = 0;

export async function maintenanceModeGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const now = Date.now();
  if (now - checkedAt > 60_000 && isDatabaseReady()) {
    try {
      const setting = await SettingModel.findOne({ key: "maintenance_mode" }).lean();
      cachedMaintenance = Boolean(setting?.value);
      checkedAt = now;
    } catch (error) {
      checkedAt = now;
      // eslint-disable-next-line no-console
      console.warn("Unable to read maintenance mode setting:", (error as Error).message);
    }
  }

  if (cachedMaintenance && !req.path.startsWith("/auth")) {
    res.status(503).json({
      success: false,
      message: "Maintenance mode enabled"
    });
    return;
  }

  next();
}
