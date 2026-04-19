/**
 * Verify Etsy OAuth token can read (`listings_r`) and create a draft (`listings_w`).
 *
 * Run locally after OAuth works (ETSY_ACCESS_TOKEN + shop + key + secret).
 *
 * Usage: pnpm etsy:verify-write
 *
 * Creates a disposable draft titled "NPA API write test …" — delete it in Shop Manager if you do not need it.
 */
import { loadEnvLocal } from "../products/load-env";
import {
  EtsyService,
  tryLoadEtsyCredsFromDb,
} from "@/lib/integrations/etsy/etsy.service";

loadEnvLocal();

async function main() {
  const db = await tryLoadEtsyCredsFromDb();
  if (db?.accessToken && !process.env.ETSY_ACCESS_TOKEN) {
    process.env.ETSY_ACCESS_TOKEN = db.accessToken;
    console.log("Loaded ETSY_ACCESS_TOKEN from database\n");
  }
  if (db?.shopId && !process.env.ETSY_SHOP_ID) {
    process.env.ETSY_SHOP_ID = db.shopId;
    console.log("Loaded ETSY_SHOP_ID from database\n");
  }

  let etsy: EtsyService;
  try {
    etsy = new EtsyService();
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  }

  console.log("1) listings_r — GET active listings (limit 1)…");
  const read = await etsy.getActiveListingsPage({ limit: 1, offset: 0 });
  if (!read.ok) {
    console.error("   FAIL:", read.error);
    console.error(
      "\nToken may be missing, expired, or lack listings_r. Reconnect OAuth.",
    );
    process.exit(2);
  }
  console.log("   OK (read access)\n");

  const taxonomy = Number(process.env.ETSY_VERIFY_TAXONOMY_ID || "2078");
  const title = `NPA API write test ${new Date().toISOString().slice(0, 19)}`;
  const desc =
    "Automated connectivity test from No Prior Authorization repo. DELETE this draft in Etsy Shop Manager.";

  console.log("2) listings_w — POST createDraftListing…");
  const write = await etsy.createDraftListing({
    title,
    description: desc,
    price: 1,
    quantity: 1,
    tags: ["connectivity test", "digital download"],
    taxonomyId: taxonomy,
    isDigital: true,
  });

  if (!write.ok || !write.listingId) {
    console.error("   FAIL:", write.error);
    console.error(
      "\nIf HTTP 403, the token likely lacks listings_w or the app is not approved.",
    );
    process.exit(3);
  }

  console.log("   OK listing_id=", write.listingId);
  console.log("   URL:", write.url);
  console.log(
    "\nDone. Remove this test listing in Etsy when finished (Shop Manager → Listings → draft).",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
