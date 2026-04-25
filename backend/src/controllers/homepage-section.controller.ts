import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HomepageSectionModel } from "../models/homepage-section.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const listHomepageSectionsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const sections = await HomepageSectionModel.find().sort({ order: 1 }).lean();
    res.json({ success: true, data: sections });
  }
);

export const upsertHomepageSectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const section = await HomepageSectionModel.findOneAndUpdate(
      { key: req.body.key },
      req.body,
      { new: true, upsert: true }
    );
    res.status(StatusCodes.OK).json({ success: true, data: section });
  }
);
