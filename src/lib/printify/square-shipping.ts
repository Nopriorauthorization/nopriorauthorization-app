import type { PrintifyShippingAddressInput } from "@/lib/printify/submit-order";

export function trySquarePaymentBuyerName(
  payment: Record<string, unknown>,
): string | null {
  const ba = payment.billing_address as Record<string, unknown> | undefined;
  if (!ba) return null;
  const first = String(ba.first_name || ba.given_name || "").trim();
  const last = String(ba.last_name || ba.family_name || "").trim();
  if (first && last) return `${first} ${last}`;
  if (first) return first;
  if (last) return last;
  return null;
}

/**
 * Best-effort: Square `payment` objects usually do not include a full shipping
 * payload unless checkout collected it. When absent, Printify submission is skipped
 * until you wire Square Orders API or store address at checkout.
 */
export function tryParseSquarePaymentShipping(
  payment: Record<string, unknown>,
  fallbackEmail: string,
  fallbackName?: string | null,
): PrintifyShippingAddressInput | null {
  const ship = payment.shipping_address as Record<string, unknown> | undefined;
  if (!ship || typeof ship !== "object") {
    return null;
  }

  const line1 =
    String(ship.address_line_1 || ship.address_line1 || ship.line1 || "").trim();
  const city = String(ship.locality || ship.city || "").trim();
  const zip = String(ship.postal_code || ship.zip || "").trim();
  const country = String(ship.country || ship.country_code || "").trim();
  if (!line1 || !city || !zip || !country) {
    return null;
  }

  const region = String(
    ship.administrative_district_level_1 || ship.state || ship.region || "",
  ).trim();
  const address2 = String(
    ship.address_line_2 || ship.address_line2 || ship.line2 || "",
  ).trim();

  const first = String(ship.first_name || ship.given_name || "").trim();
  const last = String(ship.last_name || ship.family_name || "").trim();

  return {
    firstName: first || undefined,
    lastName: last || undefined,
    email: fallbackEmail,
    phone: ship.phone_number ? String(ship.phone_number) : undefined,
    country,
    region: region || undefined,
    address1: line1,
    address2: address2 || undefined,
    city,
    zip,
  };
}
