import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PageModel } from "../models/page.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/app-error.js";

export const listPagesController = asyncHandler(async (_req: Request, res: Response) => {
  const pages = await PageModel.find().lean();
  res.json({ success: true, data: pages });
});

export const upsertPageController = asyncHandler(async (req: Request, res: Response) => {
  const page = await PageModel.findOneAndUpdate({ slug: req.body.slug }, req.body, {
    new: true,
    upsert: true
  });
  res.status(StatusCodes.OK).json({ success: true, data: page });
});

export const getPageBySlugController = asyncHandler(async (req: Request, res: Response) => {
  const page = await PageModel.findOne({ slug: req.params.slug, isPublished: true }).lean();
  if (!page) throw new AppError("Page not found", StatusCodes.NOT_FOUND);
  res.status(StatusCodes.OK).json({ success: true, data: page });
});
