import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";
import { logAccess } from "@/lib/audit-log";

export async function POST(
  request: Request,
  { params }: { params: { linkId: string } }
) {
  const admin = await getAdminUser();
  
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { linkId } = params;
  const { reason } = await request.json();

  const share = await prisma.documentShareLink.findUnique({
    where: { id: linkId },
    include: {
      document: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!share) {
    return NextResponse.json({ error: "Share link not found" }, { status: 404 });
  }

  if (share.revokedAt) {
    return NextResponse.json({ error: "Share link already revoked" }, { status: 400 });
  }

  // Get user email for logging
  const user = share.document.userId 
    ? await prisma.user.findUnique({
        where: { id: share.document.userId },
        select: { email: true },
      })
    : null;

  // Revoke the share link
  const revoked = await prisma.documentShareLink.update({
    where: { id: linkId },
    data: {
      revokedAt: new Date(),
      revokedBy: admin.id,
    },
  });

  // Log the admin revoke action
  await logAccess({
    actorId: admin.id,
    action: "ADMIN_REVOKE",
    resourceType: "DOCUMENT_SHARE",
    resourceId: linkId,
    subjectUserId: share.document.userId,
    metadata: {
      reason: reason || undefined,
      subjectUserEmail: user?.email || undefined,
      documentId: share.documentId,
    },
  });

  return NextResponse.json({
    success: true,
    share: {
      id: revoked.id,
      revokedAt: revoked.revokedAt,
      revokedBy: admin.email,
    },
  });
}
