import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getUserByEmail, getResetPasswordURL, signResetPasswordToken } from "@/utils/authHelpers";
import { validateEmail } from "@/utils/validators";


const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validate email format
    const emailError = validateEmail(email);
    if (emailError) 
      return NextResponse.json({ error: emailError }, { status: 400 });

    // Find user by email
    const user = await getUserByEmail(email);
    if(!user) 
      return NextResponse.json(
        {message: "If user exists, a reset link has been sent"},
        {status: 200}
      );

    const resetToken = signResetPasswordToken({ userId: user._id.toString() }); // Generate reset token
    const resetUrl = getResetPasswordURL(resetToken); // Generate reset URL

    // Send reset email
    await resend.emails.send({
      // from: '"Auth Module" <no-reply@auth-module.com>',
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset</p>
        <p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return NextResponse.json(
      { message: "If user exists, a reset link has been sent" }, 
      { status: 200 }
    );
  } catch (err:any) {
    return NextResponse.json(
      { error: err.message || "❌ Server error" }, 
      { status: 500 }
    );
  }
}