import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { NewsItem } from "@/types/news";

interface VideoBlockProps {
  items: NewsItem[];
}

export function VideoBlock({ items }: VideoBlockProps) {
  const t = useTranslations();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">{t("home.video")}</h2>
        <Link href="/video-news" className="text-sm text-primary">
          {t("actions.viewAll")}
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 3).map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-2 p-4">
              <div className="aspect-video rounded bg-muted" />
              <Link
                href={{ pathname: "/article/[slug]", params: { slug: item.slug } }}
                className="line-clamp-2 text-sm font-semibold"
              >
                {item.title}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
