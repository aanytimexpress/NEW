import { getLocale, getTranslations } from "next-intl/server";
import { NewsListPage } from "@/components/home/news-list-page";

export default async function LatestNewsPage() {
  const locale = await getLocale();
  const t = await getTranslations("menu");
  return (
    <NewsListPage
      locale={locale}
      category="latest"
      title={t("latest")}
      description="24/7 verified updates from newsroom desk."
    />
  );
}
