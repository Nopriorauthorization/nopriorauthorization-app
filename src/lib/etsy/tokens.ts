import prisma from "@/lib/db";

const ETSY_TOKEN_EVENT = "etsy_oauth_token";

export type EtsyTokenRecord = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId?: string;
  shopId?: string;
};

export async function saveEtsyTokens(tokens: EtsyTokenRecord): Promise<void> {
  await prisma.analytics.create({
    data: {
      event: ETSY_TOKEN_EVENT,
      metadata: tokens as Record<string, unknown>,
    },
  });
}

export async function getEtsyTokens(): Promise<EtsyTokenRecord | null> {
  const record = await prisma.analytics.findFirst({
    where: { event: ETSY_TOKEN_EVENT },
    orderBy: { createdAt: "desc" },
  });

  if (!record?.metadata) return null;

  const meta = record.metadata as Record<string, unknown>;
  const accessToken = meta.accessToken as string | undefined;
  const refreshToken = meta.refreshToken as string | undefined;

  if (!accessToken) return null;

  return {
    accessToken,
    refreshToken: refreshToken || "",
    expiresAt: (meta.expiresAt as number) || 0,
    userId: (meta.userId as string) || undefined,
    shopId: (meta.shopId as string) || undefined,
  };
}
