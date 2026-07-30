import { NextFunction, Request, Response } from "express";
import { NotFoundError, UnauthorizedError } from "../errors/customErrors.js";
import { prisma } from "../lib/prisma.js";
import { Role } from "@prisma/client";

export const checkProjectAccess = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const projectId = req.params.projectId as string;

    if (!projectId || typeof projectId !== "string") {
      throw new NotFoundError("Project ID parameter is missing or invalid");
    }

    if (!req.user) {
      throw new UnauthorizedError("User is not authenticated");
    }

    const { userId, role } = req.user;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: true,
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    const isMember = project.members.some((member) => member.userId === userId);

    if (role !== Role.ADMIN && !isMember) {
      throw new UnauthorizedError("You do not have access to this project");
    }

    req.project = project;

    next();
  } catch (error) {
    next(error);
  }
};
