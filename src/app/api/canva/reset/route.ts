import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAMES = [
  "canva_oauth_state",
  "canva_pkce_verifier",
  "canva_access_token",
  "canva_refresh_token",
  "canva_scope",
];

/**
 * Clears local Canva OAuth cookies so the next connect
 * request issues a fresh token with updated scopes.
 */
export async function GET(req: NextRequest) {
  const base = new URL(req.url);
  const res = NextResponse.redirect(new URL("/canva", base.origin));
  for (const name of COOKIE_NAMES) {
    res.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
  return res;
}
