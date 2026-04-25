"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { NewsItem } from "@/types/news";

interface HeroSliderProps {
  items: NewsItem[];
}

export function HeroSlider({ items }: HeroSliderProps) {
  const t = useTranslations();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  const active = items[index];

  return (
    <section className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          <motion.article
            key={active.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-md border bg-card"
          >
            <div className="relative aspect-[16/9]">
              <Image src={active.image} alt={active.title} fill className="object-cover" priority />
            </div>
            <div className="space-y-3 p-5">
              <Badge>{t("home.hero")}</Badge>
              <h1 className="font-serif text-2xl font-semibold leading-tight">{active.title}</h1>
              <p className="text-muted-foreground">{active.summary}</p>
              <Button asChild>
                <Link
                  href={{
                    pathname: "/article/[slug]",
                    params: { slug: active.slug }
                  }}
                >
                  {t("actions.readMore")}
                </Link>
              </Button>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
      <div className="space-y-3">
        {items.slice(0, 5).map((item, i) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setIndex(i)}
            className={`w-full rounded-md border p-3 text-left transition-colors ${
              i === index ? "bg-primary/10" : "bg-background hover:bg-muted"
            }`}
          >
            <h3 className="text-sm font-semibold leading-snug">{item.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.summary}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
