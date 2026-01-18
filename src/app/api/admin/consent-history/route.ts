import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const admin = await getAdminUser();
  
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 100;
  const search = searchParams.get("search") || "";
  const consentType = searchParams.get("consentType") || "all";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  if (consentType !== "all") {
    where.consentType = consentType;
  }

  if (startDate || endDate) {
    where.changedAt = {};
    if (startDate) where.changedAt.gte = new Date(startDate);
    if (endDate) where.changedAt.lte = new Date(endDate);
  }

  // Search by user email
  if (search) {
    where.user = {
      email: { contains: search, mode: "insensitive" },
    };
  }

  const [logs, total] = await Promise.all([
    prisma.consentChangeLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { changedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.consentChangeLog.count({ where }),
  ]);

  // Get changedBy user details
  const changedByIds = logs.map(l => l.changedBy).filter(Boolean) as string[];
  const changedByUsers = await prisma.user.findMany({
    where: { id: { in: changedByIds } },
    select: { id: true, email: true, name: true },
  });
  
  const changedByMap = new Map(changedByUsers.map(u => [u.id, u]));

  return NextResponse.json({
    logs: logs.map(log => ({
      id: log.id,
      userId: log.user.id,
      userEmail: log.user.email,
      userName: log.user.name,
      consentType: log.consentType,
      oldValue: log.oldValue,
      newValue: log.newValue,
      changedAt: log.changedAt,
      changedBy: log.changedBy ? changedByMap.get(log.changedBy) : null,
      source: log.source,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
