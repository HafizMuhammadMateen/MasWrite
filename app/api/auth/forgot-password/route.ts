import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Finding user in db using userId
    const client = await clientPromise;
    const db = client.db("auth-module");
    const user = await db.collection("users").findOne({email});

    if(!user) {
      return NextResponse.json({message: "If user exists, a reset link has been sent"}, {status: 200});
    }

    // Generate reset token
    // const resetToken = crypto.randomBytes(32).toString("hex");
    // const expires = new Date(Date.now() + 1000 * 60 * 15);

    // await db.collection("resetTokens").insertOne({
    //   userId: user._id,
    //   token: resetToken,
    //   expires,
    // })

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const resetUrl = `${process.env.AUTH_MODULE_APP_URL}/reset-password?token=${resetToken}`;

    await resend.emails.send({
      // from: '"Auth Module" <no-reply@auth-module.com>',
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset</p>
        <p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 15 minutes.</p>
      `
    });

    console.log("link sent on:", email, "token", resetToken);
        
    return NextResponse.json({message: "If user exists, a reset link has been sent"}, {status: 200});
  } catch (err:any) {
    return NextResponse.json({error: err.message || "Server error"}, {status: 500});
  }
}