import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { linkId: string } }
) {
  const admin = await getAdminUser();
  
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { linkId } = params;

  const share = await prisma.documentShareLink.findUnique({
    where: { id: linkId },
    include: {
      document: {
        select: {
          id: true,
          title: true,
          category: true,
          userId: true,
        },
      },
      accesses: {
        orderBy: { accessedAt: "desc" },
        take: 50,
      },
    },
  });

  if (!share) {
    return NextResponse.json({ error: "Share link not found" }, { status: 404 });
  }

  // Get user details
  const user = share.document.userId
    ? await prisma.user.findUnique({
        where: { id: share.document.userId },
        select: { id: true, email: true, name: true },
      })
    : null;

  // Get revoker details if revoked by admin
  let revokedByAdmin = null;
  if (share.revokedBy) {
    revokedByAdmin = await prisma.user.findUnique({
      where: { id: share.revokedBy },
      select: { email: true, name: true },
    });
  }

  const now = new Date();
  const status = share.revokedAt
    ? "revoked"
    : share.expiresAt > now
    ? "active"
    : "expired";

  return NextResponse.json({
    share: {
      id: share.id,
      token: share.token,
      documentId: share.document.id,
      documentTitle: share.document.title,
      documentCategory: share.document.category,
      userId: user?.id || null,
      userEmail: user?.email || "Anonymous",
      userName: user?.name || null,
      createdAt: share.createdAt,
      expiresAt: share.expiresAt,
      revokedAt: share.revokedAt,
      revokedBy: revokedByAdmin,
      status,
      accessCount: share.accesses.length,
    },
    accesses: share.accesses.map(access => ({
      id: access.id,
      accessedAt: access.accessedAt,
      ipAddress: access.ipAddress,
      userAgent: access.userAgent,
    })),
  });
}
