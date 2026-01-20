import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";
import { sendEmail, generateInviteEmail } from "@/lib/email";

// POST - Send invitation to join trusted circle
export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, relationship, permissions, expirationDays } = body;

    const invite = await prisma.trustedCircleInvite.create({
      data: {
        userId: identity.userId || identity.anonId || "",
        inviteeName: name,
        inviteeEmail: email,
        relationship,
        permissions,
        expiresAt: expirationDays > 0 
          ? new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000)
          : null,
        status: "pending",
      },
    });

    // Generate invitation link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nopriorauthorization.com";
    const inviteLink = `${baseUrl}/vault/trusted-circle/accept/${invite.token}`;

    // Get owner name for email
    const ownerName = identity.userId 
      ? (await prisma.user.findUnique({ where: { id: identity.userId }, select: { name: true } }))?.name || "A user"
      : "A user";

    // Send email invitation
    const emailHtml = generateInviteEmail({
      inviteeName: name,
      ownerName,
      inviteLink,
      expiresAt: invite.expiresAt,
      permissions,
    });

    await sendEmail({
      to: email,
      subject: `${ownerName} invited you to their Trusted Circle`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, invite });
  } catch (error) {
    console.error("Error sending invite:", error);
    return NextResponse.json(
      { error: "Failed to send invite" },
      { status: 500 }
    );
  }
}
