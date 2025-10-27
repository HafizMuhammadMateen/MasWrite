import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/authHelpers";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // PUBLIC ROUTES: redirect logged-in users
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (token) {
      try {
        verifyToken(token);
        console.log("🔁 Logged-in user → redirect /dashboard");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch {
        return NextResponse.next(); // Invalid token → allow access to login/signup
      }
    }
    return NextResponse.next();
  }

  // PROTECTED ROUTES [Dashboard page]: require valid token
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      console.warn("❌ No token found");
      return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
    }
    try {
      verifyToken(token);
      return NextResponse.next();
    } catch (err: any) {
      console.error("❌ Invalid or expired token:", err.message);
      return NextResponse.redirect(new URL("/login?error=token_expired", req.url));
    }
  }

  // API Routes
  if (pathname.startsWith("/api/auth/") || pathname.startsWith("/api/auth/me")) {
    if (!token) {
      console.warn("❌ No token found");
      return NextResponse.json({ message: "❌ Unauthorized" }, { status: 401 });
    }
    try {
      verifyToken(token);
      return NextResponse.next();
    } catch (err: any) {
      console.error("❌ Invalid or expired token:", err.message);
      return NextResponse.json({ message: "❌ Invalid or expired token" }, { status: 401 });
    }
  }
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/reset-password/:path*",
    "/api/auth/change-password/:path*",
    "/api/auth/reset-password/:path*",
    "/api/auth/me/:path*",
  ],
  runtime: "nodejs",
};
