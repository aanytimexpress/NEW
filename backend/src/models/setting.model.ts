import { Schema, model } from "mongoose";

export interface ISetting {
  key: string;
  value: unknown;
  group:
    | "site"
    | "seo"
    | "social"
    | "contact"
    | "language"
    | "homepage"
    | "header"
    | "footer"
    | "widget"
    | "module";
}

const settingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    group: {
      type: String,
      enum: [
        "site",
        "seo",
        "social",
        "contact",
        "language",
        "homepage",
        "header",
        "footer",
        "widget",
        "module"
      ],
      required: true
    }
  },
  { timestamps: true }
);

export const SettingModel = model<ISetting>("Setting", settingSchema);
