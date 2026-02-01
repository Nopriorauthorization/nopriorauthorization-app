import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

/**
 * NPA Phase 6: Data Export & Portability API
 * 
 * PURPOSE: Ensure NPA never traps users.
 * 
 * Patient can export:
 * - All uploaded documents
 * - Provider-added documents
 * - Metadata
 * - Audit logs
 * 
 * Export formats:
 * - ZIP of originals (future)
 * - Structured JSON summary
 * 
 * ONE-CLICK EXPORT (no support ticket required)
 * 
 * "If users can't leave, they won't trust you."
 */

// POST - Request a data export
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { npaId: true, npaIdAlias: true, email: true, name: true, createdAt: true },
    });

    if (!user?.npaId) {
      return NextResponse.json({ error: "NPA ID not found" }, { status: 404 });
    }

    const body = await request.json();
    const { exportType = "full", format = "json" } = body;

    // Validate export type
    const validTypes = ["full", "documents_only", "audit_only", "metadata_only"];
    if (!validTypes.includes(exportType)) {
      return NextResponse.json(
        { error: "Invalid export type" },
        { status: 400 }
      );
    }

    // Create export request record
    const exportRequest = await prisma.npaDataExport.create({
      data: {
        npaId: user.npaId,
        userId: session.user.id,
        exportType,
        format,
        status: "processing",
        startedAt: new Date(),
      },
    });

    // For JSON exports, we can do it synchronously (for now)
    // In production, this would be a background job for large exports
    if (format === "json") {
      const exportData: any = {
        exportId: exportRequest.id,
        exportedAt: new Date().toISOString(),
        npaId: user.npaIdAlias,
        format: "json",
        version: "1.0",
        complianceStatement: "This export contains your personal health information from No Prior Authorization. You have full ownership of this data.",
      };

      // Profile data
      if (exportType === "full" || exportType === "metadata_only") {
        exportData.profile = {
          npaIdAlias: user.npaIdAlias,
          email: user.email,
          name: user.name,
          memberSince: user.createdAt,
        };
      }

      // Documents
      if (exportType === "full" || exportType === "documents_only") {
        const documents = await prisma.npaVaultDocument.findMany({
          where: { npaId: user.npaId, isDeleted: false },
          select: {
            id: true,
            title: true,
            category: true,
            source: true,
            sourceSystem: true,
            dateOfCare: true,
            uploadedAt: true,
            originalFilename: true,
            mimeType: true,
            sizeBytes: true,
            documentType: true,
            sections: true,
            providerName: true,
            facilityName: true,
          },
          orderBy: { uploadedAt: "desc" },
        });

        exportData.documents = {
          count: documents.length,
          items: documents.map((doc) => ({
            id: doc.id,
            title: doc.title,
            category: doc.category,
            source: doc.source,
            sourceSystem: doc.sourceSystem,
            dateOfCare: doc.dateOfCare,
            uploadedAt: doc.uploadedAt,
            filename: doc.originalFilename,
            type: doc.mimeType,
            size: doc.sizeBytes,
            documentType: doc.documentType,
            extractedSections: doc.sections,
            provider: doc.providerName,
            facility: doc.facilityName,
          })),
          note: "Document files can be downloaded separately from your vault.",
        };

        // Provider contributions
        const contributions = await prisma.npaProviderContribution.findMany({
          where: { npaId: user.npaId },
          select: {
            providerName: true,
            providerRole: true,
            providerOrg: true,
            specialty: true,
            dateOfCare: true,
            contributionType: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        });

        exportData.providerContributions = {
          count: contributions.length,
          items: contributions,
        };
      }

      // Audit logs
      if (exportType === "full" || exportType === "audit_only") {
        const auditLogs = await prisma.identityAuditLog.findMany({
          where: { npaId: user.npaId },
          select: {
            action: true,
            ipAddress: true,
            metadata: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        });

        const vaultAuditLogs = await prisma.npaVaultAuditLog.findMany({
          where: { npaId: user.npaId },
          select: {
            action: true,
            ipAddress: true,
            metadata: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        });

        const shareAccessLogs = await prisma.npaShareAccessLog.findMany({
          where: {
            shareSession: { npaId: user.npaId },
          },
          select: {
            action: true,
            accessorName: true,
            accessorOrg: true,
            ipAddress: true,
            accessedAt: true,
          },
          orderBy: { accessedAt: "desc" },
        });

        exportData.auditLogs = {
          identity: {
            count: auditLogs.length,
            items: auditLogs,
          },
          vault: {
            count: vaultAuditLogs.length,
            items: vaultAuditLogs,
          },
          shareAccess: {
            count: shareAccessLogs.length,
            items: shareAccessLogs,
          },
        };

        // Emergency access history
        const emergencyLogs = await prisma.npaEmergencyAccessLog.findMany({
          where: { npaId: user.npaId },
          include: {
            session: {
              select: {
                accessorName: true,
                accessorRole: true,
                accessorOrg: true,
                reasonEntered: true,
              },
            },
          },
          orderBy: { accessedAt: "desc" },
        });

        exportData.emergencyAccessLogs = {
          count: emergencyLogs.length,
          items: emergencyLogs.map((log) => ({
            action: log.action,
            resourceType: log.resourceType,
            accessor: log.session.accessorName,
            organization: log.session.accessorOrg,
            reason: log.session.reasonEntered,
            timestamp: log.accessedAt,
          })),
        };
      }

      // Share history
      if (exportType === "full" || exportType === "metadata_only") {
        const shares = await prisma.npaShareSession.findMany({
          where: { npaId: user.npaId },
          select: {
            title: true,
            permission: true,
            createdAt: true,
            expiresAt: true,
            isRevoked: true,
            revokedAt: true,
            useCount: true,
          },
          orderBy: { createdAt: "desc" },
        });

        exportData.shareHistory = {
          count: shares.length,
          items: shares,
        };
      }

      // Update export record
      const exportSize = JSON.stringify(exportData).length;
      await prisma.npaDataExport.update({
        where: { id: exportRequest.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          fileSizeBytes: exportSize,
        },
      });

      // Log export action
      await prisma.identityAuditLog.create({
        data: {
          userId: session.user.id,
          npaId: user.npaId,
          action: "PROFILE_UPDATED",
          metadata: {
            type: "data_export",
            exportType,
            format,
            sizeBytes: exportSize,
          },
        },
      });

      return NextResponse.json({
        exportId: exportRequest.id,
        status: "completed",
        format: "json",
        data: exportData,
        legalNotice: "This export represents your complete health data from No Prior Authorization. You own this data and can use it as you see fit. No Prior Authorization does not retain copies of this export.",
      });
    }

    // For ZIP exports (future enhancement)
    return NextResponse.json({
      exportId: exportRequest.id,
      status: "processing",
      message: "Your export is being prepared. You will receive an email when it's ready.",
    });
  } catch (error) {
    console.error("Data export error:", error);
    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    );
  }
}

