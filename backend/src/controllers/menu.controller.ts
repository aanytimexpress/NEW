import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { MenuModel } from "../models/menu.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const listMenuController = asyncHandler(async (_req: Request, res: Response) => {
  const menus = await MenuModel.find().lean();
  res.json({ success: true, data: menus });
});

export const upsertMenuController = asyncHandler(async (req: Request, res: Response) => {
  const menu = await MenuModel.findOneAndUpdate(
    { name: req.body.name, location: req.body.location },
    req.body,
    { new: true, upsert: true }
  );
  res.status(StatusCodes.OK).json({ success: true, data: menu });
});
