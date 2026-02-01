import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import {
  logVaultView,
  logVaultMetadataUpdate,
  logVaultDelete,
  getVaultRequestMetadata,
} from "@/lib/vault-audit";
import { NpaDocumentCategory, NpaDocumentSource } from "@prisma/client";

/**
 * NPA Vault Document Operations
 * 
 * GET - View document metadata
 * PATCH - Update document metadata (NOT file contents)
 * DELETE - Soft delete document
 */

/**
 * GET /api/vault/[id] - Get document metadata
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

  // Log view action
  const { ipAddress, userAgent } = getVaultRequestMetadata(request);
  await logVaultView(
    document.id,
    user.npaId,
    user.id,
    user.npaId,
    ipAddress,
    userAgent
  );

  return NextResponse.json({
    document: {
      id: document.id,
      title: document.title,
      category: document.category,
      source: document.source,
      sourceSystem: document.sourceSystem,
      dateOfCare: document.dateOfCare,
      dateReceived: document.dateReceived,
      uploadedAt: document.uploadedAt,
      originalFilename: document.originalFilename,
      mimeType: document.mimeType,
      sizeBytes: document.sizeBytes,
      extractedText: document.extractedText ? true : false, // Don't expose full text
    },
  });
}

/**
 * PATCH /api/vault/[id] - Update document metadata
 * 
 * Body (JSON):
 * - title: New title
 * - category: New category
 * - source: New source
 * - sourceSystem: New source system name
 * - dateOfCare: New date of care
 * - dateReceived: New date received
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

  // Check document exists and belongs to user
  const existingDocument = await prisma.npaVaultDocument.findFirst({
    where: {
      id,
      npaId: user.npaId,
      isDeleted: false,
    },
  });

  if (!existingDocument) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const changedFields: string[] = [];
  const updateData: Record<string, unknown> = {};

  // Validate and collect updates
  if (body.title !== undefined && body.title !== existingDocument.title) {
    updateData.title = body.title;
    changedFields.push("title");
  }

  if (
    body.category !== undefined &&
    Object.values(NpaDocumentCategory).includes(body.category) &&
    body.category !== existingDocument.category
  ) {
    updateData.category = body.category;
    changedFields.push("category");
  }

  if (
    body.source !== undefined &&
    Object.values(NpaDocumentSource).includes(body.source) &&
    body.source !== existingDocument.source
  ) {
    updateData.source = body.source;
    changedFields.push("source");
  }

  if (body.sourceSystem !== undefined && body.sourceSystem !== existingDocument.sourceSystem) {
    updateData.sourceSystem = body.sourceSystem;
    changedFields.push("sourceSystem");
  }

  if (body.dateOfCare !== undefined) {
    const newDate = body.dateOfCare ? new Date(body.dateOfCare) : null;
    if (newDate?.getTime() !== existingDocument.dateOfCare?.getTime()) {
      updateData.dateOfCare = newDate;
      changedFields.push("dateOfCare");
    }
  }

  if (body.dateReceived !== undefined) {
    const newDate = body.dateReceived ? new Date(body.dateReceived) : null;
    if (newDate?.getTime() !== existingDocument.dateReceived?.getTime()) {
      updateData.dateReceived = newDate;
      changedFields.push("dateReceived");
    }
  }

  if (changedFields.length === 0) {
    return NextResponse.json({ message: "No changes to apply" });
  }

  // Update document
  const document = await prisma.npaVaultDocument.update({
    where: { id },
    data: updateData,
  });

  // Log metadata update
  const { ipAddress, userAgent } = getVaultRequestMetadata(request);
  await logVaultMetadataUpdate(
    document.id,
    user.npaId,
    user.id,
    changedFields,
    ipAddress,
    userAgent
  );

  return NextResponse.json({
    document: {
      id: document.id,
      title: document.title,
      category: document.category,
      source: document.source,
      sourceSystem: document.sourceSystem,
      dateOfCare: document.dateOfCare,
      dateReceived: document.dateReceived,
      uploadedAt: document.uploadedAt,
      originalFilename: document.originalFilename,
      mimeType: document.mimeType,
      sizeBytes: document.sizeBytes,
    },
    changedFields,
  });
}

/**
 * DELETE /api/vault/[id] - Soft delete document
 */
export async function DELETE(
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

  // Check document exists and belongs to user
  const existingDoc = await prisma.npaVaultDocument.findFirst({
    where: {
      id,
      npaId: user.npaId,
      isDeleted: false,
    },
  });

  if (!existingDoc) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 }
    );
  }

  // Soft delete - preserve for audit purposes
  await prisma.npaVaultDocument.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  // Log delete action
  const { ipAddress, userAgent } = getVaultRequestMetadata(request);
  await logVaultDelete(
    id,
    user.npaId,
    user.id,
    ipAddress,
    userAgent
  );

  return NextResponse.json({
    message: "Document deleted successfully",
    id,
  });
}
