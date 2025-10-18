import { NextRequest } from "next/server";
import { comparePassword, updatePassword, invalidateSession } from "@/utils/authHelpers";
import { validatePassword } from "@/utils/validators";
import { success, error } from "@/utils/apiResponse";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();

    // ✅ Authenticate user (works for manual + OAuth)
    const user = await getAuthenticatedUser(req);
    if (!user) return error("❌ Unauthorized", 401);

    // ❌ OAuth users can’t change password (no password field)
    if (!user.password) 
      return error("❌ Password change not allowed for Google/GitHub users", 400);

    // ✅ Compare old password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) return error("❌ Incorrect current password", 400);

    // ✅ Validate and update new password
    const passwordError = validatePassword(newPassword, true);
    if (passwordError) return error(passwordError, 400);

    await updatePassword(user._id.toString(), newPassword);

    // ✅ Invalidate old session
    const res = success("✅ Password updated successfully. Please login again.", 200);
    invalidateSession(res);
    return res;

  } catch (err: any) {
    console.error("❌ Change password failed:", err.message);
    return error(err.message || "❌ Server error", 500);
  }
}
