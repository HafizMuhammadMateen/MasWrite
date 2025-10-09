import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { validateEmail, validatePassword } from "@/utils/validators";
import { getUserByEmail, hashPassword } from "@/utils/authHelpers";

export async function POST(req: Request) {
  try {
    const { userName, email, password } = await req.json();

    // Basic validation
    if (!userName || !email || !password) {
      return NextResponse.json({ error: "⚠️ All fields are required" }, { status: 400 });
    }

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) 
      return NextResponse.json({ error: emailError }, { status: 400 });

    // Validate password
    const passwordError = validatePassword(password, true);
    if (passwordError) 
      return NextResponse.json({ error: passwordError }, { status: 400 });
    
    // Check duplicates
    const existingUser = await getUserByEmail(email);
    if (existingUser) 
      return NextResponse.json({ error: "⚠️ Email already registered" }, { status: 400});

    // Hash password
    const hashedPassword = await hashPassword(password);
    const client = await clientPromise;
    const db = client.db("auth-module");

    const newUser = {
      userName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("users").insertOne(newUser);

    return NextResponse.json({ 
        message: "✅ User created successfully",
        user: { userName, email }
      }, { status: 201 }
    );
  } catch (err) {
    console.error("❌ Signup error:", err);
    return NextResponse.json({ error: "❌ Something went wrong" }, { status: 500 });
  }
}
