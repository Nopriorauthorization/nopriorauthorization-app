import { Document } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { NextRequest } from "next/server";
import prisma from "@/lib/db";

export type DocumentIdentity = {
  userId: string | null;
  anonId: string | null;
};

export async function resolveDocumentIdentity(
  request: NextRequest
): Promise<DocumentIdentity> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;
  const anonId = request.cookies.get("npa_uid")?.value ?? null;
  return { userId, anonId };
}

export function ensureDocumentAccess(
  document: { userId: string | null; anonId: string | null; deletedAt: Date | null },
  identity: DocumentIdentity
) {
  const owns =
    (document.userId && identity.userId && document.userId === identity.userId) ||
    (document.anonId && identity.anonId && document.anonId === identity.anonId);
  if (!owns || document.deletedAt) {
    throw new Error("Document not found.");
  }
}

export async function findDocumentForOwner(
  documentId: string,
  identity: DocumentIdentity
) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });
  if (!document) throw new Error("Document not found.");
  ensureDocumentAccess(document, identity);
  return document;
}

export function formatDocument(document: Document | null) {
  if (!document) return null;
  return {
    id: document.id,
    title: document.title,
    category: document.category,
    docDate: document.docDate?.toISOString() ?? null,
    mimeType: document.mimeType,
    sizeBytes: document.sizeBytes,
    includeInPacketDefault: document.includeInPacketDefault,
    createdAt: document.createdAt.toISOString(),
  };
}

export const documentShareExpiryDays = Number(
  process.env.DOCUMENT_SHARE_LINK_EXPIRY_DAYS ?? "7"
);

export const documentSignedUrlExpires = Number(
  process.env.DOCUMENT_SIGNED_URL_EXPIRES ?? "900"
);
