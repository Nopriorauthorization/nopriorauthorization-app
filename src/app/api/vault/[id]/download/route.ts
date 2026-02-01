import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import { createSignedUrl } from "@/lib/storage/supabase";
import {
  logVaultDownload,
  getVaultRequestMetadata,
} from "@/lib/vault-audit";

/**
 * GET /api/vault/[id]/download - Download document
 * 
 * Returns a signed URL for secure download.
 * All downloads are logged for audit purposes.
 */
export async function GET(
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

  // Generate signed URL (expires in 5 minutes)
  const signedUrl = await createSignedUrl(document.storagePath, 300);

  // Log download action
  const { ipAddress, userAgent } = getVaultRequestMetadata(request);
  await logVaultDownload(
    document.id,
    user.npaId,
    user.id,
    user.npaId,
    ipAddress,
    userAgent
  );

  return NextResponse.json({
    url: signedUrl,
    filename: document.originalFilename,
    mimeType: document.mimeType,
    expiresIn: 300,
  });
}
