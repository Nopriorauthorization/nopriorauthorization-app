/**
 * Build all registered products.
 *
 * Usage: tsx scripts/products/build-all-products.ts
 *        pnpm product:build-all
 */
async function main() {
  const { getAllProductSlugs, getProductConfig } = await import(
    "../../content/products/index"
  );
  const { buildProduct } = await import(
    "../../src/lib/products/product-builder"
  );

  const slugs = getAllProductSlugs();
  console.log(`Building ${slugs.length} product(s)...\n`);

  let ok = 0;
  let failed = 0;

  for (const slug of slugs) {
    const config = getProductConfig(slug);
    if (!config) {
      console.error(`  [skip] No config for ${slug}`);
      failed += 1;
      continue;
    }

    try {
      const manifest = await buildProduct(config);
      const errors = manifest.steps.filter((s) => s.status === "error");
      if (errors.length) {
        console.error(`  [warn] ${slug}: ${errors.length} step error(s)`);
        failed += 1;
      } else {
        ok += 1;
      }
    } catch (e) {
      console.error(
        `  [fail] ${slug}: ${e instanceof Error ? e.message : e}`,
      );
      failed += 1;
    }
  }

  console.log(`\nDone. ${ok} succeeded, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
