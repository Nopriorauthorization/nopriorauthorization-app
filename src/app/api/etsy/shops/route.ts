import { NextResponse } from "next/server";
import { formatXApiKey, getEtsyEnv, parseUserIdFromAccessToken } from "@/lib/etsy/oauth";
import { getEtsyTokens } from "@/lib/etsy/tokens";

export const dynamic = "force-dynamic";

type AttemptResult = {
  endpoint: string;
  status: number;
  ok: boolean;
  body?: unknown;
};

async function callEtsyJson(
  endpoint: string,
  headers: HeadersInit
): Promise<AttemptResult> {
  const res = await fetch(endpoint, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  return { endpoint, status: res.status, ok: res.ok, body };
}

export async function GET() {
  const cfg = getEtsyEnv();
  if (!cfg) {
    return NextResponse.json(
      { error: "Missing Etsy environment configuration." },
      { status: 503 }
    );
  }

  const tokens = await getEtsyTokens();
  if (!tokens?.accessToken) {
    return NextResponse.json(
      { error: "Not connected to Etsy yet. Visit /api/etsy/auth to connect." },
      { status: 401 }
    );
  }

  const userId = tokens.userId || parseUserIdFromAccessToken(tokens.accessToken);
  const envShopId = tokens.shopId || process.env.ETSY_SHOP_ID?.trim();

  const headers = {
    "x-api-key": formatXApiKey(cfg.clientId, cfg.sharedSecret),
    Authorization: `Bearer ${tokens.accessToken}`,
  };

  const attempts: AttemptResult[] = [];

  if (userId) {
    attempts.push(
      await callEtsyJson(
        `https://api.etsy.com/v3/application/users/${encodeURIComponent(userId)}/shops`,
        headers
      )
    );
  }

  if (envShopId) {
    attempts.push(
      await callEtsyJson(
        `https://api.etsy.com/v3/application/shops/${encodeURIComponent(envShopId)}`,
        headers
      )
    );
  }

  const success = attempts.find((a) => a.ok);
  if (success) {
    return NextResponse.json({
      connected: true,
      userId: userId || null,
      shopIdHint: envShopId || null,
      sourceEndpoint: success.endpoint,
      data: success.body,
      attempts,
    });
  }

  return NextResponse.json(
    {
      connected: true,
      error: "Etsy shop probe failed.",
      userId: userId || null,
      shopIdHint: envShopId || null,
      attempts,
    },
    { status: 502 }
  );
}
