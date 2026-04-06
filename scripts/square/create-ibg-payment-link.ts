/**
 * Create a Square hosted checkout link for The Informed Beauty Guide ($49).
 * Same API path as production checkout; redirect matches live post-purchase flow.
 *
 * Requires: SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID in .env.local
 *
 * Usage: npx tsx scripts/square/create-ibg-payment-link.ts
 *        PAYMENT_LINK_ORIGIN=https://nopriorauthorization.com npx tsx ...
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

import { NPA_SITE_URL } from "../../src/config/npa-brand.config";
import {
  INFORMED_BEAUTY_GUIDE_SLUG,
  INFORMED_BEAUTY_PRICE_CENTS,
  INFORMED_BEAUTY_TITLE,
} from "../../src/config/informed-beauty-guide.config";
import { createCheckoutLink } from "../../src/lib/square/client";

async function main() {
  const origin = (process.env.PAYMENT_LINK_ORIGIN || NPA_SITE_URL).replace(/\/$/, "");
  const redirectUrl = `${origin}/shop/post-purchase?p=${encodeURIComponent(INFORMED_BEAUTY_GUIDE_SLUG)}`;

  const { url, paymentLinkId } = await createCheckoutLink(
    {
      slug: INFORMED_BEAUTY_GUIDE_SLUG,
      title: INFORMED_BEAUTY_TITLE,
      priceCents: INFORMED_BEAUTY_PRICE_CENTS,
      templateCount: 1,
    },
    redirectUrl,
  );

  console.log("\nInformed Beauty Guide — Square payment link\n");
  console.log(url);
  console.log("\npayment_link id:", paymentLinkId);
  console.log("redirect after pay:", redirectUrl);
  console.log("\nShare the first URL. After payment, buyers land on post-purchase (delivery via your webhook flow).\n");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
