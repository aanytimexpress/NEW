import { Redis } from "ioredis";
import { env } from "./env.js";

export const redisClient = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 2
});

export async function connectRedis(): Promise<void> {
  if (redisClient.status === "wait") {
    await redisClient.connect();
  }
}
