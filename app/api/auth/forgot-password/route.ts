import { NextRequest } from "next/server";
import { Resend } from "resend";
import { getUserByEmail, getResetPasswordURL, signResetPasswordToken } from "@/utils/authHelpers";
import { validateEmail } from "@/utils/validators";
import { success, error } from "@/utils/apiResponse";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // ✅ Validate email
    const emailError = validateEmail(email);
    if (emailError) return error(emailError, 400);

    // ✅ Find user (do not expose if absent)
    const user = await getUserByEmail(email);
    if (!user) return success("If user exists, a reset link has been sent", 200);

    // ❌ Block OAuth-only users (no password field)
    if (!user.password)
      return success("If user exists, a reset link has been sent", 200);

    // ✅ Generate reset token and URL
    const resetToken = signResetPasswordToken({ userId: user._id.toString() });
    const resetUrl = getResetPasswordURL(resetToken);

    // ✅ Send reset email (silent even if fails for non-existing user)
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return success("If user exists, a reset link has been sent", 200);
  } catch (err: any) {
    console.error("❌ Forgot password error:", err.message);
    return error(err.message || "❌ Server error", 500);
  }
}
