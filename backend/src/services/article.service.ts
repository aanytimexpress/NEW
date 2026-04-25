import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import {
  ARTICLE_WORKFLOW_STATUS,
  ROLES,
  type ArticleWorkflowStatus
} from "../constants/roles.js";
import { ArticleModel } from "../models/article.model.js";
import { AppError } from "../utils/app-error.js";

export async function transitionArticleStatus(input: {
  articleId: string;
  actorId: string;
  actorRole: string;
  nextStatus: ArticleWorkflowStatus;
  note?: string;
}) {
  const article = await ArticleModel.findById(input.articleId);
  if (!article) {
    throw new AppError("Article not found", StatusCodes.NOT_FOUND);
  }

  if (input.nextStatus === ARTICLE_WORKFLOW_STATUS.IN_REVIEW) {
    const canSubmit =
      input.actorRole === ROLES.REPORTER ||
      input.actorRole === ROLES.AUTHOR ||
      input.actorRole === ROLES.EDITOR;
    if (!canSubmit) throw new AppError("Only authoring roles can submit", StatusCodes.FORBIDDEN);
  }

  if (
    input.nextStatus === ARTICLE_WORKFLOW_STATUS.APPROVED &&
    ![ROLES.EDITOR, ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(input.actorRole as never)
  ) {
    throw new AppError("Only editor/admin can approve", StatusCodes.FORBIDDEN);
  }

  if (
    input.nextStatus === ARTICLE_WORKFLOW_STATUS.PUBLISHED &&
    ![ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(input.actorRole as never)
  ) {
    throw new AppError("Only admin can publish", StatusCodes.FORBIDDEN);
  }

  article.status = input.nextStatus;
  if (input.nextStatus === ARTICLE_WORKFLOW_STATUS.PUBLISHED) {
    article.publishedAt = new Date();
    article.scheduledAt = undefined;
  }

  article.workflowHistory.push({
    status: input.nextStatus,
    actionBy: input.actorId as never,
    note: input.note,
    createdAt: new Date()
  });

  await article.save();
  return article;
}

export function generateAutoSummary(content: string, maxChars = 250): string {
  const plainText = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (plainText.length <= maxChars) return plainText;
  return `${plainText.slice(0, maxChars).trim()}...`;
}

export function suggestTags(title: string, content: string): string[] {
  const merged = `${title} ${content}`.toLowerCase();
  const keywords = new Set<string>();
  const candidates = merged
    .replace(/<[^>]+>/g, " ")
    .match(/[a-zA-Z\u0980-\u09FF]{4,}/g);

  if (!candidates) return [];

  for (const word of candidates) {
    if (["that", "this", "with", "from", "about", "have"].includes(word)) continue;
    keywords.add(word);
    if (keywords.size >= 8) break;
  }

  return [...keywords];
}

export async function publishScheduledArticles(): Promise<number> {
  const now = dayjs().toDate();
  const result = await ArticleModel.updateMany(
    {
      status: ARTICLE_WORKFLOW_STATUS.SCHEDULED,
      scheduledAt: { $lte: now }
    },
    {
      $set: {
        status: ARTICLE_WORKFLOW_STATUS.PUBLISHED,
        publishedAt: now
      }
    }
  );

  return result.modifiedCount;
}
