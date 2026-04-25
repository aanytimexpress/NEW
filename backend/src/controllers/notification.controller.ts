import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { NotificationModel } from "../models/notification.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createNotificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await NotificationModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: notification });
  }
);

export const listNotificationController = asyncHandler(
  async (_req: Request, res: Response) => {
    const notifications = await NotificationModel.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: notifications });
  }
);
