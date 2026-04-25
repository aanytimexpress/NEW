import slugify from "slugify";
import { randomUUID } from "node:crypto";

export function makeSlug(value: string): string {
  const base = slugify(value, { lower: true, strict: true, trim: true });
  return base || randomUUID();
}
