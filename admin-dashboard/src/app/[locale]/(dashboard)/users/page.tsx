import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";

export default function UsersPage() {
  const t = useTranslations();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("admin.users")}</h1>
      <Card>
        <p className="text-sm text-muted-foreground">
          Role matrix: Super Admin, Admin, Editor, Reporter, Author, Subscriber with permission
          restrictions and admin IP whitelist controls.
        </p>
      </Card>
    </div>
  );
}
