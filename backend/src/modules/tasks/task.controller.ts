import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { taskService } from "./task.service";
import { GetAllTasksQueryInput } from "./task.schema";

export const createTask = async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;
  const creatorId = req.user!.userId;

  const task = await taskService.createTask(projectId, creatorId, req.body);

  return res.status(StatusCodes.CREATED).json({
    message: "Task created successfully",
    task,
  });
};

export const getAllTasks = async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;

  const result = await taskService.getAllTasks(
    projectId,
    req.validatedQuery as GetAllTasksQueryInput,
  );

  return res.status(StatusCodes.OK).json(result);
};

export const getTaskById = async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;

  const task = await taskService.getTaskById(
    projectId as string,
    taskId as string,
  );

  return res.status(StatusCodes.OK).json({ task });
};

export const updateTask = async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;

  const updatedTask = await taskService.updateTask(
    projectId as string,
    taskId as string,
    req.body,
    { userId: req.user!.userId, role: req.user!.role },
  );

  return res.status(StatusCodes.OK).json({
    message: "Task updated successfully",
    updatedTask,
  });
};

export const deleteTask = async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;
  const { userId, role } = req.user!;

  const result = await taskService.deleteTask(
    projectId as string,
    taskId as string,
    { userId, role },
  );

  return res.status(StatusCodes.OK).json(result);
};

export const taskController = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
