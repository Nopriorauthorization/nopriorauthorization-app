import { DocumentCategory } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  formatDocument,
  findDocumentForOwner,
  resolveDocumentIdentity,
} from "@/lib/documents/server";

function parseCategory(value: unknown) {
  if (typeof value !== "string") return undefined;
  return (Object.keys(DocumentCategory) as Array<
    keyof typeof DocumentCategory
  >).includes(value as keyof typeof DocumentCategory)
    ? (value as DocumentCategory)
    : undefined;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const identity = await resolveDocumentIdentity(request);
  const document = await findDocumentForOwner(params.id, identity);
  const body = await request.json().catch(() => ({}));
  const updates: Record<string, unknown> = {};

  if ("title" in body && typeof body.title === "string") {
    updates.title = body.title.trim();
  }
  if ("category" in body) {
    const category = parseCategory(body.category);
    if (category) updates.category = category;
  }
  if ("docDate" in body) {
    const raw = body.docDate;
    updates.docDate =
      typeof raw === "string" && raw.trim().length > 0
        ? new Date(raw)
        : null;
  }
  if ("includeInPacketDefault" in body) {
    updates.includeInPacketDefault = Boolean(body.includeInPacketDefault);
  }

  const payload =
    Object.keys(updates).length > 0
      ? await prisma.document.update({
          where: { id: document.id },
          data: updates,
        })
      : document;

  return NextResponse.json({ document: formatDocument(payload) });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const identity = await resolveDocumentIdentity(request);
  const document = await findDocumentForOwner(params.id, identity);
  const deleted = await prisma.document.update({
    where: { id: document.id },
    data: { deletedAt: new Date() },
  });
  return NextResponse.json({ document: formatDocument(deleted) });
}
