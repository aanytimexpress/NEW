export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  image: string;
  publishedAt: string;
  author: string;
  views: number;
  badges?: Array<"updated" | "correction" | "exclusive" | "fact_check" | "sponsored" | "live">;
}
