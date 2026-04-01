import { NextRequest, NextResponse } from "next/server";
import {
  buildAuthorizeUrl,
  generateOauthState,
  generatePkcePair,
  getCanvaEnv,
} from "@/lib/canva/oauth";

const STATE_COOKIE = "canva_oauth_state";
const VERIFIER_COOKIE = "canva_pkce_verifier";

export async function GET(_req: NextRequest) {
  const cfg = getCanvaEnv();
  if (!cfg) {
    return NextResponse.json(
      {
        error:
          "Missing CANVA_CLIENT_ID, CANVA_CLIENT_SECRET, or CANVA_OAUTH_REDIRECT_URI",
      },
      { status: 503 }
    );
  }

  let redirectUri = cfg.redirectUri;
  if (process.env.NODE_ENV !== "production") {
    const requestHost = _req.headers.get("host") || _req.nextUrl.host;
    const redirectHost = new URL(cfg.redirectUri).host;
    if (requestHost !== redirectHost) {
      // Canva requires exact redirect URI host matching.
      // If user opens localhost, send them to 127.0.0.1 auth route.
      return NextResponse.redirect(
        new URL(`${_req.nextUrl.pathname}${_req.nextUrl.search}`, `${_req.nextUrl.protocol}//${redirectHost}`),
        307
      );
    }
  }

  const { verifier, challenge } = generatePkcePair();
  const state = generateOauthState();
  const url = buildAuthorizeUrl({
    clientId: cfg.clientId,
    redirectUri,
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
