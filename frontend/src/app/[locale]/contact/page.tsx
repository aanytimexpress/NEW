import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function ContactPage() {
  const t = await getTranslations("pages");

  return (
    <div className="news-container py-8">
      <PageHeader title={t("contactTitle")} />
      <form className="max-w-xl space-y-3 rounded-md border p-4">
        <Input placeholder="Name" />
        <Input type="email" placeholder="Email" />
        <textarea className="min-h-32 w-full rounded-md border p-3 text-sm" placeholder="Message" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
