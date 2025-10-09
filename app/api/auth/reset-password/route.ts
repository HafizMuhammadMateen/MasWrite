import { NextRequest, NextResponse } from "next/server";
import { updatePassword, verifyToken } from "@/utils/authHelpers";
import { validatePassword } from "@/utils/validators";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    // Verify token
    const { userId } = verifyToken(token);
    
    // Validate password
    const passwordError = validatePassword(newPassword);
    if(passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

    // Update password in DB
    await updatePassword(userId, newPassword);

    return NextResponse.json(
      { message: "✅ Password reset successfully" }, 
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ Reset password error:", err.message);
    return NextResponse.json(
      { error: err.message || "❌ Invalid or expired token" }, 
      { status: 400 }
    );
  }
}
