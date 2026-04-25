import cron from "node-cron";
import { dispatchPendingNotifications } from "../services/notification.service.js";

export function startNotificationDispatchJob(): void {
  cron.schedule("*/1 * * * *", async () => {
    try {
      const sent = await dispatchPendingNotifications();
      if (sent > 0) {
        // eslint-disable-next-line no-console
        console.log(`[notification-dispatch] sent ${sent} notification(s)`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[notification-dispatch] job failed", error);
    }
  });
}
