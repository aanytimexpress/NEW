import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/app-error.js";

export const listUsersController = asyncHandler(async (_req: Request, res: Response) => {
  const users = await UserModel.find().select("-password -twoFASecret").lean();
  res.json({ success: true, data: users });
});

export const createUserController = asyncHandler(async (req: Request, res: Response) => {
  const existing = await UserModel.findOne({ email: req.body.email });
  if (existing) throw new AppError("Email already exists", StatusCodes.CONFLICT);
  const user = await UserModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: user });
});

export const updateUserController = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }).select("-password -twoFASecret");

  res.json({ success: true, data: user });
});
