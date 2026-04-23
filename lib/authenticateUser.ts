import { getToken } from "next-auth/jwt";
import { verifyToken, getUserById } from "@/utils/authHelpers";
import { NextRequest } from "next/server";

/** Returns the userId string from whichever auth method is active, or null. */
export async function resolveUserId(req: NextRequest): Promise<string | null> {
  const manualToken = req.cookies?.get("token")?.value;
  if (manualToken) {
    try {
      const decoded = verifyToken(manualToken);
      return decoded?.userId ?? null;
    } catch {
      return null;
    }
  }
  const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (nextAuthToken) {
    return (nextAuthToken.userId as string) || nextAuthToken.sub || null;
  }
  return null;
}

export async function getAuthenticatedUser(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  try {
    const manualToken = req.cookies?.get("token")?.value;
    const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!manualToken && !nextAuthToken) return null;

    let userId: string | undefined;

    if (manualToken) {
      const decoded = verifyToken(manualToken);
      userId = decoded?.userId;
    } else if (nextAuthToken) {
      userId = (nextAuthToken.userId as string) || nextAuthToken.sub;
    }

    if (!userId) return null;

    // Try fetching from DB; for OAuth users fall back to token data
    const dbUser = await getUserById(userId);
    if (dbUser) return dbUser;

    if (nextAuthToken) {
      return {
        _id: userId,
        email: nextAuthToken.email,
        name: nextAuthToken.name,
        image: nextAuthToken.picture,
        password: undefined, // OAuth users have no local password
      };
    }

    return null;
  } catch (error) {
    isDev && console.log("❌ Unauthenticated user:", error);
    return null;
  }
}
