import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "⚠️ Email & password required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("auth-module");

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "❌ Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "❌ Invalid credentials" }, { status: 401 });
    }

    // Sign JWT
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // return NextResponse.json({ message: "Login successful", token }, { status: 200 });
    const response = NextResponse.json({ message: "✅ Login successful"}, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
    })

    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "❌ Something went wrong" }, { status: 500 });
  }
}
