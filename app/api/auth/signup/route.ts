import { validateEmail, validatePassword } from "@/utils/validators";
import { getUserByEmail, hashPassword, makeUser } from "@/utils/authHelpers";
import { success, error } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    const { userName, email, password } = await req.json();

    // ✅ Basic validation
    if (!userName || !email || !password)
      return error("⚠️ All fields are required", 422);

    const emailError = validateEmail(email);
    if (emailError) return error(emailError, 400);

    const passwordError = validatePassword(password, true);
    if (passwordError) return error(passwordError, 400);

    // ✅ Check existing user
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      // OAuth-only user (no password set)
      if (!existingUser.password)
        return error(
          "⚠️ This email is registered via Google/GitHub. Please sign in using that provider.",
          409
        );

      // Manual user already exists
      return error("⚠️ Email already registered", 409);
    }

    // ✅ Create new manual user
    const hashedPassword = await hashPassword(password);
    await makeUser(userName, email, hashedPassword);

    console.log("✅ New user registered:", email);
    return success("✅ Account created successfully", 201, { userName, email });
  } catch (err: any) {
    console.error("❌ Signup error:", err.message);
    return error(err.message || "❌ Server error", 500);
  }
}
