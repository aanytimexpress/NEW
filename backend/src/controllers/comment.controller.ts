import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CommentModel } from "../models/comment.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { detectSpam } from "../services/spam.service.js";

export const createCommentController = asyncHandler(async (req: Request, res: Response) => {
  const isSpam = detectSpam(req.body.message || "");
  const comment = await CommentModel.create({
    ...req.body,
    isSpam,
    isApproved: false,
    user: req.authUser?._id
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: comment,
    message: isSpam ? "Comment flagged for moderation" : "Comment submitted"
  });
});

export const listCommentController = asyncHandler(async (req: Request, res: Response) => {
  const filters: Record<string, unknown> = {};
  if (req.query.article) filters.article = req.query.article;
  if (req.query.approved) filters.isApproved = req.query.approved === "true";
  const comments = await CommentModel.find(filters).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: comments });
});

export const moderateCommentController = asyncHandler(async (req: Request, res: Response) => {
  const comment = await CommentModel.findByIdAndUpdate(
    req.params.id,
    {
      isApproved: req.body.isApproved,
      isSpam: req.body.isSpam ?? false,
      moderatedBy: req.authUser?._id,
      moderatedAt: new Date()
    },
    { new: true }
  );
  res.json({ success: true, data: comment });
});
