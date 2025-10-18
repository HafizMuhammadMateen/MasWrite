import { NextRequest } from "next/server";
import { updatePassword, verifyToken, getUserById } from "@/utils/authHelpers";
import { validatePassword } from "@/utils/validators";
import { success, error } from "@/utils/apiResponse";

export async function POST(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  try {
    const { token, newPassword } = await req.json();

    const { userId } = verifyToken(token);
    const user = await getUserById(userId);
    if (!user) return error("User not found", 404);
    if (!user.password) return error("OAuth accounts cannot reset passwords manually", 403);

    const passwordError = validatePassword(newPassword, true);
    if (passwordError) return error(passwordError, 400);

    await updatePassword(userId, newPassword);

    isDev && console.log("🔑 [ResetPasswordAPI] Password reset successful for:", user.email);
    return success("Password reset successfully", 200);
  } catch (err: any) {
    isDev && console.error("❌ [ResetPasswordAPI] Error:", err.message || err);
    return error(err.message || "Invalid or expired token", 401);
  }
}
