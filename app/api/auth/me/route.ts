import { NextRequest } from "next/server";
import { verifyToken, getUserById } from "@/utils/authHelpers";
import { success, error } from "@/utils/apiResponse";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    console.log("❌ No token found in cookies");
    return error("❌ Unauthorized", 401, "No token found in cookies");
  }

  try {
    const { userId } = verifyToken(token);
    const user = await getUserById(userId);

    if (!user) {
      console.log("❌ User not found in DB");
      return error("❌ User not found", 404);
    }
    
    console.log("✅ Dashboard access granted for:", user.email);
    return success("✅ Access granted", 200, { user });
  } catch (err: any) {
    console.error("❌ JWT verification failed:", err.message);
    return error("❌ Invalid or expired token", 401, err.message);
  }
}
