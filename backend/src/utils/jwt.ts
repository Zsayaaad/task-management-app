import jwt from "jsonwebtoken";
import { getEnv } from "../lib/env.js";

export const generateToken = (payload: object) => {
  const env = getEnv();

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
  return token;
};

export const verifyToken = (token: string) => {
  const env = getEnv();

  const decoded = jwt.verify(token, env.JWT_SECRET);
  return decoded;
};
