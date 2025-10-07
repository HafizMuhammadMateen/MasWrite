import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {

    const body = await req.json();
    console.log("Incoming body:", body);

    const { userName, email, password } = body;

    // Basic validation
    if (!userName || !email || !password) {
      return NextResponse.json({ error: "⚠️ All fields are required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "❌ Invalid email" }, { status: 400 });
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return NextResponse.json({ error: "⚠️ Weak password" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("auth-module");

    // Check duplicates
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "⚠️ Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      userName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("users").insertOne(newUser);

    return NextResponse.json({ message: "✅ User created successfully" }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "❌ Something went wrong" }, { status: 500 });
  }
}
