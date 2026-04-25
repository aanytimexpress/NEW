import { getLatestNews } from "@/lib/api";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const latest = await getLatestNews("en");
  const published = latest.slice(0, 30);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${published
  .map(
    (item) => `<url>
  <loc>${siteUrl}/en/article/${item.slug}</loc>
  <news:news>
    <news:publication>
      <news:name>Bogura Kothon</news:name>
      <news:language>en</news:language>
    </news:publication>
    <news:publication_date>${item.publishedAt}</news:publication_date>
    <news:title>${escapeXml(item.title)}</news:title>
  </news:news>
</url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
