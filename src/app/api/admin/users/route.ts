export const dynamic = "force-dynamic";
/**
 * Admin API: Users Management
 * 
 * GET /api/admin/users
 * - List all users with search and filters
 * - Pagination: 100 per page
 * 
 * SECURITY: Admin-only
 * PHI POLICY: Read-only, user metadata only (no clinical content)
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
  const limit = 100;
  const skip = (page - 1) * limit;

  // Filters
  const search = searchParams.get("search") || undefined;
  const role = searchParams.get("role") || undefined;
  const status = searchParams.get("status") || undefined;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role && role !== "ALL") {
    where.role = role;
  }

  if (status === "disabled") {
    where.isDisabled = true;
  } else if (status === "active") {
    where.isDisabled = false;
  }

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isDisabled: true,
          createdAt: true,
          lastAccessAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isDisabled: user.isDisabled,
      createdAt: user.createdAt.toISOString(),
      lastAccessAt: user.lastAccessAt?.toISOString() || null,
    }));

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
