import { NextFunction, Request, Response } from "express";
import { chatClient, streamClient, videoClient } from "../../lib/stream.js";
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
    const streamRole = role === "ADMIN" ? "admin" : "user";

    // 1. Upsert user in BOTH Chat and Video databases
    const userData = { id: userId, name: userName, role: streamRole };
    await chatClient.upsertUsers([userData]);
    await videoClient.upsertUsers([userData]);

    // Generate the jwt token for this specific user
    const chatToken = streamClient.createToken(userId);

    // Generate Video Token (valid for 1 hour by default)
    const videoToken = videoClient.generateUserToken({ user_id: userId });

    const env = getEnv();

    res.status(200).json({
      apiKey: env.STREAM_API_KEY,
      userId,
      chatToken,
      videoToken,
    });
  } catch (error) {
    next(error); // Passes to the centralized error handler
  }
};
