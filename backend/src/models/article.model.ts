import { Schema, model, type HydratedDocument } from "mongoose";
import {
  ARTICLE_BADGES,
  ARTICLE_WORKFLOW_STATUS,
  type ArticleBadge,
  type ArticleWorkflowStatus
} from "../constants/roles.js";
import { makeSlug } from "../utils/slug.js";

interface ArticleTranslation {
  title: string;
  summary?: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

interface RevisionItem {
  updatedBy: Schema.Types.ObjectId;
  note?: string;
  data: {
    titleBn: string;
    titleEn: string;
    status: ArticleWorkflowStatus;
  };
  createdAt: Date;
}

interface WorkflowItem {
  status: ArticleWorkflowStatus;
  actionBy: Schema.Types.ObjectId;
  note?: string;
  createdAt: Date;
}

export interface IArticle {
  slug: string;
  author: Schema.Types.ObjectId;
  editor?: Schema.Types.ObjectId;
  category: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  featuredImage?: string;
  gallery: string[];
  videoUrl?: string;
  translations: {
    bn: ArticleTranslation;
    en: ArticleTranslation;
  };
  status: ArticleWorkflowStatus;
  badges: ArticleBadge[];
  sponsoredLabel?: string;
  isBreaking: boolean;
  isTrending: boolean;
  isLiveUpdate: boolean;
  publishedAt?: Date;
  scheduledAt?: Date;
  district?: Schema.Types.ObjectId;
  upazila?: Schema.Types.ObjectId;
  viewCount: number;
  correctionNote?: string;
  internalLinks: string[];
  ogImage?: string;
  revisions: RevisionItem[];
  workflowHistory: WorkflowItem[];
}

const articleSchema = new Schema<IArticle>(
  {
    slug: { type: String, trim: true, unique: true, required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    editor: { type: Schema.Types.ObjectId, ref: "User" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    featuredImage: { type: String },
    gallery: [{ type: String }],
    videoUrl: { type: String },
    translations: {
      bn: {
        title: { type: String, required: true },
        summary: { type: String },
        content: { type: String, required: true },
        seoTitle: { type: String },
        seoDescription: { type: String },
        seoKeywords: [{ type: String }]
      },
      en: {
        title: { type: String, required: true },
        summary: { type: String },
        content: { type: String, required: true },
        seoTitle: { type: String },
        seoDescription: { type: String },
        seoKeywords: [{ type: String }]
      }
    },
    status: {
      type: String,
      enum: Object.values(ARTICLE_WORKFLOW_STATUS),
      default: ARTICLE_WORKFLOW_STATUS.DRAFT,
      index: true
    },
    badges: [{ type: String, enum: Object.values(ARTICLE_BADGES), default: [] }],
    sponsoredLabel: { type: String },
    isBreaking: { type: Boolean, default: false, index: true },
    isTrending: { type: Boolean, default: false, index: true },
    isLiveUpdate: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, index: true },
    scheduledAt: { type: Date, index: true },
    district: { type: Schema.Types.ObjectId, ref: "District", index: true },
    upazila: { type: Schema.Types.ObjectId, ref: "Upazila", index: true },
    viewCount: { type: Number, default: 0 },
    correctionNote: { type: String },
    internalLinks: [{ type: String }],
    ogImage: { type: String },
    revisions: [
      {
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        note: { type: String },
        data: {
          titleBn: { type: String, required: true },
          titleEn: { type: String, required: true },
          status: { type: String, required: true }
        },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    workflowHistory: [
      {
        status: { type: String, required: true },
        actionBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        note: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

articleSchema.index({ "translations.bn.title": "text", "translations.en.title": "text" });
articleSchema.index({
  "translations.bn.content": "text",
  "translations.en.content": "text",
  "translations.bn.summary": "text",
  "translations.en.summary": "text"
});

articleSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.translations?.en?.title) {
    this.slug = makeSlug(this.translations.en.title);
  }
  next();
});

export const ArticleModel = model<IArticle>("Article", articleSchema);
export type ArticleDocument = HydratedDocument<IArticle>;
