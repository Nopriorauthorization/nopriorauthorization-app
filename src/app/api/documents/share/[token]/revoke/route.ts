import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  findDocumentForOwner,
  resolveDocumentIdentity,
} from "@/lib/documents/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const shareLink = await prisma.documentShareLink.findUnique({
    where: { token: params.token },
  });
  if (!shareLink) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const identity = await resolveDocumentIdentity(request);
  await findDocumentForOwner(shareLink.documentId, identity);
  await prisma.documentShareLink.update({
    where: { token: params.token },
    data: { revokedAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}
