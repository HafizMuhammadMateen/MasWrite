import { comparePassword, getUserByEmail, signToken, makeNewSession } from "@/utils/authHelpers";
import { success, error } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      console.log("⚠️ Missing email or password");
      // return NextResponse.json({ error: "⚠️ Email & password required" }, { status: 400 });
      return error("⚠️ Email & password required", 422);
    }

    // Verify user
    const user = await getUserByEmail(email);
    if (!user) { 
      console.log("❌ No user found for email:", email)
      return error("❌ Invalid credentials", 401);
    }

    // Verify password
    const valid = await comparePassword(password, user.password);
    if (!valid){
      console.log("❌ Incorrect password for:", email);  
      return error("❌ Invalid credentials", 401);
    }

    // Sign JWT
    const token = signToken({ userId: user._id.toString(), email: user.email });
    console.log("🆔 JWT generated for user:", user._id.toString());

    const response = success( "✅ Login successful", 200);
    makeNewSession(response, token);

    console.log("✅ User logged in:", user.email);
    return response;
  } catch (err: any) {
    console.error(err);
    return error(err.message || "❌ Something went wrong", 500);
  }
}
