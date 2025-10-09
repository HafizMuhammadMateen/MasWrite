import { invalidateSession } from "@/utils/authHelpers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Invalidate session
    const res = NextResponse.json({ message: "✅ Logged out successfully." });
    invalidateSession(res);
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "❌ Something went wrong" }, { status: 500 })
  }
}
