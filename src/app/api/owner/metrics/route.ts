import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin-guard';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check OWNER access
    await requireAdmin('/api/owner/metrics');

    // Get current date for time ranges
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch metrics
    const [
      totalUsers,
      activePaidUsers,
      newSignups7d,
      newSignups30d,
      totalDecodes,
      familyMembersCount,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Active paid users (with CORE or PREMIUM subscriptions)
      prisma.user.count({
        where: {
          subscriptionTier: { in: ['CORE', 'PREMIUM'] },
        },
      }),

      // New signups last 7 days
      prisma.user.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
        },
      }),

      // New signups last 30 days
      prisma.user.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
      }),

      // Total decodes (placeholder - assuming we have an analytics table)
      prisma.accessLog.count({
        where: {
          resourceType: 'document-analysis',
        },
      }),

      // Family members count (placeholder - if we have family member model)
      prisma.user.count({
        where: {
          // Assuming family members are users with certain criteria
          // For now, return 0 or count all users as placeholder
          NOT: { id: null }, // All users
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      activePaidUsers,
      newSignups: {
        '7d': newSignups7d,
        '30d': newSignups30d,
      },
      totalDecodes,
      familyMembersCount,
    });

  } catch (error) {
    console.error('Error fetching owner metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}