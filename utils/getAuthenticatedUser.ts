import { getToken } from "next-auth/jwt";
import { verifyToken } from "@/utils/authHelpers";
import { getUserById } from "@/utils/authHelpers";
import { NextRequest } from "next/server";

export async function getAuthenticatedUser(req: NextRequest) {
  const manualToken = req.cookies?.get("token")?.value;
  const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!manualToken && !nextAuthToken) return null;

  let userId;
  if (manualToken) {
    const decodedToken = verifyToken(manualToken);
    userId = decodedToken.userId;
  } else if (nextAuthToken) {
    userId = nextAuthToken.userId?.toString() || nextAuthToken.sub;
  }

  if (!userId) return null;

  return await getUserById(userId);
}
