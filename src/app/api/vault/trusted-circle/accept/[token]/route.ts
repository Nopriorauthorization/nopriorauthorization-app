import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

type RouteContext = {
  params: Promise<{ token: string }>;
};

// GET - Accept a trusted circle invitation
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { token } = await context.params;

    // Find the invitation
    const invite = await prisma.trustedCircleInvite.findUnique({
      where: { token },
    });

    if (!invite) {
      return NextResponse.redirect(new URL("/vault/trusted-circle?error=invalid", req.url));
    }

    // Check if expired
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      await prisma.trustedCircleInvite.update({
        where: { token },
        data: { status: "expired" },
      });
      return NextResponse.redirect(new URL("/vault/trusted-circle?error=expired", req.url));
    }

    // Check if already accepted
    if (invite.status === "accepted") {
      return NextResponse.redirect(new URL("/vault/trusted-circle?error=already-accepted", req.url));
    }

    // Create the member
    await prisma.trustedCircleMember.create({
      data: {
        userId: invite.userId,
        name: invite.inviteeName,
        email: invite.inviteeEmail,
        relationship: invite.relationship,
        permissions: invite.permissions,
        status: "active",
        invitedAt: invite.createdAt,
        expiresAt: invite.expiresAt,
      },
    });

    // Mark invitation as accepted
    await prisma.trustedCircleInvite.update({
      where: { token },
      data: {
        status: "accepted",
        acceptedAt: new Date(),
      },
    });

    return NextResponse.redirect(new URL("/vault/trusted-circle?success=accepted", req.url));
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.redirect(new URL("/vault/trusted-circle?error=failed", req.url));
  }
}
