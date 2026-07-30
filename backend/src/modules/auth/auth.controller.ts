import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service.js";
import { clearAuthCookie, setAuthCookie } from "../../utils/cookies.js";

export const register = async (req: Request, res: Response) => {
  const { user, token } = await authService.register(req.body);

  setAuthCookie(res, token);

  res.status(StatusCodes.CREATED).json({
    msg: "User created successfully",
    user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { user, token } = await authService.login(req.body);

  setAuthCookie(res, token);

  res.status(StatusCodes.OK).json({ msg: "User logged in successfully", user });
};

export const logout = async (_req: Request, res: Response) => {
  clearAuthCookie(res);

  return res.status(StatusCodes.OK).json({
    message: "User logged out successfully",
  });
};

export const authController = {
  register,
  login,
  logout,
};
