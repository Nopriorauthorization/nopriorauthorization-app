export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { readFacebookEnv } from "@/lib/facebook/env";
import prisma from "@/lib/db";

/**
 * GET — posting readiness (no secrets). OAuth row overrides env token for posting.
 */
export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const pageId = readFacebookEnv("FB_PAGE_ID");
  const envTok = readFacebookEnv("FB_PAGE_ACCESS_TOKEN");
  const appId = readFacebookEnv("FB_APP_ID");
  const appSecret = readFacebookEnv("FB_APP_SECRET");
  const redirectUri = readFacebookEnv("FB_REDIRECT_URI");

  const row = pageId
    ? await prisma.facebookPageCredential.findUnique({
        where: { pageId },
        select: { accessToken: true },
      })
    : null;

  const oauthConnected = Boolean(row?.accessToken?.trim());
  const fbReady = Boolean(
    pageId && (oauthConnected || Boolean(envTok.trim()))
  );
  const pageIdSuffix =
    pageId.length > 4 ? pageId.slice(-4) : pageId || null;

  const tokenSource: "database" | "env" | null = oauthConnected
    ? "database"
    : envTok.trim()
      ? "env"
      : null;

  const canStartOAuth = Boolean(appId && appSecret && redirectUri && pageId);

  return NextResponse.json({
    fbReady,
    pageIdSuffix,
    oauthConnected,
    canStartOAuth,
    tokenSource,
  });
}
