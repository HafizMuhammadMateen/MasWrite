import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    console.log("❌ No token found in cookies");
    return NextResponse.json({ error: "❌ Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    const client = await clientPromise;
    const db = client.db("auth-module");

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { userName: 1, email: 1 } }
    );

    if (!user) {
      console.log("❌ User not found in DB");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "✅ Access granted", user });
  } catch (err) {
    console.error("❌ JWT verification failed:", err);
    return NextResponse.json({ error: "❌ Invalid or expired token" }, { status: 401 });
  }
}
