import { NextRequest, NextResponse } from "next/server";
import {
  buildAuthorizeUrl,
  generateOauthState,
  generatePkcePair,
  getEtsyEnv,
} from "@/lib/etsy/oauth";

const STATE_COOKIE = "etsy_oauth_state";
const VERIFIER_COOKIE = "etsy_pkce_verifier";

/**
 * Starts Etsy OAuth (authorization code + PKCE).
 * GET /api/etsy/auth
 */
export async function GET(req: NextRequest) {
  const cfg = getEtsyEnv();
  if (!cfg) {
    return NextResponse.json(
      {
        error:
          "Missing ETSY_API_KEYSTRING, ETSY_API_SHARED_SECRET, or ETSY_OAUTH_REDIRECT_URI",
      },
      { status: 503 }
    );
  }

  // Etsy requires HTTPS for redirect_uri on the authorize request (see Authentication guide).
  if (!cfg.redirectUri.startsWith("https://")) {
    return NextResponse.json(
      {
        error:
          "ETSY_OAUTH_REDIRECT_URI must start with https:// (Etsy does not accept http://localhost for OAuth). Register https://YOUR_DOMAIN/api/etsy/callback in Your Apps and point your domain here.",
      },
      { status: 400 }
    );
  }

  const { verifier, challenge } = generatePkcePair();
  const state = generateOauthState();
  const url = buildAuthorizeUrl({
    clientId: cfg.clientId,
    redirectUri: cfg.redirectUri,
    scope: cfg.scopes.replace(/,/g, " ").trim(),
    state,
    codeChallenge: challenge,
  });

  const res = NextResponse.redirect(url, 302);
  const secure = process.env.NODE_ENV === "production";
  const base = {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600,
  };
  res.cookies.set(STATE_COOKIE, state, base);
  res.cookies.set(VERIFIER_COOKIE, verifier, base);
  return res;
}
