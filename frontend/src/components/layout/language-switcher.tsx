"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { routing, usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function onToggle() {
    const nextLocale = locale === "bn" ? "en" : "bn";
    router.replace(pathname as never, { locale: nextLocale as never });
  }

  return (
    <Button variant="outline" size="sm" onClick={onToggle} aria-label="Toggle language">
      <Globe className="h-4 w-4" />
      <span>{locale === "bn" ? "English" : "বাংলা"}</span>
    </Button>
  );
}
