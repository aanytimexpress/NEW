import { Schema, model } from "mongoose";
import { makeSlug } from "../utils/slug.js";

interface CategoryTranslation {
  name: string;
  description?: string;
}

export interface ICategory {
  slug: string;
  icon?: string;
  color?: string;
  parent?: Schema.Types.ObjectId;
  translations: {
    bn: CategoryTranslation;
    en: CategoryTranslation;
  };
  isVisible: boolean;
  sortOrder: number;
}

const categorySchema = new Schema<ICategory>(
  {
    slug: { type: String, unique: true, required: true, trim: true },
    icon: { type: String },
    color: { type: String, default: "#0F766E" },
    parent: { type: Schema.Types.ObjectId, ref: "Category" },
    translations: {
      bn: {
        name: { type: String, required: true },
        description: { type: String }
      },
      en: {
        name: { type: String, required: true },
        description: { type: String }
      }
    },
    isVisible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

categorySchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.translations?.en?.name) {
    this.slug = makeSlug(this.translations.en.name);
  }
  next();
});

export const CategoryModel = model<ICategory>("Category", categorySchema);
