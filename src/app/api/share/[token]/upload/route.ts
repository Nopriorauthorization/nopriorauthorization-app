import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  isValidShareToken,
  validateShareAccess,
  canUpload,
  getShareRequestMetadata,
  SHARE_COMPLIANCE_STATEMENT,
} from "@/lib/sharing/share-service";
import { uploadToSupabase } from "@/lib/storage/supabase";

/**
 * POST /api/share/[token]/upload - Provider contributes a document (requires UPLOAD_ALLOWED permission)
 * 
 * COMPLIANCE STATEMENT:
 * "Access is granted by the patient and may be revoked at any time.
 * Shared information reflects records as provided and does not constitute medical advice."
 * 
 * This endpoint allows providers to add documents to a patient's vault
 * when the patient has explicitly granted upload permission.
 * 
 * Required fields:
 * - file: File (the document)
 * - providerName: string
 * - contributionType: string (visit_summary, referral, care_note, etc.)
 * 
 * Optional fields:
 * - providerOrg: string
 * - providerEmail: string
 * - dateOfCare: string (ISO date)
 * - title: string (document title)
 * - notes: string (provider notes about the contribution)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!isValidShareToken(token)) {
    return NextResponse.json(
      { error: "Invalid share link" },
      { status: 400 }
    );
  }

  // Find share session
  const shareSession = await prisma.npaShareSession.findUnique({
    where: { token },
  });

  // Validate access
  const validation = validateShareAccess(shareSession);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.reason, code: validation.code },
      { status: 403 }
    );
  }

  // Check upload permission
  if (!canUpload(shareSession!.permission)) {
    return NextResponse.json(
      {
        error: "Upload is not permitted for this share link",
        message: "The patient has not granted upload permission.",
      },
      { status: 403 }
    );
  }

  // Get request metadata
  const { ipAddress, userAgent } = getShareRequestMetadata(request);

  // Parse form data
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const providerName = formData.get("providerName") as string | null;
  const providerOrg = formData.get("providerOrg") as string | null;
  const providerEmail = formData.get("providerEmail") as string | null;
  const contributionType = formData.get("contributionType") as string | null;
  const dateOfCareStr = formData.get("dateOfCare") as string | null;
  const title = formData.get("title") as string | null;
  const notes = formData.get("notes") as string | null;

  // Validate required fields
  if (!file) {
    return NextResponse.json(
      { error: "File is required" },
      { status: 400 }
    );
  }

  if (!providerName) {
    return NextResponse.json(
      { error: "Provider name is required" },
      { status: 400 }
    );
  }

  if (!contributionType) {
    return NextResponse.json(
      { error: "Contribution type is required (e.g., visit_summary, referral, care_note)" },
      { status: 400 }
    );
  }

  // Validate file type
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/xml",
    "text/xml",
  ];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      {
        error: "Unsupported file type",
        allowedTypes,
      },
      { status: 400 }
    );
  }

  // Validate file size (max 25MB)
  const maxSize = 25 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "File size exceeds 25MB limit" },
      { status: 400 }
    );
  }

  // Parse date of care if provided
  let dateOfCare: Date | null = null;
  if (dateOfCareStr) {
    dateOfCare = new Date(dateOfCareStr);
    if (isNaN(dateOfCare.getTime())) {
      return NextResponse.json(
        { error: "Invalid date of care format" },
        { status: 400 }
      );
    }
  }

  // Generate document title if not provided
  const documentTitle =
    title ||
    `${contributionType.replace(/_/g, " ")} from ${providerName}${
      dateOfCare ? ` - ${dateOfCare.toLocaleDateString()}` : ""
    }`;

  try {
    // Upload file to storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `npa-vault/${shareSession!.npaId}/provider-contributions/${timestamp}-${safeFilename}`;

    await uploadToSupabase(storagePath, fileBuffer, file.type);

    // Map contribution type to document category
    const categoryMap: Record<string, string> = {
      visit_summary: "VISIT_SUMMARY",
      referral: "REFERRAL",
      care_note: "PROGRESS_NOTE",
      lab_result: "LAB_RESULT",
      imaging: "IMAGING_REPORT",
      discharge: "DISCHARGE_SUMMARY",
      other: "OTHER",
    };

    // Create document in vault
    const document = await prisma.npaVaultDocument.create({
      data: {
        npaId: shareSession!.npaId,
        title: documentTitle,
        category: (categoryMap[contributionType] || "OTHER") as any,
        source: "PROVIDER_PORTAL",
        sourceSystem: providerOrg || providerName,
        dateOfCare,
        dateReceived: new Date(),
        storagePath,
        originalFilename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        processingStatus: "PENDING",
        providerName,
        facilityName: providerOrg,
      },
    });

    // Create provider contribution record
    const contribution = await prisma.npaProviderContribution.create({
      data: {
        shareSessionId: shareSession!.id,
        npaId: shareSession!.npaId,
        documentId: document.id,
        providerName,
        providerOrg,
        providerEmail,
        dateOfCare,
        contributionType,
        notes,
        ipAddress,
        userAgent,
      },
    });

    // Log access
    await prisma.npaShareAccessLog.create({
      data: {
        shareSessionId: shareSession!.id,
        documentId: document.id,
        action: "DOCUMENT_UPLOADED",
        accessorName: providerName,
        accessorOrg: providerOrg,
        accessorEmail: providerEmail,
        ipAddress,
        userAgent,
        wasSuccessful: true,
      },
    });

    return NextResponse.json({
      message: "Document contributed successfully",
      contribution: {
        id: contribution.id,
        documentId: document.id,
        title: documentTitle,
        contributionType,
        providerName,
        providerOrg,
        dateOfCare,
        createdAt: contribution.createdAt,
      },
      complianceStatement: SHARE_COMPLIANCE_STATEMENT,
    });
  } catch (error) {
    console.error("Provider upload error:", error);

    // Log failed upload
    await prisma.npaShareAccessLog.create({
      data: {
        shareSessionId: shareSession!.id,
        action: "DOCUMENT_UPLOADED",
        accessorName: providerName,
        accessorOrg: providerOrg,
        accessorEmail: providerEmail,
        ipAddress,
        userAgent,
        wasSuccessful: false,
        denialReason: error instanceof Error ? error.message : "Upload failed",
      },
    });

    return NextResponse.json(
      {
        error: "Failed to upload document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/share/[token]/upload - Check if upload is allowed
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!isValidShareToken(token)) {
    return NextResponse.json(
      { error: "Invalid share link" },
      { status: 400 }
    );
  }

  // Find share session
  const shareSession = await prisma.npaShareSession.findUnique({
    where: { token },
  });

  // Validate access
  const validation = validateShareAccess(shareSession);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.reason, code: validation.code },
      { status: 403 }
    );
  }

  const uploadAllowed = canUpload(shareSession!.permission);

  return NextResponse.json({
    uploadAllowed,
    message: uploadAllowed
      ? "Upload is permitted. You may contribute documents."
      : "Upload is not permitted for this share link.",
    acceptedTypes: uploadAllowed
      ? [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/gif",
          "application/xml",
        ]
      : [],
    maxSizeBytes: uploadAllowed ? 25 * 1024 * 1024 : 0,
    requiredFields: uploadAllowed
      ? ["file", "providerName", "contributionType"]
      : [],
    optionalFields: uploadAllowed
      ? ["providerOrg", "providerEmail", "dateOfCare", "title", "notes"]
      : [],
    contributionTypes: uploadAllowed
      ? [
          "visit_summary",
          "referral",
          "care_note",
          "lab_result",
          "imaging",
          "discharge",
          "other",
        ]
      : [],
  });
}
