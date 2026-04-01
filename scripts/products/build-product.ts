/**
 * Build a single product by slug.
 *
 * Usage: tsx scripts/products/build-product.ts <slug>
 *        pnpm product:build <slug>
 */
import path from "path";

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: pnpm product:build <slug>");
    console.error("Available slugs:");
    const { getAllProductSlugs } = await import("../../content/products/index");
    for (const s of getAllProductSlugs()) console.error(`  ${s}`);
    process.exit(1);
  }

  const { getProductConfig } = await import("../../content/products/index");
  const config = getProductConfig(slug);
  if (!config) {
    console.error(`Unknown product slug: "${slug}"`);
    const { getAllProductSlugs } = await import("../../content/products/index");
    console.error("Available:", getAllProductSlugs().join(", "));
    process.exit(1);
  }

  const { buildProduct } = await import("../../src/lib/products/product-builder");
  const manifest = await buildProduct(config);

  const errors = manifest.steps.filter((s) => s.status === "error");
  if (errors.length) {
    console.error(`\nBuild completed with ${errors.length} error(s).`);
    for (const e of errors) console.error(`  [${e.step}] ${e.message}`);
    process.exit(2);
  }

  console.log(`\nBuild successful: ${manifest.outputDir}`);
  console.log(`  manifest.json ✓`);
  console.log(`  listing.json  ✓`);
  console.log(`  delivery/     ✓  (${manifest.steps.find((s) => s.step === "generate-instructions")?.files?.length ?? 0} files)`);
  if (manifest.archivePath) {
    console.log(`  archives/     ✓  ${path.basename(manifest.archivePath)}`);
  }
  const skipped = manifest.steps.filter((s) => s.status === "skipped");
  if (skipped.length) {
    console.log(`  skipped: ${skipped.map((s) => s.step).join(", ")}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
