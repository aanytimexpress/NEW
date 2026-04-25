import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const t = useTranslations();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("admin.overview")}</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted-foreground">Draft queue</p>
          <p className="mt-2 text-2xl font-semibold">14</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Scheduled today</p>
          <p className="mt-2 text-2xl font-semibold">7</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Live breaking items</p>
          <p className="mt-2 text-2xl font-semibold">2</p>
        </Card>
      </div>
    </div>
  );
}
