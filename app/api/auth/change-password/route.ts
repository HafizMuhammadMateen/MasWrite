import { NextRequest } from "next/server";
import { comparePassword, 
  verifyToken, 
  getUserById, 
  updatePassword, 
  invalidateSession 
} from "@/utils/authHelpers";
import { validatePassword } from "@/utils/validators";
import { success, error } from "@/utils/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();
    const token = req.cookies.get("token")?.value;
    
    // Authenticating user
    if (!token) return error("❌ Unauthorized", 401);

    // Verify user
    const { userId } = verifyToken(token);
    const user = await getUserById(userId);
    if (!user) return error("❌ User not found", 404);

    // Compare current password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) return error("❌ Incorrect current password!", 400);

    // Validate new password
    const passwordError = validatePassword(newPassword, true);
    if (passwordError) return error(passwordError, 400);
    
    // Update password in DB  
    await updatePassword(userId, newPassword);

    // Invalidate old session
    const res = success("✅ Password updated successsfully. Please login again.", 200);
    invalidateSession(res);    
    return res;

  } catch (err: any) {
    return error(err.message || "❌ Server error", 500);
  }
}
