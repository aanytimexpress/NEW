import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { MediaModel } from "../models/media.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { processAndStoreImage } from "../services/media.service.js";
import { AppError } from "../utils/app-error.js";

export const uploadMediaController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError("File is required", StatusCodes.BAD_REQUEST);
  }
  const media = await processAndStoreImage({
    filePath: req.file.path,
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    uploaderId: req.authUser!._id.toString(),
    folder: req.body.folder
  });
  res.status(StatusCodes.CREATED).json({ success: true, data: media });
});

export const listMediaController = asyncHandler(async (req: Request, res: Response) => {
  const filters: Record<string, unknown> = {};
  if (req.query.folder) filters.folder = req.query.folder;
  const media = await MediaModel.find(filters).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: media });
});
