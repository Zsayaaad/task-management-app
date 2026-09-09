import { Redis } from "ioredis";
import { getEnv } from "./env.js";

const env = getEnv();

// BullMQ requires maxRetriesPerRequest: null for workers
export const queueConnection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

queueConnection.on("error", (err) =>
  console.error("❌ Queue Redis connection error:", err),
);
