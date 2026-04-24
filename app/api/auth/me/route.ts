import { NextRequest } from "next/server";
import { success, error } from "@/utils/apiResponse";
import { getAuthenticatedUser } from "@/lib/authenticateUser";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    console.log("[me API route] No valid session found");
    return error("Unauthorized", 401, "No valid session found");
  }

  console.log("[me API route] Dashboard access granted for:", user.email);
  return success("Access granted", 200, { user });
}
