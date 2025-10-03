import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();

    // Getting token from cookies [receiving request]
    const token = req.cookies.get("token")?.value;
    
    // Authenticating user
    if(!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    // Finding user in db using userId
    const client = await clientPromise;
    const db = client.db("auth-module");

    const user = await db.collection("users").findOne({_id: userId});
    if(!user) {
      return NextResponse.json({error: "User not found"}, {status: 404});
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if(!isMatch) {
      return NextResponse.json({ error: "Incorrect current password!" }, { status: 400 });
    }

    // Validate new password
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return NextResponse.json({ error: "Weak password" }, { status: 400 });
    }

    // Update password in DB  
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.collection("users").updateOne(
      {_id: userId}, 
      {$set: {password: hashed} }
    );

    // Invalidate old session
    const res = NextResponse.json({ message: "Password updated successsfully. Please login again."}, { status: 200} );
    res.cookies.set("token", "", {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(0),
      maxAge: 0,
    })
    return res;
  } catch (err:any) {
    return NextResponse.json({error: err.message || "Server error"}, {status: 500});
  }
}