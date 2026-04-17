/**
 * GET /api/anatomy-study/activate?token=<deliveryToken>
 * Sets anatomy full-access cookie after verified purchase, then redirects to hub.
 */
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyDeliveryToken } from "@/lib/delivery/token";
import {
  ANATOMY_STUDY_FULL_COOKIE,
  ANATOMY_STUDY_FULL_COOKIE_VALUE,
  isAnatomyStudyProductSlug,
} from "@/config/anatomy-study.config";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token required" }, { status: 400 });
  }

  const grant = verifyDeliveryToken(token);
  if (!grant) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  if (!isAnatomyStudyProductSlug(grant.productSlug)) {
    return NextResponse.json({ error: "Not an Anatomy study product" }, { status: 400 });
  }

  const res = NextResponse.redirect(new URL("/nursing-study/anatomy/hub", req.url));
  res.cookies.set(ANATOMY_STUDY_FULL_COOKIE, ANATOMY_STUDY_FULL_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
