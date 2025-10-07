import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

    const client = await clientPromise;
    const db = client.db("auth-module");

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.collection("users").updateOne(
      { _id: new ObjectId(payload.userId) },
      { $set: { password: hashed } } // hash it in production
    );

    return NextResponse.json({ message: "✅ Password reseted successfully" }, {status: 200});
  } catch (err: any) {
    console.error("❌ Reset password error:", err.message);
    return NextResponse.json({ error: err.message || "❌ Invalid or expired token" }, { status: 400 });
  }
}
