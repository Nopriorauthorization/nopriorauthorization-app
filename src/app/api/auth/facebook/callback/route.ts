export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { readFacebookEnv } from "@/lib/facebook/env";

const GRAPH = "https://graph.facebook.com/v21.0";

export async function GET(request: NextRequest) {
  function bail(msg: string) {
    const u = new URL("/admin/social", request.nextUrl.origin);
    u.searchParams.set("fb_error", msg);
    const res = NextResponse.redirect(u);
    res.cookies.delete("fb_oauth_state");
    return res;
  }

  const url = request.nextUrl;
  const err = url.searchParams.get("error");
  const errDesc = url.searchParams.get("error_description");
  if (err) {
    return bail(errDesc || err);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) {
    return bail("Missing code or state from Facebook.");
  }

  const expected = request.cookies.get("fb_oauth_state")?.value;
  if (!expected || expected !== state) {
    return bail("Invalid OAuth state — try Connect Facebook again.");
  }

  const appId = readFacebookEnv("FB_APP_ID");
  const appSecret = readFacebookEnv("FB_APP_SECRET");
  const redirectUri = readFacebookEnv("FB_REDIRECT_URI");
  const targetPageId = readFacebookEnv("FB_PAGE_ID");

  if (!appId || !appSecret || !redirectUri || !targetPageId) {
    return bail(
      "Server missing FB_APP_ID, FB_APP_SECRET, FB_REDIRECT_URI, or FB_PAGE_ID."
    );
  }

  async function fetchJson(u: string) {
    const r = await fetch(u);
    const j = (await r.json()) as Record<string, unknown>;
    return { ok: r.ok, j };
  }

  const tokUrl = new URL(`${GRAPH}/oauth/access_token`);
  tokUrl.searchParams.set("client_id", appId);
  tokUrl.searchParams.set("client_secret", appSecret);
  tokUrl.searchParams.set("redirect_uri", redirectUri);
  tokUrl.searchParams.set("code", code);

  const { ok, j: shortTok } = await fetchJson(tokUrl.toString());
  const shortUser =
    typeof shortTok.access_token === "string" ? shortTok.access_token : null;
  if (!ok || !shortUser) {
    const em =
      typeof (shortTok.error as { message?: string } | undefined)?.message ===
      "string"
        ? (shortTok.error as { message: string }).message
        : "Failed to exchange code for token.";
    return bail(em);
  }

  const llUrl = new URL(`${GRAPH}/oauth/access_token`);
  llUrl.searchParams.set("grant_type", "fb_exchange_token");
  llUrl.searchParams.set("client_id", appId);
  llUrl.searchParams.set("client_secret", appSecret);
  llUrl.searchParams.set("fb_exchange_token", shortUser);

  const { ok: ok2, j: longTok } = await fetchJson(llUrl.toString());
  const longUser =
    typeof longTok.access_token === "string" ? longTok.access_token : null;
  if (!ok2 || !longUser) {
    return bail("Failed to exchange for long-lived user token.");
  }

  const pagesUrl = new URL(`${GRAPH}/me/accounts`);
  pagesUrl.searchParams.set("access_token", longUser);
  const { ok: ok3, j: pagesData } = await fetchJson(pagesUrl.toString());
  if (!ok3) {
    return bail("Could not list Facebook Pages.");
  }

  const data = Array.isArray((pagesData as { data?: unknown }).data)
    ? ((pagesData as { data: { id: string; name?: string; access_token: string }[] })
        .data)
    : [];
  const page = data.find((p) => p.id === targetPageId);
  if (!page?.access_token) {
    return bail(
      `This Facebook login does not manage Page ID ${targetPageId}. Use an account that is an admin of the Hello Gorgeous Page, or fix FB_PAGE_ID.`
    );
  }

  await prisma.facebookPageCredential.upsert({
    where: { pageId: targetPageId },
    create: {
      pageId: targetPageId,
      pageName: page.name ?? null,
      accessToken: page.access_token,
    },
    update: {
      pageName: page.name ?? null,
      accessToken: page.access_token,
    },
  });

  const okRes = NextResponse.redirect(
    new URL("/admin/social?fb_connected=1", request.nextUrl.origin)
  );
  okRes.cookies.delete("fb_oauth_state");
  return okRes;
}
