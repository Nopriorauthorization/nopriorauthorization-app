import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth/auth-options";

export type ProviderPacketIdentity = {
  userId: string | null;
  anonId: string | null;
};

export async function resolveProviderPacketIdentity(
  request: NextRequest
): Promise<ProviderPacketIdentity> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;
  const anonId = request.cookies.get("npa_uid")?.value ?? null;
  return { userId, anonId };
}

export function ensureProviderPacketOwnership(
  packet: { userId: string | null; anonId: string | null },
  identity: ProviderPacketIdentity
) {
  const owns =
    (packet.userId && identity.userId && packet.userId === identity.userId) ||
    (packet.anonId && identity.anonId && packet.anonId === identity.anonId);
  if (!owns) {
    throw new Error("Packet not found.");
  }
}
