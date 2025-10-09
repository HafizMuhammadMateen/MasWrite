import { NextRequest, NextResponse } from "next/server";
import { comparePassword, verifyToken, getUserById, updatePassword, invalidateSession } from "@/utils/authHelpers";
import { validatePassword } from "@/utils/validators";

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();

    // Get token from cookies [receive request]
    const token = req.cookies.get("token")?.value;
    
    // Authenticating user
    if (!token) return NextResponse.json({ error: "❌ Unauthorized" }, { status: 401 });

    // Verify user
    const { userId } = verifyToken(token);
    const user = await getUserById(userId);
    if (!user) 
      return NextResponse.json({ error: "❌ User not found" }, { status: 404 });

    // Compare current password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) 
      return NextResponse.json({ error: "❌ Incorrect current password!" }, { status: 400 });

    // Validate new password
    const passwordError = validatePassword(newPassword, true);
    if (passwordError) 
      return NextResponse.json({ error: passwordError }, { status: 400 });
    
    // Update password in DB  
    await updatePassword(userId, newPassword);

    // Invalidate old session
    const res = NextResponse.json({ message: "✅ Password updated successsfully. Please login again."}, { status: 200} );
    invalidateSession(res);    
    return res;
  } catch (err: any) {
    return NextResponse.json({error: err.message || "❌ Server error"}, {status: 500});
  }
}
