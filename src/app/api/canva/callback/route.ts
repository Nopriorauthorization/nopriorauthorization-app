import { NextRequest, NextResponse } from "next/server";
import {
  buildBasicAuthHeader,
  CANVA_OAUTH_TOKEN_URL,
  getCanvaEnv,
} from "@/lib/canva/oauth";

const STATE_COOKIE = "canva_oauth_state";
const VERIFIER_COOKIE = "canva_pkce_verifier";
const ACCESS_COOKIE = "canva_access_token";
const REFRESH_COOKIE = "canva_refresh_token";
const SCOPE_COOKIE = "canva_scope";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error");
  const errDesc = url.searchParams.get("error_description");

  const base = new URL(req.url);
  const fail = (msg: string) =>
    NextResponse.redirect(
      new URL(`/canva/connected?error=${encodeURIComponent(msg)}`, base.origin)
    );

  if (err) {
    return fail(errDesc || err);
  }

  const cfg = getCanvaEnv();
  if (!cfg) {
    return fail("Canva env not configured");
  }
  const redirectUri = cfg.redirectUri;

  const cookieState = req.cookies.get(STATE_COOKIE)?.value;
  const verifier = req.cookies.get(VERIFIER_COOKIE)?.value;
  if (!code || !state || !cookieState || !verifier || state !== cookieState) {
    return fail("Invalid OAuth state - try connecting again");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    code_verifier: verifier,
    redirect_uri: redirectUri,
  });

  let accessToken = "";
  let refreshToken = "";
  let scope = "";
  let expiresIn = 60 * 60 * 4;

  try {
    const tokenRes = await fetch(CANVA_OAUTH_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: buildBasicAuthHeader(cfg.clientId, cfg.clientSecret),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const json = (await tokenRes.json()) as Record<string, unknown>;
    if (!tokenRes.ok) {
      const msg =
        typeof json.message === "string"
          ? json.message
          : JSON.stringify(json) || tokenRes.statusText;
      console.error("Canva token exchange failed:", msg);
      return fail(`Token exchange failed: ${msg}`);
    }

    accessToken = String(json.access_token || "");
    refreshToken = String(json.refresh_token || "");
    scope = String(json.scope || "");
    expiresIn = Number(json.expires_in) || expiresIn;

    if (!accessToken) {
      return fail("No access_token in Canva response");
    }
  } catch (error) {
    console.error(error);
    return fail("Token request failed");
  }

  const secure = process.env.NODE_ENV === "production";
  const res = NextResponse.redirect(new URL("/canva/connected?ok=1", base.origin));
  res.cookies.set(STATE_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(VERIFIER_COOKIE, "", { path: "/", maxAge: 0 });

  res.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: expiresIn,
  });
  res.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  res.cookies.set(SCOPE_COOKIE, scope, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
