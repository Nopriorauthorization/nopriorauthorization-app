import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  documentShareExpiryDays,
  findDocumentForOwner,
  resolveDocumentIdentity,
} from "@/lib/documents/server";

function getBaseUrl() {
  return (process.env.NEXTAUTH_URL ?? "").replace(/\/$/, "");
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const identity = await resolveDocumentIdentity(request);
  const document = await findDocumentForOwner(params.id, identity);
  const body = await request.json().catch(() => ({}));
  const expiresDays = Number(
    body?.expiresDays ?? documentShareExpiryDays
  ) || documentShareExpiryDays;

  const expiresAt = new Date(
    Date.now() + expiresDays * 24 * 60 * 60 * 1000
  );
  const shareLink = await prisma.documentShareLink.create({
    data: {
      documentId: document.id,
      token: randomUUID(),
      expiresAt,
    },
  });

  const shareUrl = `${getBaseUrl()}/api/documents/share/${shareLink.token}`;
  return NextResponse.json({
    token: shareLink.token,
    expiresAt: shareLink.expiresAt.toISOString(),
    shareUrl,
  });
}
