import { randomUUID } from "node:crypto";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import { uploadToBucket } from "@/lib/storage/supabase";
import {
  detectDocumentMetadata,
  isSupportedMimeType,
  getExtensionFromMimeType,
} from "@/lib/vault/source-detection";
import {
  logVaultUpload,
  getVaultRequestMetadata,
} from "@/lib/vault-audit";
import { NpaDocumentCategory, NpaDocumentSource } from "@prisma/client";

/**
 * NPA VAULT API - Phase 2 Implementation
 * 
 * "This phase establishes patient ownership of health records.
 * The system must remain neutral, non-diagnostic, and patient-initiated only."
 * 
 * Supported file types:
 * - PDF (MyChart, Epic summaries, discharge notes)
 * - JPG / PNG / GIF / WebP / HEIC (photos, screenshots)
 * - CCDA / CCD (XML)
 * - Insurance cards, referral letters
 */

/**
 * GET /api/vault - List all vault documents for the authenticated user
 * 
 * Query params:
 * - category: Filter by document category
 * - source: Filter by source system
 * - sortBy: "dateOfCare" (default) or "uploadedAt"
 * - limit: Number of documents to return
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
      { error: "NPA ID not found. Please contact support." },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as NpaDocumentCategory | null;
  const source = searchParams.get("source") as NpaDocumentSource | null;
  const sortBy = searchParams.get("sortBy") || "dateOfCare";
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string, 10)
    : undefined;

  // Build query filters
  const where: Record<string, unknown> = {
    npaId: user.npaId,
    isDeleted: false,
  };

  if (category && Object.values(NpaDocumentCategory).includes(category)) {
    where.category = category;
  }

  if (source && Object.values(NpaDocumentSource).includes(source)) {
    where.source = source;
  }

  // Determine sort order - Timeline view sorts by dateOfCare with fallback to uploadedAt
  const orderBy =
    sortBy === "uploadedAt"
      ? { uploadedAt: "desc" as const }
      : [
          { dateOfCare: "desc" as const },
          { uploadedAt: "desc" as const },
        ];

  const documents = await prisma.npaVaultDocument.findMany({
    where,
    orderBy,
    ...(limit ? { take: limit } : {}),
    select: {
      id: true,
      title: true,
      category: true,
      source: true,
      sourceSystem: true,
      dateOfCare: true,
      dateReceived: true,
      uploadedAt: true,
      originalFilename: true,
      mimeType: true,
      sizeBytes: true,
    },
  });

  // Log view action (fire-and-forget)
  const { ipAddress, userAgent } = getVaultRequestMetadata(request);
  // Note: We log the list view as a batch, not individual documents

  return NextResponse.json({
    documents,
    npaId: user.npaId.substring(0, 12) + "...", // Partial for display
    total: documents.length,
  });
}

/**
 * POST /api/vault - Upload a new document to the vault
 * 
 * Body (FormData):
 * - file: The document file (required)
 * - title: Document title (optional, defaults to filename)
 * - category: Document category (optional, auto-detected)
 * - source: Source system (optional, auto-detected)
 * - dateOfCare: Date of care (optional, ISO string)
 * - dateReceived: Date received (optional, ISO string)
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
    select: { id: true, npaId: true },
  });

  if (!user?.npaId) {
    return NextResponse.json(
      { error: "NPA ID not found. Please contact support." },
      { status: 400 }
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

  // Validate file type
  if (!isSupportedMimeType(file.type)) {
    return NextResponse.json(
      {
        error:
          "Unsupported file type. Supported: PDF, images (PNG, JPG, GIF, WebP, HEIC), XML (CCDA/CCD).",
      },
      { status: 400 }
    );
  }

  // Size limit: 50MB
  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File size exceeds 50MB limit." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const originalFilename = file.name || "document";
  
  // Auto-detect metadata if not provided
  const detected = detectDocumentMetadata(originalFilename, file.type);

  // Get form values with fallbacks to auto-detected
  const title =
    (formData.get("title") as string | null)?.trim() ||
    originalFilename ||
    "Untitled Document";

  const categoryRaw = formData.get("category") as string | null;
  const category =
    categoryRaw && Object.values(NpaDocumentCategory).includes(categoryRaw as NpaDocumentCategory)
      ? (categoryRaw as NpaDocumentCategory)
      : detected.category;

  const sourceRaw = formData.get("source") as string | null;
  const source =
    sourceRaw && Object.values(NpaDocumentSource).includes(sourceRaw as NpaDocumentSource)
      ? (sourceRaw as NpaDocumentSource)
      : detected.source;

  const sourceSystem =
    (formData.get("sourceSystem") as string | null) || detected.sourceSystem;

  const dateOfCareRaw = formData.get("dateOfCare") as string | null;
  const dateReceivedRaw = formData.get("dateReceived") as string | null;

  // Generate storage path - organized by NPA ID
  const extension =
    path.extname(originalFilename).toLowerCase() ||
    getExtensionFromMimeType(file.type);
  const storagePath = `vault/${user.npaId}/${randomUUID()}${extension}`;

  // Upload to encrypted storage
  await uploadToBucket({
    path: storagePath,
    data: buffer,
    mimeType: file.type || "application/octet-stream",
  });

  // Create document record
  const document = await prisma.npaVaultDocument.create({
    data: {
      npaId: user.npaId,
      userId: user.id,
      title,
      category,
      source,
      sourceSystem,
      dateOfCare: dateOfCareRaw ? new Date(dateOfCareRaw) : null,
      dateReceived: dateReceivedRaw ? new Date(dateReceivedRaw) : null,
      storagePath,
      originalFilename,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: buffer.length,
    },
  });

  // Log upload action
  const { ipAddress, userAgent } = getVaultRequestMetadata(request);
  await logVaultUpload(
    document.id,
    user.npaId,
    user.id,
    {
      filename: originalFilename,
      category,
      source,
      sizeBytes: buffer.length,
    },
    ipAddress,
    userAgent
  );

  return NextResponse.json(
    {
      document: {
        id: document.id,
        title: document.title,
        category: document.category,
        source: document.source,
        sourceSystem: document.sourceSystem,
        dateOfCare: document.dateOfCare,
        uploadedAt: document.uploadedAt,
        originalFilename: document.originalFilename,
        mimeType: document.mimeType,
        sizeBytes: document.sizeBytes,
      },
      detected: {
        category: detected.category,
        source: detected.source,
        confidence: detected.confidence,
      },
    },
    { status: 201 }
  );
}
