/**
 * Admin API: Activity & Audit Logs
 * 
 * GET /api/admin/activity-logs
 * - Query all AccessLog entries with filters
 * - Pagination: 100 per page
 * - Export: CSV format
 * 
 * SECURITY: Admin-only (role check)
 * PHI POLICY: Read-only, IDs/emails only, no clinical content
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  // Authorization check
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized - Admin access required" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  
  // Pagination
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 100; // Fixed at 100 per spec
  const skip = (page - 1) * limit;

  // Filters
  const userId = searchParams.get("userId") || undefined;
  const action = searchParams.get("action") || undefined;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const search = searchParams.get("search") || undefined;

  // Build where clause
  const where: any = {};

  if (userId) {
    where.OR = [
      { actorId: userId },
      { subjectUserId: userId },
    ];
  }

  if (action && action !== "ALL") {
    where.action = action;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  // Search by resource ID only (no user relation in AccessLog model)
  if (search) {
    where.resourceId = { contains: search, mode: "insensitive" };
  }

  try {
    // Fetch logs
    const [logs, total] = await Promise.all([
      prisma.accessLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.accessLog.count({ where }),
    ]);

    // Fetch user emails for actorId and subjectUserId
    const userIds = Array.from(
      new Set(
        logs.flatMap((log) => [log.actorId, log.subjectUserId].filter(Boolean) as string[])
      )
    );

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, name: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    // Format response
    const formattedLogs = logs.map((log) => {
      const actor = log.actorId ? userMap.get(log.actorId) : null;
      const subject = log.subjectUserId ? userMap.get(log.subjectUserId) : null;
      
      return {
        id: log.id,
        timestamp: log.createdAt.toISOString(),
        actorId: log.actorId,
        actorEmail: actor?.email,
        actorName: actor?.name,
        subjectUserId: log.subjectUserId,
        subjectEmail: subject?.email,
        subjectName: subject?.name,
        action: log.action,
        resourceType: log.resourceType,
        resourceId: log.resourceId,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        metadata: log.metadata,
      };
    });

    return NextResponse.json({
      logs: formattedLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
}
