import { getLocale } from "next-intl/server";
import { BreakingTicker } from "@/components/home/breaking-ticker";
import { HeroSlider } from "@/components/home/hero-slider";
import { NewsGrid } from "@/components/home/news-grid";
import { PopularSidebar } from "@/components/home/popular-sidebar";
import { NewsletterBlock } from "@/components/home/newsletter-block";
import { AdBlock } from "@/components/home/ad-block";
import { VideoBlock } from "@/components/home/video-block";
import { PhotoGalleryBlock } from "@/components/home/photo-gallery-block";
import {
  getBreakingNews,
  getLatestNews,
  getNewsByCategory,
  getTrendingNews
} from "@/lib/api";

export const revalidate = 120;

export default async function HomePage() {
  const locale = await getLocale();
  const [breaking, latest, trending, politics, local] = await Promise.all([
    getBreakingNews(locale),
    getLatestNews(locale),
    getTrendingNews(locale),
    getNewsByCategory(locale, "politics"),
    getNewsByCategory(locale, "local")
  ]);

  return (
    <div className="space-y-8 pb-12">
      <BreakingTicker items={breaking} />
      <div className="news-container space-y-8 pt-6">
        <HeroSlider items={latest.slice(0, 5)} />
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <NewsGrid titleKey="home.trending" items={trending} />
          <PopularSidebar items={latest.slice(0, 8)} />
        </div>
        <NewsGrid titleKey="home.latest" items={latest} />
        <NewsGrid titleKey="menu.politics" items={politics.length ? politics : latest} />
        <NewsGrid titleKey="menu.local" items={local.length ? local : latest} />
        <VideoBlock items={latest} />
        <PhotoGalleryBlock items={latest} />
        <div className="grid gap-6 lg:grid-cols-2">
          <NewsletterBlock />
          <AdBlock />
        </div>
      </div>
    </div>
  );
}
