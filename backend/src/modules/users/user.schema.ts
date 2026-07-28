import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name name is required")
    .max(20, "Name name cannot exceed 10 characters"),

  email: z.email({
    error: "invalid email format",
  }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "current password is required"),

    newPassword: z
      .string()
      .min(1, "current password is required")
      .min(8, "new password must be at least 8 characters long"),

    confirmNewPassword: z.string().min(1, "confirm new password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmedNewPassword"],
    message: "passwords do not match",
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "new password must be different from current password",
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "password is required"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
