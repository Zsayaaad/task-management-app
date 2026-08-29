import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { verifyToken } from "../utils/jwt.js";
import {
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { isAdmin } from "../lib/roles.js";

export interface AuthenticatedUserPayload {
  userId: string;
  name: string;
  role: Role;
}

export const authenticatedUser = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { token } = req.cookies;

  if (!token) {
    throw new UnauthenticatedError("Authentication token is missing");
  }

  try {
    const { userId, role, name } = verifyToken(
      token,
    ) as AuthenticatedUserPayload;
    req.user = { userId, role, name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid or expired token");
  }
};

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.user || !isAdmin(req.user.role)) {
    throw new UnauthorizedError("Admin access required");
  }
  next();
};
