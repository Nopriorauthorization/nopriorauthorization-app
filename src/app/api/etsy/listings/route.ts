import { NextResponse } from "next/server";
import { fetchActiveEtsyListings } from "@/lib/etsy/fetch-shop-listings";

export const dynamic = "force-dynamic";

/**
 * GET /api/etsy/listings — JSON of active shop listings (for debugging / integrations).
 */
export async function GET() {
  const data = await fetchActiveEtsyListings();
  if (!data.ok) {
    const status =
      data.http && data.http >= 400 && data.http < 600
        ? data.http
        : /not connected|Not connected|No shop ID|not configured/i.test(data.error)
          ? 401
          : 503;
    return NextResponse.json({ ok: false, error: data.error, http: data.http }, { status });
  }
  return NextResponse.json({ ok: true, count: data.count, listings: data.listings });
}
