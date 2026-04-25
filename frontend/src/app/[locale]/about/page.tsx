import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";

export default async function AboutPage() {
  const t = await getTranslations("pages");

  return (
    <div className="news-container py-8">
      <PageHeader title={t("aboutTitle")} />
      <div className="space-y-4 text-muted-foreground">
        <p>
          Bogura Kothon is a modern digital newsroom focused on verified and accountable journalism
          across Bogura district and beyond.
        </p>
        <p>
          Editorial, opinion, video, district and public service sections follow a structured
          reporter-editor-admin workflow with multilingual publishing.
        </p>
      </div>
    </div>
  );
}
