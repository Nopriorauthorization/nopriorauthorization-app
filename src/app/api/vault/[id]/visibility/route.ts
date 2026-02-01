import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import { getVaultRequestMetadata, logVaultAction } from "@/lib/vault-audit";

/**
 * PATCH /api/vault/[id]/visibility - Hide or show a document from timeline
 * 
 * This allows users to control which documents appear in their timeline
 * without permanently deleting them.
 * 
 * Body:
 * - isHidden: boolean (true to hide, false to show)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const { id } = await params;

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

  // Get document - enforce ownership by NPA ID
  const document = await prisma.npaVaultDocument.findFirst({
    where: {
      id,
      npaId: user.npaId,
      isDeleted: false,
    },
  });

  if (!document) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const { isHidden } = body;

  if (typeof isHidden !== "boolean") {
    return NextResponse.json(
      { error: "isHidden must be a boolean" },
      { status: 400 }
    );
  }

  // Update visibility
  const updatedDocument = await prisma.npaVaultDocument.update({
    where: { id },
    data: {
      isHidden,
      hiddenAt: isHidden ? new Date() : null,
    },
  });

  // Log action
  const { ipAddress, userAgent } = getVaultRequestMetadata(request);
  await logVaultAction({
    documentId: id,
    npaId: user.npaId,
    action: "METADATA_UPDATED",
    actorId: user.id,
    actorNpaId: user.npaId,
    ipAddress,
    userAgent,
    metadata: {
      visibilityChanged: true,
      isHidden,
    },
  });

  return NextResponse.json({
    message: isHidden
      ? "Document hidden from timeline"
      : "Document restored to timeline",
    document: {
      id: updatedDocument.id,
      title: updatedDocument.title,
      isHidden: updatedDocument.isHidden,
      hiddenAt: updatedDocument.hiddenAt,
    },
  });
}
