import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";

export const taskIdParamSchema = z.object({
  taskId: z.uuid().trim().min(1),
});

export const createTaskBodySchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be at most 150 characters")
    .trim(),

  description: z
    .string({ error: "Description is required" })
    .min(1, "Description cannot be empty")
    .max(1000, "Description must be at most 1000 characters")
    .trim(),

  status: z.enum(TaskStatus).optional(),

  priority: z.enum(TaskPriority).optional(),

  dueDate: z
    .string({ error: "Due date is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Must be YYYY-MM-DD"),

  assigneeId: z.uuid().min(1, "Assignee is required"),
});

const ignoreAllOrEmpty = (value: unknown) =>
  value === "all" || value === "" ? undefined : value;

const ignoreBlankString = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

export const getAllTasksQuerySchema = z.object({
  // z.preprocess is used to prepare the input before validation.
  status: z.preprocess(ignoreAllOrEmpty, z.enum(TaskStatus).optional()),

  priority: z.preprocess(ignoreAllOrEmpty, z.enum(TaskPriority).optional()),

  assigneeName: z.preprocess(
    ignoreBlankString,
    z.string().trim().min(1).optional(),
  ),

  page: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().default(1),
  ),

  limit: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().max(100).default(10),
  ),
});

export const updateTaskBodySchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be at most 150 characters")
    .trim()
    .optional(),

  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .trim()
    .optional(),

  status: z.enum(TaskStatus).optional(),

  priority: z.enum(TaskPriority).optional(),

  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Must be YYYY-MM-DD")
    .optional(),

  assigneeId: z.uuid().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskBodySchema>;
export type GetAllTasksQueryInput = z.infer<typeof getAllTasksQuerySchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskBodySchema>;
