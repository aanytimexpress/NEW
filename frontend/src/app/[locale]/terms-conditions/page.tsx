import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";

export default async function TermsPage() {
  const t = await getTranslations("pages");

  return (
    <div className="news-container py-8">
      <PageHeader title={t("termsTitle")} />
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          Content may not be reproduced without permission. Opinion and editorial content are subject
          to newsroom policy.
        </p>
        <p>
          Accounts violating comment policies, spam policies or impersonation rules may be suspended.
        </p>
      </div>
    </div>
  );
}
