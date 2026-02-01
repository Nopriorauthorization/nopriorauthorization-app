import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import {
  generateShareToken,
  calculateExpirationDate,
  formatShareSessionResponse,
  SHARE_COMPLIANCE_STATEMENT,
  type ExpirationPreset,
} from "@/lib/sharing/share-service";
import type { SharePermission } from "@prisma/client";

/**
 * POST /api/share - Create a new share session
 * 
 * COMPLIANCE STATEMENT:
 * "Access is granted by the patient and may be revoked at any time.
 * Shared information reflects records as provided and does not constitute medical advice."
 * 
 * Body:
 * - documentIds: string[] (required) - Documents to share
 * - permission: "READ_ONLY" | "READ_DOWNLOAD" | "UPLOAD_ALLOWED" (default: READ_ONLY)
 * - expirationPreset: "24h" | "7d" | "30d" | "custom" (default: 7d)
 * - customExpirationDate?: string (ISO date, required if preset is "custom")
 * - maxUses?: number (optional limit on accesses)
 * - title?: string (optional name for the share)
 * - showPatientName?: boolean (default: true)
 * - patientDisplayName?: string (override display name)
 */
export async function POST(request: NextRequest) {
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
    select: { id: true, npaId: true, name: true },
  });

  if (!user?.npaId) {
    return NextResponse.json(
      { error: "NPA ID not found. Please contact support." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const {
    documentIds,
    permission = "READ_ONLY",
    expirationPreset = "7d",
    customExpirationDate,
    maxUses,
    title,
    showPatientName = true,
    patientDisplayName,
  } = body;

  // Validate document IDs
  if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
    return NextResponse.json(
      { error: "At least one document must be selected for sharing" },
      { status: 400 }
    );
  }

  // Validate permission
  const validPermissions: SharePermission[] = [
    "READ_ONLY",
    "READ_DOWNLOAD",
    "UPLOAD_ALLOWED",
  ];
  if (!validPermissions.includes(permission)) {
    return NextResponse.json(
      { error: "Invalid permission. Must be READ_ONLY, READ_DOWNLOAD, or UPLOAD_ALLOWED" },
      { status: 400 }
    );
  }

  // Verify all documents exist and belong to this user's NPA ID
  const documents = await prisma.npaVaultDocument.findMany({
    where: {
      id: { in: documentIds },
      npaId: user.npaId,
      isDeleted: false,
    },
    select: { id: true, title: true, category: true, documentType: true, dateOfCare: true },
  });

  if (documents.length !== documentIds.length) {
    return NextResponse.json(
      { error: "One or more documents not found or not authorized" },
      { status: 400 }
    );
  }

  // Calculate expiration
  let expiresAt: Date;
  try {
    expiresAt = calculateExpirationDate(
      expirationPreset as ExpirationPreset,
      customExpirationDate ? new Date(customExpirationDate) : undefined
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid expiration" },
      { status: 400 }
    );
  }

  // Generate share token
  const token = generateShareToken();

  // Create share session with documents
  const shareSession = await prisma.npaShareSession.create({
    data: {
      npaId: user.npaId,
      userId: user.id,
      token,
      title,
      permission: permission as SharePermission,
      expiresAt,
      maxUses: maxUses || null,
      showPatientName,
      patientDisplayName: patientDisplayName || user.name || null,
      documents: {
        create: documentIds.map((docId: string) => ({
          documentId: docId,
        })),
      },
    },
    include: {
      documents: {
        include: {
          document: {
            select: {
              id: true,
              title: true,
              category: true,
              documentType: true,
              dateOfCare: true,
            },
          },
        },
      },
      _count: {
        select: {
          accessLogs: true,
          contributions: true,
        },
      },
    },
  });

  return NextResponse.json({
    message: "Share link created successfully",
    share: formatShareSessionResponse(shareSession),
    complianceStatement: SHARE_COMPLIANCE_STATEMENT,
  });
}

/**
 * GET /api/share - List user's share sessions
 * 
 * Query params:
 * - status: "active" | "expired" | "revoked" | "all" (default: all)
 * - limit: number (default: 50)
 * - offset: number (default: 0)
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
  const status = searchParams.get("status") || "all";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  // Build filter
  const where: Record<string, any> = {
    npaId: user.npaId,
  };

  const now = new Date();
  if (status === "active") {
    where.isRevoked = false;
    where.expiresAt = { gt: now };
  } else if (status === "expired") {
    where.expiresAt = { lte: now };
    where.isRevoked = false;
  } else if (status === "revoked") {
    where.isRevoked = true;
  }

  // Get share sessions
  const [shareSessions, totalCount] = await Promise.all([
    prisma.npaShareSession.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        documents: {
          include: {
            document: {
              select: {
                id: true,
                title: true,
                category: true,
                documentType: true,
                dateOfCare: true,
              },
            },
          },
        },
        _count: {
          select: {
            accessLogs: true,
            contributions: true,
          },
        },
      },
    }),
    prisma.npaShareSession.count({ where }),
  ]);

  return NextResponse.json({
    shares: shareSessions.map(formatShareSessionResponse),
    pagination: {
      total: totalCount,
      limit,
      offset,
      hasMore: offset + shareSessions.length < totalCount,
    },
    complianceStatement: SHARE_COMPLIANCE_STATEMENT,
  });
}
