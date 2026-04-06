export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAdminUser } from "@/lib/auth/admin-guard";

export async function GET(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const primarySlug = req.nextUrl.searchParams.get("primarySlug")?.trim();

  const where = primarySlug ? { primarySlug } : {};

  const grouped = await prisma.funnelAnalyticsEvent.groupBy({
    by: ["primarySlug", "step"],
    where,
    _count: { id: true },
    _sum: { revenueCents: true },
  });

  const bySession = await prisma.funnelAnalyticsEvent.groupBy({
    by: ["sessionId"],
    where,
    _count: { id: true },
    _sum: { revenueCents: true },
  });

  return NextResponse.json({
    byStep: grouped.map((g) => ({
      primarySlug: g.primarySlug,
      step: g.step,
      count: g._count.id,
      revenueCents: g._sum.revenueCents ?? 0,
    })),
    uniqueSessions: bySession.length,
  });
}
