import { getLocale } from "next-intl/server";
import { NoticeListPage } from "@/components/home/notice-list-page";

export default async function EventCalendarPage() {
  const locale = await getLocale();
  const isBn = locale === "bn";

  return (
    <NoticeListPage
      title={isBn ? "ইভেন্ট ক্যালেন্ডার" : "Event Calendar"}
      description={
        isBn
          ? "জেলা ও উপজেলা পর্যায়ের গুরুত্বপূর্ণ ইভেন্ট সূচি।"
          : "Important district and upazila-level events."
      }
      items={[
        {
          title: isBn ? "জেলা বইমেলা" : "District Book Fair",
          date: "2026-05-02",
          details: isBn
            ? "শহীদ খোকন পার্কে ৭ দিনব্যাপী আয়োজন।"
            : "Seven-day event at Shaheed Khokon Park."
        },
        {
          title: isBn ? "প্রযুক্তি কর্মশালা" : "Technology Workshop",
          date: "2026-05-05",
          details: isBn
            ? "শিক্ষার্থীদের জন্য উন্মুক্ত নিবন্ধন।"
            : "Open registration for students."
        }
      ]}
    />
  );
}
