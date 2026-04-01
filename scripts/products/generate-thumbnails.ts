/**
 * Generate thumbnails for all built products (or one specific slug).
 *
 * Usage:
 *   tsx scripts/products/generate-thumbnails.ts             # all built products
 *   tsx scripts/products/generate-thumbnails.ts med-spa     # only products matching prefix
 *   pnpm product:thumbnails
 */
import fs from "fs";
import path from "path";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

const OUTPUT_ROOT = process.env.PRODUCT_OUTPUT_DIR || path.join(process.cwd(), "output");

async function main() {
  const filter = process.argv[2] || "";

  const { generateProductThumbnail } = await import(
    "../../src/lib/products/thumbnail-generator"
  );

  if (!fs.existsSync(OUTPUT_ROOT)) {
    console.error(`Output directory not found: ${OUTPUT_ROOT}`);
    console.error("Run 'pnpm product:build-all' first.");
    process.exit(1);
  }

  const slugs = fs
    .readdirSync(OUTPUT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !filter || name.startsWith(filter))
    .sort();

  console.log(`Generating thumbnails for ${slugs.length} product(s)...\n`);

  let ok = 0;
  let skipped = 0;

  for (const slug of slugs) {
    const manifestPath = path.join(OUTPUT_ROOT, slug, "manifest.json");
    const listingPath = path.join(OUTPUT_ROOT, slug, "listing.json");

    if (!fs.existsSync(listingPath)) {
      console.log(`  SKIP  ${slug} — no listing.json`);
      skipped += 1;
      continue;
    }

    const listing = JSON.parse(fs.readFileSync(listingPath, "utf8"));
    const previewsDir = path.join(OUTPUT_ROOT, slug, "previews");

    const existing = path.join(previewsDir, "thumbnail-1.png");
    if (fs.existsSync(existing)) {
      console.log(`  SKIP  ${slug} — thumbnail already exists`);
      skipped += 1;
      continue;
    }

    const result = await generateProductThumbnail({
      slug,
      title: listing.title || slug,
      templateCount: listing.quantity || 30,
      category: listing.materials || "",
      outputDir: previewsDir,
    });

    if (result) {
      console.log(`  OK    ${slug} → thumbnail-1.png`);
      ok += 1;
    } else {
      console.log(`  FAIL  ${slug} — puppeteer error`);
      skipped += 1;
    }
  }

  console.log(`\nDone. ${ok} generated, ${skipped} skipped.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
