import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be atleast of 2 character.")
  .max(20, "username must be no longer than 20 char.")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contain any special character.");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email" }),
  password: z
    .string()
    .min(6, { message: "password must be of atleast 6 char" }),
});
