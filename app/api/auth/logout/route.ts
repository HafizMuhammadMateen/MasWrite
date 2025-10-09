import { success, error } from "@/utils/apiResponse";
import { invalidateSession } from "@/utils/authHelpers";

export async function POST() {
  try {
    // Invalidate session
    const res = success("✅ Logged out successfully.", 200)
    invalidateSession(res);
    console.log("👋 User logged out");
    return res;
  } catch (err: any) {
    console.error("❌ Logout error:", err.message);
    return error(err.message || "❌ Something went wrong", 500);
  }
}
