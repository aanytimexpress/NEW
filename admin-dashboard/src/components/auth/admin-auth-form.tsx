"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function AdminAuthForm() {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const api = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "http://localhost:5000/api/v1";

    try {
      const loginRes = await fetch(`${api}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!loginRes.ok) {
        setError("Login failed");
        return;
      }

      const meRes = await fetch(`${api}/auth/me`, {
        credentials: "include"
      });
      const payload = (await meRes.json().catch(() => ({}))) as {
        data?: { role?: string };
      };
      const role = payload.data?.role;
      const isAllowed = role === "super_admin" || role === "admin" || role === "editor";
      if (!isAllowed) {
        setError(t("auth.unauthorized"));
        return;
      }

      router.replace("/");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4 rounded-md border bg-white p-6">
      <h1 className="text-2xl font-semibold">{t("auth.loginTitle")}</h1>
      <input
        className="w-full rounded-md border px-3 py-2 text-sm"
        type="email"
        required
        placeholder={t("auth.email")}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        className="w-full rounded-md border px-3 py-2 text-sm"
        type="password"
        required
        placeholder={t("auth.password")}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "..." : t("auth.login")}
      </Button>
    </form>
  );
}
