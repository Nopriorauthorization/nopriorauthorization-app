/**
 * End-to-end digital listing pipeline (one product): draft → image → file → type → optional active.
 *
 * Prerequisites: OAuth token with listings_w, valid paths, run `prisma migrate deploy` for EtsyListingSync.
 *
 * Usage:
 *   pnpm etsy:verify-e2e
 *   pnpm etsy:verify-e2e -- --publish
 *   pnpm etsy:verify-e2e -- --image public/.../x.png --file path/to/buyer.pdf
 */
import { loadEnvLocal } from "../products/load-env";
import {
  EtsyService,
  tryLoadEtsyCredsFromDb,
} from "@/lib/integrations/etsy/etsy.service";
import { publishDigitalListing } from "@/lib/integrations/etsy/publish-digital-listing";
import prisma from "@/lib/db";

loadEnvLocal();

function argValue(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return undefined;
}

async function main() {
  const publish = process.argv.includes("--publish");
  const db = await tryLoadEtsyCredsFromDb();
  if (db?.accessToken && !process.env.ETSY_ACCESS_TOKEN) {
    process.env.ETSY_ACCESS_TOKEN = db.accessToken;
    console.log("Loaded ETSY_ACCESS_TOKEN from database\n");
  }
  if (db?.shopId && !process.env.ETSY_SHOP_ID) {
    process.env.ETSY_SHOP_ID = db.shopId;
    console.log("Loaded ETSY_SHOP_ID from database\n");
  }

  const etsy = new EtsyService();

  const imagePath =
    argValue("--image") ||
    "public/shop-previews/weight-loss/etsy-wl-01-main-thumbnail.png";
  const digitalFilePath =
    argValue("--file") ||
    "etsy-products/store-launch/delivery/glp1-story-templates-etsy-delivery.html";

  const slug = "verify-e2e-" + Date.now();
  const result = await publishDigitalListing(
    {
      productSlug: slug,
      title: `NPA E2E digital test ${new Date().toISOString().slice(0, 16)}`,
      description:
        "End-to-end API test listing from the NPA repo. Safe to delete in Shop Manager.",
      price: Number(process.env.ETSY_VERIFY_PRICE || "1"),
      tags: [
        "digital test",
        "med spa",
        "canva",
        "weight loss",
        "glp1",
        "template",
      ],
      taxonomyId: Number(process.env.ETSY_VERIFY_TAXONOMY_ID || "2078"),
      quantity: 1,
      imagePath,
      digitalFilePath,
      publish,
    },
    etsy,
    { prisma, maxAttempts: 4 },
  );

  if (!result.ok) {
    console.error("E2E failed:", result.error);
    process.exit(1);
  }
  if (result.skipped) {
    console.log("Skipped (already active):", result.url);
    return;
  }
  console.log("\nE2E OK");
  console.log("  listing_id:", result.listingId);
  console.log("  url:", result.url);
  console.log("  publish:", publish ? "active" : "left as draft (no --publish)");
  console.log(
    "\nDB row EtsyListingSync.productSlug =",
    slug,
    "(delete row + Etsy listing when cleaning up).",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
