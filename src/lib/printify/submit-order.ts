import { PrintifyClient } from "@/lib/printify/client";
import {
  getPrintifyInventoryLine,
  getPrintifyRowForSku,
} from "@/lib/printify/products";

export type PrintifyShippingAddressInput = {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  country: string;
  region?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
};

function splitName(full: string): { firstName: string; lastName: string } {
  const t = full.trim();
  const i = t.indexOf(" ");
  if (i === -1) {
    return { firstName: t || "Customer", lastName: "." };
  }
  return {
    firstName: t.slice(0, i).trim() || "Customer",
    lastName: t.slice(i + 1).trim() || ".",
  };
}

export function buildPrintifyAddressTo(
  shipping: PrintifyShippingAddressInput,
  customerName?: string | null,
) {
  let firstName = shipping.firstName?.trim();
  let lastName = shipping.lastName?.trim();
  if ((!firstName || !lastName) && customerName) {
    const s = splitName(customerName);
    firstName = firstName || s.firstName;
    lastName = lastName || s.lastName;
  }
  return {
    first_name: firstName || "Customer",
    last_name: lastName || "N/A",
    email: shipping.email,
    phone: (shipping.phone && shipping.phone.trim()) || "0000000000",
    country: shipping.country,
    region: (shipping.region && shipping.region.trim()) || "",
    address1: shipping.address1,
    address2: (shipping.address2 && shipping.address2.trim()) || "",
    city: shipping.city,
    zip: shipping.zip,
  };
}

export async function submitPrintifyOrderForSku(opts: {
  sku: string;
  quantity: number;
  shipping: PrintifyShippingAddressInput;
  externalId: string;
  label?: string;
  customerName?: string | null;
}): Promise<
  | { ok: true; printifyOrderId: string; raw: unknown }
  | { ok: false; message: string; status?: number }
> {
  const invLines = getPrintifyInventoryLine(opts.sku);
  if (!invLines || invLines.length === 0) {
    return {
      ok: false,
      message:
        "Missing PRINTIFY_INVENTORY_JSON for this SKU (needs productId + variantId).",
    };
  }

  // For single-item SKUs, validate blueprint row exists; for bundles skip that check.
  const row = getPrintifyRowForSku(opts.sku);
  const label = opts.label || row?.title || opts.sku;

  let client: PrintifyClient;
  try {
    client = new PrintifyClient();
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }

  const qty = Math.min(Math.max(Math.floor(opts.quantity), 1), 99);
  const line_items = invLines.map((inv) => ({
    product_id: inv.productId,
    variant_id: inv.variantId,
    quantity: qty,
  }));

  const payload = {
    external_id: opts.externalId,
    label,
    line_items,
    shipping_method: 1,
    send_shipping_notification: true,
    is_printify_express: false,
    address_to: buildPrintifyAddressTo(opts.shipping, opts.customerName),
  };

  const res = await client.submitOrder(payload);
  if (!res.ok) {
    return { ok: false, message: res.text, status: res.status };
  }
  const data = res.data as { id?: string };
  const id = data?.id;
  if (!id) {
    return { ok: false, message: "Printify returned no order id." };
  }
  return { ok: true, printifyOrderId: String(id), raw: res.data };
}