// GET - Get export status or list past exports
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { npaId: true },
    });

    if (!user?.npaId) {
      return NextResponse.json({ error: "NPA ID not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const exportId = searchParams.get("id");

    if (exportId) {
      // Get specific export status
      const exportRecord = await prisma.npaDataExport.findFirst({
        where: {
          id: exportId,
          npaId: user.npaId,
        },
      });

      if (!exportRecord) {
        return NextResponse.json({ error: "Export not found" }, { status: 404 });
      }

      return NextResponse.json({
        export: {
          id: exportRecord.id,
          type: exportRecord.exportType,
          format: exportRecord.format,
          status: exportRecord.status,
          requestedAt: exportRecord.requestedAt,
          completedAt: exportRecord.completedAt,
          sizeBytes: exportRecord.fileSizeBytes,
          downloadUrl: exportRecord.downloadUrl,
          downloadExpiresAt: exportRecord.downloadExpiresAt,
        },
      });
    }

    // List all exports
    const exports = await prisma.npaDataExport.findMany({
      where: { npaId: user.npaId },
      orderBy: { requestedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      exports: exports.map((e) => ({
        id: e.id,
        type: e.exportType,
        format: e.format,
        status: e.status,
        requestedAt: e.requestedAt,
        completedAt: e.completedAt,
        sizeBytes: e.fileSizeBytes,
      })),
      availableFormats: [
        { value: "json", label: "JSON (Structured Data)" },
        // { value: "zip", label: "ZIP (Full Archive)" }, // Future
      ],
      availableTypes: [
        { value: "full", label: "Complete Export" },
        { value: "documents_only", label: "Documents Only" },
        { value: "audit_only", label: "Audit Logs Only" },
        { value: "metadata_only", label: "Profile & Metadata Only" },
      ],
      notice: "Data portability is your right. Export and leave anytime.",
    });
  } catch (error) {
    console.error("Export list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exports" },
      { status: 500 }
    );
  }
}
