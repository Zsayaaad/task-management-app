import { Role } from "@prisma/client";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../errors/customErrors";
import { prisma } from "../../lib/prisma";
import {
  AddMemberInput,
  CreateProjectInput,
  UpdateProjectInput,
} from "./projects.schema";

export const createProject = async (
  creatorId: string,
  data: CreateProjectInput,
) => {
  const existingProject = await prisma.project.findFirst({
    where: {
      name: data.name,
    },
  });

  if (existingProject) {
    throw new ConflictError("You already have a project with this name");
  }

  // This way, if something fails, there won't be any partial data loss in the database.
  const project = await prisma.$transaction(async (tx) => {
    const newProject = await tx.project.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    await tx.projectMember.create({
      data: {
        userId: creatorId,
        projectId: newProject.id,
      },
    });

    return newProject;
  });

  const projectWithMembers = await prisma.project.findUnique({
    where: { id: project.id },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });

  return projectWithMembers;
};

export const getAllProjects = async (userId: string, role: Role) => {
  const projects = await prisma.project.findMany({
    where: role === Role.ADMIN ? {} : { members: { some: { userId: userId } } },
    include: {
      _count: {
        select: {
          members: true,
          tasks: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return projects;
};

export const getProjectById = async (projectId: string) => {
  const product = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      },
      tasks: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return product;
};

export const updateProject = async (
  projectId: string,
  data: UpdateProjectInput,
) => {
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data,
  });

  return updatedProject;
};

export const deleteProject = async (projectId: string) => {
  await prisma.project.delete({
    where: { id: projectId },
  });

  return { message: "Project deleted successfully" };
};

export const getProjectMembers = async (projectId: string) => {
  const members = await prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  return members.map((m) => m.user);
};

export const addMember = async (projectId: string, data: AddMemberInput) => {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const existingMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: { userId: data.userId, projectId },
    },
  });

  if (existingMember) {
    throw new ConflictError("User is already a member of this project");
  }

  await prisma.projectMember.create({
    data: { userId: data.userId, projectId },
  });

  return user;
};

export async function removeMember(
  projectId: string,
  userId: string,
  requesterId: string,
) {
  // Admin
  if (userId === requesterId) {
    throw new BadRequestError("You cannot remove yourself from the project");
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: { userId, projectId },
    },
  });

  if (!membership) {
    throw new NotFoundError("User is not a member of this project");
  }

  await prisma.projectMember.delete({
    where: {
      userId_projectId: { userId, projectId },
    },
  });
}

export const projectService = {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectMembers,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
