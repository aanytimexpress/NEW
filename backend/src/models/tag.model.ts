import { Schema, model } from "mongoose";
import { makeSlug } from "../utils/slug.js";

export interface ITag {
  slug: string;
  translations: {
    bn: { label: string };
    en: { label: string };
  };
}

const tagSchema = new Schema<ITag>(
  {
    slug: { type: String, unique: true, trim: true, required: true },
    translations: {
      bn: { label: { type: String, required: true } },
      en: { label: { type: String, required: true } }
    }
  },
  { timestamps: true }
);

tagSchema.pre("validate", function setSlug(next) {
  if (!this.slug) {
    this.slug = makeSlug(this.translations.en.label);
  }
  next();
});

export const TagModel = model<ITag>("Tag", tagSchema);
