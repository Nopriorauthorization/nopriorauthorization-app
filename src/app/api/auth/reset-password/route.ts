import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";

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
    
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      // Generate secure token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store token
      await prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt,
        },
      });

      // Build reset URL
      const baseUrl = process.env.NEXTAUTH_URL || 'https://nopriorauthorization.com';
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      // Log for development (in production, send email via Resend/SendGrid)
      console.log('========================================');
      console.log('PASSWORD RESET REQUESTED');
      console.log('Email:', normalizedEmail);
      console.log('Reset URL:', resetUrl);
      console.log('Expires:', expiresAt.toISOString());
      console.log('========================================');

      // Track analytics
      await prisma.analytics.create({
        data: {
          event: "password_reset_requested",
          userId: user.id,
        },
      });
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
