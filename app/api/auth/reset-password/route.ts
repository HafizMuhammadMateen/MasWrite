import { NextRequest } from "next/server";
import { updatePassword, verifyToken } from "@/utils/authHelpers";
import { validatePassword } from "@/utils/validators";
import { success, error } from "@/utils/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    // Verify token
    const { userId } = verifyToken(token);
    console.log("🔑 Password reset for user:", userId);
    
    // Validate password
    const passwordError = validatePassword(newPassword, true);
    if(passwordError) return error(passwordError, 400);

    // Update password in DB
    await updatePassword(userId, newPassword);

    return success("✅ Password reset successfully", 200);
  } catch (err: any) {
    console.error("❌ Reset password error:", err.message);
    return error(err.message || "❌ Invalid or expired token", 401);
  }
}
