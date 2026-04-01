import { NextRequest, NextResponse } from "next/server";
import {
  ETSY_TOKEN_URL,
  formatXApiKey,
  getEtsyEnv,
  parseUserIdFromAccessToken,
} from "@/lib/etsy/oauth";
import { saveEtsyTokens } from "@/lib/etsy/tokens";

const STATE_COOKIE = "etsy_oauth_state";
const VERIFIER_COOKIE = "etsy_pkce_verifier";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error");
  const errDesc = url.searchParams.get("error_description");

  const base = new URL(req.url);
  const fail = (msg: string) =>
    NextResponse.redirect(
      new URL(
        `/etsy/connected?error=${encodeURIComponent(msg)}`,
        base.origin
      )
    );

  if (err) {
    return fail(errDesc || err);
  }

  const cfg = getEtsyEnv();
  if (!cfg) {
    return fail("Etsy env not configured");
  }

  const cookieState = req.cookies.get(STATE_COOKIE)?.value;
  const verifier = req.cookies.get(VERIFIER_COOKIE)?.value;
  if (!code || !state || !cookieState || !verifier || state !== cookieState) {
    return fail("Invalid OAuth state — try connecting again");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    code,
    code_verifier: verifier,
  });

  let access_token: string;
  let refresh_token: string;
  let expires_in: number;

  try {
    const tokenRes = await fetch(ETSY_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-api-key": formatXApiKey(cfg.clientId, cfg.sharedSecret),
      },
      body: body.toString(),
    });

    const json = (await tokenRes.json()) as Record<string, unknown>;
    if (!tokenRes.ok) {
      const msg =
        typeof json.error === "string"
          ? json.error
          : JSON.stringify(json) || tokenRes.statusText;
      console.error("Etsy token exchange failed:", msg);
      return fail(`Token exchange failed: ${msg}`);
    }

    access_token = String(json.access_token || "");
    refresh_token = String(json.refresh_token || "");
    expires_in = Number(json.expires_in) || 3600;
    if (!access_token) {
      return fail("No access_token in Etsy response");
    }
  } catch (e) {
    console.error(e);
    return fail("Token request failed");
  }

  const userId = parseUserIdFromAccessToken(access_token);
  const shopId = process.env.ETSY_SHOP_ID?.trim() || undefined;

  await saveEtsyTokens({
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + expires_in,
    userId: userId || undefined,
    shopId,
  });

  const res = NextResponse.redirect(new URL("/etsy/connected?ok=1", base.origin));
  res.cookies.set(STATE_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(VERIFIER_COOKIE, "", { path: "/", maxAge: 0 });

  return res;
}
