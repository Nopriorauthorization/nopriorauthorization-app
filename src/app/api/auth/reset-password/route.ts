import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * NPA Password Reset API
 * 
 * POST - Request password reset (send email)
 * PATCH - Complete password reset (with token)
 * 
 * AUDIT LOGGING:
 * - Password reset request logged
 * - Password reset success logged
 */

// Extract request metadata for audit logging
function getRequestMetadata(request: NextRequest) {
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;
  const userAgent = request.headers.get("user-agent") || null;
  return { ipAddress, userAgent };
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const { ipAddress, userAgent } = getRequestMetadata(request);

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
      const token = crypto.randomBytes(32).toString("hex");
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
      const baseUrl = process.env.NEXTAUTH_URL || "https://ask-beau-tox.vercel.app";
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      // Log for development (in production, send email via Resend/SendGrid)
      console.log("========================================");
      console.log("PASSWORD RESET REQUESTED");
      console.log("Email:", normalizedEmail);
      console.log("Reset URL:", resetUrl);
      console.log("Expires:", expiresAt.toISOString());
      console.log("========================================");

      // AUDIT LOG: Password reset requested
      await prisma.identityAuditLog.create({
        data: {
          userId: user.id,
          npaId: user.npaId,
          action: "PASSWORD_RESET_REQUESTED",
          ipAddress,
          userAgent,
          metadata: { email: normalizedEmail },
        },
      });

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

// PATCH - Complete password reset with token
export async function PATCH(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    const { ipAddress, userAgent } = getRequestMetadata(request);

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Find valid token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update password and mark token as used
    await Promise.all([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    // AUDIT LOG: Password reset completed
    await prisma.identityAuditLog.create({
      data: {
        userId: resetToken.userId,
        npaId: resetToken.user.npaId,
        action: "PASSWORD_RESET_COMPLETED",
        ipAddress,
        userAgent,
        metadata: { method: "email_token" },
      },
    });

    // Track analytics
    await prisma.analytics.create({
      data: {
        event: "password_reset_completed",
        userId: resetToken.userId,
      },
    });

    return NextResponse.json({
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Password reset complete error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
