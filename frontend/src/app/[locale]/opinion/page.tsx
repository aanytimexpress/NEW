import { getLocale, getTranslations } from "next-intl/server";
import { NewsListPage } from "@/components/home/news-list-page";

export default async function OpinionPage() {
  const locale = await getLocale();
  const t = await getTranslations("menu");
  return (
    <NewsListPage
      locale={locale}
      category="opinion"
      title={t("opinion")}
      description="Opinion pieces from authors and guest contributors."
    />
  );
}
