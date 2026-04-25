import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./config";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/latest-news": {
      bn: "/সর্বশেষ",
      en: "/latest-news"
    },
    "/news/[category]": {
      bn: "/খবর/[category]",
      en: "/news/[category]"
    },
    "/video-news": {
      bn: "/ভিডিও-সংবাদ",
      en: "/video-news"
    },
    "/photo-gallery": {
      bn: "/ছবি-গ্যালারি",
      en: "/photo-gallery"
    },
    "/editorial": {
      bn: "/সম্পাদকীয়",
      en: "/editorial"
    },
    "/opinion": {
      bn: "/মতামত",
      en: "/opinion"
    },
    "/article/[slug]": {
      bn: "/আর্টিকেল/[slug]",
      en: "/article/[slug]"
    },
    "/login": {
      bn: "/লগইন",
      en: "/login"
    },
    "/register": {
      bn: "/রেজিস্টার",
      en: "/register"
    },
    "/search": {
      bn: "/অনুসন্ধান",
      en: "/search"
    },
    "/archive": {
      bn: "/আর্কাইভ",
      en: "/archive"
    },
    "/author/[username]": {
      bn: "/লেখক/[username]",
      en: "/author/[username]"
    },
    "/about": {
      bn: "/আমাদের-সম্পর্কে",
      en: "/about"
    },
    "/contact": {
      bn: "/যোগাযোগ",
      en: "/contact"
    },
    "/privacy-policy": {
      bn: "/গোপনীয়তা-নীতি",
      en: "/privacy-policy"
    },
    "/terms-conditions": {
      bn: "/শর্তাবলী",
      en: "/terms-conditions"
    },
    "/event-calendar": {
      bn: "/ইভেন্ট-ক্যালেন্ডার",
      en: "/event-calendar"
    },
    "/job-circular": {
      bn: "/চাকরির-সার্কুলার",
      en: "/job-circular"
    },
    "/tender-notice": {
      bn: "/টেন্ডার-নোটিশ",
      en: "/tender-notice"
    },
    "/public-announcement": {
      bn: "/জনসাধারণের-ঘোষণা",
      en: "/public-announcement"
    },
    "/obituary": {
      bn: "/শোক-সংবাদ",
      en: "/obituary"
    }
  }
});

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
