"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface MePayload {
  id: string;
  name: string;
  email: string;
  role: string;
  locale: string;
}

export function AuthActions() {
  const t = useTranslations();
  const [user, setUser] = useState<MePayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const api = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";
    void fetch(`${api}/auth/me`, {
      credentials: "include",
      signal: controller.signal
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const payload = (await res.json()) as { data?: MePayload };
        return payload.data ?? null;
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  async function logout() {
    const api = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";
    await fetch(`${api}/auth/logout`, {
      method: "POST",
      credentials: "include"
    }).catch(() => undefined);
    setUser(null);
  }

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/login">{t("actions.login")}</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/register">{t("actions.register")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-muted-foreground md:inline">{user.name}</span>
      <Button size="sm" variant="outline" onClick={() => void logout()}>
        {t("actions.logout")}
      </Button>
    </div>
  );
}
