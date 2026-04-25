import { getLocale, getTranslations } from "next-intl/server";
import { NewsListPage } from "@/components/home/news-list-page";

export default async function EditorialPage() {
  const locale = await getLocale();
  const t = await getTranslations("menu");
  return (
    <NewsListPage
      locale={locale}
      category="editorial"
      title={t("editorial")}
      description="Editorial insights and institutional perspective."
    />
  );
}
