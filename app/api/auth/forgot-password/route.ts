import { NextRequest } from "next/server";
import { Resend } from "resend";
import { getUserByEmail, signResetPasswordToken } from "@/utils/authHelpers";
import { validateEmail } from "@/utils/validators";
import { success, error } from "@/utils/apiResponse";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  try {
    const { email } = await req.json();

    const emailError = validateEmail(email);
    if (emailError) return error(emailError, 422);

    const user = await getUserByEmail(email);
    if (!user) return error("Email not registered", 404);
    if (!user.password) return error("OAuth accounts cannot reset passwords manually", 403);

    const resetToken = signResetPasswordToken({ userId: user._id.toString() });
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    await resend.emails.send({
      // from: '"Auth Module" <no-reply@maswrite.com>',
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 15 minutes.</p>
      `,
    });
    isDev && console.log("🔑 [ForgotPasswordAPI] Reset link sent to:", email);
    return success(`A reset link has been sent to: ${email}`, 200);
  } catch (err: any) {
    isDev && console.error("❌ [ForgotPasswordAPI] Error:", err.message || err);
    return error(err.message || "Server error", 500);
  }
}
