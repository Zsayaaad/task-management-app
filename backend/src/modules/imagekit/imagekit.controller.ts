import { NextFunction, Request, Response } from "express";
import { getEnv } from "../../lib/env.js";
import { imagekit } from "../../lib/imagekit.js";

export const getAuthParameters = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const env = getEnv();

    // Generate token, signature and timestamp
    const { token, expire, signature } = imagekit.getAuthenticationParameters();

    res.status(200).json({
      token,
      signature,
      expire,
      publicKey: env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
    });
  } catch (error) {
    next(error);
  }
};
