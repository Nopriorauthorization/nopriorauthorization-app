export const dynamic = "force-dynamic";

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { readFacebookEnv } from "@/lib/facebook/env";

const FB_SCOPES =
  "pages_show_list,pages_read_engagement,pages_manage_posts,business_management";

/**
 * Starts Facebook Login for the Page configured in FB_PAGE_ID.
 * Requires FB_APP_ID, FB_REDIRECT_URI, FB_PAGE_ID (and FB_APP_SECRET on callback).
 */
function redirectSocialWithError(request: NextRequest, message: string) {
  const u = new URL("/admin/social", request.nextUrl.origin);
  u.searchParams.set("fb_error", message);
  return NextResponse.redirect(u);
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!session?.user?.id) {
    const u = new URL("/login", request.nextUrl.origin);
    u.searchParams.set("callbackUrl", "/admin/social");
    return NextResponse.redirect(u);
  }

  const appId = readFacebookEnv("FB_APP_ID");
  const redirectUri = readFacebookEnv("FB_REDIRECT_URI");
  const pageId = readFacebookEnv("FB_PAGE_ID");
  if (!appId || !redirectUri || !pageId) {
    return redirectSocialWithError(
      request,
      "Missing FB_APP_ID, FB_REDIRECT_URI, or FB_PAGE_ID in server environment. Add them in Vercel (or .env.local) then redeploy.",
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
