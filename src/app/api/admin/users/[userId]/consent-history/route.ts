import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const admin = await getAdminUser();
  
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId } = params;

  const logs = await prisma.consentChangeLog.findMany({
    where: { userId },
    orderBy: { changedAt: "desc" },
  });

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
      consentType: log.consentType,
      oldValue: log.oldValue,
      newValue: log.newValue,
      changedAt: log.changedAt,
      changedBy: log.changedBy ? changedByMap.get(log.changedBy) : null,
      source: log.source,
    })),
  });
}
