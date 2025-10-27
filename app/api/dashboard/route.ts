import { NextRequest } from "next/server";
import { success, error } from "@/utils/apiResponse";
import { getAuthenticatedUser } from "@/lib/authenticateUser";

export async function GET(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return error("Unauthorized", 401);

    isDev && console.log("✅ [DashboardAPI] Access granted for:", user.email);
    return success("Access granted", 200, { user });
  } catch (err: any) {
    isDev && console.error("❌ [DashboardAPI] Auth check failed:", err.message || err);
    return error(err.message || "Invalid or expired token", 401);
  }
}
