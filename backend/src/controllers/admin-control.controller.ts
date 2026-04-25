import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ArticleModel } from "../models/article.model.js";
import { SettingModel } from "../models/setting.model.js";
import { asyncHandler } from "../utils/async-handler.js";

const adminConfigKeys = [
  "homepage_layout",
  "mega_menu",
  "widgets",
  "footer_text",
  "header_announcement",
  "site_logo",
  "site_favicon",
  "seo_global",
  "social_links",
  "contact_info",
  "language_labels",
  "module_toggles",
  "maintenance_mode"
] as const;

export const getAdminControlsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const settings = await SettingModel.find({ key: { $in: adminConfigKeys as unknown as string[] } })
      .lean();

    const indexed = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
    res.status(StatusCodes.OK).json({ success: true, data: indexed });
  }
);

export const updateAdminControlController = asyncHandler(
  async (req: Request, res: Response) => {
    const { key, value, group = "site" } = req.body;
    const setting = await SettingModel.findOneAndUpdate(
      { key },
      { key, value, group },
      { upsert: true, new: true }
    );

    res.status(StatusCodes.OK).json({ success: true, data: setting });
  }
);

export const manageBreakingNewsController = asyncHandler(
  async (req: Request, res: Response) => {
    const articleIds: string[] = req.body.articleIds ?? [];
    await ArticleModel.updateMany({}, { $set: { isBreaking: false } });
    if (articleIds.length) {
      await ArticleModel.updateMany({ _id: { $in: articleIds } }, { $set: { isBreaking: true } });
    }
    res.status(StatusCodes.OK).json({ success: true, count: articleIds.length });
  }
);

export const manageTrendingNewsController = asyncHandler(
  async (req: Request, res: Response) => {
    const articleIds: string[] = req.body.articleIds ?? [];
    await ArticleModel.updateMany({}, { $set: { isTrending: false } });
    if (articleIds.length) {
      await ArticleModel.updateMany({ _id: { $in: articleIds } }, { $set: { isTrending: true } });
    }
    res.status(StatusCodes.OK).json({ success: true, count: articleIds.length });
  }
);
