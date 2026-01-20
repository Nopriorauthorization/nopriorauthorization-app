import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

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

    // TODO: Send email invitation
    // 1. Generate secure invitation link with token
    // 2. Send email using SendGrid/AWS SES
    // 3. Include vault owner name, expiration date
    // 4. Link should accept invite and create TrustedCircleMember

    return NextResponse.json({ success: true, invite });
  } catch (error) {
    console.error("Error sending invite:", error);
    return NextResponse.json(
      { error: "Failed to send invite" },
      { status: 500 }
    );
  }
}
