import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ARTICLE_WORKFLOW_STATUS, ROLES } from "../constants/roles.js";
import { ArticleModel } from "../models/article.model.js";
import { TagModel } from "../models/tag.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/app-error.js";
import {
  generateAutoSummary,
  suggestTags,
  transitionArticleStatus
} from "../services/article.service.js";
import { keywordDensity, suggestInternalLinks } from "../services/seo.service.js";
import { makeSlug } from "../utils/slug.js";

export const createArticleController = asyncHandler(async (req: Request, res: Response) => {
  const user = req.authUser!;

  const payload = req.body;
  const autoSummaryBn =
    payload.translations?.bn?.summary ??
    generateAutoSummary(payload.translations?.bn?.content ?? "");
  const autoSummaryEn =
    payload.translations?.en?.summary ??
    generateAutoSummary(payload.translations?.en?.content ?? "");

  const inferredTags = suggestTags(
    payload.translations?.en?.title ?? "",
    payload.translations?.en?.content ?? ""
  );

  const tagIds: string[] = [];
  for (const tag of inferredTags) {
    const existing = await TagModel.findOne({ "translations.en.label": tag });
    if (existing) {
      tagIds.push(existing._id.toString());
      continue;
    }
    const created = await TagModel.create({
      slug: makeSlug(tag),
      translations: { bn: { label: tag }, en: { label: tag } }
    });
    tagIds.push(created._id.toString());
  }

  const article = await ArticleModel.create({
    ...payload,
    slug: payload.slug || makeSlug(payload.translations?.en?.title ?? ""),
    author: user._id,
    status: payload.status ?? ARTICLE_WORKFLOW_STATUS.DRAFT,
    tags: payload.tags?.length ? payload.tags : tagIds,
    translations: {
      bn: {
        ...payload.translations.bn,
        summary: autoSummaryBn
      },
      en: {
        ...payload.translations.en,
        summary: autoSummaryEn
      }
    },
    workflowHistory: [
      {
        status: payload.status ?? ARTICLE_WORKFLOW_STATUS.DRAFT,
        actionBy: user._id,
        note: "Article created",
        createdAt: new Date()
      }
    ],
    revisions: [
      {
        updatedBy: user._id,
        note: "Initial draft",
        data: {
          titleBn: payload.translations.bn.title,
          titleEn: payload.translations.en.title,
          status: payload.status ?? ARTICLE_WORKFLOW_STATUS.DRAFT
        },
        createdAt: new Date()
      }
    ]
  });

  res.status(StatusCodes.CREATED).json({ success: true, data: article });
});

export const listArticlesController = asyncHandler(async (req: Request, res: Response) => {
  const {
    status,
    category,
    district,
    upazila,
    author,
    locale = "bn",
    search,
    sort = "latest",
    from,
    to,
    page = "1",
    limit = "20"
  } = req.query;

  const filters: Record<string, unknown> = {};
  if (status) filters.status = status;
  if (category) filters.category = category;
  if (district) filters.district = district;
  if (upazila) filters.upazila = upazila;
  if (author) filters.author = author;
  if (from || to) {
    filters.publishedAt = {
      ...(from ? { $gte: new Date(String(from)) } : {}),
      ...(to ? { $lte: new Date(String(to)) } : {})
    };
  }
  if (search) {
    filters.$text = { $search: String(search) };
  }

  const sortConfig: Record<string, 1 | -1> =
    sort === "trending"
      ? { isTrending: -1, viewCount: -1, publishedAt: -1 }
      : sort === "popular"
        ? { viewCount: -1, publishedAt: -1 }
        : { publishedAt: -1, createdAt: -1 };

  const articles = await ArticleModel.find(filters)
    .populate("author", "name role avatarUrl")
    .populate("category", "translations slug color icon")
    .sort(sortConfig)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .lean();

  const formatted = articles.map((article) => {
    const localeData = (article.translations as Record<string, unknown>)[String(locale)] as Record<
      string,
      unknown
    >;
    return {
      ...article,
      headline: localeData?.title,
      summary: localeData?.summary
    };
  });

  res.json({ success: true, data: formatted });
});

export const getArticleController = asyncHandler(async (req: Request, res: Response) => {
  const locale = (req.query.locale as string) || "bn";
  const article = await ArticleModel.findOne({ slug: req.params.slug })
    .populate("author", "name role bio avatarUrl")
    .populate("category", "translations slug color icon")
    .populate("tags", "translations slug")
    .lean();

  if (!article) {
    throw new AppError("Article not found", StatusCodes.NOT_FOUND);
  }

  await ArticleModel.updateOne({ _id: article._id }, { $inc: { viewCount: 1 } });
  const localeVersion = (article.translations as Record<string, unknown>)[locale];

  res.json({
    success: true,
    data: {
      ...article,
      localeVersion
    }
  });
});

