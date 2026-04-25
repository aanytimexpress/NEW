import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SubscriberModel } from "../models/subscriber.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/app-error.js";
import { subscribeToMailchimp } from "../services/newsletter.service.js";

export const subscribeController = asyncHandler(async (req: Request, res: Response) => {
  const email = String(req.body.email).toLowerCase();
  const locale = req.body.locale === "en" ? "en" : "bn";
  const exists = await SubscriberModel.findOne({ email });
  if (exists) {
    throw new AppError("Already subscribed", StatusCodes.CONFLICT);
  }
  const mailchimpSync = await subscribeToMailchimp(email, locale);
  const subscriber = await SubscriberModel.create({
    email,
    locale,
    source: mailchimpSync === "synced" ? "mailchimp" : "web"
  });
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: subscriber,
    mailchimpSync
  });
});

export const listSubscribersController = asyncHandler(async (_req: Request, res: Response) => {
  const subscribers = await SubscriberModel.find({ isActive: true }).lean();
  res.status(StatusCodes.OK).json({ success: true, data: subscribers });
});
