import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import { createSignedUrl } from "@/lib/storage/supabase";
import { extractText } from "@/lib/decoder/text-extraction";
import {
  processDocument,
  getDocumentTypeDisplay,
} from "@/lib/vault/document-intelligence";
import { getVaultRequestMetadata, logVaultAction } from "@/lib/vault-audit";

/**
 * POST /api/vault/[id]/process - Process a document for intelligence extraction
 * 
 * COMPLIANCE STATEMENT:
 * "This feature organizes and displays information exactly as provided by healthcare documents.
 * It does not interpret, diagnose, or provide medical advice."
 * 
 * This endpoint:
 * 1. Extracts text from the document (PDF, image, etc.)
 * 2. Classifies the document type (visit_summary, lab_report, etc.)
 * 3. Extracts sections (medications, allergies, diagnoses as-written)
 * 4. Extracts date of care and provider info
 * 
 * It does NOT:
 * - Diagnose
 * - Interpret lab values
 * - Flag abnormalities
 * - Recommend treatment
 */
export async function POST(
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

  // Check if already processed
  if (document.processingStatus === "COMPLETED") {
    return NextResponse.json({
      message: "Document already processed",
      document: formatProcessedDocument(document),
    });
  }

  // Check if currently processing
  if (document.processingStatus === "PROCESSING") {
    return NextResponse.json({
      message: "Document is currently being processed",
      status: "PROCESSING",
    });
  }

  try {
    // Mark as processing
    await prisma.npaVaultDocument.update({
      where: { id },
      data: { processingStatus: "PROCESSING" },
    });

    // Get signed URL to download the file
    const signedUrl = await createSignedUrl(document.storagePath, 300);

    // Download the file
    const fileResponse = await fetch(signedUrl);
    if (!fileResponse.ok) {
      throw new Error("Failed to download document for processing");
    }

    const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());

    // Extract text based on mime type
    let extractedText = "";
    try {
      if (
        document.mimeType === "application/pdf" ||
        document.mimeType.startsWith("image/")
      ) {
        extractedText = await extractText(fileBuffer, document.mimeType);
      } else if (
        document.mimeType === "application/xml" ||
        document.mimeType === "text/xml"
      ) {
        // For CCDA/CCD XML, extract text content
        extractedText = fileBuffer.toString("utf-8");
      }
    } catch (extractError) {
      console.error("Text extraction error:", extractError);
      // Continue with empty text - classification can still use filename
    }

    // Process the document
    const processed = processDocument(
      document.originalFilename,
      extractedText
    );

    // Update document with processed data
    const updatedDocument = await prisma.npaVaultDocument.update({
      where: { id },
      data: {
        processingStatus: "COMPLETED",
        processedAt: new Date(),
        extractedText: extractedText || null,
        documentType: processed.documentType,
        classificationConfidence: processed.classification.confidence,
        sections: processed.sections,
        providerName: processed.providerInfo.providerName || null,
        facilityName: processed.providerInfo.facilityName || null,
        department: processed.providerInfo.department || null,
        // Update dateOfCare if we extracted one and none was set
        ...(processed.dateOfCare && !document.dateOfCare
          ? { dateOfCare: processed.dateOfCare }
          : {}),
      },
    });

    // Log processing action
    const { ipAddress, userAgent } = getVaultRequestMetadata(request);
    await logVaultAction({
      documentId: id,
      npaId: user.npaId,
      action: "METADATA_UPDATED",
      actorId: user.id,
      actorNpaId: user.npaId,
      ipAddress,
      userAgent,
      metadata: {
        processingCompleted: true,
        documentType: processed.documentType,
        sectionsExtracted: Object.keys(processed.sections).filter(
          (k) => k !== "rawText" && processed.sections[k as keyof typeof processed.sections]
        ),
      },
    });

    return NextResponse.json({
      message: "Document processed successfully",
      document: formatProcessedDocument(updatedDocument),
      complianceNotice: processed.complianceNotice,
    });
  } catch (error) {
    console.error("Document processing error:", error);

    // Mark as failed
    await prisma.npaVaultDocument.update({
      where: { id },
      data: {
        processingStatus: "FAILED",
        processingError:
          error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json(
      {
        error: "Failed to process document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/vault/[id]/process - Get processing status and results
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

  return NextResponse.json({
    processingStatus: document.processingStatus,
    processedAt: document.processedAt,
    processingError: document.processingError,
    document:
      document.processingStatus === "COMPLETED"
        ? formatProcessedDocument(document)
        : null,
    complianceNotice:
      "This feature organizes and displays information exactly as provided by healthcare documents. It does not interpret, diagnose, or provide medical advice.",
  });
}

// Format document for API response
function formatProcessedDocument(document: any) {
  const typeDisplay = document.documentType
    ? getDocumentTypeDisplay(document.documentType)
    : null;

  return {
    id: document.id,
    title: document.title,
    category: document.category,
    documentType: document.documentType,
    documentTypeDisplay: typeDisplay,
    classificationConfidence: document.classificationConfidence,
    dateOfCare: document.dateOfCare,
    uploadedAt: document.uploadedAt,
    providerInfo: {
      providerName: document.providerName,
      facilityName: document.facilityName,
      department: document.department,
    },
    sections: document.sections,
    hasExtractedText: !!document.extractedText,
    processingStatus: document.processingStatus,
    processedAt: document.processedAt,
  };
}
