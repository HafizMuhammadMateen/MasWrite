import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value; // Expect "Bearer <token>"
  console.log("token is:", token)
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next(); // allow request
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}

// Protect all routes under /api/protected/*
export const config = {
  matcher: ["/api/protected/:path*"],
  runtime: "nodejs", // 👈 force Node runtime
};