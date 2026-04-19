import crypto from "crypto";
import { buildSquarePaymentNote } from "@/lib/square/payment-note";

const SQUARE_BASE = "https://connect.squareup.com/v2";

function getAccessToken(): string {
  const token = process.env.SQUARE_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "SQUARE_ACCESS_TOKEN not set. Add your production access token to .env.local",
    );
  }
  return token;
}

function getLocationId(): string {
  const id = process.env.SQUARE_LOCATION_ID?.trim();
  if (!id) {
    throw new Error(
      "SQUARE_LOCATION_ID not set. Find it at Square Dashboard > Account & Settings > Locations",
    );
  }
  return id;
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${getAccessToken()}`,
    "Content-Type": "application/json",
    "Square-Version": "2026-01-22",
  };
}

export type CheckoutProduct = {
  slug: string;
  title: string;
  priceCents: number;
  templateCount: number;
};

/**
 * Create a Square hosted checkout payment link via REST API.
 */
export async function createCheckoutLink(
  product: CheckoutProduct,
  redirectUrl: string,
  opts?: { requiresShipping?: boolean },
): Promise<{ url: string; paymentLinkId: string }> {
  const locationId = getLocationId();

  const checkoutOptions: Record<string, unknown> = { redirect_url: redirectUrl };
  if (opts?.requiresShipping) {
    checkoutOptions.ask_for_shipping_address = true;
  }

  const res = await fetch(`${SQUARE_BASE}/online-checkout/payment-links`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      idempotency_key: crypto.randomUUID(),
      quick_pay: {
        name: product.title,
        price_money: {
          amount: product.priceCents,
          currency: "USD",
        },
        location_id: locationId,
      },
      checkout_options: checkoutOptions,
      payment_note: buildSquarePaymentNote([product.slug]),
    }),
  });

  const json = (await res.json()) as {
    payment_link?: { url?: string; id?: string };
    errors?: Array<{ code?: string; detail?: string }>;
  };

  if (!res.ok || !json.payment_link?.url) {
    const errMsg = json.errors
      ? json.errors.map((e) => `${e.code}: ${e.detail}`).join("; ")
      : `HTTP ${res.status}`;
    console.error("[square] createCheckoutLink failed:", errMsg);
    throw new Error(`Square checkout failed: ${errMsg}`);
  }

  return {
    url: json.payment_link.url,
    paymentLinkId: json.payment_link.id || "",
  };
}

/**
 * Single Square quick-pay link for main product + optional bumps (one charge, combined total).
 */
export async function createCheckoutLinkBundle(
  items: CheckoutProduct[],
  redirectUrl: string,
  opts?: { requiresShipping?: boolean },
): Promise<{ url: string; paymentLinkId: string }> {
  if (items.length === 0) {
    throw new Error("createCheckoutLinkBundle: at least one item required");
  }
  if (items.length === 1) {
    return createCheckoutLink(items[0]!, redirectUrl, opts);
  }

  const locationId = getLocationId();
  const totalCents = items.reduce((acc, i) => acc + i.priceCents, 0);
  const primary = items[0]!;
  const extra = items.length - 1;
  const name =
    extra === 1
      ? `${primary.title} + 1 add-on`
      : `${primary.title} + ${extra} add-ons`;

  const checkoutOptions: Record<string, unknown> = { redirect_url: redirectUrl };
  if (opts?.requiresShipping) {
    checkoutOptions.ask_for_shipping_address = true;
  }

  const res = await fetch(`${SQUARE_BASE}/online-checkout/payment-links`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      idempotency_key: crypto.randomUUID(),
      quick_pay: {
        name,
        price_money: {
          amount: totalCents,
          currency: "USD",
        },
        location_id: locationId,
      },
      checkout_options: checkoutOptions,
      payment_note: buildSquarePaymentNote(items.map((i) => i.slug)),
    }),
  });

  const json = (await res.json()) as {
    payment_link?: { url?: string; id?: string };
    errors?: Array<{ code?: string; detail?: string }>;
  };

  if (!res.ok || !json.payment_link?.url) {
    const errMsg = json.errors
      ? json.errors.map((e) => `${e.code}: ${e.detail}`).join("; ")
      : `HTTP ${res.status}`;
    console.error("[square] createCheckoutLinkBundle failed:", errMsg);
    throw new Error(`Square checkout failed: ${errMsg}`);
  }

  return {
    url: json.payment_link.url,
    paymentLinkId: json.payment_link.id || "",
  };
}

/**
 * Verify Square webhook signature (HMAC-SHA256).
 */
export function verifySquareWebhook(
  body: string,
  signature: string,
  signatureKey: string,
  notificationUrl: string,
): boolean {
  const combined = notificationUrl + body;
  const expected = crypto
    .createHmac("sha256", signatureKey)
    .update(combined)
    .digest("base64");
  return signature === expected;
}
