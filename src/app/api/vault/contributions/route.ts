import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

/**
 * GET /api/vault/contributions - Get all provider contributions to patient's vault
 * 
 * Phase 5: Provides visibility into all documents contributed by providers,
 * enabling patients to:
 * - See who has contributed
 * - View contribution details
 * - Understand their longitudinal timeline sources
 * 
 * PATIENT LEGAL STATEMENT:
 * "Provider-added records are included for continuity and reference."
 * 
 * Query params:
 * - providerName: Filter by provider name
 * - specialty: Filter by specialty
 * - contributionType: Filter by type
 * - limit: Number of contributions (default: 50)
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
    select: { id: true, npaId: true },
  });

  if (!user?.npaId) {
    return NextResponse.json(
      { error: "NPA ID not found" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const providerName = searchParams.get("providerName");
  const specialty = searchParams.get("specialty");
  const contributionType = searchParams.get("contributionType");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  // Build query filters
  const where: Record<string, any> = {
    npaId: user.npaId,
  };

  if (providerName) {
    where.providerName = { contains: providerName, mode: "insensitive" };
  }

  if (specialty) {
    where.specialty = { contains: specialty, mode: "insensitive" };
  }

  if (contributionType) {
    where.contributionType = contributionType;
  }

  // Get contributions with document details
  const [contributions, totalCount] = await Promise.all([
    prisma.npaProviderContribution.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        document: {
          select: {
            id: true,
            title: true,
            category: true,
            dateOfCare: true,
            uploadedAt: true,
            mimeType: true,
            processingStatus: true,
            isHidden: true,
          },
        },
        shareSession: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.npaProviderContribution.count({ where }),
  ]);

  // Get unique providers for filtering
  const uniqueProviders = await prisma.npaProviderContribution.findMany({
    where: { npaId: user.npaId },
    distinct: ["providerName", "providerOrg"],
    select: {
      providerName: true,
      providerRole: true,
      providerOrg: true,
      specialty: true,
    },
  });

  // Get contribution type counts
  const typeCounts = await prisma.npaProviderContribution.groupBy({
    by: ["contributionType"],
    where: { npaId: user.npaId },
    _count: true,
  });

  // Get specialty counts
  const specialtyCounts = await prisma.npaProviderContribution.groupBy({
    by: ["specialty"],
    where: { 
      npaId: user.npaId,
      specialty: { not: null },
    },
    _count: true,
  });

  // Format contributions
  const formattedContributions = contributions.map((c) => {
    const roleDisplay = c.providerRole && c.providerRole !== "OTHER"
      ? `, ${c.providerRole}`
      : "";
    const specialtyDisplay = c.specialty ? ` — ${c.specialty}` : "";
    const dateDisplay = c.dateOfCare
      ? ` — ${c.dateOfCare.toLocaleDateString()}`
      : "";
    
    return {
      id: c.id,
      // Attribution label for display
      attributionLabel: `Added by ${c.providerName}${roleDisplay}${specialtyDisplay}${dateDisplay}`,
      provider: {
        name: c.providerName,
        role: c.providerRole,
        organization: c.providerOrg,
        specialty: c.specialty,
        email: c.providerEmail,
        npi: c.providerNPI,
      },
      contributionType: c.contributionType,
      contributionTypeLabel: formatContributionType(c.contributionType),
      dateOfCare: c.dateOfCare,
      notes: c.notes,
      contributedAt: c.createdAt,
      document: {
        id: c.document.id,
        title: c.document.title,
        category: c.document.category,
        dateOfCare: c.document.dateOfCare,
        mimeType: c.document.mimeType,
        processingStatus: c.document.processingStatus,
        isHidden: c.document.isHidden,
      },
      shareSession: c.shareSession ? {
        id: c.shareSession.id,
        title: c.shareSession.title,
        createdAt: c.shareSession.createdAt,
      } : null,
    };
  });

  return NextResponse.json({
    contributions: formattedContributions,
    pagination: {
      total: totalCount,
      limit,
      offset,
      hasMore: offset + contributions.length < totalCount,
    },
    filters: {
      providers: uniqueProviders.map((p) => ({
        name: p.providerName,
        role: p.providerRole,
        organization: p.providerOrg,
        specialty: p.specialty,
      })),
      contributionTypes: typeCounts.map((tc) => ({
        type: tc.contributionType,
        label: formatContributionType(tc.contributionType),
        count: tc._count,
      })),
      specialties: specialtyCounts.map((sc) => ({
        specialty: sc.specialty,
        count: sc._count,
      })),
    },
    summary: {
      totalContributions: totalCount,
      uniqueProviders: uniqueProviders.length,
      uniqueSpecialties: specialtyCounts.length,
    },
    legalNotice:
      "Provider-added records are included for continuity and reference.",
  });
}

function formatContributionType(type: string): string {
  const labels: Record<string, string> = {
    visit_summary: "Visit Summary",
    referral: "Referral Letter",
    care_note: "Care Note",
    lab_result: "Lab Result",
    imaging: "Imaging Report",
    discharge: "Discharge Summary",
    other: "Other Document",
  };
  return labels[type] || type.replace(/_/g, " ");
}
