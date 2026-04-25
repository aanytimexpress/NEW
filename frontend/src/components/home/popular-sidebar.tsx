import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NewsItem } from "@/types/news";

interface PopularSidebarProps {
  items: NewsItem[];
}

export function PopularSidebar({ items }: PopularSidebarProps) {
  const t = useTranslations();

  return (
    <aside className="rounded-md border p-4">
      <h3 className="mb-4 font-serif text-lg font-semibold">{t("home.popular")}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <article key={item.id} className="flex gap-3">
            <span className="text-lg font-bold text-primary">{index + 1}</span>
            <Link
              href={{ pathname: "/article/[slug]", params: { slug: item.slug } }}
              className="line-clamp-2 text-sm font-medium"
            >
              {item.title}
            </Link>
          </article>
        ))}
      </div>
    </aside>
  );
}
