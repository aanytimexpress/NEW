import { Schema, model } from "mongoose";

export interface IMedia {
  originalName: string;
  fileName: string;
  fileUrl: string;
  folder: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  convertedWebpUrl?: string;
  uploadedBy: Schema.Types.ObjectId;
}

const mediaSchema = new Schema<IMedia>(
  {
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    folder: { type: String, default: "general" },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    convertedWebpUrl: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const MediaModel = model<IMedia>("Media", mediaSchema);
