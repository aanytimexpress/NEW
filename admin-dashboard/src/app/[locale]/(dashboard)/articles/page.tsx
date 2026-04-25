import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ArticlesAdminPage() {
  const t = useTranslations();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("admin.articles")}</h1>
        <Button>{t("labels.publish")}</Button>
      </div>
      <Card className="space-y-2">
        <p className="text-sm text-muted-foreground">Reporter → Editor → Admin workflow</p>
        <div className="grid gap-2 md:grid-cols-4">
          <div className="rounded border p-3">{t("labels.draft")}</div>
          <div className="rounded border p-3">{t("labels.review")}</div>
          <div className="rounded border p-3">{t("labels.scheduled")}</div>
          <div className="rounded border p-3">{t("labels.published")}</div>
        </div>
      </Card>
    </div>
  );
}
