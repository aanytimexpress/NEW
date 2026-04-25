import cron from "node-cron";
import { refreshTrendingFlags } from "../services/trending.service.js";

export function startTrendingRefreshJob(): void {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const updated = await refreshTrendingFlags();
      if (updated > 0) {
        // eslint-disable-next-line no-console
        console.log(`[trending-refresh] updated ${updated} trending article(s)`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[trending-refresh] job failed", error);
    }
  });
}
