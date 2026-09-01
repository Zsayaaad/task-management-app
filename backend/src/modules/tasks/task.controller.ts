import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { taskService } from "./task.service.js";
import { getAllTasksQuerySchema, taskIdParamSchema } from "./task.schema.js";
import { NotFoundError } from "../../errors/customErrors.js";

export const extractTaskId = (req: Request): string => {
  const parsed = taskIdParamSchema.safeParse(req.params);

  if (!parsed.success) {
    throw new NotFoundError("Task ID parameter is missing or invalid");
  }

  return parsed.data.taskId;
};

export const createTask = async (req: Request, res: Response) => {
  const { id: projectId } = req.project;
  const creatorId = req.user!.userId;

  const { userId, name } = req.user!;

  const task = await taskService.createTask(projectId, creatorId, req.body, {
    userId,
    name,
  });

  return res.status(StatusCodes.CREATED).json({
    message: "Task created successfully",
    task,
  });
};

export const getAllTasks = async (req: Request, res: Response) => {
  // const projectId = req.params.projectId ;

  const { id: projectId } = req.project;

  const query = getAllTasksQuerySchema.parse(req.query);

  const result = await taskService.getAllTasks(projectId, query);

  return res.status(StatusCodes.OK).json(result);
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id: projectId } = req.project;

  const taskId = extractTaskId(req);

  const task = await taskService.getTaskById(projectId, taskId);

  return res.status(StatusCodes.OK).json({ task });
};

export const updateTask = async (req: Request, res: Response) => {
  const { id: projectId } = req.project;
  const taskId = extractTaskId(req);

  const { userId, role, name } = req.user!;

  const updatedTask = await taskService.updateTask(
    projectId,
    taskId,
    req.body,
    { userId, role, name },
  );

  return res.status(StatusCodes.OK).json({
    message: "Task updated successfully",
    updatedTask,
  });
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id: projectId } = req.project;

  const taskId = extractTaskId(req);

  const { userId, role, name } = req.user!;

  const result = await taskService.deleteTask(projectId, taskId, {
    userId,
    role,
    name,
  });

  return res.status(StatusCodes.OK).json(result);
};

export const taskController = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
