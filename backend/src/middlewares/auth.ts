import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { verifyToken } from "../utils/jwt";
import {
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors";
import { isAdmin } from "../lib/roles";

export interface AuthenticatedUserPayload {
  userId: string;
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
    const { userId, role } = verifyToken(token) as AuthenticatedUserPayload;
    req.user = { userId, role };
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
