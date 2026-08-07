import { Prisma, Role } from "@prisma/client";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../errors/customErrors.js";
import { prisma } from "../../lib/prisma.js";
import {
  AddMemberInput,
  CreateProjectInput,
  GetAllProjectsQueryInput,
  UpdateProjectInput,
} from "./projects.schema.js";

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
        creatorId,
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

  const projectWithDetails = await prisma.project.findUnique({
    where: { id: project.id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
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

  return projectWithDetails;
};

export const getAllProjects = async (
  userId: string,
  role: Role,
  query: GetAllProjectsQueryInput,
) => {
  const { search, limit, page, sort } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ProjectWhereInput = {
    ...(role !== Role.ADMIN && { members: { some: { userId: userId } } }),
    ...(search && { name: { contains: search, mode: "insensitive" } }),
  };

  const sortOptions: Record<string, Prisma.ProjectOrderByWithRelationInput> = {
    "a-z": { name: "asc" },
    "z-a": { name: "desc" },
    newest: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
  };

  const orderBy = sortOptions[sort] || { createdAt: "desc" };

  const [totalProjects, projects] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        creator: {
          select: { id: true, name: true, email: true, role: true },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
    }),
  ]);

  return {
    projects,
    pagination: {
      totalProjects,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / limit),
      limit,
    },
  };

  // const projects = await prisma.project.findMany({
  //   where: role === Role.ADMIN ? {} : { members: { some: { userId: userId } } },
  //   include: {
  //     creator: {
  //       select: { id: true, name: true, email: true, role: true },
  //     },
  //     _count: {
  //       select: {
  //         members: true,
  //         tasks: true,
  //       },
  //     },
  //   },
  //   orderBy: { createdAt: "desc" },
  // });

  // return projects;
};

export const getProjectById = async (projectId: string) => {
  const product = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      },
      tasks: {
        orderBy: { updatedAt: "desc" },
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
    where: { email: data.email },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const existingMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: { userId: user.id, projectId },
    },
  });

  if (existingMember) {
    throw new ConflictError("User is already a member of this project");
  }

  await prisma.projectMember.create({
    data: { userId: user.id, projectId },
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
