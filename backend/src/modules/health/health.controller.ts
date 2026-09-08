import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma.js";
import { redisClient } from "../../lib/redis.js";

export const healthCheck = async (_req: Request, res: Response) => {
  const status = { service: "ok", redis: "down", db: "down" };

  try {
    await redisClient.ping();
    status.redis = "up";
  } catch {
    /* stays "down" */
  }

  try {
    await prisma.$queryRaw`SELECT 1`; // SELECT 1 to make sure it is connected and responsive
    status.db = "up";
  } catch {
    /* stays "down" */
  }

  const allUp = status.redis === "up" && status.db === "up";
  return res
    .status(allUp ? StatusCodes.OK : StatusCodes.SERVICE_UNAVAILABLE)
    .json(status);
};
