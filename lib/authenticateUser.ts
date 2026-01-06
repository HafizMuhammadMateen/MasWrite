import { getToken } from "next-auth/jwt";
import { verifyToken, getUserById } from "@/utils/authHelpers";
import { NextRequest } from "next/server";

export async function getAuthenticatedUser(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";
  
  try {
    const manualToken = req.cookies?.get("token")?.value;
    const nextAuthToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // No tokens found
    if (!manualToken && !nextAuthToken) return null;

    // Extract userId from whichever token exists
    let userId: string | undefined;

    if (manualToken) {
      const decoded = verifyToken(manualToken);
      userId = decoded?.userId;
    } else if (nextAuthToken) {
      userId = nextAuthToken.userId?.toString() || nextAuthToken.sub;
    }

    if (!userId) return null;

    // Fetch user document from DB
    return await getUserById(userId);
  } catch (error) {
    isDev && console.log("❌ Unauthenticated user:", error);
    return null;
  }
}
