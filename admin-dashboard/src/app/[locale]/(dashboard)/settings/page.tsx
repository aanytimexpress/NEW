import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const t = useTranslations();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("admin.settings")}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-medium">Branding</h2>
          <p className="text-sm text-muted-foreground">Logo, favicon, site title, footer text</p>
          <Button className="mt-3">{t("labels.save")}</Button>
        </Card>
        <Card>
          <h2 className="font-medium">SEO & Social</h2>
          <p className="text-sm text-muted-foreground">
            Global metadata, canonical rules, social links, contact details
          </p>
          <Button className="mt-3">{t("labels.save")}</Button>
        </Card>
        <Card>
          <h2 className="font-medium">Security Controls</h2>
          <p className="text-sm text-muted-foreground">
            Admin IP whitelist, session expiry policy, and 2FA enforcement settings.
          </p>
          <Button className="mt-3">{t("labels.save")}</Button>
        </Card>
        <Card>
          <h2 className="font-medium">Backup & Restore</h2>
          <p className="text-sm text-muted-foreground">
            Trigger JSON backup snapshot and restore from verified export payload.
          </p>
          <Button className="mt-3">{t("labels.save")}</Button>
        </Card>
      </div>
    </div>
  );
}
