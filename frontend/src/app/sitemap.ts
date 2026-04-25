import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const routes = [
    "",
    "/latest-news",
    "/news/politics",
    "/news/local",
    "/news/international",
    "/news/sports",
    "/news/business",
    "/news/technology",
    "/news/entertainment",
    "/editorial",
    "/opinion",
    "/video-news",
    "/photo-gallery",
    "/login",
    "/register",
    "/search",
    "/archive",
    "/event-calendar",
    "/job-circular",
    "/tender-notice",
    "/public-announcement",
    "/obituary",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-conditions"
  ];

  return ["bn", "en"].flatMap((locale) =>
    routes.map((route) => ({
      url: `${siteUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: route === "" ? 1 : 0.8
    }))
  );
}
