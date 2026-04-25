import { Schema, model } from "mongoose";

export interface IHomepageSection {
  key:
    | "breakingTicker"
    | "heroSlider"
    | "trendingBlock"
    | "latestFeed"
    | "categoryBlocks"
    | "videoBlock"
    | "photoGalleryBlock"
    | "popularSidebar"
    | "newsletterBlock"
    | "advertisementBlock";
  title: {
    bn: string;
    en: string;
  };
  enabled: boolean;
  order: number;
  config: Record<string, unknown>;
}

const homepageSectionSchema = new Schema<IHomepageSection>(
  {
    key: {
      type: String,
      enum: [
        "breakingTicker",
        "heroSlider",
        "trendingBlock",
        "latestFeed",
        "categoryBlocks",
        "videoBlock",
        "photoGalleryBlock",
        "popularSidebar",
        "newsletterBlock",
        "advertisementBlock"
      ],
      required: true,
      unique: true
    },
    title: {
      bn: { type: String, required: true },
      en: { type: String, required: true }
    },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    config: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const HomepageSectionModel = model<IHomepageSection>(
  "HomepageSection",
  homepageSectionSchema
);
