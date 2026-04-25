import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";

export default function MediaPage() {
  const t = useTranslations();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("admin.media")}</h1>
      <Card>
        <p className="text-sm text-muted-foreground">
          Drag-and-drop upload, folder management, WebP conversion, image compression and validation
          scan controls are available through backend media APIs.
        </p>
      </Card>
    </div>
  );
}
