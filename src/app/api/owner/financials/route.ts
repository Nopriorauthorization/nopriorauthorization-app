export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { getStripeClient } from "@/lib/stripe/stripe";
import prisma from "@/lib/db";
import { logAccess } from "@/lib/audit-log";

interface FinancialData {
  revenueOverview?: {
    mrr: number;
    arr: number;
    activeSubscriptions: number;
    arpu: number;
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
    // Check OWNER/ADMIN access
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Log access
    await logAccess({
      actorId: admin.id,
      action: "VIEW_FINANCIALS",
      resourceType: "FINANCIAL_DATA",
      resourceId: "owner-financials",
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    const data: FinancialData = {};

    // Revenue Overview
    try {
      const revenueData = await getRevenueOverview();
      data.revenueOverview = revenueData;
    } catch (error) {
      console.error("Failed to fetch revenue overview:", error);
      // Continue with other sections
    }

    // Subscription Mix
    try {
      const mixData = await getSubscriptionMix();
      data.subscriptionMix = mixData;
    } catch (error) {
      console.error("Failed to fetch subscription mix:", error);
    }

    // Billing Health
    try {
      const healthData = await getBillingHealth();
      data.billingHealth = healthData;
    } catch (error) {
      console.error("Failed to fetch billing health:", error);
    }

    // Growth Snapshot
    try {
      const growthData = await getGrowthSnapshot();
      data.growthSnapshot = growthData;
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
  const stripe = getStripeClient();

  // Get all active subscriptions from database
  const activeSubscriptions = await prisma.subscription.findMany({
    where: {
      status: "active",
      currentPeriodEnd: {
        gt: new Date(),
      },
    },
  });

  if (activeSubscriptions.length === 0) {
    return {
      mrr: 0,
      arr: 0,
      activeSubscriptions: 0,
      arpu: 0,
    };
  }

  // Get subscription details from Stripe
  const subscriptionDetails = await Promise.all(
    activeSubscriptions.map(async (sub) => {
      if (!sub.stripeSubId) return null;
      try {
        const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubId);
        return stripeSub;
      } catch (error) {
        console.error(`Failed to fetch subscription ${sub.stripeSubId}:`, error);
        return null;
      }
    })
  );

  const validSubscriptions = subscriptionDetails.filter(Boolean);

  if (validSubscriptions.length === 0) {
    return {
      mrr: 0,
      arr: 0,
      activeSubscriptions: 0,
      arpu: 0,
    };
  }

  // Calculate MRR (assuming monthly subscriptions)
  let totalMRR = 0;
  for (const sub of validSubscriptions) {
    if (sub && sub.items.data.length > 0) {
      const price = sub.items.data[0].price;
      if (price) {
        // Convert to monthly amount
        const amount = price.unit_amount || 0;
        if (price.recurring?.interval === "year") {
          totalMRR += amount / 12 / 100; // Convert cents to dollars and yearly to monthly
        } else if (price.recurring?.interval === "month") {
          totalMRR += amount / 100; // Convert cents to dollars
        }
      }
    }
  }

  const arr = totalMRR * 12;
  const activeCount = validSubscriptions.length;
  const arpu = activeCount > 0 ? totalMRR / activeCount : 0;

  return {
    mrr: Math.round(totalMRR * 100) / 100, // Round to 2 decimal places
    arr: Math.round(arr * 100) / 100,
    activeSubscriptions: activeCount,
    arpu: Math.round(arpu * 100) / 100,
  };
}

async function getSubscriptionMix() {
  const stripe = getStripeClient();

  // Get all subscriptions
  const subscriptions = await prisma.subscription.findMany({
    where: {
      stripeSubId: { not: null },
    },
  });

  if (subscriptions.length === 0) {
    return { tiers: [] };
  }

  // Group by price/product
  const tierCounts: Record<string, number> = {};

  for (const sub of subscriptions) {
    if (!sub.stripeSubId) continue;

    try {
      const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubId);
      if (stripeSub.items.data.length > 0) {
        const price = stripeSub.items.data[0].price;
        if (price) {
          const tierName = price.nickname || `$${price.unit_amount ? price.unit_amount / 100 : 0}`;
          tierCounts[tierName] = (tierCounts[tierName] || 0) + 1;
        }
      }
    } catch (error) {
      console.error(`Failed to fetch subscription ${sub.stripeSubId}:`, error);
    }
  }

  const total = subscriptions.length;
  const tiers = Object.entries(tierCounts).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / total) * 100 * 100) / 100, // Round to 2 decimal places
  }));

  return { tiers };
}

async function getBillingHealth() {
  const stripe = getStripeClient();

  // Get failed payments (invoices with failed status)
  let failedPayments = 0;
  let refunds = 0;

  try {
    // Get recent invoices (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const invoices = await stripe.invoices.list({
      created: { gte: Math.floor(thirtyDaysAgo.getTime() / 1000) },
      limit: 100,
    });

    for (const invoice of invoices.data) {
      if (invoice.status === "open" && invoice.attempt_count && invoice.attempt_count > 0) {
        failedPayments++;
      }
    }
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
  }

  // Get refunds
  try {
    const refundsList = await stripe.refunds.list({
      created: { gte: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60 },
      limit: 100,
    });
    refunds = refundsList.data.length;
  } catch (error) {
    console.error("Failed to fetch refunds:", error);
  }

  // Calculate churn rate (cancellations in last 30 days / total active subscriptions)
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
      churnRate = Math.round((canceledSubscriptions / activeSubscriptions) * 100 * 100) / 100;
    }
  } catch (error) {
    console.error("Failed to calculate churn rate:", error);
  }

  return {
    failedPayments,
    refunds,
    churnRate,
  };
}

async function getGrowthSnapshot() {
  const stripe = getStripeClient();

  // Get new subscriptions in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newSubscriptions = await prisma.analytics.count({
    where: {
      event: "subscription_created",
      createdAt: { gte: thirtyDaysAgo },
    },
  });

  // Calculate revenue change (compare last 30 days to previous 30 days)
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  let revenueChange = 0;
  try {
    // This is a simplified calculation - in reality you'd need to track historical revenue
    // For now, we'll use subscription events as a proxy
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
      revenueChange = Math.round(((recentRevenue - previousRevenue) / previousRevenue) * 100 * 100) / 100;
    }
  } catch (error) {
    console.error("Failed to calculate revenue change:", error);
  }

  return {
    newSubscriptions,
    revenueChange,
  };
}