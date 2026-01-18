/**
 * Admin API: Enable User Account
 * 
 * POST /api/admin/users/[userId]/enable
 * - Re-enable previously disabled user account
 * - Resolves most recent UserDisableEvent
 * - Logs to AccessLog
 * 
 * SECURITY: Admin-only
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

    if (!user.isDisabled) {
      return NextResponse.json(
        { error: "User is not disabled" },
        { status: 400 }
      );
    }

    // Enable user and resolve disable event in a transaction
    await prisma.$transaction(async (tx) => {
      // Set user.isDisabled = false
      await tx.user.update({
        where: { id: userId },
        data: { isDisabled: false },
      });

      // Resolve most recent disable event (set resolvedAt and resolvedBy)
      const latestDisableEvent = await tx.userDisableEvent.findFirst({
        where: {
          userId,
          resolvedAt: null,
        },
        orderBy: { disabledAt: "desc" },
      });

      if (latestDisableEvent) {
        await tx.userDisableEvent.update({
          where: { id: latestDisableEvent.id },
          data: {
            resolvedAt: new Date(),
            resolvedBy: admin.id,
          },
        });
      }
    });

    // Log to AccessLog
    await logAccess({
      actorId: admin.id,
      action: "USER_ENABLED",
      resourceType: "USER",
      resourceId: userId,
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
      subjectUserId: userId,
      metadata: {
        subjectEmail: user.email,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User account enabled successfully",
    });
  } catch (error) {
    console.error("Failed to enable user:", error);
    return NextResponse.json(
      { error: "Failed to enable user account" },
      { status: 500 }
    );
  }
}
