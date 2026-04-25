import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("pages");

  return (
    <div className="news-container py-8">
      <PageHeader title={t("privacyTitle")} />
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          We collect only necessary data for account security, newsletter subscriptions and analytics.
        </p>
        <p>
          User comments and newsroom submissions follow moderation and retention policies aligned with
          platform security standards.
        </p>
      </div>
    </div>
  );
}
