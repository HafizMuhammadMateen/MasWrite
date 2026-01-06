import { NextRequest } from "next/server";
import { comparePassword, updatePassword, destroySession } from "@/utils/authHelpers";
import { validatePassword } from "@/utils/validators";
import { success, error } from "@/utils/apiResponse";
import { getAuthenticatedUser } from "@/lib/authenticateUser";

export async function POST(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";
  
  try {
    const { currentPassword, newPassword } = await req.json();

    // Authenticate user (manual + OAuth)
    const user = await getAuthenticatedUser(req);
    if (!user) return error("Unauthorized", 401);

    // Disallow OAuth users from changing password
    if (!user.password)
      return error("Password change not allowed for Google/GitHub users", 403);

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) return error("Incorrect current password", 400);

    const passwordError = validatePassword(newPassword, true);
    if (passwordError) return error(passwordError, 400);

    await updatePassword(user._id.toString(), newPassword);

    isDev && console.log("🔑 [ChangePasswordAPI] Password updated for:", user.email);
    const res = success("Password updated successfully. Please login again.", 200);
    destroySession(res);

    return res;

  } catch (err: any) {
    isDev && console.error("❌ [ChangePasswordAPI] Failed:", err.message || err);
    return error(err.message || "Server error", 500);
  }
}
