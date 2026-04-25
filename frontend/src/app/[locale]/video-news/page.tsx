import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { VideoBlock } from "@/components/home/video-block";
import { getLatestNews } from "@/lib/api";

export default async function VideoNewsPage() {
  const locale = await getLocale();
  const t = await getTranslations();
  const items = await getLatestNews(locale);

  return (
    <div className="news-container py-8">
      <PageHeader title={t("menu.video")} />
      <VideoBlock items={items} />
    </div>
  );
}
