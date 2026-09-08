import RedisStore, { RedisReply } from "rate-limit-redis";
import { redisClient } from "../lib/redis.js";
import rateLimit from "express-rate-limit";

const redisStore = (prefix: string) =>
  new RedisStore({
    prefix, // isolates counters per limiter
    sendCommand: (command: string, ...args: string[]) =>
      redisClient.call(command, ...args) as Promise<RedisReply>,
  });

// Global safely net for the whole API: 300 req / 15 min / IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore("rl:global:"),
  message: { msg: "Too many requests, please slow down." },
});

// Strict limiter for expensive/sensitive actions: 10 req / 15 min / IP
export const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore("rl:sensitive:"),
  message: { msg: "Rate limit exceeded for this action, retry later." },
});
