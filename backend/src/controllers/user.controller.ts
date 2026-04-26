import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/app-error.js";
import { ALL_ROLES, LOCALES } from "../constants/roles.js";
import { serializeAuthUser } from "../utils/serialize-auth-user.js";

function pickMutableUserFields(input: Record<string, unknown>) {
  const update: Record<string, unknown> = {};

  if (typeof input.name === "string") update.name = input.name.trim();
  if (typeof input.email === "string") update.email = input.email.trim().toLowerCase();
  if (typeof input.password === "string") update.password = input.password;
  if (typeof input.role === "string" && ALL_ROLES.includes(input.role as never)) update.role = input.role;
  if (typeof input.locale === "string" && LOCALES.includes(input.locale as never)) update.locale = input.locale;
  if (typeof input.bio === "string") update.bio = input.bio;
  if (typeof input.avatarUrl === "string") update.avatarUrl = input.avatarUrl;
  if (typeof input.isActive === "boolean") update.isActive = input.isActive;
  if (Array.isArray(input.adminIpWhitelist)) update.adminIpWhitelist = input.adminIpWhitelist;
  if (input.district) update.district = input.district;
  if (input.upazila) update.upazila = input.upazila;

  return update;
}

export const listUsersController = asyncHandler(async (_req: Request, res: Response) => {
  const users = await UserModel.find().select("-password -twoFASecret").sort({
    createdAt: -1
  });
  res.json({ success: true, data: users.map((user) => serializeAuthUser(user)) });
});

export const createUserController = asyncHandler(async (req: Request, res: Response) => {
  const payload = pickMutableUserFields(req.body);
  if (!payload.email || !payload.password || !payload.name) {
    throw new AppError("Name, email, and password are required", StatusCodes.BAD_REQUEST);
  }

  const existing = await UserModel.findOne({ email: payload.email });
  if (existing) throw new AppError("Email already exists", StatusCodes.CONFLICT);
  const user = await UserModel.create(payload);
  res.status(StatusCodes.CREATED).json({ success: true, data: serializeAuthUser(user) });
});

export const updateUserController = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.params.id).select("+password +twoFASecret");
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  const payload = pickMutableUserFields(req.body);
  if (payload.email && payload.email !== user.email) {
    const existing = await UserModel.findOne({ email: payload.email });
    if (existing && existing._id.toString() !== user._id.toString()) {
      throw new AppError("Email already exists", StatusCodes.CONFLICT);
    }
  }

  Object.assign(user, payload);
  await user.save();

  res.json({ success: true, data: serializeAuthUser(user) });
});
