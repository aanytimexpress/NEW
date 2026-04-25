"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { NewsItem } from "@/types/news";

interface BreakingTickerProps {
  items: NewsItem[];
}

export function BreakingTicker({ items }: BreakingTickerProps) {
  const t = useTranslations();
  const texts = items.map((item) => item.title).join("   •   ");

  return (
    <section className="border-y bg-accent/10">
      <div className="news-container flex items-center gap-3 overflow-hidden py-2">
        <span className="rounded bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
          {t("home.breaking")}
        </span>
        <div className="relative overflow-hidden">
          <motion.div
            className="whitespace-nowrap text-sm"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {texts}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
