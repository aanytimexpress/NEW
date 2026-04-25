import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomepageBuilderPage() {
  const t = useTranslations();

  const sections = [
    "breakingTicker",
    "heroSlider",
    "trendingBlock",
    "latestFeed",
    "categoryBlocks",
    "videoBlock",
    "photoGalleryBlock",
    "popularSidebar",
    "newsletterBlock",
    "advertisementBlock"
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("admin.homepageBuilder")}</h1>
      <p className="text-sm text-muted-foreground">{t("labels.dragDrop")}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section} className="flex items-center justify-between">
            <span>{section}</span>
            <Button variant="outline">{t("labels.save")}</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
