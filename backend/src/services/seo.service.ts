import { ArticleModel } from "../models/article.model.js";

export function keywordDensity(content: string, keyword: string): number {
  const normalized = content
    .replace(/<[^>]+>/g, " ")
    .toLowerCase()
    .replace(/[^\w\u0980-\u09FF ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (!normalized.length) return 0;
  const keywordCount = normalized.filter((word) => word === keyword.toLowerCase()).length;
  return Number(((keywordCount / normalized.length) * 100).toFixed(2));
}

export async function suggestInternalLinks(title: string): Promise<string[]> {
  const relatedArticles = await ArticleModel.find({
    $text: { $search: title },
    status: "published"
  })
    .select("slug")
    .limit(5)
    .lean();

  return relatedArticles.map((article) => `/news/${article.slug}`);
}
