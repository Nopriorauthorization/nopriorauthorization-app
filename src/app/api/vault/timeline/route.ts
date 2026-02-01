import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import { getDocumentTypeDisplay } from "@/lib/vault/document-intelligence";

/**
 * GET /api/vault/timeline - Get longitudinal health record timeline
 * 
 * Phase 3 + Phase 5: Returns documents organized chronologically by date of care,
 * clearly differentiating patient-uploaded vs provider-contributed documents.
 * 
 * COMPLIANCE STATEMENT:
 * "This feature organizes and displays information exactly as provided by healthcare documents.
 * It does not interpret, diagnose, or provide medical advice."
 * 
 * PATIENT LEGAL STATEMENT (Phase 5):
 * "Provider-added records are included for continuity and reference."
 * 
 * Query params:
 * - showHidden: "true" to include hidden documents
 * - documentType: Filter by type (visit_summary, lab_report, etc.)
 * - source: Filter by source (PATIENT_UPLOAD, PROVIDER_PORTAL)
 * - year: Filter by year
 * - limit: Number of documents (default: 50)
 * - offset: Pagination offset
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
    select: { id: true, npaId: true, npaIdAlias: true },
  });

  if (!user?.npaId) {
    return NextResponse.json(
      { error: "NPA ID not found. Please contact support." },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const showHidden = searchParams.get("showHidden") === "true";
  const documentType = searchParams.get("documentType");
  const source = searchParams.get("source"); // Phase 5: filter by source
  const year = searchParams.get("year");
  const limit = Math.min(
    parseInt(searchParams.get("limit") || "50", 10),
    100
  );
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  // Build query filters
  const where: Record<string, any> = {
    npaId: user.npaId,
    isDeleted: false,
  };

  // Hide documents unless explicitly showing hidden
  if (!showHidden) {
    where.isHidden = false;
  }

  // Filter by document type
  if (documentType) {
    where.documentType = documentType;
  }

  // Phase 5: Filter by source (patient upload vs provider contributed)
  if (source) {
    where.source = source;
  }

  // Filter by year
  if (year) {
    const yearNum = parseInt(year, 10);
    if (!isNaN(yearNum)) {
      where.dateOfCare = {
        gte: new Date(yearNum, 0, 1),
        lt: new Date(yearNum + 1, 0, 1),
      };
    }
  }

  // Get documents sorted by date of care (fallback to upload date)
  // Include provider contribution data for Phase 5 attribution
  const documents = await prisma.npaVaultDocument.findMany({
    where,
    orderBy: [
      { dateOfCare: "desc" },
      { uploadedAt: "desc" },
    ],
    take: limit,
    skip: offset,
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
      isHidden: true,
      processingStatus: true,
      documentType: true,
      classificationConfidence: true,
      providerName: true,
      facilityName: true,
      department: true,
      sections: true,
      // Phase 5: Include provider contribution details
      providerContribution: {
        select: {
          id: true,
          providerName: true,
          providerRole: true,
          providerOrg: true,
          specialty: true,
          contributionType: true,
          dateOfCare: true,
          createdAt: true,
        },
      },
    },
  });

  // Get total count for pagination
  const totalCount = await prisma.npaVaultDocument.count({ where });

  // Get available years for filtering
  const yearsResult = await prisma.$queryRaw<Array<{ year: number }>>`
    SELECT DISTINCT EXTRACT(YEAR FROM COALESCE("dateOfCare", "uploadedAt"))::int as year
    FROM "NpaVaultDocument"
    WHERE "npaId" = ${user.npaId} AND "isDeleted" = false
    ORDER BY year DESC
  `;

  // Get document type counts for filtering
  const typeCounts = await prisma.npaVaultDocument.groupBy({
    by: ["documentType"],
    where: {
      npaId: user.npaId,
      isDeleted: false,
      isHidden: showHidden ? undefined : false,
      documentType: { not: null },
    },
    _count: true,
  });

  // Phase 5: Get source counts for filtering (patient vs provider)
  const sourceCounts = await prisma.npaVaultDocument.groupBy({
    by: ["source"],
    where: {
      npaId: user.npaId,
      isDeleted: false,
      isHidden: showHidden ? undefined : false,
    },
    _count: true,
  });

  // Phase 5: Count provider contributions
  const providerContributionCount = await prisma.npaProviderContribution.count({
    where: { npaId: user.npaId },
  });

  // Group documents by time period for timeline display
  const timeline = groupDocumentsByTimePeriod(documents);

  return NextResponse.json({
    timeline,
    documents: documents.map(formatTimelineDocument),
    pagination: {
      total: totalCount,
      limit,
      offset,
      hasMore: offset + documents.length < totalCount,
    },
    filters: {
      years: yearsResult.map((r) => r.year).filter((y) => y),
      documentTypes: typeCounts.map((tc) => ({
        type: tc.documentType,
        count: tc._count,
        display: tc.documentType
          ? getDocumentTypeDisplay(tc.documentType as any)
          : null,
      })),
      // Phase 5: Source filter (patient uploads vs provider contributions)
      sources: sourceCounts.map((sc) => ({
        source: sc.source,
        count: sc._count,
        label: sc.source === "PROVIDER_PORTAL" 
          ? "Provider Contributed" 
          : sc.source === "PATIENT_UPLOAD" 
            ? "Patient Uploaded" 
            : sc.source,
      })),
    },
    // Phase 5: Provider contribution summary
    providerContributions: {
      count: providerContributionCount,
      hasContributions: providerContributionCount > 0,
    },
    npaId: user.npaIdAlias || user.npaId.substring(0, 12) + "...",
    complianceNotice:
      "This feature organizes and displays information exactly as provided by healthcare documents. It does not interpret, diagnose, or provide medical advice.",
    // Phase 5: Legal statement for provider contributions
    providerContributionNotice:
      "Provider-added records are included for continuity and reference.",
  });
}

// Format a document for timeline display
function formatTimelineDocument(document: any) {
  const typeDisplay = document.documentType
    ? getDocumentTypeDisplay(document.documentType)
    : null;

  // Calculate effective date (date of care or upload date)
  const effectiveDate = document.dateOfCare || document.uploadedAt;

  // Phase 5: Determine if this is a provider-contributed document
  const isProviderContributed = document.source === "PROVIDER_PORTAL";
  const contribution = document.providerContribution;

  // Generate attribution label for provider contributions
  // Example: "Added by Dr. Smith, MD — Cardiology — 03/14/2024"
  let attributionLabel: string | null = null;
  if (isProviderContributed && contribution) {
    const roleDisplay = contribution.providerRole && contribution.providerRole !== "OTHER" 
      ? `, ${contribution.providerRole}` 
      : "";
    const specialtyDisplay = contribution.specialty ? ` — ${contribution.specialty}` : "";
    const dateDisplay = contribution.dateOfCare 
      ? ` — ${new Date(contribution.dateOfCare).toLocaleDateString()}`
      : "";
    attributionLabel = `Added by ${contribution.providerName}${roleDisplay}${specialtyDisplay}${dateDisplay}`;
  }

  return {
    id: document.id,
    title: document.title,
    effectiveDate,
    dateOfCare: document.dateOfCare,
    uploadedAt: document.uploadedAt,
    category: document.category,
    documentType: document.documentType,
    documentTypeDisplay: typeDisplay,
    classificationConfidence: document.classificationConfidence,
    source: document.source,
    sourceSystem: document.sourceSystem,
    
    // Phase 5: Clear differentiation of provider contributions
    isProviderContributed,
    attributionLabel,
    contribution: isProviderContributed && contribution ? {
      providerName: contribution.providerName,
      providerRole: contribution.providerRole,
      organization: contribution.providerOrg,
      specialty: contribution.specialty,
      contributionType: contribution.contributionType,
      contributedAt: contribution.createdAt,
    } : null,
    
    // Provider info (from document metadata)
    providerInfo: {
      providerName: document.providerName,
      facilityName: document.facilityName,
      department: document.department,
    },
    mimeType: document.mimeType,
    sizeBytes: document.sizeBytes,
    isHidden: document.isHidden,
    processingStatus: document.processingStatus,
    hasSections: document.sections && Object.keys(document.sections).length > 1,
    availableSections: document.sections
      ? Object.keys(document.sections).filter(
          (k) => k !== "rawText" && document.sections[k]
        )
      : [],
  };
}

// Group documents into time periods for visual timeline
function groupDocumentsByTimePeriod(documents: any[]) {
  const groups: Record<
    string,
    {
      label: string;
      startDate: Date;
      endDate: Date;
      documents: any[];
    }
  > = {};

  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();

  for (const doc of documents) {
    const effectiveDate = new Date(doc.dateOfCare || doc.uploadedAt);
    const year = effectiveDate.getFullYear();
    const month = effectiveDate.getMonth();

    let groupKey: string;
    let label: string;

    // Group logic
    if (year === thisYear && month === thisMonth) {
      groupKey = "this_month";
      label = "This Month";
    } else if (
      year === thisYear &&
      month === thisMonth - 1
    ) {
      groupKey = "last_month";
      label = "Last Month";
    } else if (year === thisYear) {
      groupKey = `${year}_${month}`;
      label = effectiveDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else {
      groupKey = `${year}`;
      label = `${year}`;
    }

    if (!groups[groupKey]) {
      groups[groupKey] = {
        label,
        startDate: effectiveDate,
        endDate: effectiveDate,
        documents: [],
      };
    }

    groups[groupKey].documents.push(formatTimelineDocument(doc));

    // Update date range
    if (effectiveDate < groups[groupKey].startDate) {
      groups[groupKey].startDate = effectiveDate;
    }
    if (effectiveDate > groups[groupKey].endDate) {
      groups[groupKey].endDate = effectiveDate;
    }
  }

  // Convert to array and sort by most recent first
  return Object.entries(groups)
    .map(([key, group]) => ({
      key,
      ...group,
      documentCount: group.documents.length,
    }))
    .sort((a, b) => b.endDate.getTime() - a.endDate.getTime());
}
