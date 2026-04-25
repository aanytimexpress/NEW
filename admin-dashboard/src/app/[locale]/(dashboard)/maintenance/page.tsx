"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
  const t = useTranslations();
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("admin.maintenance")}</h1>
      <Card className="flex items-center justify-between">
        <div>
          <p className="font-medium">Maintenance mode</p>
          <p className="text-sm text-muted-foreground">
            When enabled, public APIs return 503 (except authentication routes).
          </p>
        </div>
        <Button
          variant={enabled ? "default" : "outline"}
          onClick={() => setEnabled((prev) => !prev)}
        >
          {enabled ? "ON" : "OFF"}
        </Button>
      </Card>
    </div>
  );
}
