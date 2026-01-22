export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createSignedUrl } from "@/lib/storage/supabase";
import { documentSignedUrlExpires } from "@/lib/documents/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const shareLink = await prisma.documentShareLink.findUnique({
    where: { token: params.token },
    include: { document: true },
  });
  if (
    !shareLink ||
    shareLink.revokedAt ||
    shareLink.expiresAt.getTime() < Date.now() ||
    !shareLink.document ||
    shareLink.document.deletedAt
  ) {
    return NextResponse.json(
      { error: "This document link is no longer available." },
      { status: 410 }
    );
  }

  const signedUrl = await createSignedUrl(
    shareLink.document.storagePath,
    documentSignedUrlExpires
  );

  await prisma.documentShareLinkAccess.create({
    data: {
      shareLinkId: shareLink.id,
      ipAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: request.headers.get("user-agent") ?? null,
    },
  });

  return NextResponse.json({ url: signedUrl });
}
