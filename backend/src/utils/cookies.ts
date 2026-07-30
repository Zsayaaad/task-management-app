import { Response } from "express";
import { getEnv } from "../lib/env.js";

const env = getEnv();

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true, // CRITICAL: Prevents client-side JS from reading the cookie
    secure: env.NODE_ENV === "production", // Ensures cookie only sent over HTTPS only in production
    sameSite: "strict", // Protects against CSRF
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day in ms
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
