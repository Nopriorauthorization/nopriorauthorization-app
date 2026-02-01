import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import { SHARE_COMPLIANCE_STATEMENT } from "@/lib/sharing/share-service";

/**
 * GET /api/share/audit - Get comprehensive sharing audit log
 * 
 * This endpoint shows users:
 * - Active shares
 * - Expired shares
 * - Revoked shares
 * - Who accessed what
 * - When access occurred
 * - What action was taken
 * 
 * This is NON-NEGOTIABLE trust UX.
 * 
 * Query params:
 * - shareId?: string (filter to specific share session)
 * - action?: string (filter by action type)
 * - startDate?: string (ISO date)
 * - endDate?: string (ISO date)
 * - limit?: number (default: 100)
 * - offset?: number (default: 0)
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Get user with NPA ID
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, npaId: true },
  });

  if (!user?.npaId) {
    return NextResponse.json(
      { error: "NPA ID not found" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const shareId = searchParams.get("shareId");
  const action = searchParams.get("action");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 500);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  // Build filter for access logs
  const accessLogWhere: Record<string, any> = {
    shareSession: {
      npaId: user.npaId,
    },
  };

  if (shareId) {
    accessLogWhere.shareSessionId = shareId;
  }

  if (action) {
    accessLogWhere.action = action;
  }

  if (startDate || endDate) {
    accessLogWhere.accessedAt = {};
    if (startDate) {
      accessLogWhere.accessedAt.gte = new Date(startDate);
    }
    if (endDate) {
      accessLogWhere.accessedAt.lte = new Date(endDate);
    }
  }

  // Get access logs with share session info
  const [accessLogs, totalCount, shareStats] = await Promise.all([
    prisma.npaShareAccessLog.findMany({
      where: accessLogWhere,
      orderBy: { accessedAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        shareSession: {
          select: {
            id: true,
            token: true,
            title: true,
            permission: true,
            expiresAt: true,
            isRevoked: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.npaShareAccessLog.count({ where: accessLogWhere }),
    // Get aggregate stats
    prisma.npaShareSession.groupBy({
      by: ["isRevoked"],
      where: { npaId: user.npaId },
      _count: true,
    }),
  ]);

  // Get counts by status
  const now = new Date();
  const [activeCount, expiredCount, revokedCount, totalShares] = await Promise.all([
    prisma.npaShareSession.count({
      where: {
        npaId: user.npaId,
        isRevoked: false,
        expiresAt: { gt: now },
      },
    }),
    prisma.npaShareSession.count({
      where: {
        npaId: user.npaId,
        isRevoked: false,
        expiresAt: { lte: now },
      },
    }),
    prisma.npaShareSession.count({
      where: {
        npaId: user.npaId,
        isRevoked: true,
      },
    }),
    prisma.npaShareSession.count({
      where: { npaId: user.npaId },
    }),
  ]);

  // Get unique accessors
  const uniqueAccessors = await prisma.npaShareAccessLog.findMany({
    where: {
      shareSession: { npaId: user.npaId },
      accessorEmail: { not: null },
    },
    distinct: ["accessorEmail"],
    select: {
      accessorName: true,
      accessorOrg: true,
      accessorEmail: true,
    },
  });

  // Format access logs
  const formattedLogs = accessLogs.map((log) => ({
    id: log.id,
    shareId: log.shareSessionId,
    shareTitle: log.shareSession.title,
    shareToken: log.shareSession.token,
    action: log.action,
    actionDescription: getActionDescription(log.action),
    documentId: log.documentId,
    accessor: {
      name: log.accessorName,
      organization: log.accessorOrg,
      email: log.accessorEmail,
    },
    wasSuccessful: log.wasSuccessful,
    denialReason: log.denialReason,
    ipAddress: log.ipAddress,
    accessedAt: log.accessedAt,
  }));

  return NextResponse.json({
    summary: {
      totalShares,
      activeShares: activeCount,
      expiredShares: expiredCount,
      revokedShares: revokedCount,
      totalAccessEvents: totalCount,
      uniqueAccessors: uniqueAccessors.length,
    },
    knownAccessors: uniqueAccessors,
    accessLogs: formattedLogs,
    pagination: {
      total: totalCount,
      limit,
      offset,
      hasMore: offset + accessLogs.length < totalCount,
    },
    complianceStatement: SHARE_COMPLIANCE_STATEMENT,
  });
}

function getActionDescription(action: string): string {
  switch (action) {
    case "LINK_VIEWED":
      return "Opened share link";
    case "DOCUMENT_VIEWED":
      return "Viewed a document";
    case "DOCUMENT_DOWNLOADED":
      return "Downloaded a document";
    case "DOCUMENT_UPLOADED":
      return "Contributed a document";
    case "ACCESS_DENIED":
      return "Access was denied";
    default:
      return action;
  }
}
