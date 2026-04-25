import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { getLatestNews } from "@/lib/api";

export default async function ArchivePage() {
  const t = await getTranslations("pages");
  const locale = await getLocale();
  const articles = await getLatestNews(locale);

  return (
    <div className="news-container py-8">
      <PageHeader title={t("archiveTitle")} description="Browse old newsroom records by date." />
      <div className="space-y-3">
        {articles.map((article) => (
          <article key={article.id} className="rounded-md border p-4">
            <div className="text-xs text-muted-foreground">
              {new Date(article.publishedAt).toLocaleDateString()}
            </div>
            <h3 className="mt-1 font-medium">{article.title}</h3>
          </article>
        ))}
      </div>
    </div>
  );
}
