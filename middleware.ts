// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/authHelpers";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDev = process.env.NODE_ENV === "development";

  // Fetch tokens
  const manualToken = req.cookies.get("token")?.value;
  const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 🔍 Log only in dev mode
  isDev && console.log("🧭 [Middleware]", {
    path: pathname,
    manualJWT: !!manualToken,
    nextAuthJWT: !!nextAuthToken,
  });

  // ----------------------------
  // 1️⃣ PUBLIC ROUTES (login/signup)
  // ----------------------------
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (manualToken || nextAuthToken) {
      try {
        if (manualToken) verifyToken(manualToken);
        isDev && console.log("🔁 [Middleware] Already logged in → redirecting to /dashboard");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch {
        // Invalid token → allow access to login/signup
      }
    }
    return NextResponse.next();
  }

  // ----------------------------
  // 2️⃣ PROTECTED ROUTES (/dashboard)
  // ----------------------------
  if (pathname.startsWith("/dashboard")) {
    if (!manualToken && !nextAuthToken) {
      isDev && console.warn("❌ [Middleware] No auth|credential token found");
      return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
    }

    try {
      if (manualToken) verifyToken(manualToken);
      return NextResponse.next();
    } catch {
      isDev && console.error("❌ [Middleware] Invalid or expired token");
      return NextResponse.redirect(new URL("/login?error=token_expired", req.url));
    }
  }

  // ----------------------------
  // 3️⃣ API ROUTES (protected)
  // ----------------------------
  if (
    pathname.startsWith("/api/dashboard/") ||
    pathname.startsWith("/api/auth/change-password/") ||
    pathname.startsWith("/api/auth/reset-password/")
  ) {
    if (!manualToken && !nextAuthToken) {
      isDev && console.warn("❌ [Middleware] Token not found for API");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      if (manualToken) verifyToken(manualToken);
      return NextResponse.next();
    } catch {
      isDev && console.error("❌ [Middleware] Invalid or expired token for API");
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
  }

  // Default fallback
  return NextResponse.next();
}

// ✅ Matcher configuration
export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/reset-password/:path*",
    "/api/dashboard/:path*",
    "/api/auth/change-password/:path*",
    "/api/auth/reset-password/:path*",
  ],
  runtime: "nodejs",
};
