import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations();

  return (
    <footer className="mt-16 border-t bg-muted/60">
      <div className="news-container py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-semibold">{t("site.name")}</h2>
            <p className="text-sm text-muted-foreground">{t("site.tagline")}</p>
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="/about">{t("menu.about")}</Link>
            <Link href="/contact">{t("menu.contact")}</Link>
            <Link href="/privacy-policy">{t("pages.privacyTitle")}</Link>
            <Link href="/terms-conditions">{t("pages.termsTitle")}</Link>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/event-calendar">{t("menu.eventCalendar")}</Link>
          <Link href="/job-circular">{t("menu.jobCircular")}</Link>
          <Link href="/tender-notice">{t("menu.tenderNotice")}</Link>
          <Link href="/public-announcement">{t("menu.announcement")}</Link>
          <Link href="/obituary">{t("menu.obituary")}</Link>
        </div>
      </div>
    </footer>
  );
}
