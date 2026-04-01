/**
 * Create an Etsy draft listing from a built product.
 *
 * Usage: tsx scripts/products/create-draft.ts <slug>
 *        pnpm product:create-draft <slug>
 *
 * Requires: ETSY_ACCESS_TOKEN, ETSY_API_KEYSTRING, ETSY_API_SHARED_SECRET, ETSY_SHOP_ID
 */
import fs from "fs";
import path from "path";

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: pnpm product:create-draft <slug>");
    process.exit(1);
  }

  const outputDir =
    process.env.PRODUCT_OUTPUT_DIR || path.join(process.cwd(), "output");
  const listingPath = path.join(outputDir, slug, "listing.json");

  if (!fs.existsSync(listingPath)) {
    console.error(
      `No listing.json found at ${listingPath}. Run pnpm product:build ${slug} first.`,
    );
    process.exit(1);
  }

  const listing = JSON.parse(fs.readFileSync(listingPath, "utf8")) as Record<
    string,
    unknown
  >;

  // Try DB token fallback for scripts
  const { tryLoadEtsyCredsFromDb } = await import(
    "../../src/lib/integrations/etsy/etsy.service"
  );
  const dbCreds = await tryLoadEtsyCredsFromDb();
  if (dbCreds?.accessToken && !process.env.ETSY_ACCESS_TOKEN) {
    process.env.ETSY_ACCESS_TOKEN = dbCreds.accessToken;
    console.log("[create-draft] Loaded ETSY_ACCESS_TOKEN from database");
  }
  if (dbCreds?.shopId && !process.env.ETSY_SHOP_ID) {
    process.env.ETSY_SHOP_ID = dbCreds.shopId;
    console.log("[create-draft] Loaded ETSY_SHOP_ID from database");
  }

  const { EtsyService } = await import(
    "../../src/lib/integrations/etsy/etsy.service"
  );

  let etsy: InstanceType<typeof EtsyService>;
  try {
    etsy = new EtsyService();
  } catch (e) {
    console.error(
      `[create-draft] ${e instanceof Error ? e.message : e}`,
    );
    console.error(
      "Set ETSY_ACCESS_TOKEN, ETSY_API_KEYSTRING, ETSY_API_SHARED_SECRET, ETSY_SHOP_ID in .env.local",
    );
    process.exit(1);
  }

  const result = await etsy.createDraftListing({
    title: listing.title as string,
    description: listing.description as string,
    price: listing.price as number,
    quantity: (listing.quantity as number) || 999,
    tags: listing.tags as string[],
    taxonomyId: (listing.taxonomy_id as number) || 2078,
    isDigital: true,
  });

  if (result.ok) {
    console.log(`\nDraft listing created: ${result.url}`);
    console.log(`  listing_id: ${result.listingId}`);
    console.log(`  state: ${result.state}`);

    // Save result alongside build
    const resultPath = path.join(outputDir, slug, "etsy-draft.json");
    fs.writeFileSync(
      resultPath,
      JSON.stringify(
        { ...result, slug, createdAt: new Date().toISOString() },
        null,
        2,
      ) + "\n",
    );
    console.log(`  saved: ${resultPath}`);
  } else {
    console.error(`\nFailed to create draft listing for ${slug}`);
    console.error(`  ${result.error}`);
    process.exit(2);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
