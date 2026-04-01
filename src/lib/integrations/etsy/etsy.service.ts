import type { DraftListingInput, EtsyListingResult } from "./types";
import { EtsyServiceError } from "./types";

const ETSY_BASE = "https://openapi.etsy.com/v3";

type EtsyCredentials = {
  accessToken: string;
  apiKeystring: string;
  apiSharedSecret: string;
  shopId: string;
};

/**
 * Server-side Etsy API service for CLI / product pipeline.
 *
 * Credentials resolved from:
 * - env (ETSY_ACCESS_TOKEN, ETSY_API_KEYSTRING, ETSY_API_SHARED_SECRET, ETSY_SHOP_ID)
 * - explicit constructor args
 * - DB token via tryLoadFromDb (optional async init)
 */
export class EtsyService {
  private creds: EtsyCredentials;

  constructor(creds?: Partial<EtsyCredentials>) {
    const accessToken =
      creds?.accessToken || process.env.ETSY_ACCESS_TOKEN?.trim() || "";
    const apiKeystring =
      creds?.apiKeystring || process.env.ETSY_API_KEYSTRING?.trim() || "";
    const apiSharedSecret =
      creds?.apiSharedSecret ||
      process.env.ETSY_API_SHARED_SECRET?.trim() ||
      "";
    const shopId =
      creds?.shopId || process.env.ETSY_SHOP_ID?.trim() || "";

    const missing: string[] = [];
    if (!accessToken) missing.push("ETSY_ACCESS_TOKEN");
    if (!apiKeystring) missing.push("ETSY_API_KEYSTRING");
    if (!apiSharedSecret) missing.push("ETSY_API_SHARED_SECRET");
    if (!shopId) missing.push("ETSY_SHOP_ID");

    if (missing.length) {
      throw new EtsyServiceError(
        `Missing Etsy credentials: ${missing.join(", ")}. Set in .env.local or pass to constructor.`,
      );
    }

    this.creds = {
      accessToken,
      apiKeystring,
      apiSharedSecret,
      shopId,
    };
  }

  private headers(): Record<string, string> {
    return {
      "x-api-key": `${this.creds.apiKeystring}:${this.creds.apiSharedSecret}`,
      Authorization: `Bearer ${this.creds.accessToken}`,
      "Content-Type": "application/json",
    };
  }

  private log(msg: string) {
    const ts = new Date().toISOString().slice(11, 23);
    console.log(`[${ts}] [etsy] ${msg}`);
  }

  /**
   * Validate listing input before API call.
   */
  validateListingInput(input: DraftListingInput): string[] {
    const errors: string[] = [];
    if (!input.title?.trim()) errors.push("title is required");
    if (input.title && input.title.length > 140)
      errors.push(`title too long (${input.title.length}/140)`);
    if (!input.description?.trim()) errors.push("description is required");
    if (input.price <= 0) errors.push("price must be > 0");
    if (input.quantity < 1) errors.push("quantity must be >= 1");
    if (!input.tags?.length) errors.push("tags are required");
    if (input.tags?.length > 13)
      errors.push(`too many tags (${input.tags.length}/13)`);
    if (!input.taxonomyId) errors.push("taxonomyId is required");
    return errors;
  }

  /**
   * Create a draft listing on the connected Etsy shop.
   */
  async createDraftListing(
    input: DraftListingInput,
  ): Promise<EtsyListingResult> {
    const validation = this.validateListingInput(input);
    if (validation.length) {
      return {
        ok: false,
        error: `Validation failed: ${validation.join("; ")}`,
      };
    }

    const url = `${ETSY_BASE}/application/shops/${this.creds.shopId}/listings`;
    const body = {
      quantity: input.quantity,
      title: input.title,
      description: input.description,
      price: input.price,
      who_made: input.whoMade || "i_did",
      when_made: input.whenMade || "made_to_order",
      taxonomy_id: input.taxonomyId,
      type: "download",
      is_digital: input.isDigital,
      tags: input.tags,
      state: "draft",
    };

    this.log(`POST draft listing "${input.title.slice(0, 50)}…"`);
    const start = Date.now();

    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify(body),
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this.log(`  FAILED (network): ${msg}`);
      return { ok: false, error: `Network error: ${msg}` };
    }

    const dur = Date.now() - start;
    const json = (await res.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    if (res.ok && json.listing_id) {
      const listingId = json.listing_id as number;
      this.log(
        `  OK listing_id=${listingId} state=${json.state} (${dur}ms)`,
      );
      return {
        ok: true,
        listingId,
        state: (json.state as string) || "draft",
        url: `https://www.etsy.com/listing/${listingId}`,
      };
    }

    this.log(`  FAILED HTTP ${res.status} (${dur}ms)`);
    return {
      ok: false,
      httpStatus: res.status,
      error: JSON.stringify(json).slice(0, 300),
    };
  }
}

/**
 * Helper to attempt loading credentials from DB if env vars are missing.
 * Useful in scripts that run outside the Next.js server.
 */
export async function tryLoadEtsyCredsFromDb(): Promise<
  Partial<{ accessToken: string; shopId: string }> | null
> {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return null;

    const { default: pg } = await import("pg");
    const client = new pg.Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    const result = await client.query(
      `SELECT metadata FROM "Analytics" WHERE event = 'etsy_oauth_token' ORDER BY "createdAt" DESC LIMIT 1`,
    );
    await client.end();

    if (result.rows.length && result.rows[0].metadata) {
      const meta = result.rows[0].metadata as Record<string, unknown>;
      return {
        accessToken: (meta.accessToken as string) || undefined,
        shopId: (meta.shopId as string) || undefined,
      };
    }
  } catch {
    // silently skip DB in non-server contexts
  }
  return null;
}
