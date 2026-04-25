import { env } from "../config/env.js";

export async function subscribeToMailchimp(
  email: string,
  locale: "bn" | "en"
): Promise<"synced" | "skipped"> {
  if (!env.MAILCHIMP_API_KEY || !env.MAILCHIMP_AUDIENCE_ID || !env.MAILCHIMP_SERVER_PREFIX) {
    return "skipped";
  }

  const endpoint = `https://${env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${env.MAILCHIMP_AUDIENCE_ID}/members`;
  const auth = Buffer.from(`anystring:${env.MAILCHIMP_API_KEY}`).toString("base64");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email_address: email,
      status_if_new: "subscribed",
      status: "subscribed",
      merge_fields: {
        LANGUAGE: locale.toUpperCase()
      },
      update_existing: true
    })
  });

  if (!response.ok && response.status !== 400) {
    const payload = await response.text();
    throw new Error(`Mailchimp sync failed: ${payload}`);
  }

  return "synced";
}
