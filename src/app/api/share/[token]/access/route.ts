import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  isValidShareToken,
  validateShareAccess,
  getShareRequestMetadata,
  canDownload,
  canUpload,
  isExpired,
  SHARE_COMPLIANCE_STATEMENT,
  SHARE_PRIVACY_NOTICE,
} from "@/lib/sharing/share-service";
import { createSignedUrl } from "@/lib/storage/supabase";
import { getDocumentTypeDisplay } from "@/lib/vault/document-intelligence";

/**
 * GET /api/share/[token]/access - Provider access to shared documents (NO ACCOUNT REQUIRED)
 * 
 * COMPLIANCE STATEMENT:
 * "Access is granted by the patient and may be revoked at any time.
 * Shared information reflects records as provided and does not constitute medical advice."
 * 
 * Query params:
 * - documentId?: string (get specific document)
 * - download?: "true" (get download URL, requires READ_DOWNLOAD or UPLOAD_ALLOWED permission)
 * 
 * Optional headers for logging:
 * - X-Accessor-Name: Provider name
 * - X-Accessor-Org: Organization
 * - X-Accessor-Email: Email
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

  // Get request metadata
  const { ipAddress, userAgent } = getShareRequestMetadata(request);
  const headers = request.headers;
  const accessorName = headers.get("x-accessor-name") || null;
  const accessorOrg = headers.get("x-accessor-org") || null;
  const accessorEmail = headers.get("x-accessor-email") || null;

  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get("documentId");
  const wantsDownload = searchParams.get("download") === "true";

  // Find share session
  const shareSession = await prisma.npaShareSession.findUnique({
    where: { token },
    include: {
      documents: {
        include: {
          document: {
            select: {
              id: true,
              title: true,
              category: true,
              source: true,
              sourceSystem: true,
              documentType: true,
              dateOfCare: true,
              uploadedAt: true,
              mimeType: true,
              sizeBytes: true,
              storagePath: true,
              sections: true,
              providerName: true,
              facilityName: true,
              department: true,
              processingStatus: true,
              isDeleted: true,
            },
          },
        },
      },
    },
  });

  // Validate access
  const validation = validateShareAccess(shareSession);
  if (!validation.valid) {
    // Log failed access attempt
    if (shareSession) {
      await prisma.npaShareAccessLog.create({
        data: {
          shareSessionId: shareSession.id,
          action: "ACCESS_DENIED",
          accessorName,
          accessorOrg,
          accessorEmail,
          ipAddress,
          userAgent,
          wasSuccessful: false,
          denialReason: validation.reason,
        },
      });
    }

    return NextResponse.json(
      {
        error: validation.reason,
        code: validation.code,
      },
      { status: validation.code === "NOT_FOUND" ? 404 : 403 }
    );
  }

  // Filter out deleted documents
  const activeDocuments = shareSession!.documents.filter(
    (d) => !d.document.isDeleted
  );

  // If requesting specific document
  if (documentId) {
    const sharedDoc = activeDocuments.find((d) => d.documentId === documentId);
    if (!sharedDoc) {
      await prisma.npaShareAccessLog.create({
        data: {
          shareSessionId: shareSession!.id,
          documentId,
          action: "ACCESS_DENIED",
          accessorName,
          accessorOrg,
          accessorEmail,
          ipAddress,
          userAgent,
          wasSuccessful: false,
          denialReason: "Document not included in share or has been deleted",
        },
      });

      return NextResponse.json(
        { error: "Document not found in this share" },
        { status: 404 }
      );
    }

    // Handle download request
    if (wantsDownload) {
      if (!canDownload(shareSession!.permission)) {
        await prisma.npaShareAccessLog.create({
          data: {
            shareSessionId: shareSession!.id,
            documentId,
            action: "ACCESS_DENIED",
            accessorName,
            accessorOrg,
            accessorEmail,
            ipAddress,
            userAgent,
            wasSuccessful: false,
            denialReason: "Download not permitted for this share",
          },
        });

        return NextResponse.json(
          { error: "Download is not permitted for this share link" },
          { status: 403 }
        );
      }

      // Generate signed download URL
      const downloadUrl = await createSignedUrl(
        sharedDoc.document.storagePath,
        300 // 5 minute expiry
      );

      // Log download
      await prisma.npaShareAccessLog.create({
        data: {
          shareSessionId: shareSession!.id,
          documentId,
          action: "DOCUMENT_DOWNLOADED",
          accessorName,
          accessorOrg,
          accessorEmail,
          ipAddress,
          userAgent,
          wasSuccessful: true,
        },
      });

      return NextResponse.json({
        downloadUrl,
        expiresIn: 300,
        document: formatDocumentForProvider(sharedDoc),
      });
    }

    // Log document view
    await prisma.npaShareAccessLog.create({
      data: {
        shareSessionId: shareSession!.id,
        documentId,
        action: "DOCUMENT_VIEWED",
        accessorName,
        accessorOrg,
        accessorEmail,
        ipAddress,
        userAgent,
        wasSuccessful: true,
      },
    });

    return NextResponse.json({
      document: formatDocumentForProvider(sharedDoc),
      permissions: {
        canDownload: canDownload(shareSession!.permission),
        canUpload: canUpload(shareSession!.permission),
      },
      complianceStatement: SHARE_COMPLIANCE_STATEMENT,
      privacyNotice: SHARE_PRIVACY_NOTICE,
    });
  }

  // Return full share session overview
  // Log session view
  await Promise.all([
    prisma.npaShareAccessLog.create({
      data: {
        shareSessionId: shareSession!.id,
        action: "LINK_VIEWED",
        accessorName,
        accessorOrg,
        accessorEmail,
        ipAddress,
        userAgent,
        wasSuccessful: true,
      },
    }),
    // Increment use count and update last accessed
    prisma.npaShareSession.update({
      where: { id: shareSession!.id },
      data: {
        useCount: { increment: 1 },
        lastAccessedAt: new Date(),
      },
    }),
  ]);

  return NextResponse.json({
    share: {
      title: shareSession!.title,
      patientName: shareSession!.showPatientName
        ? shareSession!.patientDisplayName
        : null,
      permission: shareSession!.permission,
      expiresAt: shareSession!.expiresAt,
      documentCount: activeDocuments.length,
    },
    documents: activeDocuments.map(formatDocumentForProvider),
    permissions: {
      canDownload: canDownload(shareSession!.permission),
      canUpload: canUpload(shareSession!.permission),
    },
    complianceStatement: SHARE_COMPLIANCE_STATEMENT,
    privacyNotice: SHARE_PRIVACY_NOTICE,
  });
}

/**
 * POST /api/share/[token]/access - Register provider accessing (optional, for tracking)
 * 
 * Body:
 * - name: string (provider name)
 * - organization?: string
 * - email?: string
 * 
 * This allows providers to identify themselves before viewing records.
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

  const body = await request.json();
  const { name, organization, email } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Provider name is required" },
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

  // Get request metadata
  const { ipAddress, userAgent } = getShareRequestMetadata(request);

  // Log provider registration
  await prisma.npaShareAccessLog.create({
    data: {
      shareSessionId: shareSession!.id,
      action: "LINK_VIEWED",
      accessorName: name,
      accessorOrg: organization || null,
      accessorEmail: email || null,
      ipAddress,
      userAgent,
      wasSuccessful: true,
    },
  });

  return NextResponse.json({
    message: "Provider registered successfully",
    share: {
      title: shareSession!.title,
      expiresAt: shareSession!.expiresAt,
      canDownload: canDownload(shareSession!.permission),
      canUpload: canUpload(shareSession!.permission),
    },
    complianceStatement: SHARE_COMPLIANCE_STATEMENT,
  });
}

// Format document for provider view (hide internal details)
function formatDocumentForProvider(sharedDoc: any) {
  const doc = sharedDoc.document;
  const typeDisplay = doc.documentType
    ? getDocumentTypeDisplay(doc.documentType)
    : null;

  return {
    id: doc.id,
    title: sharedDoc.customTitle || doc.title,
    category: doc.category,
    documentType: doc.documentType,
    documentTypeDisplay: typeDisplay,
    dateOfCare: doc.dateOfCare,
    uploadedAt: doc.uploadedAt,
    source: doc.source,
    sourceSystem: doc.sourceSystem,
    providerInfo: {
      providerName: doc.providerName,
      facilityName: doc.facilityName,
      department: doc.department,
    },
    mimeType: doc.mimeType,
    sizeBytes: doc.sizeBytes,
    processingStatus: doc.processingStatus,
    sections: doc.sections
      ? Object.keys(doc.sections).filter(
          (k) => k !== "rawText" && doc.sections[k]
        )
      : [],
  };
}
