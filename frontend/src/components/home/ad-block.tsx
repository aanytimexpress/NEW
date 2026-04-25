import { useTranslations } from "next-intl";

export function AdBlock() {
  const t = useTranslations();
  return (
    <section className="rounded-md border bg-secondary/10 p-6 text-center">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("home.ads")}</p>
      <div className="mt-2 text-sm text-muted-foreground">
        970x90 / 300x250 Google AdSense or Manual Banner Slot
      </div>
    </section>
  );
}
