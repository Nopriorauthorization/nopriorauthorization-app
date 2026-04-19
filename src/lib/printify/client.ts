/**
 * Printify REST API v1 client.
 * @see https://developers.printify.com/
 */
const PRINTIFY_BASE = "https://api.printify.com/v1";

export type PrintifyClientConfig = {
  apiToken: string;
  shopId: string;
};

export class PrintifyClient {
  private readonly token: string;
  private readonly shopId: string;

  constructor(cfg?: Partial<PrintifyClientConfig>) {
    const apiToken =
      cfg?.apiToken || process.env.PRINTIFY_API_TOKEN?.trim() || "";
    const shopId =
      cfg?.shopId ||
      process.env.PRINTIFY_SHOP_ID?.trim() ||
      String(process.env.PRINTIFY_SHOP_ID || "").trim();
    if (!apiToken) {
      throw new Error("Missing PRINTIFY_API_TOKEN");
    }
    if (!shopId) {
      throw new Error("Missing PRINTIFY_SHOP_ID");
    }
    this.token = apiToken;
    this.shopId = shopId;
  }

  getShopId(): string {
    return this.shopId;
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      "User-Agent": "NPA-Printify-Integration (nopriorauthorization.com)",
    };
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<{ ok: true; data: T; status: number } | { ok: false; status: number; text: string }> {
    const url = `${PRINTIFY_BASE}${path.startsWith("/") ? path : `/${path}`}`;
    const res = await fetch(url, {
      method,
      headers: this.headers(),
      ...(body !== undefined && method !== "GET"
        ? { body: JSON.stringify(body) }
        : {}),
    });
    const text = await res.text();
    let data: T;
    try {
      data = (text ? JSON.parse(text) : {}) as T;
    } catch {
      return { ok: false, status: res.status, text: text.slice(0, 500) };
    }
    if (!res.ok) {
      return { ok: false, status: res.status, text: JSON.stringify(data).slice(0, 800) };
    }
    return { ok: true, data, status: res.status };
  }

  async getShops(): Promise<
    { ok: true; data: unknown } | { ok: false; status: number; text: string }
  > {
    const r = await this.request<unknown>("GET", "/shops.json");
    if (!r.ok) return r;
    return { ok: true, data: r.data };
  }

  async getBlueprint(blueprintId: number) {
    return this.request<unknown>(
      "GET",
      `/catalog/blueprints/${blueprintId}.json`,
    );
  }

  async getBlueprintPrintProviders(blueprintId: number) {
    return this.request<unknown>(
      "GET",
      `/catalog/blueprints/${blueprintId}/print_providers.json`,
    );
  }

  /** Alias for catalog print providers (same as `getBlueprintPrintProviders`). */
  getBlueprintProviders(blueprintId: number) {
    return this.getBlueprintPrintProviders(blueprintId);
  }

  async createProduct(payload: unknown) {
    return this.request<unknown>(
      "POST",
      `/shops/${this.shopId}/products.json`,
      payload,
    );
  }

  async submitOrder(payload: unknown) {
    return this.request<unknown>(
      "POST",
      `/shops/${this.shopId}/orders.json`,
      payload,
    );
  }

  async getOrder(orderId: string) {
    return this.request<unknown>(
      "GET",
      `/shops/${this.shopId}/orders/${encodeURIComponent(orderId)}.json`,
    );
  }
}

export function getPrintifyClientOrNull(): PrintifyClient | null {
  try {
    return new PrintifyClient();
  } catch {
    return null;
  }
}
