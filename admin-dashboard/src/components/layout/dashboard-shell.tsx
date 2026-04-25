import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Newspaper,
  Settings,
  PanelsTopLeft,
  MenuSquare,
  Image,
  Users,
  Megaphone,
  History,
  Wrench
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LanguageToggle } from "./language-toggle";
import { AdminAuthActions } from "@/components/auth/admin-auth-actions";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const t = useTranslations();
  const items = [
    { key: "overview", href: "/", icon: LayoutDashboard },
    { key: "articles", href: "/articles", icon: Newspaper },
    { key: "homepageBuilder", href: "/homepage-builder", icon: PanelsTopLeft },
    { key: "menus", href: "/menus", icon: MenuSquare },
    { key: "ads", href: "/ads", icon: Megaphone },
    { key: "media", href: "/media", icon: Image },
    { key: "users", href: "/users", icon: Users },
    { key: "activity", href: "/activity-logs", icon: History },
    { key: "maintenance", href: "/maintenance", icon: Wrench },
    { key: "settings", href: "/settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-border bg-white p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-sm font-semibold">{t("admin.title")}</h1>
          <div className="flex items-center gap-2">
            <AdminAuthActions />
            <LanguageToggle />
          </div>
        </div>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <Icon className="h-4 w-4" />
                {t(`admin.${item.key}`)}
              </Link>
            );
          })}
        </nav>
      </aside>
      <section className="p-6">{children}</section>
    </div>
  );
}
