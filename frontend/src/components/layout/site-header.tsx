import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { InstallAppButton } from "./install-app-button";
import { PushNotificationButton } from "./push-notification-button";
import { AuthActions } from "./auth-actions";

export function SiteHeader() {
  const t = useTranslations();
  const menu = [
    { key: "home", href: "/" },
    { key: "latest", href: "/latest-news" },
    { key: "politics", href: { pathname: "/news/[category]", params: { category: "politics" } } },
    { key: "local", href: { pathname: "/news/[category]", params: { category: "local" } } },
    {
      key: "international",
      href: { pathname: "/news/[category]", params: { category: "international" } }
    },
    { key: "sports", href: { pathname: "/news/[category]", params: { category: "sports" } } },
    { key: "business", href: { pathname: "/news/[category]", params: { category: "business" } } },
    {
      key: "technology",
      href: { pathname: "/news/[category]", params: { category: "technology" } }
    },
    {
      key: "entertainment",
      href: { pathname: "/news/[category]", params: { category: "entertainment" } }
    },
    { key: "editorial", href: "/editorial" },
    { key: "opinion", href: "/opinion" },
    { key: "video", href: "/video-news" },
    { key: "gallery", href: "/photo-gallery" }
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="news-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-serif text-xl font-bold text-primary">
            {t("site.name")}
          </Link>
          <span className="hidden text-sm text-muted-foreground md:inline-block">
            {t("site.tagline")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AuthActions />
          <InstallAppButton />
          <PushNotificationButton />
          <LanguageSwitcher />
        </div>
      </div>
      <nav className="news-container flex items-center gap-4 overflow-x-auto py-2 text-sm font-medium">
        {menu.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="whitespace-nowrap text-foreground/80 transition-colors hover:text-foreground"
          >
            {t(`menu.${item.key}`)}
          </Link>
        ))}
      </nav>
    </header>
  );
}
