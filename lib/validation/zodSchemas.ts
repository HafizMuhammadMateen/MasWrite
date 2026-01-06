
import { z, ZodError } from "zod";

// Constants
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 50;
const PASSWORD_MIN_LENGTH = 8;

export const userNameSchema = z
  .string()
  .min(USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`)
  .max(USERNAME_MAX_LENGTH, `Username must not exceed ${USERNAME_MAX_LENGTH} characters.`);

export const emailSchema = z
  .string()
  .email("Please enter a valid email address.");

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`)
  .refine((val) => /[A-Z]/.test(val), "Password must contain at least one uppercase letter.")
  .refine((val) => /\d/.test(val), "Password must contain at least one number.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string(), // no strict rules on login
});

export const signupSchema = z.object({
  userName: userNameSchema,
  email: emailSchema,
  password: passwordSchema, // strict rules on signup
});

// Generic validation function
export const validateField = (name: string, value: string) => {
  try {
    if (name === "email") {
      emailSchema.parse(value);
    } else if (name === "password") {
      passwordSchema.parse(value);
    }
    return ""; // ✅ no error
  } catch (err) {
    if (err instanceof ZodError) {
      // ✅ Correct way to extract error messages
      return err.issues?.[0]?.message || "Invalid input";
    }
    return "Validation failed";
  }
};
