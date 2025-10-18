import { NextRequest } from "next/server";
import { updatePassword, verifyToken, getUserById } from "@/utils/authHelpers";
import { validatePassword } from "@/utils/validators";
import { success, error } from "@/utils/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    // ✅ Verify reset token
    const { userId } = verifyToken(token);
    const user = await getUserById(userId);
    if (!user) return error("❌ User not found", 404);

    // ❌ Prevent password reset for OAuth-only users
    if (!user.password)
      return error("⚠️ OAuth accounts cannot reset passwords manually.", 403);

    // ✅ Validate new password
    const passwordError = validatePassword(newPassword, true);
    if (passwordError) return error(passwordError, 400);

    // ✅ Update password in DB
    await updatePassword(userId, newPassword);

    console.log("🔑 Password reset successful for:", user.email);
    return success("✅ Password reset successfully", 200);
  } catch (err: any) {
    console.error("❌ Reset password error:", err.message);
    return error(err.message || "❌ Invalid or expired token", 401);
  }
}
