import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("This is not a valid email"),
  password: z
    .string()
    .min(8, "Password too short")
    .max(50, "Password too long"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .regex(
      /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/,
      "Password should be minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
    ),
  confirmPassword: z
    .string()
    .regex(
      /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/,
      "Password should be minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
    ),
});

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export const inviteUserFormSchema = z.object({
  name: z.string().min(1, "Name too short").max(70, "Name too long"),
  email: z.string().email("This is not a valid email"),
});

export type InviteUserForm = z.infer<typeof inviteUserFormSchema>;

export const signUpSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email("This is not a valid email"),
  password: z
    .string()
    .min(8, "Password too short")
    .max(50, "Password too long"),
});

export type SignUpType = z.infer<typeof signUpSchema>;
