import { PageHeader } from "@/components/layout/page-header";
import { NewsGrid } from "@/components/home/news-grid";
import { getNewsByCategory } from "@/lib/api";

interface NewsListPageProps {
  locale: string;
  title: string;
  category: string;
  description?: string;
}

export async function NewsListPage({
  locale,
  title,
  category,
  description
}: NewsListPageProps) {
  const items = await getNewsByCategory(locale, category);

  return (
    <div className="news-container py-8">
      <PageHeader title={title} description={description} />
      <NewsGrid titleKey="home.latest" items={items} />
    </div>
  );
}
