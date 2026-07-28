import { NotFoundError, UnauthorizedError } from "../../errors/customErrors";
import { prisma } from "../../lib/prisma";
import { comparePassword, hashPassword } from "../../utils/hash";
import {
  ChangePasswordInput,
  DeleteAccountInput,
  UpdateProfileInput,
} from "./user.schema";

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const updateProfile = async (
  userId: string,
  data: UpdateProfileInput,
) => {
  const newUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(data.name && {
        name: data.name,
      }),
      ...(data.email && {
        email: data.email,
      }),
    },
    omit: {
      password: true,
    },
  });

  return newUser;
};

export const changePassword = async (
  userId: string,
  data: ChangePasswordInput,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isCurrentPasswordValid = await comparePassword(
    data.currentPassword,
    user!.password,
  );

  if (!isCurrentPasswordValid) {
    throw new UnauthorizedError("current password is incorrect");
  }

  const hashedPassword = await hashPassword(data.newPassword);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password updated successfully",
  };
};

export const deleteAccount = async (
  userId: string,
  data: DeleteAccountInput,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      // id: true,
      password: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Password is incorrect");
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return {
    message: "Account deleted successfully",
  };
};

export const userService = {
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount,
};
