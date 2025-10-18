import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthOptions";
import { verifyToken, getUserById } from "@/utils/authHelpers";

export async function GET(req: NextRequest) {
  try {
    // ✅ Try NextAuth session (OAuth users)
    const nextAuthSession = await getServerSession(authOptions);
    if (nextAuthSession?.user) {
      return NextResponse.json({
        authenticated: true,
        source: "oauth",
        user: nextAuthSession.user,
      });
    }

    // ✅ Try manual JWT session
    const manualToken = req.cookies.get("token")?.value;
    if (manualToken) {
      const { userId } = verifyToken(manualToken);
      const user = await getUserById(userId);
      if (user) {
        return NextResponse.json({
          authenticated: true,
          source: "manual",
          user: { email: user.email, name: user.name },
        });
      }
    }

    // ❌ No valid session found
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err: any) {
    console.error("❌ Session check error:", err.message);
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
  }
}
