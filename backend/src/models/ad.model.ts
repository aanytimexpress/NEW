import { Schema, model } from "mongoose";

export interface IAd {
  name: string;
  type: "adsense" | "manual";
  placement:
    | "homepage_top"
    | "homepage_sidebar"
    | "article_middle"
    | "category_top"
    | "popup"
    | "sticky_sidebar";
  category?: Schema.Types.ObjectId;
  imageUrl?: string;
  targetUrl?: string;
  script?: string;
  isActive: boolean;
  startsAt?: Date;
  endsAt?: Date;
  priority: number;
}

const adSchema = new Schema<IAd>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["adsense", "manual"], required: true },
    placement: {
      type: String,
      enum: [
        "homepage_top",
        "homepage_sidebar",
        "article_middle",
        "category_top",
        "popup",
        "sticky_sidebar"
      ],
      required: true
    },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    imageUrl: { type: String },
    targetUrl: { type: String },
    script: { type: String },
    isActive: { type: Boolean, default: true },
    startsAt: { type: Date },
    endsAt: { type: Date },
    priority: { type: Number, default: 100 }
  },
  { timestamps: true }
);

export const AdModel = model<IAd>("Ad", adSchema);
