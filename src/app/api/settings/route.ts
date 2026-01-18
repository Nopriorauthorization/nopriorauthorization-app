import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import { logConsentChange, getRequestMetadata } from "@/lib/audit-log";

// GET /api/settings - Load user settings
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        lastAccessAt: true,
        consentToShareClinicalSummary: true,
        allowProviderToProviderSharing: true,
        emailNotificationsEnabled: true,
        defaultClinicalSummaryView: true,
        includeProviderNotesInShares: true,
        copyToEHRFormat: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user ID for share links query
    const fullUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    // Fetch active share links
    const shareLinks = fullUser
      ? await prisma.providerPacketLink.findMany({
          where: {
            packet: {
              userId: fullUser.id,
            },
            revokedAt: null,
          },
      select: {
        id: true,
        token: true,
        expiresAt: true,
        createdAt: true,
        accesses: {
          select: { id: true },
        },
      },
          orderBy: { createdAt: "desc" },
        })
      : [];

    const formattedShareLinks = shareLinks.map((link) => ({
      id: link.id,
      token: link.token,
      expiresAt: link.expiresAt.toISOString(),
      createdAt: link.createdAt.toISOString(),
      accessCount: link.accesses.length,
    }));

    return NextResponse.json({
      settings: {
        ...user,
        lastAccessAt: user.lastAccessAt?.toISOString() || null,
      },
      shareLinks: formattedShareLinks,
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

// PATCH /api/settings - Update user settings
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();


    // HIPAA CRITICAL: Track consent changes - fetch current state
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        consentToShareClinicalSummary: true,
        allowProviderToProviderSharing: true,
      },
    });

    const { ipAddress, userAgent } = getRequestMetadata(req);
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: body.name,
        email: body.email,
        consentToShareClinicalSummary: body.consentToShareClinicalSummary,
        allowProviderToProviderSharing: body.allowProviderToProviderSharing,
        emailNotificationsEnabled: body.emailNotificationsEnabled,
        defaultClinicalSummaryView: body.defaultClinicalSummaryView,
        includeProviderNotesInShares: body.includeProviderNotesInShares,
        copyToEHRFormat: body.copyToEHRFormat,
        updatedAt: new Date(),
      },
    });

        // HIPAA CRITICAL: Log consent changes
    if (currentUser) {
      if (
        typeof body.consentToShareClinicalSummary === "boolean" &&
        body.consentToShareClinicalSummary !== currentUser.consentToShareClinicalSummary
      ) {
        await logConsentChange(
          currentUser.id,
          body.consentToShareClinicalSummary ? "CONSENT_GRANTED" : "CONSENT_REVOKED",
          "consentToShareClinicalSummary",
          ipAddress,
          userAgent
        );
      }

      if (
        typeof body.allowProviderToProviderSharing === "boolean" &&
        body.allowProviderToProviderSharing !== currentUser.allowProviderToProviderSharing
      ) {
        await logConsentChange(
          currentUser.id,
          body.allowProviderToProviderSharing ? "CONSENT_GRANTED" : "CONSENT_REVOKED",
          "allowProviderToProviderSharing",
          ipAddress,
          userAgent
        );
      }
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Settings PATCH error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
