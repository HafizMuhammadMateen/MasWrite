import { validateEmail, validatePassword } from "@/utils/validators";
import { getUserByEmail, createUser } from "@/utils/authHelpers";
import { success, error } from "@/utils/apiResponse";

export async function POST(req: Request) {
  const isDev = process.env.NODE_ENV === "development";

  try {
    const { userName, email, password } = await req.json();
    if (!userName || !email || !password) return error("All fields are required", 400);

    const emailError = validateEmail(email);
    if (emailError) return error(emailError, 422);

    const passwordError = validatePassword(password, true);
    if (passwordError) return error(passwordError, 422);

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      if (!existingUser.password)
        return error("Email registered via Google/GitHub. Sign in using that provider.", 409);
      return error("Email already registered", 409);
    }

    await createUser(userName, email, password);

    isDev && console.log("✅ [SignupAPI] New user registered:", email);
    return success("Account created successfully", 201, { userName, email });
  } catch (err: any) {
    isDev && console.error("❌ [SignupAPI] Error:", err.message || err);
    return error(err.message || "Server error", 500);
  }
}
