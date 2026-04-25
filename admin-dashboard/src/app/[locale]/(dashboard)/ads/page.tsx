import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";

export default function AdsPage() {
  const t = useTranslations();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("admin.ads")}</h1>
      <Card>
        <p className="text-sm text-muted-foreground">
          Configure AdSense blocks, manual banners, category ads, article middle ads, sticky sidebar,
          and popup rules.
        </p>
      </Card>
    </div>
  );
}
