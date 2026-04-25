"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

interface AuthState {
  loading: boolean;
  ok: boolean;
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AuthState>({ loading: true, ok: false });

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "http://localhost:5000/api/v1";
    void fetch(`${api}/auth/me`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return null;
        const payload = (await res.json()) as { data?: { role?: string } };
        return payload.data ?? null;
      })
      .then((user) => {
        const role = user?.role;
        const ok = role === "super_admin" || role === "admin" || role === "editor";
        if (!ok) {
          router.replace("/login");
          setState({ loading: false, ok: false });
          return;
        }
        setState({ loading: false, ok: true });
      })
      .catch(() => {
        router.replace("/login");
        setState({ loading: false, ok: false });
      });
  }, [pathname, router]);

  if (state.loading) {
    return <div className="p-6 text-sm text-muted-foreground">Checking session...</div>;
  }
  if (!state.ok) return null;
  return <>{children}</>;
}
