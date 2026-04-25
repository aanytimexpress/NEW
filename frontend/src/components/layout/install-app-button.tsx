"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePwaInstall } from "@/hooks/use-pwa";
import { Button } from "@/components/ui/button";

export function InstallAppButton() {
  const t = useTranslations();
  const { canInstall, install } = usePwaInstall();

  if (!canInstall) return null;
  return (
    <Button variant="outline" size="sm" onClick={() => void install()}>
      <Download className="h-4 w-4" />
      {t("actions.installApp")}
    </Button>
  );
}
