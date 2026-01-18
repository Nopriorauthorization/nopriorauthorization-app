/**
 * Admin API: User Detail
 * 
 * GET /api/admin/users/[userId]
 * - Get detailed information about a specific user
 * - Includes consent status, active shares, recent activity summary
 * 
 * SECURITY: Admin-only
 * PHI POLICY: Read-only metadata, no clinical content
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";

export async function GET(
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isDisabled: true,
        createdAt: true,
        lastAccessAt: true,
        consentToShareClinicalSummary: true,
        allowProviderToProviderSharing: true,
        dataExportRequestedAt: true,
        accountDeletionRequestedAt: true,
        disableEvents: {
          orderBy: { disabledAt: "desc" },
          take: 5,
          select: {
            id: true,
            disabledAt: true,
            disabledBy: true,
            reason: true,
            resolvedAt: true,
            resolvedBy: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get active share links count
    const activeSharesCount = await prisma.providerPacketLink.count({
      where: {
        packet: { userId: userId },
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    // Get recent activity count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivityCount = await prisma.accessLog.count({
      where: {
        OR: [
          { actorId: userId },
          { subjectUserId: userId },
        ],
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    // Fetch admin user details for disable events
    const adminIds = Array.from(
      new Set(
        user.disableEvents.flatMap((e) => [e.disabledBy, e.resolvedBy].filter(Boolean) as string[])
      )
    );

    const admins = await prisma.user.findMany({
      where: { id: { in: adminIds } },
      select: { id: true, email: true, name: true },
    });

    const adminMap = new Map(admins.map((a) => [a.id, a]));

    const formattedDisableEvents = user.disableEvents.map((event) => ({
      id: event.id,
      disabledAt: event.disabledAt.toISOString(),
      disabledBy: event.disabledBy,
      disabledByEmail: adminMap.get(event.disabledBy)?.email,
      reason: event.reason,
      resolvedAt: event.resolvedAt?.toISOString() || null,
      resolvedBy: event.resolvedBy,
      resolvedByEmail: event.resolvedBy ? adminMap.get(event.resolvedBy)?.email : null,
    }));

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isDisabled: user.isDisabled,
        createdAt: user.createdAt.toISOString(),
        lastAccessAt: user.lastAccessAt?.toISOString() || null,
      },
      consent: {
        clinicalSummarySharing: user.consentToShareClinicalSummary,
        providerToProviderSharing: user.allowProviderToProviderSharing,
      },
      dataRequests: {
        exportRequested: user.dataExportRequestedAt?.toISOString() || null,
        deletionRequested: user.accountDeletionRequestedAt?.toISOString() || null,
      },
      summary: {
        activeShareLinksCount: activeSharesCount,
        recentActivityCount,
      },
      disableHistory: formattedDisableEvents,
    });
  } catch (error) {
    console.error("Failed to fetch user detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch user detail" },
      { status: 500 }
    );
  }
}
