"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface UserMe {
  name: string;
  role: string;
}

export function AdminAuthActions() {
  const t = useTranslations();
  const [user, setUser] = useState<UserMe | null>(null);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "http://localhost:5000/api/v1";
    void fetch(`${api}/auth/me`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return null;
        const payload = (await res.json()) as { data?: UserMe };
        return payload.data ?? null;
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    const api = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "http://localhost:5000/api/v1";
    await fetch(`${api}/auth/logout`, {
      method: "POST",
      credentials: "include"
    }).catch(() => undefined);
    window.location.href = window.location.pathname.replace(/\/[^/]+$/, "/login");
  }

  if (!user) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{user.name}</span>
      <Button variant="outline" onClick={() => void logout()}>
        {t("auth.logout")}
      </Button>
    </div>
  );
}
