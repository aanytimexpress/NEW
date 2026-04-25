import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { MediaModel } from "../models/media.model.js";

export async function processAndStoreImage(input: {
  filePath: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  uploaderId: string;
  folder?: string;
}) {
  const image = sharp(input.filePath);
  const metadata = await image.metadata();
  const webpPath = `${input.filePath}.webp`;

  await image.webp({ quality: 80 }).toFile(webpPath);

  const media = await MediaModel.create({
    originalName: input.originalname,
    fileName: input.filename,
    fileUrl: `/uploads/${input.filename}`,
    folder: input.folder ?? "general",
    mimeType: input.mimetype,
    fileSize: input.size,
    width: metadata.width,
    height: metadata.height,
    convertedWebpUrl: `/uploads/${path.basename(webpPath)}`,
    uploadedBy: input.uploaderId
  });

  await fs.access(webpPath);
  return media;
}
