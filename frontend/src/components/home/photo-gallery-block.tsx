import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NewsItem } from "@/types/news";

interface PhotoGalleryBlockProps {
  items: NewsItem[];
}

export function PhotoGalleryBlock({ items }: PhotoGalleryBlockProps) {
  const t = useTranslations();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">{t("home.gallery")}</h2>
        <Link href="/photo-gallery" className="text-sm text-primary">
          {t("actions.viewAll")}
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((item) => (
          <Link
            key={item.id}
            href={{ pathname: "/article/[slug]", params: { slug: item.slug } }}
            className="group relative block aspect-square overflow-hidden rounded-md"
          >
            <Image src={item.image} alt={item.title} fill className="object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-xs text-white">
              {item.title}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
