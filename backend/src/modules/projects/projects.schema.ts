import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .min(3, "Project name must be at least 3 character")
    .max(100, "Project name cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .trim(),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name cannot be empty")
    .min(3, "Project name must be at least 3 character")
    .max(100, "Project name cannot exceed 10 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
});
// .refine((data) => data.name !== undefined || data.description !== undefined, {
//   message:
//     "At least one field (name or description) must be provided for update",
// });

export const addMemberSchema = z.object({
  email: z.email({
    error: "Invalid email format",
  }),
});

const ignoreBlankString = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

export const getAllProjectsQuerySchema = z.object({
  search: z.preprocess(ignoreBlankString, z.string().trim().min(1).optional()),

  sort: z.enum(["a-z", "z-a", "newest", "oldest"]).optional().default("newest"),

  page: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().default(1),
  ),

  limit: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().max(100).default(4),
  ),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type GetAllProjectsQueryInput = z.infer<
  typeof getAllProjectsQuerySchema
>;
