import { formatXApiKey, getEtsyEnv } from "@/lib/etsy/oauth";
import { getEtsyTokens } from "@/lib/etsy/tokens";

const BASE = "https://openapi.etsy.com/v3";

export type EtsyListingCard = {
  listingId: number;
  title: string;
  url: string;
  priceDisplay: string;
  currencyCode: string;
  imageUrl: string | null;
};

function formatPriceFromListing(row: Record<string, unknown>): string {
  const price = row.price as Record<string, unknown> | undefined;
  if (!price) return "";
  const amount = Number(price.amount);
  const divisor = Number(price.divisor) || 100;
  const cur = String(price.currency_code || "USD");
  if (!Number.isFinite(amount)) return "";
  const n = amount / divisor;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(n);
  } catch {
    return `${cur} ${n.toFixed(2)}`;
  }
}

function pickImage(row: Record<string, unknown>): string | null {
  const images =
    (row.images as unknown[]) ||
    (row.Images as unknown[]) ||
    (row.images_results as unknown[]);
  if (!Array.isArray(images) || !images.length) return null;
  const first = images[0];
  if (!first || typeof first !== "object") return null;
  const img = first as Record<string, unknown>;
  return (
    (img.url_570xN as string) ||
    (img.url_750xN as string) ||
    (img.url_fullxfull as string) ||
    (img.url_170x135 as string) ||
    null
  );
}

/**
 * Active listings for the connected shop (Open API v3).
 * Requires OAuth token in DB + ETSY_SHOP_ID (or shopId on token metadata) + listings_r scope.
 */
export async function fetchActiveEtsyListings(): Promise<
  | { ok: true; count: number; listings: EtsyListingCard[] }
  | { ok: false; error: string; http?: number }
> {
  const cfg = getEtsyEnv();
  if (!cfg) {
    return {
      ok: false,
      error:
        "Etsy API is not configured. Add ETSY_API_KEYSTRING, ETSY_API_SHARED_SECRET, and ETSY_OAUTH_REDIRECT_URI to the server environment.",
    };
  }

  const tokens = await getEtsyTokens();
  if (!tokens?.accessToken) {
    return {
      ok: false,
      error:
        "Etsy is not connected yet. Visit /api/etsy/auth on this site while logged into Etsy, approve access, then reload this page.",
    };
  }

  const shopId = (tokens.shopId || process.env.ETSY_SHOP_ID || "").trim();
  if (!shopId) {
    return {
      ok: false,
      error:
        "No shop ID. Set ETSY_SHOP_ID in Vercel (numeric shop id from Etsy, or the id shown after OAuth). Try GET /api/etsy/shops when connected to confirm.",
    };
  }

  const headers: Record<string, string> = {
    "x-api-key": formatXApiKey(cfg.clientId, cfg.sharedSecret),
    Authorization: `Bearer ${tokens.accessToken}`,
  };

  const tryFetch = async (withImages: boolean) => {
    const url = new URL(`${BASE}/application/shops/${encodeURIComponent(shopId)}/listings/active`);
    url.searchParams.set("limit", "100");
    url.searchParams.set("offset", "0");
    if (withImages) url.searchParams.set("includes", "Images");
    const res = await fetch(url.toString(), { method: "GET", headers, cache: "no-store" });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { res, json };
  };

  let { res, json } = await tryFetch(true);
  if (!res.ok && res.status === 400) {
    ({ res, json } = await tryFetch(false));
  }

  if (!res.ok) {
    const msg =
      typeof json.error === "string"
        ? json.error
        : typeof json.message === "string"
          ? json.message
          : JSON.stringify(json).slice(0, 400);
    return {
      ok: false,
      http: res.status,
      error: `Etsy returned ${res.status}: ${msg}`,
    };
  }

  const results = json.results as unknown[] | undefined;
  if (!Array.isArray(results)) {
    return { ok: false, error: "Unexpected Etsy response (missing results array)." };
  }

  const listings: EtsyListingCard[] = [];
  for (const raw of results) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    const listingId = Number(row.listing_id);
    if (!Number.isFinite(listingId)) continue;
    const title = String(row.title || "").trim() || "Untitled listing";
    listings.push({
      listingId,
      title,
      url: `https://www.etsy.com/listing/${listingId}`,
      priceDisplay: formatPriceFromListing(row),
      currencyCode: String((row.price as Record<string, unknown> | undefined)?.currency_code || "USD"),
      imageUrl: pickImage(row),
    });
  }

  return { ok: true, count: listings.length, listings };
}
