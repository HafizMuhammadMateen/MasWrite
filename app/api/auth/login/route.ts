import { NextResponse } from "next/server";
import { comparePassword, getUserByEmail, getToken, makeNewSession } from "@/utils/authHelpers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      console.log("⚠️ Missing email or password");
      return NextResponse.json({ error: "⚠️ Email & password required" }, { status: 400 });
    }

    // Verify user
    const user = await getUserByEmail(email);
    if (!user) { 
      console.log("❌ No user found for email:", email)
      return NextResponse.json({ error: "❌ Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const valid = await comparePassword(password, user.password);
    if (!valid){
      console.log("❌ Incorrect password for:", email);  
      return NextResponse.json({ error: "❌ Invalid credentials" }, { status: 401 });
    }

    // Sign JWT
    const token = getToken({ userId: user._id.toString(), email: user.email });
    const response = NextResponse.json({ message: "✅ Login successful"}, { status: 200 });

    makeNewSession(response, token);
    console.log("✅ User logged in:", user.email);
    return response;
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "❌ Something went wrong" }, { status: 500 });
  }
}
