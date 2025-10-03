import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

    const client = await clientPromise;
    const db = client.db("auth-module");

    await db.collection("users").updateOne(
      { _id: payload.userId },
      { $set: { password: newPassword } } // hash it in production
    );

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid or expired token" }, { status: 400 });
  }
}
