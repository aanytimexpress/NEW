import { Schema, model } from "mongoose";

export interface ILanguage {
  code: "bn" | "en";
  label: string;
  nativeLabel: string;
  isDefault: boolean;
  isEnabled: boolean;
}

const languageSchema = new Schema<ILanguage>(
  {
    code: { type: String, enum: ["bn", "en"], unique: true, required: true },
    label: { type: String, required: true },
    nativeLabel: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    isEnabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const LanguageModel = model<ILanguage>("Language", languageSchema);
