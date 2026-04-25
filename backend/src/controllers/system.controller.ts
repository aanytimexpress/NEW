import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ActivityLogModel } from "../models/activity-log.model.js";
import { ArticleModel } from "../models/article.model.js";
import { CategoryModel } from "../models/category.model.js";
import { MenuModel } from "../models/menu.model.js";
import { SettingModel } from "../models/setting.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const listActivityLogsController = asyncHandler(async (_req: Request, res: Response) => {
  const logs = await ActivityLogModel.find()
    .populate("actor", "name role email")
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();
  res.status(StatusCodes.OK).json({ success: true, data: logs });
});

export const backupController = asyncHandler(async (_req: Request, res: Response) => {
  const [settings, categories, menus, latestArticles] = await Promise.all([
    SettingModel.find().lean(),
    CategoryModel.find().lean(),
    MenuModel.find().lean(),
    ArticleModel.find().sort({ updatedAt: -1 }).limit(500).lean()
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      generatedAt: new Date().toISOString(),
      settings,
      categories,
      menus,
      latestArticles
    }
  });
});

export const restoreController = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  if (payload.settings?.length) {
    await SettingModel.deleteMany({});
    await SettingModel.insertMany(payload.settings);
  }
  if (payload.categories?.length) {
    await CategoryModel.deleteMany({});
    await CategoryModel.insertMany(payload.categories);
  }
  if (payload.menus?.length) {
    await MenuModel.deleteMany({});
    await MenuModel.insertMany(payload.menus);
  }
  res.status(StatusCodes.OK).json({ success: true, message: "Restore completed" });
});
