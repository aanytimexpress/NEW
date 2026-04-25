"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterBlock() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("...");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "/api/v1"}/subscribers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        }
      );
      setStatus(response.ok ? "Subscribed" : "Try again");
    } catch {
      setStatus("Try again");
    }
  }

  return (
    <section className="rounded-md border bg-muted/30 p-6">
      <h3 className="font-serif text-xl font-semibold">{t("newsletter.title")}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{t("newsletter.desc")}</p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 md:flex-row">
        <Input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("newsletter.placeholder")}
        />
        <Button type="submit">{t("actions.subscribe")}</Button>
      </form>
      {status ? <p className="mt-2 text-xs text-muted-foreground">{status}</p> : null}
    </section>
  );
}
