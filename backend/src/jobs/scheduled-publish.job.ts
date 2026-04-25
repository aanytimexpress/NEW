import cron from "node-cron";
import { publishScheduledArticles } from "../services/article.service.js";

export function startScheduledPublishJob(): void {
  cron.schedule("*/2 * * * *", async () => {
    try {
      const count = await publishScheduledArticles();
      if (count > 0) {
        // eslint-disable-next-line no-console
        console.log(`[scheduled-publish] published ${count} article(s)`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[scheduled-publish] job failed", error);
    }
  });
}
