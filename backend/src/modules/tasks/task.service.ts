import { Prisma, Role } from "@prisma/client";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../errors/customErrors";
import { prisma } from "../../lib/prisma";
import {
  CreateTaskInput,
  GetAllTasksQueryInput,
  UpdateTaskInput,
} from "./task.schema";

export const createTask = async (
  projectId: string,
  creatorId: string,
  data: CreateTaskInput,
) => {
  const assignee = await prisma.user.findUnique({
    where: { id: data.assigneeId },
  });

  if (!assignee) {
    throw new NotFoundError("Assignee user not found");
  }

  const isAssigneeMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: data.assigneeId,
        projectId,
      },
    },
  });

  if (!isAssigneeMember) {
    throw new BadRequestError("Assignee must be a member of this project");
  }

  const existingTask = await prisma.task.findFirst({
    where: {
      projectId,
      title: {
        equals: data.title,
        mode: "insensitive",
      },
    },
  });

  if (existingTask) {
    throw new BadRequestError(
      "A task with the same title already exists in this project",
    );
  }

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: new Date(data.dueDate),
      assigneeId: data.assigneeId,
      creatorId,
      projectId,
    },
    include: {
      creator: {
        select: { id: true, name: true, email: true },
      },
      assignee: {
        select: { id: true, name: true, email: true },
      },
    },
  });
  return task;
};

export const getAllTasks = async (
  projectId: string,
  query: GetAllTasksQueryInput,
) => {
  const { status, priority, assigneeName, page, limit } = query;

  const where: Prisma.TaskWhereInput = {
    projectId,
    ...(status && { status: status }),
    ...(priority && { priority: priority }),
    ...(assigneeName && {
      assignee: {
        name: {
          contains: assigneeName,
          mode: "insensitive",
        },
      },
    }),
  };

  const skip = (page - 1) * limit;

  const [totalTasks, tasks] = await prisma.$transaction([
    prisma.task.count({ where }),
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const totalPages = Math.ceil(totalTasks / limit);

  return {
    tasks,
    pagination: {
      totalTasks,
      currentPage: page,
      numOfPages: totalPages,
      limit,
    },
  };
};

export const getTaskById = async (projectId: string, taskId: string) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
      projectId: projectId,
    },
    include: {
      creator: {
        select: { id: true, name: true, email: true },
      },
      assignee: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!task) {
    throw new NotFoundError("Task not found in this project");
  }

  return task;
};

export const updateTask = async (
  projectId: string,
  taskId: string,
  data: UpdateTaskInput,
  requester: { userId: string; role: Role },
) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId, projectId: projectId },
  });

  if (!task) {
    throw new NotFoundError("Task not found in this project");
  }

  const isAdmin = requester.role === Role.ADMIN;
  const isCreator = task.creatorId === requester.userId;
  const isAssignee = task.assigneeId === requester.userId;

  if (!isAdmin && !isCreator && !isAssignee) {
    throw new UnauthorizedError(
      "You do not have permission to update this task",
    );
  }

  // To find out which fields the user actually requested to be modified, or to check whether certain fields have been submitted or not
  const requestedFields = Object.keys(data);

  // If only an Assignee (not an Admin and not a Creator) -> they are only allowed to edit the status
  if (!isAdmin && !isCreator && isAssignee) {
    const disallowedFields = requestedFields.filter(
      (field) => field !== "status",
    );

    if (disallowedFields.length > 0) {
      throw new UnauthorizedError(
        `As an assignee, you can only update the task status. Not allowed to change: ${disallowedFields.join(
          ", ",
        )}`,
      );
    }
    if (requestedFields.length === 0) {
      throw new BadRequestError("No valid fields provided to update");
    }
  }

  if ((isAdmin || isCreator) && data.assigneeId) {
    const isMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId: data.assigneeId, projectId },
      },
    });

    if (!isMember) {
      throw new BadRequestError("Assignee must be a member of this project");
    }
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...data,
      // Prisma expects a `Date` instance or full ISO timestamp
      ...(data.dueDate ? { dueDate: new Date(data.dueDate) } : {}),
    },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
  });

  return updatedTask;
};

export const deleteTask = async (
  projectId: string,
  taskId: string,
  requester: { userId: string; role: Role },
) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId, projectId },
  });
  if (!task) {
    throw new NotFoundError("Task not found in this project");
  }

  const isAdmin = requester.role === Role.ADMIN;
  const isCreator = task.creatorId === requester.userId;

  if (!isAdmin && !isCreator) {
    throw new UnauthorizedError(
      "You do not have permission to delete this task. Only the creator or an Admin can delete it",
    );
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: "Task deleted successfully" };
};

export const taskService = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
