import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { SearchPanel } from "@/components/home/search-panel";

export default async function SearchPage() {
  const t = await getTranslations("pages");

  return (
    <div className="news-container py-8">
      <PageHeader title={t("searchTitle")} />
      <SearchPanel />
    </div>
  );
}
