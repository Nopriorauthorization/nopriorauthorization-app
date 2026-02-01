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
import type { ProviderRole } from "@prisma/client";

/**
 * NPA Phase 5: Provider Contribution Upload
 * 
 * PROVIDER LEGAL STATEMENT (displayed on upload screen):
 * "You are uploading information at the request of the patient.
 * This system does not replace your medical record.
 * Uploaded documents reflect your original documentation and remain unaltered."
 * 
 * PATIENT LEGAL STATEMENT:
 * "Provider-added records are included for continuity and reference."
 * 
 * This endpoint allows providers to add documents to a patient's vault
 * when the patient has explicitly granted upload permission.
 * 
 * Required fields (Phase 5 - MANDATORY):
 * - file: File (the document)
 * - providerName: string (full name)
 * - providerRole: string (MD, DO, NP, PA, RN, etc.)
 * - providerOrg: string (organization/clinic name)
 * - dateOfCare: string (ISO date)
 * - contributionType: string (visit_summary, referral, care_note, etc.)
 * 
 * Optional fields:
 * - providerEmail: string
 * - providerNPI: string (National Provider Identifier)
 * - specialty: string (e.g., Cardiology)
 * - title: string (document title)
 * - notes: string (provider notes about the contribution)
 */

// Provider role validation
const VALID_PROVIDER_ROLES: ProviderRole[] = [
  "MD", "DO", "NP", "PA", "RN", "LPN", "PHARMD",
  "PT", "OT", "LCSW", "PHD", "PSYD", "DMD", "DDS",
  "DC", "OD", "DPM", "OTHER"
];

// Legal statements (REQUIRED to display)
const PROVIDER_LEGAL_STATEMENT = 
  "You are uploading information at the request of the patient. " +
  "This system does not replace your medical record. " +
  "Uploaded documents reflect your original documentation and remain unaltered.";

