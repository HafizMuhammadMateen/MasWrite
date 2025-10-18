import { success, error } from "@/utils/apiResponse";
import { invalidateSession } from "@/utils/authHelpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthOptions";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Check for OAuth session first
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();

    // ✅ Case 1: Manual JWT session
    if (cookieStore.get("token")) {
      const res = success("✅ Logged out successfully.", 200);
      invalidateSession(res);
      console.log("👋 User logged out: Manual user");
      return res;
    }

    // ✅ Case 2: OAuth (NextAuth) session
    if (session) {
      // Delete NextAuth cookies manually
      cookieStore.delete("next-auth.session-token");
      cookieStore.delete("__Secure-next-auth.session-token");
      cookieStore.delete("next-auth.callback-url");
      cookieStore.delete("next-auth.csrf-token");

      const res = success("✅ Logged out successfully.", 200);
      console.log("👋 User logged out: OAuth user");
      return res;
    }

    // ✅ Case 3: No session at all
    return success("⚠️ No active session found.", 200);
  } catch (err: any) {
    console.error("❌ Logout error:", err.message);
    return error(err.message || "❌ Something went wrong", 500);
  }
}
