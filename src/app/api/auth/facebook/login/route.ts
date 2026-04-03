export const dynamic = "force-dynamic";

import crypto from "crypto";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { readFacebookEnv } from "@/lib/facebook/env";

const FB_SCOPES =
  "pages_show_list,pages_read_engagement,pages_manage_posts,business_management";

/**
 * Starts Facebook Login for the Page configured in FB_PAGE_ID.
 * Requires FB_APP_ID, FB_REDIRECT_URI, FB_PAGE_ID (and FB_APP_SECRET on callback).
 */
export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const appId = readFacebookEnv("FB_APP_ID");
  const redirectUri = readFacebookEnv("FB_REDIRECT_URI");
  const pageId = readFacebookEnv("FB_PAGE_ID");
  if (!appId || !redirectUri || !pageId) {
    return NextResponse.json(
      {
        error:
          "Missing FB_APP_ID, FB_REDIRECT_URI, or FB_PAGE_ID in environment.",
      },
      { status: 500 }
    );
  }

  const state = crypto.randomBytes(24).toString("hex");
  const auth = new URL("https://www.facebook.com/v21.0/dialog/oauth");
  auth.searchParams.set("client_id", appId);
  auth.searchParams.set("redirect_uri", redirectUri);
  auth.searchParams.set("scope", FB_SCOPES);
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("state", state);

  const res = NextResponse.redirect(auth.toString());
  res.cookies.set("fb_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
