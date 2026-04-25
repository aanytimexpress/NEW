import { NotificationModel } from "../models/notification.model.js";
import { PushSubscriptionModel } from "../models/push-subscription.model.js";

interface NotificationPayload {
  title: string;
  body: string;
  audience: string;
}

export async function dispatchPendingNotifications(): Promise<number> {
  const pending = await NotificationModel.find({
    isSent: false,
    $or: [{ scheduledAt: { $exists: false } }, { scheduledAt: { $lte: new Date() } }]
  })
    .sort({ createdAt: 1 })
    .limit(100);

  if (!pending.length) return 0;

  for (const item of pending) {
    await fakePushDispatch({
      title: item.title,
      body: item.message,
      audience: item.audience
    });
    item.isSent = true;
    item.sentAt = new Date();
    await item.save();
  }

  return pending.length;
}

async function fakePushDispatch(payload: NotificationPayload): Promise<void> {
  const query: Record<string, unknown> = { isActive: true };
  const recipients = await PushSubscriptionModel.find(query).select("endpoint").lean();

  // Integrate real Web Push/FCM provider where you iterate recipient endpoints.
  // This placeholder keeps queue semantics and auditability.
  // eslint-disable-next-line no-console
  console.log("[notification-dispatch]", {
    ...payload,
    recipients: recipients.length
  });
}
