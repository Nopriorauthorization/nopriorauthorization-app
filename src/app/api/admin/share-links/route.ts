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
  const status = searchParams.get("status") || "all"; // all, active, expired, revoked

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  // Status filter
  const now = new Date();
  if (status === "active") {
    where.revokedAt = null;
    where.expiresAt = { gt: now };
  } else if (status === "expired") {
    where.revokedAt = null;
    where.expiresAt = { lte: now };
  } else if (status === "revoked") {
    where.revokedAt = { not: null };
  }

  // Search by user email
  if (search) {
    where.document = {
      user: {
        email: { contains: search, mode: "insensitive" },
      },
    };
  }

  const [shares, total] = await Promise.all([
    prisma.documentShareLink.findMany({
      where,
      include: {
        document: {
          select: {
            title: true,
            userId: true,
          },
        },
        _count: {
          select: { accesses: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.documentShareLink.count({ where }),
  ]);

  // Get user emails for all shares
  const userIds = shares.map(s => s.document.userId).filter(Boolean) as string[];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true, name: true },
  });
  
  const userMap = new Map(users.map(u => [u.id, u]));

  return NextResponse.json({
    shares: shares.map(share => {
      const user = share.document.userId ? userMap.get(share.document.userId) : null;
      return {
        id: share.id,
        token: share.token,
        userEmail: user?.email || "Anonymous",
        userName: user?.name || null,
        documentTitle: share.document.title,
        createdAt: share.createdAt,
        expiresAt: share.expiresAt,
        revokedAt: share.revokedAt,
        accessCount: share._count.accesses,
        status: share.revokedAt
          ? "revoked"
          : share.expiresAt > now
          ? "active"
          : "expired",
      };
    }),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
