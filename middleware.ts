import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/authHelpers";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Must be async — since we await getToken()
  const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const manualToken = req.cookies.get("token")?.value;

  console.log("Middleware Path:", pathname);
  console.log("➡️ Manual JWT:", manualToken ? "Present" : "Absent");
  console.log("➡️ NextAuth JWT:", nextAuthToken ? "Present" : "Absent");

  // ----------------------------
  // 1️⃣ PUBLIC ROUTES (login/signup)
  // ----------------------------
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (manualToken || nextAuthToken) {
      try {
        if (manualToken) verifyToken(manualToken);
        console.log("🔁 Already logged in → redirecting to /dashboard");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch {
        // Invalid manual token — let user proceed
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // ----------------------------
  // 2️⃣ PROTECTED ROUTES (/dashboard)
  // ----------------------------
  if (pathname.startsWith("/dashboard")) {
    // If no token of any kind → redirect
    if (!manualToken && !nextAuthToken) {
      console.warn("❌ No auth token found");
      return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
    }

    try {
      // Verify manual token if present
      if (manualToken) verifyToken(manualToken);
      // Otherwise, just trust NextAuth token (already validated by next-auth)
      return NextResponse.next();
    } catch (err: any) {
      console.error("❌ Invalid or expired token:", err.message);
      return NextResponse.redirect(new URL("/login?error=token_expired", req.url));
    }
  }

  // ----------------------------
  // 3️⃣ API ROUTES
  // ----------------------------
  if (pathname.startsWith("/api/dashboard/") || pathname.startsWith("/api/auth/change-password/")) {
    if (!manualToken && !nextAuthToken) {
      console.warn("❌ No auth token found for API");
      return NextResponse.json({ message: "❌ Unauthorized" }, { status: 401 });
    }

    try {
      if (manualToken) verifyToken(manualToken);
      return NextResponse.next();
    } catch (err: any) {
      console.error("❌ Invalid or expired token:", err.message);
      return NextResponse.json({ message: "❌ Invalid or expired token" }, { status: 401 });
    }
  }

  return NextResponse.next(); // Default fallback
}

// ✅ Config — async safe, correct matcher
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


// // middleware.ts
// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const { pathname } = req.nextUrl;

//   console.log("Middleware - Path:", pathname, "Token:", token ? "Present" : "Absent");

//   // If logged in user tries to access login/signup → redirect
//   if ((pathname.startsWith("/login") || pathname.startsWith("/signup")) && token) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   // Protect dashboard routes
//   if (pathname.startsWith("/dashboard") && !token) {
//     return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/login", "/signup", "/dashboard/:path*"],
// };

