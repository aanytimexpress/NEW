export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  EDITOR: "editor",
  REPORTER: "reporter",
  AUTHOR: "author",
  SUBSCRIBER: "subscriber"
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ARTICLE_WORKFLOW_STATUS = {
  DRAFT: "draft",
  IN_REVIEW: "in_review",
  APPROVED: "approved",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
  ARCHIVED: "archived",
  REJECTED: "rejected"
} as const;

export type ArticleWorkflowStatus =
  (typeof ARTICLE_WORKFLOW_STATUS)[keyof typeof ARTICLE_WORKFLOW_STATUS];

export const ARTICLE_BADGES = {
  UPDATED: "updated",
  CORRECTION: "correction",
  EXCLUSIVE: "exclusive",
  FACT_CHECK: "fact_check",
  SPONSORED: "sponsored",
  LIVE: "live"
} as const;

export type ArticleBadge = (typeof ARTICLE_BADGES)[keyof typeof ARTICLE_BADGES];

export const LOCALES = ["bn", "en"] as const;
export type Locale = (typeof LOCALES)[number];
