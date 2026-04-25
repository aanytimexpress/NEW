import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AdModel } from "../models/ad.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createAdController = asyncHandler(async (req: Request, res: Response) => {
  const ad = await AdModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: ad });
});

export const listAdsController = asyncHandler(async (req: Request, res: Response) => {
  const filters: Record<string, unknown> = {};
  if (req.query.placement) filters.placement = req.query.placement;
  if (req.query.category) filters.category = req.query.category;
  const ads = await AdModel.find(filters).sort({ priority: 1 }).lean();
  res.json({ success: true, data: ads });
});

export const updateAdController = asyncHandler(async (req: Request, res: Response) => {
  const ad = await AdModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: ad });
});
