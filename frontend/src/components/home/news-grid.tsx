import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { NewsItem } from "@/types/news";

interface NewsGridProps {
  titleKey: string;
  items: NewsItem[];
}

export function NewsGrid({ titleKey, items }: NewsGridProps) {
  const t = useTranslations();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">{t(titleKey)}</h2>
        <Link href="/latest-news" className="text-sm text-primary">
          {t("actions.viewAll")}
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="relative aspect-[16/10]">
              <Image src={item.image} alt={item.title} fill className="rounded-t-md object-cover" />
            </div>
            <CardContent className="space-y-2 p-3">
              <Badge variant="outline">{item.category}</Badge>
              <Link
                href={{ pathname: "/article/[slug]", params: { slug: item.slug } }}
                className="line-clamp-2 text-sm font-semibold"
              >
                {item.title}
              </Link>
              <p className="line-clamp-2 text-xs text-muted-foreground">{item.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
