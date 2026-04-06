import crypto from "crypto";

const SQUARE_BASE = "https://connect.squareup.com/v2";

function apiHeaders(): Record<string, string> {
  const token = process.env.SQUARE_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new Error("SQUARE_ACCESS_TOKEN not set");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Square-Version": "2024-01-18",
  };
}

function getLocationId(): string {
  const id = process.env.SQUARE_LOCATION_ID?.trim();
  if (!id) {
    throw new Error("SQUARE_LOCATION_ID not set");
  }
  return id;
}

export type SquarePaymentCardContext = {
  customerId: string | null;
  cardId: string | null;
  sourceType: string | null;
};

/**
 * Read customer + saved card id from a completed payment (for card-on-file upsell).
 * WALLET / BNPL may not expose a reusable card id — caller should fall back to hosted checkout.
 */
export async function retrieveSquarePaymentCardContext(
  paymentId: string,
): Promise<SquarePaymentCardContext> {
  const res = await fetch(`${SQUARE_BASE}/payments/${encodeURIComponent(paymentId)}`, {
    headers: apiHeaders(),
  });
  const json = (await res.json()) as {
    payment?: {
      customer_id?: string;
      source_type?: string;
      card_details?: { card?: { id?: string } };
    };
    errors?: Array<{ detail?: string }>;
  };

  if (!res.ok || !json.payment) {
    console.warn("[square/payments-api] retrieve payment failed:", json.errors);
    return { customerId: null, cardId: null, sourceType: null };
  }

  const p = json.payment;
  const customerId = p.customer_id ? String(p.customer_id) : null;
  const sourceType = p.source_type ? String(p.source_type) : null;
  let cardId = p.card_details?.card?.id ? String(p.card_details.card.id) : null;

  if (customerId && !cardId && sourceType === "CARD") {
    cardId = await listFirstEnabledCustomerCardId(customerId);
  }

  return { customerId, cardId, sourceType };
}

async function listFirstEnabledCustomerCardId(customerId: string): Promise<string | null> {
  const url = new URL(`${SQUARE_BASE}/cards`);
  url.searchParams.set("customer_id", customerId);
  const res = await fetch(url.toString(), { headers: apiHeaders() });
  const json = (await res.json()) as {
    cards?: Array<{ id?: string; enabled?: boolean }>;
  };
  const card = json.cards?.find((c) => c.id && c.enabled !== false);
  return card?.id ? String(card.id) : null;
}

export async function createSquareCardOnFilePayment(opts: {
  cardId: string;
  customerId?: string | null;
  amountCents: number;
  note: string;
  idempotencyKey: string;
}): Promise<{ paymentId: string } | { error: string }> {
  const locationId = getLocationId();
  const sourceId = opts.cardId.startsWith("ccof:") ? opts.cardId : `ccof:${opts.cardId}`;

  const body: Record<string, unknown> = {
    idempotency_key: opts.idempotencyKey,
    source_id: sourceId,
    amount_money: { amount: opts.amountCents, currency: "USD" },
    location_id: locationId,
    note: opts.note,
    autocomplete: true,
  };
  if (opts.customerId) {
    body.customer_id = opts.customerId;
  }

  const res = await fetch(`${SQUARE_BASE}/payments`, {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as {
    payment?: { id?: string };
    errors?: Array<{ code?: string; detail?: string }>;
  };

  if (!res.ok || !json.payment?.id) {
    const errMsg = json.errors
      ? json.errors.map((e) => `${e.code}: ${e.detail}`).join("; ")
      : `HTTP ${res.status}`;
    return { error: errMsg };
  }

  return { paymentId: json.payment.id };
}

export function upsellChargeIdempotencyKey(postCheckoutToken: string, upsellSlug: string): string {
  const raw = `upsell|${postCheckoutToken}|${upsellSlug}`;
  return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 45);
}
