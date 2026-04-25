"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchNews } from "@/lib/api";
import { Link } from "@/i18n/navigation";
import type { NewsItem } from "@/types/news";

export function SearchPanel() {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    const data = await searchNews(query);
    setResults(data);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("actions.search")}
        />
        <Button type="submit">{loading ? "..." : t("actions.search")}</Button>
      </form>
      <div className="space-y-3">
        {results.map((item) => (
          <article key={item.id} className="rounded-md border p-3">
            <Link
              href={{ pathname: "/article/[slug]", params: { slug: item.slug } }}
              className="font-medium"
            >
              {item.title}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
