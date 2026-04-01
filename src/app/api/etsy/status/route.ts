import { NextResponse } from "next/server";
import { getEtsyTokens } from "@/lib/etsy/tokens";

export const dynamic = "force-dynamic";

export async function GET() {
  const tokens = await getEtsyTokens();
  const now = Math.floor(Date.now() / 1000);

  return NextResponse.json({
    connected: Boolean(tokens?.accessToken),
    hasRefresh: Boolean(tokens?.refreshToken),
    userId: tokens?.userId || null,
    shopId: tokens?.shopId || null,
    expired: tokens?.expiresAt ? tokens.expiresAt < now : null,
  });
}
