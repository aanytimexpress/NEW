import type { NextFunction, Request, Response } from "express";
import { redisClient } from "../config/redis.js";

export function cacheResponse(ttlSeconds = 60) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET" || redisClient.status !== "ready") {
      next();
      return;
    }

    const key = `cache:${req.originalUrl}`;
    const cached = await redisClient.get(key);
    if (cached) {
      res.setHeader("x-cache-hit", "true");
      res.json(JSON.parse(cached));
      return;
    }

    const originalJson = res.json.bind(res);
    res.json = ((payload: unknown) => {
      void redisClient.set(key, JSON.stringify(payload), "EX", ttlSeconds);
      return originalJson(payload);
    }) as typeof res.json;
    next();
  };
}
