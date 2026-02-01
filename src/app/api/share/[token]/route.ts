import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import {
  isValidShareToken,
  formatShareSessionResponse,
  SHARE_COMPLIANCE_STATEMENT,
} from "@/lib/sharing/share-service";

/**
 * GET /api/share/[token] - Get share session details (owner only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const { token } = await params;

  if (!isValidShareToken(token)) {
    return NextResponse.json(
      { error: "Invalid share token format" },
      { status: 400 }
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

  // Get share session - must belong to this user
  const shareSession = await prisma.npaShareSession.findFirst({
    where: {
      token,
      npaId: user.npaId,
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
      accessLogs: {
        orderBy: { accessedAt: "desc" },
        take: 50,
        select: {
          id: true,
          action: true,
          accessorName: true,
          accessorOrg: true,
          accessorEmail: true,
          ipAddress: true,
          wasSuccessful: true,
          denialReason: true,
          accessedAt: true,
          documentId: true,
        },
      },
      contributions: {
        include: {
          document: {
            select: {
              id: true,
              title: true,
              category: true,
              dateOfCare: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          accessLogs: true,
          contributions: true,
        },
      },
    },
  });

  if (!shareSession) {
    return NextResponse.json(
      { error: "Share session not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    share: {
      ...formatShareSessionResponse(shareSession),
      accessLogs: shareSession.accessLogs,
      contributions: shareSession.contributions.map((c) => ({
        id: c.id,
        providerName: c.providerName,
        providerOrg: c.providerOrg,
        providerEmail: c.providerEmail,
        contributionType: c.contributionType,
        dateOfCare: c.dateOfCare,
        notes: c.notes,
        createdAt: c.createdAt,
        document: c.document,
      })),
    },
    complianceStatement: SHARE_COMPLIANCE_STATEMENT,
  });
}

/**
 * DELETE /api/share/[token] - Revoke a share session (instant, hard stop)
 * 
 * Body (optional):
 * - reason: string (optional reason for revocation)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const { token } = await params;

  if (!isValidShareToken(token)) {
    return NextResponse.json(
      { error: "Invalid share token format" },
      { status: 400 }
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

  // Parse optional body
  let reason: string | undefined;
  try {
    const body = await request.json();
    reason = body.reason;
  } catch {
    // Body is optional
  }

  // Find and revoke the share session
  const shareSession = await prisma.npaShareSession.findFirst({
    where: {
      token,
      npaId: user.npaId,
    },
  });

  if (!shareSession) {
    return NextResponse.json(
      { error: "Share session not found" },
      { status: 404 }
    );
  }

  if (shareSession.isRevoked) {
    return NextResponse.json(
      { error: "Share session is already revoked" },
      { status: 400 }
    );
  }

  // Revoke immediately
  const revokedSession = await prisma.npaShareSession.update({
    where: { id: shareSession.id },
    data: {
      isRevoked: true,
      revokedAt: new Date(),
      revokedReason: reason || null,
    },
  });

  return NextResponse.json({
    message: "Share link revoked successfully. All access has been terminated.",
    share: {
      id: revokedSession.id,
      token: revokedSession.token,
      isRevoked: true,
      revokedAt: revokedSession.revokedAt,
      revokedReason: revokedSession.revokedReason,
    },
  });
}

/**
 * PATCH /api/share/[token] - Update share session settings
 * 
 * Body:
 * - title?: string
 * - expiresAt?: string (ISO date, must be in future)
 * - maxUses?: number | null
 * - showPatientName?: boolean
 * - patientDisplayName?: string
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const { token } = await params;

  if (!isValidShareToken(token)) {
    return NextResponse.json(
      { error: "Invalid share token format" },
      { status: 400 }
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

  const body = await request.json();
  const { title, expiresAt, maxUses, showPatientName, patientDisplayName } = body;

  // Find the share session
  const shareSession = await prisma.npaShareSession.findFirst({
    where: {
      token,
      npaId: user.npaId,
    },
  });

  if (!shareSession) {
    return NextResponse.json(
      { error: "Share session not found" },
      { status: 404 }
    );
  }

  if (shareSession.isRevoked) {
    return NextResponse.json(
      { error: "Cannot update a revoked share session" },
      { status: 400 }
    );
  }

  // Build update data
  const updateData: Record<string, any> = {};

  if (title !== undefined) {
    updateData.title = title;
  }

  if (expiresAt !== undefined) {
    const newExpiry = new Date(expiresAt);
    if (newExpiry <= new Date()) {
      return NextResponse.json(
        { error: "Expiration date must be in the future" },
        { status: 400 }
      );
    }
    updateData.expiresAt = newExpiry;
  }

  if (maxUses !== undefined) {
    updateData.maxUses = maxUses;
  }

  if (showPatientName !== undefined) {
    updateData.showPatientName = showPatientName;
  }

  if (patientDisplayName !== undefined) {
    updateData.patientDisplayName = patientDisplayName;
  }

  // Update
  const updatedSession = await prisma.npaShareSession.update({
    where: { id: shareSession.id },
    data: updateData,
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
    message: "Share settings updated",
    share: formatShareSessionResponse(updatedSession),
  });
}
