import { getLocale } from "next-intl/server";
import { NoticeListPage } from "@/components/home/notice-list-page";

export default async function JobCircularPage() {
  const locale = await getLocale();
  const isBn = locale === "bn";

  return (
    <NoticeListPage
      title={isBn ? "চাকরির সার্কুলার" : "Job Circular"}
      description={
        isBn
          ? "বগুড়া ও আশপাশের সরকারি-বেসরকারি চাকরির আপডেট।"
          : "Government and private job updates across Bogura and nearby regions."
      }
      items={[
        {
          title: isBn ? "জেলা পরিষদ নিয়োগ বিজ্ঞপ্তি" : "District Council Recruitment Notice",
          date: "2026-05-01",
          details: isBn
            ? "আবেদনের শেষ তারিখ: ১৫ মে ২০২৬।"
            : "Application deadline: May 15, 2026."
        },
        {
          title: isBn ? "স্থানীয় এনজিও ফিল্ড অফিসার" : "Local NGO Field Officer",
          date: "2026-04-30",
          details: isBn
            ? "কমপক্ষে ২ বছরের অভিজ্ঞতা প্রয়োজন।"
            : "Minimum 2 years of experience required."
        }
      ]}
    />
  );
}
