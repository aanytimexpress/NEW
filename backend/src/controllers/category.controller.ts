import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CategoryModel } from "../models/category.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: category });
});

export const listCategoryController = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await CategoryModel.find({ isVisible: true }).sort({ sortOrder: 1 }).lean();
  res.json({ success: true, data: categories });
});

export const updateCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json({ success: true, data: category });
});
