import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { logAccess, getRequestMetadata } from "@/lib/audit-log";
import {
  ensureProviderPacketOwnership,
  resolveProviderPacketIdentity,
} from "@/lib/provider-packet/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const shareLink = await prisma.providerPacketLink.findUnique({
    where: { token: params.token },
    include: { packet: true },
  });
  if (!shareLink || !shareLink.packet) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const identity = await resolveProviderPacketIdentity(request);
  try {
    ensureProviderPacketOwnership(shareLink.packet, identity);
  } catch (error) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  await prisma.providerPacketLink.update({
    where: { token: params.token },
    data: { revokedAt: new Date() },
  });

  // HIPAA CRITICAL: Log revocation
  const { ipAddress, userAgent } = getRequestMetadata(request);
  await logAccess({
    actorId: identity.userId || null,
    subjectUserId: shareLink.packet.userId || null,
    action: "REVOKE",
    resourceType: "SHARE_LINK",
    resourceId: params.token,
    ipAddress,
    userAgent,
    metadata: { packetId: shareLink.packet.id },
  });

  return NextResponse.json({ ok: true });
}
