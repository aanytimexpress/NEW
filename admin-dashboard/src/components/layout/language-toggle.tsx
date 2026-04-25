"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() =>
        router.replace(pathname as never, {
          locale: (locale === "bn" ? "en" : "bn") as never
        })
      }
    >
      {locale === "bn" ? "English" : "বাংলা"}
    </Button>
  );
}
