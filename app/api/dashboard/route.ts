import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById } from "@/utils/authHelpers";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    console.log("❌ No token found in cookies");
    return NextResponse.json({ error: "❌ Unauthorized" }, { status: 401 });
  }

  try {
    const { userId } = verifyToken(token);
    const user = await getUserById(userId);

    if (!user) {
      console.log("❌ User not found in DB");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "✅ Access granted", user });
  } catch (err: any) {
    console.error("❌ JWT verification failed:", err.message);
    return NextResponse.json({ error: "❌ Invalid or expired token" }, { status: 401 });
  }
}
