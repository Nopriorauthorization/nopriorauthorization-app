import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import { getSafeLabel } from "@/lib/vault/document-intelligence";
import { getVaultRequestMetadata, logVaultView } from "@/lib/vault-audit";

/**
 * GET /api/vault/[id]/sections - Get extracted sections from a processed document
 * 
 * COMPLIANCE STATEMENT:
 * "This feature organizes and displays information exactly as provided by healthcare documents.
 * It does not interpret, diagnose, or provide medical advice."
 * 
 * Returns sections like:
 * - Medications Listed
 * - Allergies Reported
 * - Reported Diagnoses
 * - Lab Results (as reported)
 * - Provider Notes
 * 
 * DOES NOT return:
 * - Interpretations
 * - Abnormal flags
 * - Treatment recommendations
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
    select: {
      id: true,
      title: true,
      documentType: true,
      processingStatus: true,
      sections: true,
      providerName: true,
      facilityName: true,
      dateOfCare: true,
    },
  });

  if (!document) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 }
    );
  }

  // Check if document has been processed
  if (document.processingStatus !== "COMPLETED") {
    return NextResponse.json(
      {
        error: "Document has not been processed yet",
        processingStatus: document.processingStatus,
        message:
          document.processingStatus === "PENDING"
            ? "Call POST /api/vault/[id]/process to process this document"
            : document.processingStatus === "PROCESSING"
            ? "Document is currently being processed"
            : "Document processing failed",
      },
      { status: 400 }
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

  // Format sections with safe labels
  const sections = document.sections as Record<string, string> | null;
  const formattedSections: Array<{
    key: string;
    label: string;
    content: string;
    hasContent: boolean;
  }> = [];

  if (sections) {
    const sectionKeys = [
      "medications",
      "allergies",
      "diagnoses",
      "procedures",
      "labResults",
      "vitalSigns",
      "assessmentPlan",
      "instructions",
      "providerNotes",
    ];

    for (const key of sectionKeys) {
      const content = sections[key];
      formattedSections.push({
        key,
        label: getSafeLabel(key),
        content: content || "",
        hasContent: !!content && content.trim().length > 0,
      });
    }
  }

  return NextResponse.json({
    document: {
      id: document.id,
      title: document.title,
      documentType: document.documentType,
      dateOfCare: document.dateOfCare,
      providerName: document.providerName,
      facilityName: document.facilityName,
    },
    sections: formattedSections.filter((s) => s.hasContent),
    allSections: formattedSections,
    complianceNotice:
      "This feature organizes and displays information exactly as provided by healthcare documents. It does not interpret, diagnose, or provide medical advice.",
  });
}
