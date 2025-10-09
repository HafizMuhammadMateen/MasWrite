import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { error } from "@/utils/apiResponse";
import { verifyToken } from "@/utils/authHelpers";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // No token found -> block access
  if (!token) {
    console.warn("❌ No token found in middleware");
    return error("❌ Unauthorized", 401);
  }

  try {
    verifyToken(token);

    // Allow request to route
    return NextResponse.next();
  } catch (err: any) {
    console.error("❌ Invalid or expired token in middleware:", err.message);
    return error("❌ Invalid or expired token", 401);
  }
}

// Protect all routes under /api/protected/*
export const config = {
  matcher: ["/api/auth/:path*"],
  // runtime: "nodejs", // 👈 force Node runtime
};