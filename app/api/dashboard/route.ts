import { NextRequest } from "next/server";
import { success, error } from "@/utils/apiResponse";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return error("❌ Unauthorized", 401);

    console.log("✅ Dashboard access granted for:", user.email);
    return success("✅ Access granted", 200, { user });
  } catch (err: any) {
    console.error("❌ Auth check failed:", err.message);
    return error("❌ Invalid or expired token", 401, err.message);
  }
}
