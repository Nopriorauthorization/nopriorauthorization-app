export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { readFacebookEnv } from "@/lib/facebook/post-to-page";

/**
 * GET — whether Facebook posting env is present (no secrets returned).
 * Lets the client re-check after you add .env.local and restart `npm run dev`.
 */
export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const pageId = readFacebookEnv("FB_PAGE_ID");
  const token = readFacebookEnv("FB_PAGE_ACCESS_TOKEN");
  const fbReady = Boolean(pageId && token);
  const pageIdSuffix =
    pageId.length > 4 ? pageId.slice(-4) : pageId || null;

  return NextResponse.json({ fbReady, pageIdSuffix });
}
