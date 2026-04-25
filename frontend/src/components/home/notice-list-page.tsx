import { PageHeader } from "@/components/layout/page-header";

interface NoticeListPageProps {
  title: string;
  description: string;
  items: Array<{
    title: string;
    date: string;
    details: string;
  }>;
}

export function NoticeListPage({ title, description, items }: NoticeListPageProps) {
  return (
    <div className="news-container py-8">
      <PageHeader title={title} description={description} />
      <div className="space-y-3">
        {items.map((item) => (
          <article key={`${item.title}-${item.date}`} className="rounded-md border p-4">
            <div className="text-xs text-muted-foreground">{item.date}</div>
            <h3 className="mt-1 font-medium">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.details}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
