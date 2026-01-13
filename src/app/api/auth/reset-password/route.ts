import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Note: In production, you would integrate an email service like Resend, SendGrid, or AWS SES
// For MVP, this endpoint validates the email exists and logs the reset request

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user exists (don't reveal whether email exists in response)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      // In production: Generate reset token and send email
      // For now, log the request
      console.log(`Password reset requested for: ${normalizedEmail}`);

      // Track analytics
      await prisma.analytics.create({
        data: {
          event: "password_reset_requested",
          userId: user.id,
        },
      });

      // TODO: Implement email sending
      // 1. Generate secure token: crypto.randomBytes(32).toString('hex')
      // 2. Store token with expiry in database
      // 3. Send email with reset link: /reset-password?token=xxx
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: "If an account exists, reset instructions have been sent",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
