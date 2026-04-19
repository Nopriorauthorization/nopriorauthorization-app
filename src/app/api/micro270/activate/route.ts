/**
 * GET /api/micro270/activate?token=<deliveryToken>
 *
 * Sets hub cookies from a valid delivery token (Square purchase).
 * Cheat-sheet tier only unlocks /micro270/cheat-sheets/*.html; bank tiers unlock full hub.
 */
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyDeliveryToken } from "@/lib/delivery/token";
import {
  MICRO270_BANK_COOKIE,
  MICRO270_BANK_COOKIE_VALUE,
  MICRO270_CHEATS_COOKIE,
  MICRO270_CHEATS_COOKIE_VALUE,
  MICRO270_TIER_COOKIE,
  MICRO270_TIER_BUNDLE,
  MICRO270_TIER_FULL,
} from "@/config/micro270-sales.config";
import {
  MICRO270_SHOP_SLUG_BUNDLE,
  MICRO270_SHOP_SLUG_CHEATS,
  MICRO270_SHOP_SLUG_FLAGSHIP,
  MICRO270_SHOP_SLUG_FULL,
} from "@/config/micro270-shop.config";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function tierForSlug(slug: string): string | null {
  if (slug === MICRO270_SHOP_SLUG_FULL || slug === MICRO270_SHOP_SLUG_FLAGSHIP) {
    return MICRO270_TIER_FULL;
  }
  if (slug === MICRO270_SHOP_SLUG_BUNDLE) return MICRO270_TIER_BUNDLE;
  return null;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token required" }, { status: 400 });
  }

  const grant = verifyDeliveryToken(token);
  if (!grant) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  if (!grant.productSlug.startsWith("micro270")) {
    return NextResponse.json({ error: "Not a Micro270 product" }, { status: 400 });
  }

  if (grant.productSlug === MICRO270_SHOP_SLUG_CHEATS) {
    const res = NextResponse.redirect(new URL("/micro270/cheat-sheets", req.url));
    res.cookies.set(MICRO270_CHEATS_COOKIE, MICRO270_CHEATS_COOKIE_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
    return res;
  }

  const res = NextResponse.redirect(new URL("/micro270/hub", req.url));

  res.cookies.set(MICRO270_BANK_COOKIE, MICRO270_BANK_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  const tier = tierForSlug(grant.productSlug);
  if (tier) {
    res.cookies.set(MICRO270_TIER_COOKIE, tier, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  }

  return res;
}
