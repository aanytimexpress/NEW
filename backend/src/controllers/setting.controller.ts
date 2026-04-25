import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SettingModel } from "../models/setting.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const listSettingsController = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await SettingModel.find().lean();
  res.json({ success: true, data: settings });
});

export const upsertSettingController = asyncHandler(async (req: Request, res: Response) => {
  const setting = await SettingModel.findOneAndUpdate(
    { key: req.body.key },
    req.body,
    { new: true, upsert: true }
  );
  res.status(StatusCodes.OK).json({ success: true, data: setting });
});
