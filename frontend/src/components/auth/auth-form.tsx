"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
    const endpoint = mode === "login" ? "login" : "signup";

    try {
      const response = await fetch(`${api}/auth/${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login"
            ? { email, password }
            : { name, email, password, role: "subscriber", locale }
        )
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({ message: "Request failed" }))) as {
          message?: string;
        };
        setError(payload.message || "Request failed");
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
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4 rounded-md border p-6">
      <h1 className="font-serif text-2xl font-semibold">
        {mode === "login" ? t("auth.loginTitle") : t("auth.registerTitle")}
      </h1>
      <p className="text-sm text-muted-foreground">
        {mode === "login" ? t("auth.loginHelp") : t("auth.registerHelp")}
      </p>

      {mode === "register" ? (
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder={t("auth.name")}
        />
      ) : null}

      <Input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        placeholder={t("auth.email")}
      />
      <Input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        placeholder={t("auth.password")}
      />

      {error ? <p className="text-sm text-accent">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? "..."
          : mode === "login"
            ? t("actions.login")
            : t("actions.register")}
      </Button>

      <div className="flex items-center justify-between text-sm">
        {mode === "login" ? (
          <Link href="/register" className="text-primary">
            {t("actions.register")}
          </Link>
        ) : (
          <Link href="/login" className="text-primary">
            {t("actions.login")}
          </Link>
        )}
        <a
          href={`${process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001"}/${locale}`}
          target="_blank"
          rel="noreferrer"
          className="text-primary"
        >
          {t("auth.adminLogin")}
        </a>
      </div>
    </form>
  );
}
