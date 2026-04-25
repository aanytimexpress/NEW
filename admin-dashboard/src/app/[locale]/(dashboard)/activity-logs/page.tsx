import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";

const sampleLogs = [
  "Editor approved article: district-budget-update",
  "Admin published breaking: flood-warning-bogura",
  "Super Admin changed module: maintenance_mode=false",
  "Reporter updated local story: sadar-road-repair"
];

export default function ActivityLogsPage() {
  const t = useTranslations();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("admin.activity")}</h1>
      <Card className="space-y-2">
        {sampleLogs.map((log) => (
          <div key={log} className="rounded border p-2 text-sm">
            {log}
          </div>
        ))}
      </Card>
    </div>
  );
}
