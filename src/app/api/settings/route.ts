import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

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

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Settings PATCH error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
