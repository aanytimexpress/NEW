import { createServer } from "node:http";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { connectRedis } from "./config/redis.js";
import { env } from "./config/env.js";
import { startScheduledPublishJob } from "./jobs/scheduled-publish.job.js";
import { startTrendingRefreshJob } from "./jobs/trending-refresh.job.js";
import { startNotificationDispatchJob } from "./jobs/notification-dispatch.job.js";

async function bootstrap() {
  const app = createApp();
  const server = createServer(app);
  let databaseConnected = false;

  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${env.PORT}`);
  });

  try {
    await connectDatabase();
    databaseConnected = true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("MongoDB connection failed, running in degraded mode:", error);
  }

  void connectRedis().catch((error) => {
    // eslint-disable-next-line no-console
    console.warn("Redis connection skipped:", error);
  });

  if (databaseConnected) {
    startScheduledPublishJob();
    startTrendingRefreshJob();
    startNotificationDispatchJob();
    return;
  }

  // eslint-disable-next-line no-console
  console.warn("Background newsroom jobs are paused because database is unavailable.");
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to bootstrap backend", error);
  process.exit(1);
});
