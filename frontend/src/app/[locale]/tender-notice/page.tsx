import { getLocale } from "next-intl/server";
import { NoticeListPage } from "@/components/home/notice-list-page";

export default async function TenderNoticePage() {
  const locale = await getLocale();
  const isBn = locale === "bn";

  return (
    <NoticeListPage
      title={isBn ? "টেন্ডার নোটিশ" : "Tender Notice"}
      description={
        isBn
          ? "সরকারি-বেসরকারি টেন্ডার নোটিশ এবং ডকুমেন্টেশন আপডেট।"
          : "Public and private tender notices with documentation updates."
      }
      items={[
        {
          title: isBn ? "সড়ক পুনর্নির্মাণ প্রকল্প" : "Road Reconstruction Project",
          date: "2026-05-03",
          details: isBn
            ? "বিড সাবমিশন: ২০ মে ২০২৬।"
            : "Bid submission: May 20, 2026."
        },
        {
          title: isBn ? "স্বাস্থ্যকেন্দ্র সরঞ্জাম সরবরাহ" : "Health Center Equipment Supply",
          date: "2026-04-28",
          details: isBn
            ? "প্রি-বিড মিটিং: ৮ মে ২০২৬।"
            : "Pre-bid meeting: May 8, 2026."
        }
      ]}
    />
  );
}
