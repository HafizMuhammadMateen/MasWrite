import { comparePassword, getUserByEmail, signToken, createSession } from "@/utils/authHelpers";
import { success, error } from "@/utils/apiResponse";

export async function POST(req: Request) {
  const isDev = process.env.NODE_ENV === "development";

  try {
    const { email, password } = await req.json();
    if (!email || !password) return error("Email & password required", 400);

    const user = await getUserByEmail(email);
    if (!user) return error("Invalid credentials", 401);
    if (!user.password) return error("This account uses OAuth. Sign in with Google or GitHub.", 403);

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return error("Invalid credentials", 401);

    const token = signToken({ userId: user._id.toString(), email: user.email });
    const res = success("Login successful", 200);
    createSession(res, token);

    isDev && console.log("✅ [LoginAPI] User logged in:", user.email);
    return res;
  } catch (err: any) {
    isDev && console.error("❌ [LoginAPI] Error:", err.message || err);
    return error(err.message || "Server error", 500);
  }
}
