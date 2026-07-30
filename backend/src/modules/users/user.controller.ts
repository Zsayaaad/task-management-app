import { Request, Response } from "express";
import { userService } from "./user.service.js";
import { StatusCodes } from "http-status-codes";
import { clearAuthCookie } from "../../utils/cookies.js";

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await userService.getCurrentUser(req.user!.userId);

  return res.status(StatusCodes.OK).json({
    user,
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  const newUser = await userService.updateProfile(req.user!.userId, req.body);

  res.status(StatusCodes.OK).json({ msg: "update user", newUser });
};

export const changePassword = async (req: Request, res: Response) => {
  const result = await userService.changePassword(req.user!.userId, req.body);

  return res.status(StatusCodes.OK).json({
    message: result.message,
  });
};

export const deleteAccount = async (req: Request, res: Response) => {
  const result = await userService.deleteAccount(req.user!.userId, req.body);

  clearAuthCookie(res);

  return res.status(StatusCodes.OK).json({
    message: result.message,
  });
};

export const userController = {
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount,
};
