import { Client, Environment } from "square";
import crypto from "crypto";

let _client: Client | null = null;

export function getSquareClient(): Client {
  if (_client) return _client;

  const accessToken = process.env.SQUARE_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    throw new Error(
      "SQUARE_ACCESS_TOKEN not set. Add your production access token to .env.local",
    );
  }

  const env =
    process.env.SQUARE_ENVIRONMENT === "sandbox"
      ? Environment.Sandbox
      : Environment.Production;

  _client = new Client({ accessToken, environment: env });
  return _client;
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

export type CheckoutProduct = {
  slug: string;
  title: string;
  priceCents: number;
  templateCount: number;
};

/**
 * Create a Square hosted checkout payment link.
 * Returns the checkout URL for redirect.
 */
export async function createCheckoutLink(
  product: CheckoutProduct,
  redirectUrl: string,
): Promise<{ url: string; paymentLinkId: string }> {
  const client = getSquareClient();
  const locationId = getLocationId();

  const response = await client.checkoutApi.createPaymentLink({
    idempotencyKey: crypto.randomUUID(),
    quickPay: {
      name: product.title,
      priceMoney: {
        amount: BigInt(product.priceCents),
        currency: "USD",
      },
      locationId,
    },
    checkoutOptions: {
      redirectUrl,
      askForShippingAddress: false,
    },
    paymentNote: `npa:${product.slug}`,
  });

  const link = response.result.paymentLink;
  if (!link?.url || !link.id) {
    throw new Error(
      `Square createPaymentLink failed: ${JSON.stringify(response.result.errors || "no link returned")}`,
    );
  }

  return { url: link.url, paymentLinkId: link.id };
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
