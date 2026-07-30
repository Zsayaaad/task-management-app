import { Request, Response } from "express";
import { projectService } from "./projects.service.js";
import { StatusCodes } from "http-status-codes";

export const createProject = async (req: Request, res: Response) => {
  const project = await projectService.createProject(
    req.user!.userId,
    req.body,
  );

  return res.status(StatusCodes.CREATED).json({ project });
};

export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await projectService.getAllProjects(
    req.user!.userId,
    req.user!.role,
  );

  return res.status(StatusCodes.OK).json({ projects });
};

export const getProjectById = async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;

  const project = await projectService.getProjectById(projectId);

  return res.status(StatusCodes.OK).json({ project });
};

export const updateProject = async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;
  const project = await projectService.updateProject(projectId, req.body);

  return res.status(StatusCodes.OK).json({
    message: "Project updated successfully",
    project,
  });
};

export const deleteProject = async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;

  const result = await projectService.deleteProject(projectId);

  return res.status(StatusCodes.OK).json(result);
};

export const getProjectMembers = async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;

  const members = await projectService.getProjectMembers(projectId);

  return res.status(StatusCodes.OK).json({ members });
};

export const addMember = async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;

  const member = await projectService.addMember(projectId, req.body);

  return res.status(StatusCodes.CREATED).json({
    message: "Member added to project successfully",
    data: member,
  });
};

export async function removeMember(req: Request, res: Response) {
  const projectId = req.params.projectId as string;
  const userId = req.params.userId as string;

  await projectService.removeMember(projectId, userId, req.user!.userId);

  res.status(StatusCodes.OK).json({
    message: "Member removed successfully",
  });
}

export const projectController = {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectMembers,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
