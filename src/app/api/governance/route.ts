import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * NPA Phase 6: Patient Governance Dashboard API
 * 
 * PURPOSE: Make trust visible.
 * 
 * Patients can see:
 * - All active permissions
 * - All past shares
 * - All provider uploads
 * - All emergency accesses
 * - Full audit history
 * 
 * Patients can:
 * - Revoke any permission
 * - Disable emergency access
 * - Export audit logs
 * 
 * This is not optional UX — it's foundational.
 */

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { npaId: true, npaIdAlias: true, createdAt: true },
    });

    if (!user?.npaId) {
      return NextResponse.json({ error: "NPA ID not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") || "overview";

    // Overview section - summary of everything
    if (section === "overview") {
      const [
        activeShares,
        totalShares,
        providerContributions,
        emergencySettings,
        emergencySessions,
        vaultDocCount,
        recentActivity,
      ] = await Promise.all([
        // Active share sessions
        prisma.npaShareSession.count({
          where: {
            npaId: user.npaId,
            isRevoked: false,
            expiresAt: { gt: new Date() },
          },
        }),
        // Total shares ever
        prisma.npaShareSession.count({
          where: { npaId: user.npaId },
        }),
        // Provider contributions
        prisma.npaProviderContribution.count({
          where: { npaId: user.npaId },
        }),
        // Emergency access settings
        prisma.npaEmergencyAccessSettings.findUnique({
          where: { npaId: user.npaId },
        }),
        // Emergency access sessions
        prisma.npaEmergencyAccessSession.count({
          where: { npaId: user.npaId },
        }),
        // Vault document count
        prisma.npaVaultDocument.count({
          where: { npaId: user.npaId, isDeleted: false },
        }),
        // Recent audit activity
        prisma.identityAuditLog.findMany({
          where: { npaId: user.npaId },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

      return NextResponse.json({
        npaId: user.npaIdAlias,
        memberSince: user.createdAt,
        summary: {
          activeShares,
          totalShares,
          providerContributions,
          emergencyAccessEnabled: emergencySettings?.isEnabled || false,
          emergencyAccessSessions: emergencySessions,
          vaultDocuments: vaultDocCount,
        },
        recentActivity: recentActivity.map((log) => ({
          action: log.action,
          timestamp: log.createdAt,
          metadata: log.metadata,
        })),
        trustStatement: "You have full control over your health data. Review, revoke, or export at any time.",
      });
    }

    // Active permissions section
    if (section === "permissions") {
      const activeShares = await prisma.npaShareSession.findMany({
        where: {
          npaId: user.npaId,
          isRevoked: false,
          expiresAt: { gt: new Date() },
        },
        include: {
          documents: {
            include: {
              document: {
                select: { id: true, title: true, category: true },
              },
            },
          },
          accessLogs: {
            orderBy: { accessedAt: "desc" },
            take: 5,
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        activePermissions: activeShares.map((share) => ({
          id: share.id,
          title: share.title,
          permission: share.permission,
          expiresAt: share.expiresAt,
          useCount: share.useCount,
          maxUses: share.maxUses,
          documentCount: share.documents.length,
          documents: share.documents.map((d) => ({
            id: d.document.id,
            title: d.document.title,
            category: d.document.category,
          })),
          lastAccessed: share.lastAccessedAt,
          recentAccessors: share.accessLogs.map((log) => ({
            name: log.accessorName,
            org: log.accessorOrg,
            action: log.action,
            timestamp: log.accessedAt,
          })),
          canRevoke: true,
        })),
        totalActive: activeShares.length,
      });
    }

    // Past shares section
    if (section === "history") {
      const page = parseInt(searchParams.get("page") || "1");
      const limit = 20;
      const skip = (page - 1) * limit;

      const [shares, total] = await Promise.all([
        prisma.npaShareSession.findMany({
          where: { npaId: user.npaId },
          include: {
            documents: {
              include: {
                document: {
                  select: { id: true, title: true },
                },
              },
            },
            _count: {
              select: { accessLogs: true },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.npaShareSession.count({
          where: { npaId: user.npaId },
        }),
      ]);

      return NextResponse.json({
        shareHistory: shares.map((share) => ({
          id: share.id,
          title: share.title,
          permission: share.permission,
          status: share.isRevoked
            ? "revoked"
            : new Date() > share.expiresAt
            ? "expired"
            : "active",
          createdAt: share.createdAt,
          expiresAt: share.expiresAt,
          revokedAt: share.revokedAt,
          documentCount: share.documents.length,
          accessCount: share._count.accessLogs,
        })),
        pagination: {
          page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      });
    }

    // Provider contributions section
    if (section === "contributions") {
      const contributions = await prisma.npaProviderContribution.findMany({
        where: { npaId: user.npaId },
        include: {
          document: {
            select: { id: true, title: true, category: true, dateOfCare: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        providerContributions: contributions.map((c) => ({
          id: c.id,
          providerName: c.providerName,
          providerRole: c.providerRole,
          organization: c.providerOrg,
          specialty: c.specialty,
          dateOfCare: c.dateOfCare,
          contributionType: c.contributionType,
          document: c.document,
          createdAt: c.createdAt,
        })),
        totalContributions: contributions.length,
        notice: "Provider-added records are included for continuity and reference.",
      });
    }

    // Emergency access section
    if (section === "emergency") {
      const [settings, sessions] = await Promise.all([
        prisma.npaEmergencyAccessSettings.findUnique({
          where: { npaId: user.npaId },
        }),
        prisma.npaEmergencyAccessSession.findMany({
          where: { npaId: user.npaId },
          include: {
            _count: {
              select: { accessLogs: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
      ]);

      return NextResponse.json({
        emergencyAccess: {
          isEnabled: settings?.isEnabled || false,
          scope: settings?.allowedScope || "CRITICAL_ONLY",
          maxDuration: settings?.maxDurationMinutes || 60,
          emergencyContact: settings ? {
            name: settings.emergencyContactName,
            phone: settings.emergencyContactPhone,
            relation: settings.emergencyContactRelation,
          } : null,
        },
        accessHistory: sessions.map((s) => ({
          id: s.id,
          startedAt: s.startedAt,
          expiresAt: s.expiresAt,
          endedAt: s.endedAt,
          accessorName: s.accessorName,
          accessorRole: s.accessorRole,
          accessorOrg: s.accessorOrg,
          reason: s.reasonEntered,
          status: s.wasRevoked ? "revoked" : new Date() > s.expiresAt ? "expired" : "active",
          actionsLogged: s._count.accessLogs,
        })),
        notice: "Emergency access allows temporary access to critical health information when you cannot consent. All access is logged.",
      });
    }

    // Full audit log section
    if (section === "audit") {
      const page = parseInt(searchParams.get("page") || "1");
      const limit = 50;
      const skip = (page - 1) * limit;

      const [logs, total] = await Promise.all([
        prisma.identityAuditLog.findMany({
          where: { npaId: user.npaId },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.identityAuditLog.count({
          where: { npaId: user.npaId },
        }),
      ]);

      return NextResponse.json({
        auditLogs: logs.map((log) => ({
          action: log.action,
          timestamp: log.createdAt,
          ipAddress: log.ipAddress,
          metadata: log.metadata,
        })),
        pagination: {
          page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
        exportAvailable: true,
      });
    }

    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  } catch (error) {
    console.error("Governance API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch governance data" },
      { status: 500 }
    );
  }
}
