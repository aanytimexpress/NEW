import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { PhotoGalleryBlock } from "@/components/home/photo-gallery-block";
import { getLatestNews } from "@/lib/api";

export default async function PhotoGalleryPage() {
  const locale = await getLocale();
  const t = await getTranslations();
  const items = await getLatestNews(locale);

  return (
    <div className="news-container py-8">
      <PageHeader title={t("menu.gallery")} />
      <PhotoGalleryBlock items={items} />
    </div>
  );
}
