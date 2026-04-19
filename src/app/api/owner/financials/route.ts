export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";
import { logAccess } from "@/lib/audit-log";

interface FinancialData {
  revenueOverview?: {
    mrr: number;
    arr: number;
    activeSubscriptions: number;
    arpu: number;
    /** Gross shop purchases (Square) recorded in DB, last 30 days, cents. */
    shopRevenueLast30dCents?: number;
    note?: string;
  };
  subscriptionMix?: {
    tiers: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
  };
  billingHealth?: {
    failedPayments: number;
    refunds: number;
    churnRate: number;
  };
  growthSnapshot?: {
    newSubscriptions: number;
    revenueChange: number;
  };
}

export async function GET(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await logAccess({
      actorId: admin.id,
      action: "VIEW_FINANCIALS",
      resourceType: "FINANCIAL_DATA",
      resourceId: "owner-financials",
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    const data: FinancialData = {};

    try {
      data.revenueOverview = await getRevenueOverview();
    } catch (error) {
      console.error("Failed to fetch revenue overview:", error);
    }

    try {
      data.subscriptionMix = await getSubscriptionMix();
    } catch (error) {
      console.error("Failed to fetch subscription mix:", error);
    }

    try {
      data.billingHealth = await getBillingHealth();
    } catch (error) {
      console.error("Failed to fetch billing health:", error);
    }

    try {
      data.growthSnapshot = await getGrowthSnapshot();
    } catch (error) {
      console.error("Failed to fetch growth snapshot:", error);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Financials API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial data" },
      { status: 500 }
    );
  }
}

async function getRevenueOverview() {
  const activeSubscriptions = await prisma.subscription.count({
    where: {
      status: "active",
      currentPeriodEnd: { gt: new Date() },
    },
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const shopAgg = await prisma.purchase.aggregate({
    where: { createdAt: { gte: thirtyDaysAgo } },
    _sum: { amountPaid: true },
  });

  return {
    mrr: 0,
    arr: 0,
    activeSubscriptions,
    arpu: 0,
    shopRevenueLast30dCents: shopAgg._sum.amountPaid ?? 0,
    note:
      "Subscription MRR/ARR are not synced here (Stripe removed). Use Square Dashboard for payment detail; shopRevenueLast30dCents sums Purchase.amountPaid in this database.",
  };
}

async function getSubscriptionMix() {
  const rows = await prisma.subscription.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  if (rows.length === 0) return { tiers: [] };

  const total = rows.reduce((s, r) => s + r._count.id, 0);
  const tiers = rows.map((r) => ({
    name: r.status,
    count: r._count.id,
    percentage: total > 0 ? Math.round((r._count.id / total) * 10000) / 100 : 0,
  }));

  return { tiers };
}

async function getBillingHealth() {
  let churnRate = 0;
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const canceledSubscriptions = await prisma.analytics.count({
      where: {
        event: "subscription_canceled",
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const activeSubscriptions = await prisma.subscription.count({
      where: {
        status: "active",
        currentPeriodEnd: { gt: new Date() },
      },
    });

    if (activeSubscriptions > 0) {
      churnRate =
        Math.round((canceledSubscriptions / activeSubscriptions) * 100 * 100) /
        100;
    }
  } catch (error) {
    console.error("Failed to calculate churn rate:", error);
  }

  return {
    failedPayments: 0,
    refunds: 0,
    churnRate,
  };
}

async function getGrowthSnapshot() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newSubscriptions = await prisma.analytics.count({
    where: {
      event: "subscription_created",
      createdAt: { gte: thirtyDaysAgo },
    },
  });

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  let revenueChange = 0;
  try {
    const recentRevenue = await prisma.analytics.count({
      where: {
        event: "subscription_created",
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const previousRevenue = await prisma.analytics.count({
      where: {
        event: "subscription_created",
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    });

    if (previousRevenue > 0) {
      revenueChange =
        Math.round(((recentRevenue - previousRevenue) / previousRevenue) * 100 * 100) /
        100;
    }
  } catch (error) {
    console.error("Failed to calculate revenue change:", error);
  }

  return {
    newSubscriptions,
    revenueChange,
  };
}
