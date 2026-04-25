import { Redis } from "ioredis";
import { env } from "./env.js";

export const redisClient = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 2,
  retryStrategy: () => null
});

let redisWarningLogged = false;

redisClient.on("error", (error) => {
  if (redisWarningLogged) {
    return;
  }

  redisWarningLogged = true;
  // eslint-disable-next-line no-console
  console.warn("Redis unavailable, continuing without cache:", error.message);
});

export async function connectRedis(): Promise<void> {
  if (redisClient.status === "wait") {
    await redisClient.connect();
  }
}
