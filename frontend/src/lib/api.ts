import type { NewsItem } from "@/types/news";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(url, { next: { revalidate: 120 } });
    if (!response.ok) return fallback;
    const payload = (await response.json()) as { data: T };
    return payload.data;
  } catch {
    return fallback;
  }
}

export async function getLatestNews(locale: string): Promise<NewsItem[]> {
  return safeFetch<NewsItem[]>(
    `${API_URL}/articles?status=published&locale=${locale}&limit=20`,
    getMockNews(locale)
  );
}

export async function getTrendingNews(locale: string): Promise<NewsItem[]> {
  return safeFetch<NewsItem[]>(
    `${API_URL}/articles?status=published&locale=${locale}&limit=8&sort=trending`,
    getMockNews(locale).slice(0, 8)
  );
}

export async function getBreakingNews(locale: string): Promise<NewsItem[]> {
  return safeFetch<NewsItem[]>(
    `${API_URL}/articles?status=published&locale=${locale}&limit=10&isBreaking=true`,
    getMockNews(locale).slice(0, 10)
  );
}

export async function getNewsByCategory(locale: string, category: string): Promise<NewsItem[]> {
  return safeFetch<NewsItem[]>(
    `${API_URL}/articles?status=published&locale=${locale}&category=${category}&limit=20`,
    getMockNews(locale).filter((item) => item.category === category)
  );
}

export async function searchNews(query: string): Promise<NewsItem[]> {
  return safeFetch<NewsItem[]>(`${API_URL}/search?q=${encodeURIComponent(query)}`, []);
}

function getMockNews(locale: string): NewsItem[] {
  const isBn = locale === "bn";
  return [
    {
      id: "1",
      slug: "bogura-development-plan",
      title: isBn ? "বগুড়ায় নতুন উন্নয়ন পরিকল্পনা ঘোষণা" : "New Development Plan Announced in Bogura",
      summary: isBn
        ? "সড়ক, স্বাস্থ্য ও কর্মসংস্থান খাতে বড় বিনিয়োগের ঘোষণা দিয়েছে কর্তৃপক্ষ।"
        : "Authorities announced major investment across roads, healthcare and employment.",
      category: "politics",
      image:
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date().toISOString(),
      author: "Newsroom Desk",
      views: 1289,
      badges: ["updated"]
    },
    {
      id: "2",
      slug: "district-sports-league",
      title: isBn ? "জেলা ক্রীড়া লিগে দর্শকের ভিড়" : "District Sports League Draws Full Crowd",
      summary: isBn
        ? "ফাইনাল ম্যাচে দুই দলের রুদ্ধশ্বাস লড়াই।"
        : "A thrilling final match between the two teams drew a packed venue.",
      category: "sports",
      image:
        "https://images.unsplash.com/photo-1521417531039-5ec9af2fe8c1?auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date().toISOString(),
      author: "Sports Correspondent",
      views: 948,
      badges: ["exclusive"]
    },
    {
      id: "3",
      slug: "agritech-innovation-bogura",
      title: isBn
        ? "বগুড়ার কৃষিতে নতুন প্রযুক্তির ব্যবহার"
        : "AgriTech Innovation Expands Across Bogura",
      summary: isBn
        ? "স্মার্ট সেচ ও ডেটা-চালিত ফসল ব্যবস্থাপনায় কৃষকদের আগ্রহ বাড়ছে।"
        : "Farmers are adopting smart irrigation and data-driven crop management.",
      category: "technology",
      image:
        "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date().toISOString(),
      author: "Tech Desk",
      views: 703,
      badges: ["fact_check"]
    }
  ];
}
