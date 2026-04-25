import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { getLatestNews } from "@/lib/api";
import { notFound } from "next/navigation";
import { ShareActions } from "@/components/layout/share-actions";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("badges");
  const articles = await getLatestNews(locale);
  const article = articles.find((item) => item.slug === slug) ?? articles[0];
  if (!article) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const canonicalUrl = `${siteUrl}/${locale}/article/${article.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author
    },
    mainEntityOfPage: canonicalUrl
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: article.category, item: `${siteUrl}/${locale}/news/${article.category}` },
      { "@type": "ListItem", position: 3, name: article.title, item: canonicalUrl }
    ]
  };

  return (
    <article className="news-container py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <header className="mx-auto max-w-4xl space-y-3">
        <Badge variant="outline">{article.category}</Badge>
        <h1 className="font-serif text-4xl font-semibold leading-tight">{article.title}</h1>
        <div className="text-sm text-muted-foreground">
          {article.author} · {new Date(article.publishedAt).toLocaleString()} · {article.views} views
        </div>
        <div className="flex flex-wrap gap-2">
          {article.badges?.map((badge) => (
            <Badge key={badge}>{t(badge)}</Badge>
          ))}
        </div>
        <ShareActions url={canonicalUrl} title={article.title} />
      </header>
      <div className="mx-auto mt-6 max-w-4xl">
        <div className="relative aspect-[16/9] overflow-hidden rounded-md">
          <Image src={article.image} alt={article.title} fill className="object-cover" />
        </div>
        <div className="prose prose-slate mt-6 max-w-none text-base leading-8">
          <p>{article.summary}</p>
          <p>
            This article page is wired for multilingual SEO metadata, badge display, share modules and
            newsroom revision markers. Connect this to `/api/v1/articles/:slug` in production for full
            CMS content.
          </p>
        </div>
      </div>
    </article>
  );
}
