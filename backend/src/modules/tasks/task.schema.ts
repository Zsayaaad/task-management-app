import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";

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

  // dueDate: z.iso
  //   .datetime({
  //     message: "Invalid due date format. Must be an ISO-8601 date string",
  //   })
  //   .min(1, "Due date is required"),
  dueDate: z
    .string({ error: "Due date is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Must be YYYY-MM-DD"),

  assigneeId: z.uuid().min(1, "Assignee is required"),
});

// Schema for Query Params so we handle queries by using coerce: URL: page=1&limit=12, Zod convert it to number 1,12
export const getAllTasksQuerySchema = z.object({
  status: z.preprocess(
    (val) => (val === "all" || val === "" ? undefined : val),
    z.enum(TaskStatus).optional(),
  ),
  priority: z.preprocess(
    (val) => (val === "all" || val === "" ? undefined : val),
    z.enum(TaskPriority).optional(),
  ),
  assigneeName: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.string().min(1).optional(),
  ),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
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
