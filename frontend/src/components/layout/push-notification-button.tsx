"use client";

import { Bell, BellOff } from "lucide-react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePushSubscription } from "@/hooks/use-push-subscription";

export function PushNotificationButton() {
  const locale = useLocale();
  const { supported, subscribed, loading, subscribe, unsubscribe } = usePushSubscription();

  if (!supported) return null;

  async function toggle() {
    if (subscribed) {
      await unsubscribe();
      return;
    }
    await subscribe(locale === "en" ? "en" : "bn");
  }

  return (
    <Button variant="outline" size="sm" onClick={() => void toggle()} disabled={loading}>
      {subscribed ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
      {subscribed ? "Alerts On" : "Alerts"}
    </Button>
  );
}
