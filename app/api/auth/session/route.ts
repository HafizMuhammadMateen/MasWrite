// app/api/auth/session/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ authenticated: false });
  }
  return Response.json({
    authenticated: true,
    user: session.user,
    mfaRequired: (session as any).mfaRequired || false,
  });
}
