import { getLocale } from "next-intl/server";
import { NoticeListPage } from "@/components/home/notice-list-page";

export default async function ObituaryPage() {
  const locale = await getLocale();
  const isBn = locale === "bn";

  return (
    <NoticeListPage
      title={isBn ? "শোক সংবাদ" : "Obituary"}
      description={
        isBn
          ? "সমাজের গুরুত্বপূর্ণ ব্যক্তিত্ব ও নাগরিকদের স্মরণে।"
          : "In remembrance of notable community members and citizens."
      }
      items={[
        {
          title: isBn ? "প্রবীণ শিক্ষক মোঃ আব্দুল করিম" : "Veteran Teacher Md. Abdul Karim",
          date: "2026-04-25",
          details: isBn
            ? "বহু শিক্ষার্থীকে আলোকিত করা এই শিক্ষককে শ্রদ্ধাভরে স্মরণ।"
            : "Remembered with respect for his lifelong contribution to education."
        },
        {
          title: isBn ? "সাংস্কৃতিক সংগঠক রওশন আরা" : "Cultural Organizer Rowshan Ara",
          date: "2026-04-23",
          details: isBn
            ? "স্থানীয় সংস্কৃতি চর্চায় তাঁর ভূমিকা অবিস্মরণীয়।"
            : "Her role in local cultural development remains unforgettable."
        }
      ]}
    />
  );
}
