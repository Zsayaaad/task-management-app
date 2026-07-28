import { Role } from "@prisma/client";
import { ConflictError } from "../../errors/customErrors";
import { prisma } from "../../lib/prisma";
import { CreateProjectInput, UpdateProjectInput } from "./projects.schema";

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

export const projectService = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
