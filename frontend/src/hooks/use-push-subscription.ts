"use client";

import { useEffect, useState } from "react";

interface PushState {
  supported: boolean;
  subscribed: boolean;
  loading: boolean;
}

export function usePushSubscription() {
  const [state, setState] = useState<PushState>({
    supported: false,
    subscribed: false,
    loading: false
  });

  useEffect(() => {
    const supported = "serviceWorker" in navigator && "PushManager" in window;
    setState((prev) => ({ ...prev, supported }));
    if (!supported) return;

    void navigator.serviceWorker.ready.then(async (registration) => {
      const existing = await registration.pushManager.getSubscription();
      setState((prev) => ({ ...prev, subscribed: !!existing }));
    });
  }, []);

  async function subscribe(locale: "bn" | "en") {
    if (!state.supported) return false;
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) return false;

    setState((prev) => ({ ...prev, loading: true }));
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/push-subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(subscription.getKey("p256dh")),
            auth: arrayBufferToBase64(subscription.getKey("auth"))
          },
          locale
        })
      });

      setState({ supported: true, subscribed: true, loading: false });
      return true;
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
      return false;
    }
  }

  async function unsubscribe() {
    if (!state.supported) return false;

    setState((prev) => ({ ...prev, loading: true }));
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        setState((prev) => ({ ...prev, subscribed: false, loading: false }));
        return true;
      }
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/push-subscriptions/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });
      await subscription.unsubscribe();
      setState((prev) => ({ ...prev, subscribed: false, loading: false }));
      return true;
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
      return false;
    }
  }

  return { ...state, subscribe, unsubscribe };
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return "";
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}
