import { Redis } from "ioredis";
import { getEnv } from "./env.js";

const env = getEnv();

export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 5,
  enableReadyCheck: true,
  retryStrategy: (times) => {
    if (times > 5) return null; // Stop retrying after 5 failures
    return Math.min(times * 200, 2000);
  },
});

redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));
