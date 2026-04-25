import { getLocale } from "next-intl/server";
import { NoticeListPage } from "@/components/home/notice-list-page";

export default async function PublicAnnouncementPage() {
  const locale = await getLocale();
  const isBn = locale === "bn";

  return (
    <NoticeListPage
      title={isBn ? "জনসাধারণের ঘোষণা" : "Public Announcement"}
      description={
        isBn
          ? "জরুরি জনসচেতনতা, সেবা ও প্রশাসনিক ঘোষণা।"
          : "Urgent public advisories, service and administrative announcements."
      }
      items={[
        {
          title: isBn ? "বর্ষা মৌসুমে সতর্কতা নির্দেশনা" : "Monsoon Safety Guidance",
          date: "2026-04-27",
          details: isBn
            ? "নিম্নাঞ্চলের বাসিন্দাদের প্রয়োজনীয় প্রস্তুতি নিতে অনুরোধ।"
            : "Residents in low-lying zones are advised to take precautions."
        },
        {
          title: isBn ? "পানি সরবরাহ সাময়িক বন্ধ" : "Temporary Water Supply Interruption",
          date: "2026-04-26",
          details: isBn
            ? "রক্ষণাবেক্ষণ কাজের জন্য ৪ ঘণ্টা সেবা বন্ধ থাকবে।"
            : "Service will be paused for 4 hours due to maintenance."
        }
      ]}
    />
  );
}
