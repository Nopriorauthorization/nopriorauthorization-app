export const dynamic = "force-dynamic";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { DocumentCategory } from "@prisma/client";
import prisma from "@/lib/db";
import { uploadToBucket } from "@/lib/storage/supabase";
import {
  formatDocument,
  resolveDocumentIdentity,
} from "@/lib/documents/server";
import { getOrCreateAnonId } from "@/lib/memory/userMemory";
import { smartCategorize } from "@/lib/documents/ai-categorization";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
]);

export async function GET(request: NextRequest) {
  const identity = await resolveDocumentIdentity(request);
  if (!identity.userId && !identity.anonId) {
    return NextResponse.json({ documents: [] });
  }
  
  const { searchParams } = new URL(request.url);
  const decodedOnly = searchParams.get("decoded") === "true";
  const limit = searchParams.get("limit") 
    ? parseInt(searchParams.get("limit") as string, 10) 
    : undefined;
  
  const filters: Array<Record<string, string>> = [];
  if (identity.userId) {
    filters.push({ userId: identity.userId });
  }
  if (identity.anonId) {
    filters.push({ anonId: identity.anonId });
  }
  
  const documents = await prisma.document.findMany({
    where: {
      deletedAt: null,
      OR: filters,
      ...(decodedOnly ? { decode: { isNot: null } } : {}),
    },
    include: {
      decode: decodedOnly,
    },
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
  
  return NextResponse.json({
    documents: documents.map((document) => ({
      ...formatDocument(document),
      hasDecoded: !!document.decode,
      termCount: document.decode 
        ? (Array.isArray(document.decode.keyTerms) ? document.decode.keyTerms.length : 0)
        : 0,
    })),
  });
}

export async function POST(request: NextRequest) {
  const identity = await resolveDocumentIdentity(request);
  const hasUser =
    typeof identity.userId === "string" && identity.userId.length > 0;
  const existingAnonId = request.cookies.get("npa_uid")?.value ?? null;
  const anonId =
    identity.anonId ||
    (!hasUser ? getOrCreateAnonId(existingAnonId) : null);

  if (!hasUser && !anonId) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "A document file is required." },
      { status: 400 }
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only PDF, PNG, and JPG files are allowed." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ownerId = (hasUser ? identity.userId : anonId) as string;
  const extension = path.extname(file.name ?? ".pdf").toLowerCase() || ".pdf";
  const storagePath = `documents/${ownerId}/${randomUUID()}${extension}`;

  await uploadToBucket({
    path: storagePath,
    data: buffer,
    mimeType: file.type || "application/octet-stream",
  });

  // AI-powered smart categorization
  const title = (formData.get("title") as string | null) ?? file.name ?? "Untitled Document";
  const aiAnalysis = smartCategorize(title, file.name, file.type);
  
  // Use provided category or fall back to AI suggestion
  const categoryRaw = (formData.get("category") as string | null) ?? aiAnalysis.suggestedCategory;
  const category = (Object.keys(DocumentCategory) as Array<
    keyof typeof DocumentCategory
  >).includes(categoryRaw as keyof typeof DocumentCategory)
    ? (categoryRaw as DocumentCategory)
    : DocumentCategory.OTHER;

  const docDateRaw = (formData.get("docDate") as string | null) ?? null;
  const includeDefault =
    (formData.get("includeInPacketDefault") as string | null) === "true";

  const document = await prisma.document.create({
    data: {
      userId: hasUser ? identity.userId : undefined,
      anonId: hasUser ? undefined : anonId ?? undefined,
      title: (formData.get("title") as string | null)?.trim() ||
        file.name ||
        "Document",
      category,
      docDate: docDateRaw ? new Date(docDateRaw) : undefined,
      storagePath,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: buffer.length,
      includeInPacketDefault: includeDefault,
    },
  });

  const response = NextResponse.json({ document: formatDocument(document) });
  if (!hasUser && !existingAnonId && anonId) {
    response.cookies.set("npa_uid", anonId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}
