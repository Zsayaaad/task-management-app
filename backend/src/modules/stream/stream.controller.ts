import { NextFunction, Request, Response } from "express";
import { streamClient } from "../../lib/stream.js";
import { getEnv } from "../../lib/env.js";

export const generateStreamToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // My auth middleware attaches the user to req.user
    const userId = req.user!.userId;
    const role = req.user!.role;
    const userName = req.user!.name;

    // 1. Sync user to Stream (Upsert ensures they exist in Stream's DB)
    await streamClient.upsertUsers([
      {
        id: userId,
        name: userName,
        role: role === "ADMIN" ? "admin" : "user",
      },
    ]);

    // Generate the jwt token for this specific user
    const token = streamClient.createToken(userId);

    const env = getEnv();

    res.status(200).json({ apiKey: env.STREAM_API_KEY, userId, token });
  } catch (error) {
    next(error); // Passes to the centralized error handler
  }
};
