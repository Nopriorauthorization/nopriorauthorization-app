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
  const status = searchParams.get("status") || "all";
  const requestType = searchParams.get("requestType") || "all";

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  if (status !== "all") {
    where.status = status;
  }

  if (requestType !== "all") {
    where.requestType = requestType;
  }

  // Search by user email
  if (search) {
    where.user = {
      email: { contains: search, mode: "insensitive" },
    };
  }

  const [requests, total] = await Promise.all([
    prisma.dataRequest.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { requestedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.dataRequest.count({ where }),
  ]);

  // Get admin user details for fulfilled/cancelled by
  const adminIds = [
    ...requests.map(r => r.fulfilledBy).filter(Boolean),
    ...requests.map(r => r.cancelledBy).filter(Boolean),
  ] as string[];
  
  const admins = await prisma.user.findMany({
    where: { id: { in: adminIds } },
    select: { id: true, email: true, name: true },
  });
  
  const adminMap = new Map(admins.map(u => [u.id, u]));

  return NextResponse.json({
    requests: requests.map(req => ({
      id: req.id,
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      requestType: req.requestType,
      status: req.status,
      requestedAt: req.requestedAt,
      fulfilledAt: req.fulfilledAt,
      fulfilledBy: req.fulfilledBy ? adminMap.get(req.fulfilledBy) : null,
      cancelledAt: req.cancelledAt,
      cancelledBy: req.cancelledBy ? adminMap.get(req.cancelledBy) : null,
      cancellationReason: req.cancellationReason,
      notes: req.notes,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
