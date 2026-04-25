import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { NewsGrid } from "@/components/home/news-grid";
import { getLatestNews } from "@/lib/api";

interface AuthorProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function AuthorProfilePage({ params }: AuthorProfilePageProps) {
  const { username } = await params;
  const locale = await getLocale();
  const t = await getTranslations("pages");
  const items = await getLatestNews(locale);

  return (
    <div className="news-container py-8">
      <PageHeader title={`${t("authorTitle")}: ${username}`} />
      <div className="mb-6 rounded-md border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          Senior correspondent focused on district governance, economy and civic affairs.
        </p>
      </div>
      <NewsGrid titleKey="home.latest" items={items} />
    </div>
  );
}
