import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MenuBuilderPage() {
  const t = useTranslations();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("admin.menus")}</h1>
      <Card className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Configure mega menu groups, labels, and multilingual URL mapping.
        </p>
        <Button>{t("labels.save")}</Button>
      </Card>
    </div>
  );
}
