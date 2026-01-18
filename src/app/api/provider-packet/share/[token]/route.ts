import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { logAccess, getRequestMetadata } from "@/lib/audit-log";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { ipAddress, userAgent } = getRequestMetadata(request);
  
  const shareLink = await prisma.providerPacketLink.findUnique({
    where: { token: params.token },
    include: { packet: true },
  });

  if (!shareLink || !shareLink.packet) {
    await logAccess({
      actorId: null,
      subjectUserId: null,
      action: "VIEW",
      resourceType: "SHARE_LINK",
      resourceId: params.token,
      ipAddress,
      userAgent,
      metadata: { success: false, reason: "not_found" },
    });
    return NextResponse.json(
      { error: "This provider packet link is no longer available." },
      { status: 410 }
    );
  }

  if (shareLink.revokedAt) {
    await logAccess({
      actorId: null,
      subjectUserId: shareLink.packet.userId || null,
      action: "VIEW",
      resourceType: "SHARE_LINK",
      resourceId: params.token,
      ipAddress,
      userAgent,
      metadata: { success: false, reason: "revoked", packetId: shareLink.packet.id },
    });
    return NextResponse.json(
      { error: "This provider packet link is no longer available." },
      { status: 410 }
    );
  }

  if (shareLink.expiresAt.getTime() < Date.now()) {
    await logAccess({
      actorId: null,
      subjectUserId: shareLink.packet.userId || null,
      action: "VIEW",
      resourceType: "SHARE_LINK",
      resourceId: params.token,
      ipAddress,
      userAgent,
      metadata: { success: false, reason: "expired", packetId: shareLink.packet.id, expiresAt: shareLink.expiresAt.toISOString() },
    });
    return NextResponse.json(
      { error: "This provider packet link is no longer available." },
      { status: 410 }
    );
  }

  await logAccess({
    actorId: null,
    subjectUserId: shareLink.packet.userId || null,
    action: "VIEW",
    resourceType: "PROVIDER_PACKET",
    resourceId: shareLink.packet.id,
    ipAddress,
    userAgent,
    metadata: { success: true, token: params.token, template: shareLink.packet.template },
  });

  await prisma.providerPacketAccessLog.create({
    data: {
      providerPacketLinkId: shareLink.id,
      ipAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: request.headers.get("user-agent") ?? null,
    },
  });

  return NextResponse.json(
    {
      error:
        "Provider packet PDF generation is temporarily unavailable (pdfkit dependency pending). Please try again later.",
    },
    {
      status: 501,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
