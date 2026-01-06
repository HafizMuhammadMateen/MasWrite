import { success, error } from "@/utils/apiResponse";
import { destroySession } from "@/utils/authHelpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthOptions";
import { cookies } from "next/headers";

export async function POST() {
  const isDev = process.env.NODE_ENV === "development";

  try {
    // Check for OAuth session first
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();

    // Case 1: Manual JWT session
    if (cookieStore.get("token")) {
      const res = success("Logged out successfully", 200);
      destroySession(res);
      isDev && console.log("✅ [LogoutAPI] Manual user logged out");
      return res;
    }

    // Case 2: NextAuth session (OAuth)
    if (session) {
      cookieStore.delete("next-auth.session-token");
      cookieStore.delete("__Secure-next-auth.session-token");
      cookieStore.delete("next-auth.callback-url");
      cookieStore.delete("next-auth.csrf-token");

      const res = success("Logged out successfully", 200);
      isDev && console.log("✅ [LogoutAPI] OAuth user logged out");
      return res;
    }

    // Case 3: No active session at all
    return success("No active session found", 200);
  } catch (err: any) {
    isDev && console.error("❌ [LogoutAPI] Error:", err.message || err);
    return error(err.message || "Server error", 500);
  }
}
