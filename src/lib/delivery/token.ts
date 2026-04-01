import { createHmac, timingSafeEqual } from "crypto";

type DeliveryTokenPayload = {
  productSlug: string;
  buyerEmail: string;
  orderRef?: string;
  issuedAt: number;
  expiresAt: number;
};

export type DeliveryGrant = {
  productSlug: string;
  buyerEmail: string;
  orderRef?: string;
  issuedAt: number;
  expiresAt: number;
};

function base64UrlEncode(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input: string): string {
  const pad = input.length % 4 ? "=".repeat(4 - (input.length % 4)) : "";
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(normalized, "base64").toString("utf8");
}

function getDeliverySecret(): string {
  const secret =
    process.env.DELIVERY_TOKEN_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim();

  if (!secret) {
    throw new Error(
      "Missing DELIVERY_TOKEN_SECRET or NEXTAUTH_SECRET for delivery links."
    );
  }

  return secret;
}

function sign(input: string): string {
  return base64UrlEncode(
    createHmac("sha256", getDeliverySecret()).update(input).digest()
  );
}

export function issueDeliveryToken(input: {
  productSlug: string;
  buyerEmail: string;
  orderRef?: string;
  expiresInDays?: number;
}): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + (input.expiresInDays ?? 30) * 24 * 60 * 60;

  const payload: DeliveryTokenPayload = {
    productSlug: input.productSlug,
    buyerEmail: input.buyerEmail,
    orderRef: input.orderRef,
    issuedAt,
    expiresAt,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyDeliveryToken(token: string): DeliveryGrant | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let payload: DeliveryTokenPayload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload));
  } catch {
    return null;
  }

  if (
    !payload.productSlug ||
    !payload.buyerEmail ||
    !payload.issuedAt ||
    !payload.expiresAt
  ) {
    return null;
  }

  if (payload.expiresAt < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0] || "*"}*@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}
