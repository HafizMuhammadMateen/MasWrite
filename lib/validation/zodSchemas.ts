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
export const validateField = (name: string, value: string): string => {
  try {
    if (name === "email") emailSchema.parse(value);
    else if (name === "password") passwordSchema.parse(value);
    return "";
  } catch (err) {
    if (err instanceof ZodError) return err.issues?.[0]?.message || "Invalid input";
    return "Validation failed";
  }
};

// Imperative helpers (replaces utils/validators.ts)
export function validateEmail(email: string): string | null {
  if (!email) return "Email is required.";
  const result = emailSchema.safeParse(email);
  return result.success ? null : result.error.issues[0]?.message ?? "Invalid email";
}

export function validatePassword(password: string, isSignup = false): string | null {
  if (!password) return "Password is required.";
  const schema = isSignup ? passwordSchema : z.string().min(1);
  const result = schema.safeParse(password);
  return result.success ? null : result.error.issues[0]?.message ?? "Invalid password";
}

export function validateUsername(userName: string): string | null {
  if (!userName) return "Username is required.";
  const result = userNameSchema.safeParse(userName);
  return result.success ? null : result.error.issues[0]?.message ?? "Invalid username";
}
