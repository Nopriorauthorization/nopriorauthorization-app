import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
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

  return NextResponse.json({ ok: true });
}