const PATIENT_LEGAL_STATEMENT = 
  "Provider-added records are included for continuity and reference.";
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
  const providerRoleStr = formData.get("providerRole") as string | null;
  const providerOrg = formData.get("providerOrg") as string | null;
  const providerEmail = formData.get("providerEmail") as string | null;
  const providerNPI = formData.get("providerNPI") as string | null;
  const specialty = formData.get("specialty") as string | null;
  const contributionType = formData.get("contributionType") as string | null;
  const dateOfCareStr = formData.get("dateOfCare") as string | null;
  const title = formData.get("title") as string | null;
  const notes = formData.get("notes") as string | null;

  // Validate required fields (Phase 5 - stricter requirements)
  if (!file) {
    return NextResponse.json(
      { error: "File is required" },
      { status: 400 }
    );
  }

  if (!providerName) {
    return NextResponse.json(
      { error: "Provider full name is required" },
      { status: 400 }
    );
  }

  if (!providerRoleStr) {
    return NextResponse.json(
      { 
        error: "Provider role is required",
        validRoles: VALID_PROVIDER_ROLES,
        example: "MD, DO, NP, PA, RN, etc."
      },
      { status: 400 }
    );
  }

  // Validate provider role
  const providerRole = providerRoleStr.toUpperCase() as ProviderRole;
  if (!VALID_PROVIDER_ROLES.includes(providerRole)) {
    return NextResponse.json(
      { 
        error: `Invalid provider role: ${providerRoleStr}`,
        validRoles: VALID_PROVIDER_ROLES
      },
      { status: 400 }
    );
  }

  if (!providerOrg) {
    return NextResponse.json(
      { error: "Organization/clinic name is required" },
      { status: 400 }
    );
  }

  if (!dateOfCareStr) {
    return NextResponse.json(
      { error: "Date of care is required" },
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

  // Generate document title with clear attribution (Phase 5 requirement)
  const roleDisplay = providerRole === "OTHER" ? "" : `, ${providerRole}`;
  const specialtyDisplay = specialty ? ` — ${specialty}` : "";
  const dateDisplay = dateOfCare ? ` — ${dateOfCare.toLocaleDateString()}` : "";
  
  const documentTitle =
    title ||
    `${contributionType.replace(/_/g, " ")} from ${providerName}${roleDisplay}${specialtyDisplay}${dateDisplay}`;
  
  // Attribution label for timeline display
  const attributionLabel = `Added by ${providerName}${roleDisplay}${specialtyDisplay}${dateDisplay}`;

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

    // Create document in vault with clear provider attribution
    const document = await prisma.npaVaultDocument.create({
      data: {
        npaId: shareSession!.npaId,
        title: documentTitle,
        category: (categoryMap[contributionType] || "OTHER") as any,
        source: "PROVIDER_PORTAL",
        sourceSystem: providerOrg,
        dateOfCare,
        dateReceived: new Date(),
        storagePath,
        originalFilename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        processingStatus: "PENDING",
        providerName,
        facilityName: providerOrg,
        department: specialty || null,
      },
    });

    // Create provider contribution record with full metadata (Phase 5)
    const contribution = await prisma.npaProviderContribution.create({
      data: {
        shareSessionId: shareSession!.id,
        npaId: shareSession!.npaId,
        documentId: document.id,
        providerName,
        providerRole,
        providerOrg,
        providerEmail,
        providerNPI,
        specialty,
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
        attributionLabel,
        contributionType,
        provider: {
          name: providerName,
          role: providerRole,
          organization: providerOrg,
          specialty,
          npi: providerNPI,
        },
        dateOfCare,
        createdAt: contribution.createdAt,
      },
      legalStatements: {
        provider: PROVIDER_LEGAL_STATEMENT,
        patient: PATIENT_LEGAL_STATEMENT,
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
 * GET /api/share/[token]/upload - Check if upload is allowed and get requirements
 * 
 * Returns the provider upload interface specification including
 * required fields, legal statements, and contribution types.
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

  // Find share session with patient display info
  const shareSession = await prisma.npaShareSession.findUnique({
    where: { token },
    select: {
      id: true,
      permission: true,
      expiresAt: true,
      isRevoked: true,
      useCount: true,
      maxUses: true,
      showPatientName: true,
      patientDisplayName: true,
    },
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
      ? "Upload is permitted. You may contribute documents to this patient's health record."
      : "Upload is not permitted for this share link.",
    
    // Patient context (for provider to verify correct patient)
    patient: uploadAllowed && shareSession!.showPatientName
      ? { displayName: shareSession!.patientDisplayName }
      : null,
    
    // Phase 5: Required fields (MANDATORY)
    requiredFields: uploadAllowed
      ? [
          { name: "file", description: "The document file (PDF, image, or XML)" },
          { name: "providerName", description: "Your full name" },
          { name: "providerRole", description: "Your credential (MD, DO, NP, PA, RN, etc.)" },
          { name: "providerOrg", description: "Organization or clinic name" },
          { name: "dateOfCare", description: "Date of the clinical encounter (ISO format)" },
          { name: "contributionType", description: "Type of document being uploaded" },
        ]
      : [],
    
    // Optional fields
    optionalFields: uploadAllowed
      ? [
          { name: "providerEmail", description: "Contact email (optional)" },
          { name: "providerNPI", description: "National Provider Identifier (optional)" },
          { name: "specialty", description: "Your specialty (e.g., Cardiology)" },
          { name: "title", description: "Custom document title (optional)" },
          { name: "notes", description: "Additional notes about this contribution" },
        ]
      : [],
    
    // Valid provider roles
    providerRoles: uploadAllowed ? VALID_PROVIDER_ROLES : [],
    
    // Contribution types
    contributionTypes: uploadAllowed
      ? [
          { value: "visit_summary", label: "Visit Summary" },
          { value: "referral", label: "Referral Letter" },
          { value: "care_note", label: "Care Note" },
          { value: "lab_result", label: "Lab Result" },
          { value: "imaging", label: "Imaging Report" },
          { value: "discharge", label: "Discharge Summary" },
          { value: "other", label: "Other Document" },
        ]
      : [],
    
    // File constraints
    acceptedTypes: uploadAllowed
      ? ["application/pdf", "image/jpeg", "image/png", "image/gif", "application/xml"]
      : [],
    maxSizeBytes: uploadAllowed ? 25 * 1024 * 1024 : 0,
    
    // Legal statements (MUST be displayed to provider)
    legalStatements: uploadAllowed
      ? {
          provider: PROVIDER_LEGAL_STATEMENT,
          patient: PATIENT_LEGAL_STATEMENT,
        }
      : null,
    
    complianceStatement: SHARE_COMPLIANCE_STATEMENT,
  });
}
