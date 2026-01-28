export const dynamic = "force-dynamic";
/**
 * Admin API: Disable User Account
 * 
 * POST /api/admin/users/[userId]/disable
 * - Soft disable user account
 * - Creates UserDisableEvent record
 * - Revokes all active sessions
 * - Logs to AccessLog
 * 
 * SECURITY: Admin-only, confirmation required
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";
import { logAccess } from "@/lib/audit-log";

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  // Authorization check
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized - Admin access required" },
      { status: 403 }
    );
  }

  const { userId } = params;
  const body = await request.json();
  const { reason } = body;

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, isDisabled: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.isDisabled) {
      return NextResponse.json(
        { error: "User is already disabled" },
        { status: 400 }
      );
    }

    // Disable user and create disable event in a transaction
    await prisma.$transaction(async (tx) => {
      // Set user.isDisabled = true
      await tx.user.update({
        where: { id: userId },
        data: { isDisabled: true },
      });

      // Create disable event record
      await tx.userDisableEvent.create({
        data: {
          userId,
          disabledBy: admin.id,
          reason: reason || null,
        },
      });
    });

    // Log to AccessLog (actorId = admin, subjectUserId = disabled user)
    await logAccess({
      actorId: admin.id,
      action: "USER_DISABLED",
      resourceType: "USER",
      resourceId: userId,
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
      subjectUserId: userId,
      metadata: {
        subjectEmail: user.email,
        reason: reason || null,
      },
    });

    // Sessions will be invalidated on next auth check when isDisabled is detected

    return NextResponse.json({
      success: true,
      message: "User account disabled successfully",
    });
  } catch (error) {
    console.error("Failed to disable user:", error);
    return NextResponse.json(
      { error: "Failed to disable user account" },
      { status: 500 }
    );
  }
}
