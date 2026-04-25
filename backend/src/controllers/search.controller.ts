import type { Request, Response } from "express";
import { ArticleModel } from "../models/article.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const globalSearchController = asyncHandler(async (req: Request, res: Response) => {
  const {
    q = "",
    category,
    author,
    from,
    to,
    page = "1",
    limit = "20"
  } = req.query;

  const filters: Record<string, unknown> = {
    status: "published"
  };

  if (q) filters.$text = { $search: String(q) };
  if (category) filters.category = category;
  if (author) filters.author = author;
  if (from || to) {
    filters.publishedAt = {
      ...(from ? { $gte: new Date(String(from)) } : {}),
      ...(to ? { $lte: new Date(String(to)) } : {})
    };
  }

  const data = await ArticleModel.find(filters)
    .sort({ score: { $meta: "textScore" }, publishedAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate("author", "name")
    .populate("category", "translations slug")
    .lean();

  res.json({ success: true, data });
});

export const categorySearchController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await ArticleModel.find({
      status: "published",
      category: req.params.categoryId
    })
      .sort({ publishedAt: -1 })
      .limit(50)
      .lean();

    res.json({ success: true, data });
  }
);

export const authorSearchController = asyncHandler(async (req: Request, res: Response) => {
  const data = await ArticleModel.find({
    status: "published",
    author: req.params.authorId
  })
    .sort({ publishedAt: -1 })
    .limit(50)
    .lean();

  res.json({ success: true, data });
});
