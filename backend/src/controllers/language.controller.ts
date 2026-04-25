import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LanguageModel } from "../models/language.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const listLanguagesController = asyncHandler(async (_req: Request, res: Response) => {
  const languages = await LanguageModel.find().sort({ code: 1 }).lean();
  res.status(StatusCodes.OK).json({ success: true, data: languages });
});

export const upsertLanguageController = asyncHandler(async (req: Request, res: Response) => {
  const language = await LanguageModel.findOneAndUpdate(
    { code: req.body.code },
    req.body,
    { new: true, upsert: true }
  );
  res.status(StatusCodes.OK).json({ success: true, data: language });
});
