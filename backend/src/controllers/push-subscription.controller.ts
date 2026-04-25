import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PushSubscriptionModel } from "../models/push-subscription.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const registerPushSubscriptionController = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const record = await PushSubscriptionModel.findOneAndUpdate(
      { endpoint: payload.endpoint },
      {
        endpoint: payload.endpoint,
        keys: payload.keys,
        locale: payload.locale === "en" ? "en" : "bn",
        district: payload.district,
        user: req.authUser?._id,
        isActive: true
      },
      { upsert: true, new: true }
    );

    res.status(StatusCodes.CREATED).json({ success: true, data: record });
  }
);

export const unregisterPushSubscriptionController = asyncHandler(
  async (req: Request, res: Response) => {
    await PushSubscriptionModel.findOneAndUpdate(
      { endpoint: req.body.endpoint },
      { $set: { isActive: false } }
    );
    res.status(StatusCodes.OK).json({ success: true });
  }
);

export const listPushSubscriptionsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const records = await PushSubscriptionModel.find({ isActive: true }).lean();
    res.status(StatusCodes.OK).json({ success: true, data: records });
  }
);
