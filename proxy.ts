import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/authHelpers";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDev = process.env.NODE_ENV === "development";

  const manualToken = req.cookies.get("token")?.value;
  const nextAuthToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (isDev) {
    console.log("🧭 [Proxy]", {
      path: pathname,
      manualJWT: !!manualToken,
      nextAuthJWT: !!nextAuthToken,
    });
  }

  // Public routes
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (manualToken || nextAuthToken) {
      try {
        if (manualToken) verifyToken(manualToken);
        if (isDev) {
          console.log("🔁 [Proxy] Already logged in → redirecting to /dashboard");
        }
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch {
        // allow access if manual token is invalid
      }
    }

    return NextResponse.next();
  }

  // Protected dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!manualToken && !nextAuthToken) {
      if (isDev) console.warn("❌ [Proxy] No auth token found");
      return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
    }

    try {
      if (manualToken) verifyToken(manualToken);
      return NextResponse.next();
    } catch {
      if (isDev) console.error("❌ [Proxy] Invalid or expired token");
      return NextResponse.redirect(new URL("/login?error=token_expired", req.url));
    }
  }

  // Protected API routes
  if (
    pathname.startsWith("/api/dashboard/") ||
    pathname.startsWith("/api/auth/change-password/") ||
    pathname.startsWith("/api/auth/reset-password/")
  ) {
    if (!manualToken && !nextAuthToken) {
      if (isDev) console.warn("❌ [Proxy] Token not found for API");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      if (manualToken) verifyToken(manualToken);
      return NextResponse.next();
    } catch {
      if (isDev) console.error("❌ [Proxy] Invalid or expired token for API");
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/reset-password/:path*",
    "/api/dashboard/:path*",
    "/api/auth/change-password/:path*",
    "/api/auth/reset-password/:path*",
    "/api/auth/me/:path*",
  ],
};
