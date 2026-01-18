/**
 * Admin API: Export Activity Logs as CSV
 * 
 * GET /api/admin/activity-logs/export
 * - Returns CSV file with all matching logs
 * - Respects same filters as main endpoint
 * - Filename: activity-logs-YYYY-MM-DD.csv
 * 
 * SECURITY: Admin-only
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
  
  // Filters (same as main endpoint)
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

  if (search) {
    where.resourceId = { contains: search, mode: "insensitive" };
  }

  try {
    // Fetch all matching logs (no pagination for export)
    const logs = await prisma.accessLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Fetch user data
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

    // Generate CSV
    const headers = [
      "Timestamp",
      "Actor Email",
      "Actor Name",
      "Subject Email",
      "Subject Name",
      "Action",
      "Resource Type",
      "Resource ID",
      "IP Address",
      "User Agent",
    ];

    const rows = logs.map((log) => {
      const actor = log.actorId ? userMap.get(log.actorId) : null;
      const subject = log.subjectUserId ? userMap.get(log.subjectUserId) : null;
      
      return [
        log.createdAt.toISOString(),
        actor?.email || "",
        actor?.name || "",
        subject?.email || "",
        subject?.name || "",
        log.action,
        log.resourceType || "",
        log.resourceId || "",
        log.ipAddress || "",
        log.userAgent || "",
      ];
    });

    // Escape CSV values (handle commas, quotes)
    const escapeCsvValue = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\n");

    // Generate filename with current date
    const date = new Date().toISOString().split("T")[0];
    const filename = `activity-logs-${date}.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Failed to export activity logs:", error);
    return NextResponse.json(
      { error: "Failed to export activity logs" },
      { status: 500 }
    );
  }
}
