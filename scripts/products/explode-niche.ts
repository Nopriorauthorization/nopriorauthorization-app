/**
 * Explode a niche blueprint into DigitalProductConfig files.
 *
 * Usage:
 *   tsx scripts/products/explode-niche.ts med-spa
 *   tsx scripts/products/explode-niche.ts --all
 *   pnpm product:explode med-spa
 */
import fs from "fs";
import path from "path";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

const GENERATED_DIR = path.join(process.cwd(), "content", "products", "generated");

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: pnpm product:explode <niche|--all>");
    const { getAllBlueprintNiches } = await import("../../content/blueprints/index");
    console.error("Available niches:", getAllBlueprintNiches().join(", "));
    process.exit(1);
  }

  const { getBlueprint, getAllBlueprintNiches } = await import(
    "../../content/blueprints/index"
  );
  const { explodeBlueprint } = await import(
    "../../src/lib/products/blueprint-exploder"
  );

  const niches = arg === "--all" ? getAllBlueprintNiches() : [arg];

  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  let totalConfigs = 0;

  for (const niche of niches) {
    const bp = getBlueprint(niche);
    if (!bp) {
      console.error(`Unknown niche: ${niche}`);
      continue;
    }

    const configs = explodeBlueprint(bp);
    console.log(`\n[${niche}] Generated ${configs.length} product configs:`);

    for (const config of configs) {
      const filePath = path.join(GENERATED_DIR, `${config.slug}.config.json`);
      fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + "\n");
      console.log(`  ${config.slug} → $${config.etsy.priceUsd}`);
      totalConfigs += 1;
    }
  }

  // Write a generated registry
  const allFiles = fs
    .readdirSync(GENERATED_DIR)
    .filter((f) => f.endsWith(".config.json"))
    .sort();

  const registryPath = path.join(GENERATED_DIR, "_registry.json");
  const registry = allFiles.map((f) => {
    const config = JSON.parse(
      fs.readFileSync(path.join(GENERATED_DIR, f), "utf8"),
    );
    return {
      slug: config.slug,
      title: config.internalName,
      price: config.etsy.priceUsd,
      file: f,
    };
  });
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n");

  console.log(`\nTotal: ${totalConfigs} configs generated in ${GENERATED_DIR}`);
  console.log(`Registry: ${registryPath} (${registry.length} entries)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
