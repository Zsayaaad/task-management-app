import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .trim(),
});

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .min(1, "Project name cannot be empty")
      .max(100, "display name cannot exceed 10 characters")
      .optional(),
    description: z.string().optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message:
      "At least one field (name or description) must be provided for update",
  });

export const addMemberSchema = z.object({
  email: z.email({
    error: "Invalid email format",
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
