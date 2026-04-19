import type { DraftListingInput, EtsyListingResult } from "./types";
import { EtsyServiceError } from "./types";

/** Open API base — same host works for most v3 routes; override with `ETSY_API_BASE` if needed. */
const DEFAULT_ETSY_BASE = "https://openapi.etsy.com/v3";

type EtsyCredentials = {
  accessToken: string;
  apiKeystring: string;
  apiSharedSecret: string;
  shopId: string;
};

/**
 * Server-side Etsy Open API v3 client (drafts, images, files, PATCH listing).
 *
 * Credentials: `ETSY_ACCESS_TOKEN`, `ETSY_API_KEYSTRING`, `ETSY_API_SHARED_SECRET`, `ETSY_SHOP_ID`
 * Optional: `ETSY_API_BASE` (default `https://openapi.etsy.com/v3`; Etsy documents `api.etsy.com` as equivalent).
 *
 * @see https://developer.etsy.com/documentation/tutorials/listings
 */
export class EtsyService {
  private creds: EtsyCredentials;
  private readonly baseUrl: string;

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
    this.baseUrl = (
      process.env.ETSY_API_BASE?.trim() || DEFAULT_ETSY_BASE
    ).replace(/\/$/, "");
  }

  private xApiKey(): string {
    return `${this.creds.apiKeystring}:${this.creds.apiSharedSecret}`;
  }

  /** JSON POST/PATCH (create listing). */
  private jsonHeaders(): Record<string, string> {
    return {
      "x-api-key": this.xApiKey(),
      Authorization: `Bearer ${this.creds.accessToken}`,
      "Content-Type": "application/json",
    };
  }

  /** Auth only (multipart — do not set Content-Type). */
  private authHeaders(): Record<string, string> {
    return {
      "x-api-key": this.xApiKey(),
      Authorization: `Bearer ${this.creds.accessToken}`,
    };
  }

  /** application/x-www-form-urlencoded PATCH (updateListing). */
  private formHeaders(): Record<string, string> {
    return {
      "x-api-key": this.xApiKey(),
      Authorization: `Bearer ${this.creds.accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
  }

  private log(msg: string) {
    const ts = new Date().toISOString().slice(11, 23);
    console.log(`[${ts}] [etsy] ${msg}`);
  }

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
   * Create a draft listing (`listings_w`). Digital: `type: "download"`, `is_digital: true`.
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

    const url = `${this.baseUrl}/application/shops/${this.creds.shopId}/listings`;
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
        headers: this.jsonHeaders(),
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
      error: JSON.stringify(json).slice(0, 800),
    };
  }

  /**
   * Upload a listing image (`listings_w`). Multipart field `image` + filename.
   * @see https://developer.etsy.com/documentation/tutorials/listings#adding-an-image-to-a-listing
   */
  async uploadListingImage(
    listingId: number,
    imageBytes: Buffer,
    filename: string,
    rank?: number,
  ): Promise<{ ok: true; raw: unknown } | { ok: false; error: string; httpStatus?: number }> {
    const url = `${this.baseUrl}/application/shops/${this.creds.shopId}/listings/${listingId}/images`;
    const form = new FormData();
    const blob = new Blob([new Uint8Array(imageBytes)]);
    form.append("image", blob, filename);
    if (rank !== undefined) form.append("rank", String(rank));

    this.log(`POST listing image listing_id=${listingId} file=${filename}`);
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: this.authHeaders(),
        body: form,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, error: `Network: ${msg}` };
    }

    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      this.log(`  OK image upload`);
      return { ok: true, raw: json };
    }
    return {
      ok: false,
      httpStatus: res.status,
      error: JSON.stringify(json).slice(0, 800),
    };
  }

  /**
   * Upload a digital listing file (`listings_w`). Multipart field `file`.
   * @see https://developer.etsy.com/documentation/tutorials/listings#listing-a-digital-product-for-sale
   */
  async uploadListingFile(
    listingId: number,
    fileBytes: Buffer,
    filename: string,
  ): Promise<{ ok: true; raw: unknown } | { ok: false; error: string; httpStatus?: number }> {
    const url = `${this.baseUrl}/application/shops/${this.creds.shopId}/listings/${listingId}/files`;
    const form = new FormData();
    const blob = new Blob([new Uint8Array(fileBytes)]);
    form.append("file", blob, filename);

    this.log(`POST listing file listing_id=${listingId} file=${filename}`);
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: this.authHeaders(),
        body: form,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, error: `Network: ${msg}` };
    }

    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      this.log(`  OK file upload`);
      return { ok: true, raw: json };
    }
    return {
      ok: false,
      httpStatus: res.status,
      error: JSON.stringify(json).slice(0, 800),
    };
  }

  /**
   * PATCH listing (partial update). Pass only fields to change, e.g. `{ type: "download" }`, `{ state: "active" }`.
   */
  async patchListing(
    listingId: number,
    fields: Record<string, string>,
  ): Promise<{ ok: true; raw: unknown } | { ok: false; error: string; httpStatus?: number }> {
    const url = `${this.baseUrl}/application/shops/${this.creds.shopId}/listings/${listingId}`;
    const body = new URLSearchParams(fields);

    this.log(`PATCH listing_id=${listingId} ${JSON.stringify(fields)}`);
    let res: Response;
    try {
      res = await fetch(url, {
        method: "PATCH",
        headers: this.formHeaders(),
        body: body.toString(),
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, error: `Network: ${msg}` };
    }

    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      this.log(`  OK patch`);
      return { ok: true, raw: json };
    }
    return {
      ok: false,
      httpStatus: res.status,
      error: JSON.stringify(json).slice(0, 800),
    };
  }

  /** GET one page of active listings — smoke test for `listings_r`. */
  async getActiveListingsPage(params?: {
    limit?: number;
    offset?: number;
  }): Promise<{ ok: true; status: number; raw: unknown } | { ok: false; error: string; httpStatus?: number }> {
    const limit = params?.limit ?? 1;
    const offset = params?.offset ?? 0;
    const url = new URL(
      `${this.baseUrl}/application/shops/${encodeURIComponent(this.creds.shopId)}/listings/active`,
    );
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));

    let res: Response;
    try {
      res = await fetch(url.toString(), {
        method: "GET",
        headers: this.authHeaders(),
      });
    } catch (e) {
      return { ok: false, error: String(e), httpStatus: undefined };
    }
    const raw = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, status: res.status, raw };
    return {
      ok: false,
      httpStatus: res.status,
      error: JSON.stringify(raw).slice(0, 500),
    };
  }
}

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
