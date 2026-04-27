import { NextResponse } from "next/server";
import { destroySession } from "@/utils/authHelpers";
import { cookies } from "next/headers";

const EXPIRED = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, expires: new Date(0), maxAge: 0, path: "/" };
const isDev = process.env.NODE_ENV === "development";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const res = NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });

    // Clear manual JWT cookie
    if (cookieStore.get("token")) {
      destroySession(res);
      isDev && console.log("✅ [LogoutAPI] Manual JWT cleared");
    }

    // Clear all NextAuth cookies on the response (works for both http + https)
    res.cookies.set("next-auth.session-token", "", EXPIRED);
    res.cookies.set("next-auth.callback-url", "", EXPIRED);
    res.cookies.set("next-auth.csrf-token", "", EXPIRED);
    res.cookies.set("__Secure-next-auth.session-token", "", EXPIRED);
    res.cookies.set("__Secure-next-auth.callback-url", "", EXPIRED);
    res.cookies.set("__Secure-next-auth.csrf-token", "", EXPIRED);
    res.cookies.set("__Host-next-auth.csrf-token", "", EXPIRED);

    isDev && console.log("✅ [LogoutAPI] Session cleared");
    return res;
  } catch (err: any) {
    isDev && console.error("❌ [LogoutAPI] Error:", err.message || err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
