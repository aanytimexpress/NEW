import { getLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { NewsGrid } from "@/components/home/news-grid";
import { getNewsByCategory } from "@/lib/api";
import { Link } from "@/i18n/navigation";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const locale = await getLocale();
  const items = await getNewsByCategory(locale, category);

  return (
    <div className="news-container py-8">
      <PageHeader title={category.replace("-", " ")} description={`Category feed: ${category}`} />
      {category === "local" ? (
        <div className="mb-6 flex flex-wrap gap-3 text-sm">
          <Link href="/event-calendar" className="rounded border px-3 py-2">
            Event Calendar
          </Link>
          <Link href="/job-circular" className="rounded border px-3 py-2">
            Job Circular
          </Link>
          <Link href="/tender-notice" className="rounded border px-3 py-2">
            Tender Notice
          </Link>
          <Link href="/public-announcement" className="rounded border px-3 py-2">
            Public Announcement
          </Link>
          <Link href="/obituary" className="rounded border px-3 py-2">
            Obituary
          </Link>
        </div>
      ) : null}
      <NewsGrid titleKey="home.latest" items={items} />
    </div>
  );
}