export const updateArticleController = asyncHandler(async (req: Request, res: Response) => {
  const user = req.authUser!;
  const article = await ArticleModel.findById(req.params.id);
  if (!article) throw new AppError("Article not found", StatusCodes.NOT_FOUND);

  const isOwner = article.author.toString() === user._id.toString();
  const isPrivileged =
    user.role === ROLES.ADMIN ||
    user.role === ROLES.SUPER_ADMIN ||
    user.role === ROLES.EDITOR;
  if (!isOwner && !isPrivileged) {
    throw new AppError("You cannot edit this article", StatusCodes.FORBIDDEN);
  }

  const payload = req.body;
  Object.assign(article, payload);
  article.revisions.push({
    updatedBy: user._id as never,
    note: payload.revisionNote || "Content update",
    data: {
      titleBn: article.translations.bn.title,
      titleEn: article.translations.en.title,
      status: article.status
    },
    createdAt: new Date()
  });

  await article.save();
  res.json({ success: true, data: article });
});

export const changeArticleStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.authUser!;
    const article = await transitionArticleStatus({
      articleId: req.params.id,
      actorId: user._id.toString(),
      actorRole: user.role,
      nextStatus: req.body.status,
      note: req.body.note
    });

    res.json({ success: true, data: article });
  }
);

export const scheduleArticleController = asyncHandler(async (req: Request, res: Response) => {
  const user = req.authUser!;
  if (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN) {
    throw new AppError("Only admin can schedule publication", StatusCodes.FORBIDDEN);
  }

  const article = await ArticleModel.findById(req.params.id);
  if (!article) throw new AppError("Article not found", StatusCodes.NOT_FOUND);

  article.status = ARTICLE_WORKFLOW_STATUS.SCHEDULED;
  article.scheduledAt = new Date(req.body.scheduledAt);
  article.workflowHistory.push({
    status: ARTICLE_WORKFLOW_STATUS.SCHEDULED,
    actionBy: user._id as never,
    note: "Scheduled for publication",
    createdAt: new Date()
  });

  await article.save();
  res.json({ success: true, data: article });
});

export const seoInsightsController = asyncHandler(async (req: Request, res: Response) => {
  const article = await ArticleModel.findById(req.params.id);
  if (!article) throw new AppError("Article not found", StatusCodes.NOT_FOUND);

  const keyword = req.query.keyword?.toString() ?? "";
  const density = keyword
    ? keywordDensity(`${article.translations.bn.content} ${article.translations.en.content}`, keyword)
    : 0;
  const internalLinks = await suggestInternalLinks(article.translations.en.title);

  res.json({
    success: true,
    data: { keyword, density, internalLinks }
  });
});

export const listArticleRevisionsController = asyncHandler(
  async (req: Request, res: Response) => {
    const article = await ArticleModel.findById(req.params.id)
      .select("slug revisions updatedAt")
      .populate("revisions.updatedBy", "name role")
      .lean();

    if (!article) throw new AppError("Article not found", StatusCodes.NOT_FOUND);

    res.json({ success: true, data: article });
  }
);

export const rollbackArticleRevisionController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.authUser!;
    const article = await ArticleModel.findById(req.params.id);
    if (!article) throw new AppError("Article not found", StatusCodes.NOT_FOUND);

    const revisionIndex = Number(req.body.revisionIndex);
    const revision = article.revisions[revisionIndex];
    if (!revision) {
      throw new AppError("Revision not found", StatusCodes.NOT_FOUND);
    }

    article.translations.bn.title = revision.data.titleBn;
    article.translations.en.title = revision.data.titleEn;
    article.status = revision.data.status as never;
    article.revisions.push({
      updatedBy: user._id as never,
      note: `Rollback to revision ${revisionIndex}`,
      data: {
        titleBn: article.translations.bn.title,
        titleEn: article.translations.en.title,
        status: article.status
      },
      createdAt: new Date()
    });

    await article.save();
    res.json({ success: true, data: article });
  }
);

export const updateArticleFlagsController = asyncHandler(
  async (req: Request, res: Response) => {
    const article = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isBreaking: Boolean(req.body.isBreaking),
          isTrending: Boolean(req.body.isTrending),
          isLiveUpdate: Boolean(req.body.isLiveUpdate),
          badges: req.body.badges ?? undefined
        }
      },
      { new: true }
    );

    if (!article) throw new AppError("Article not found", StatusCodes.NOT_FOUND);
    res.json({ success: true, data: article });
  }
);
