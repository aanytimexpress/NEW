import { Schema, model } from "mongoose";
import { makeSlug } from "../utils/slug.js";

interface PageTranslation {
  title: string;
  body: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface IPage {
  slug: string;
  type:
    | "about"
    | "contact"
    | "privacy"
    | "terms"
    | "event_calendar"
    | "job_circular"
    | "tender_notice"
    | "announcement"
    | "obituary";
  translations: {
    bn: PageTranslation;
    en: PageTranslation;
  };
  isPublished: boolean;
}

const pageSchema = new Schema<IPage>(
  {
    slug: { type: String, unique: true, required: true },
    type: {
      type: String,
      enum: [
        "about",
        "contact",
        "privacy",
        "terms",
        "event_calendar",
        "job_circular",
        "tender_notice",
        "announcement",
        "obituary"
      ],
      required: true
    },
    translations: {
      bn: {
        title: { type: String, required: true },
        body: { type: String, required: true },
        seoTitle: { type: String },
        seoDescription: { type: String }
      },
      en: {
        title: { type: String, required: true },
        body: { type: String, required: true },
        seoTitle: { type: String },
        seoDescription: { type: String }
      }
    },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

pageSchema.pre("validate", function setSlug(next) {
  if (!this.slug) {
    this.slug = makeSlug(this.type);
  }
  next();
});

export const PageModel = model<IPage>("Page", pageSchema);
