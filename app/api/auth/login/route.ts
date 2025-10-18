import { comparePassword, getUserByEmail, signToken, makeNewSession } from "@/utils/authHelpers";
import { success, error } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) return error("⚠️ Email & password required", 422);

    // ✅ Fetch user
    const user = await getUserByEmail(email);
    if (!user) return error("❌ Invalid credentials", 401);

    // ❌ Block OAuth-only users (no password field)
    if (!user.password)
      return error("⚠️ This account uses OAuth. Sign in with Google or GitHub.", 403);

    // ✅ Verify password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return error("❌ Invalid credentials", 401);

    // ✅ Generate JWT and set cookie
    const token = signToken({ userId: user._id.toString(), email: user.email });
    const res = success("✅ Login successful", 200);
    makeNewSession(res, token);

    console.log("✅ User logged in:", user.email);
    return res;
  } catch (err: any) {
    console.error("❌ Login error:", err.message);
    return error(err.message || "❌ Server error", 500);
  }
}
