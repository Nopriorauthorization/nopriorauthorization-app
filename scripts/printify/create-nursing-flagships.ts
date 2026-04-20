/**
 * Creates the 4 Printify flagship nursing-study products (spirals + NCLEX deck).
 * Requires: PRINTIFY_API_TOKEN, PRINTIFY_SHOP_ID in .env.local
 *
 * Put cover art here before running:
 *   printify-assets/nursing-flagships/<coverDir>/cover.png
 * (coverDir matches `coverDir` in src/config/nursing-study-printify-flagships.config.ts)
 *
 * Run: npx tsx scripts/printify/create-nursing-flagships.ts
 *
 * Output: printify-assets/nursing-flagships/product-ids.json
 * Then merge those keys into PRINTIFY_INVENTORY_JSON on Vercel (same shape as study kits).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { NURSING_STUDY_PRINTIFY_FLAGSHIPS } from "../../src/config/nursing-study-printify-flagships.config";

const require = createRequire(import.meta.url);
require("dotenv").config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const ASSETS = path.join(ROOT, "printify-assets/nursing-flagships");
const OUT = path.join(ASSETS, "product-ids.json");
const PROGRESS = path.join(ASSETS, "upload-progress.json");

const TOKEN = process.env.PRINTIFY_API_TOKEN?.trim();
const SHOP_ID = process.env.PRINTIFY_SHOP_ID?.trim();
const BASE = "https://api.printify.com/v1";

if (!TOKEN || !SHOP_ID) {
  console.error("Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID in .env.local");
  process.exit(1);
}

function headers() {
  return { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
}

async function uploadImage(filePath: string): Promise<string> {
  const base64 = fs.readFileSync(filePath).toString("base64");
  const res = await fetch(`${BASE}/uploads/images.json`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ file_name: path.basename(filePath), contents: base64 }),
  });
  const data = (await res.json()) as { id?: string };
  if (!res.ok) throw new Error(JSON.stringify(data).slice(0, 400));
  return String(data.id);
}

async function createProduct(body: Record<string, unknown>) {
  const res = await fetch(`${BASE}/shops/${SHOP_ID}/products.json`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data).slice(0, 500));
  return data as { id: string };
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });
  const results: Record<string, { productId: string; variantId: number; price: number }> =
    fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
  const progress: Record<string, string> = fs.existsSync(PROGRESS)
    ? JSON.parse(fs.readFileSync(PROGRESS, "utf8"))
    : {};

  for (const row of NURSING_STUDY_PRINTIFY_FLAGSHIPS) {
    const key = row.printifySkuKey;
    if (results[key]?.productId) {
      console.log(`SKIP ${key} (${results[key].productId})`);
      continue;
    }

    const coverPath = path.join(ASSETS, row.coverDir, "cover.png");
    if (!fs.existsSync(coverPath)) {
      console.warn(`⚠  SKIP ${key} — missing cover: ${coverPath}`);
      continue;
    }

    const cacheKey = `upload:${key}:cover`;
    let imageId = progress[cacheKey];
    if (!imageId) {
      process.stdout.write(`Upload ${row.coverDir}/cover.png …`);
      imageId = await uploadImage(coverPath);
      progress[cacheKey] = imageId;
      fs.writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
      console.log(` id=${imageId}`);
    } else {
      console.log(`  cached cover upload: ${imageId}`);
    }

    const variantIds = [row.variantId];
    const body = {
      title: row.title,
      description: row.longDescription.replace(/\n/g, "\n"),
      blueprint_id: row.blueprintId,
      print_provider_id: row.printProviderId,
      variants: [{ id: row.variantId, price: row.priceCents, is_enabled: true }],
      print_areas: [
        {
          variant_ids: variantIds,
          placeholders: [
            {
              position: "front",
              images: [{ id: imageId, x: 0.5, y: 0.5, scale: 1, angle: 0 }],
            },
          ],
        },
      ],
      tags: ["nursing", "no prior authorization", "study", row.printifySkuKey],
    };

    process.stdout.write(`Create Printify product ${key} …`);
    const product = await createProduct(body);
    results[key] = {
      productId: product.id,
      variantId: row.variantId,
      price: row.priceCents,
    };
    fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
    console.log(` ✓ ${product.id}`);
  }

  fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
  console.log(`\nSaved → ${OUT}`);
  console.log(
    "\nNext: merge JSON keys (NPA-NITM-*) into PRINTIFY_INVENTORY_JSON on Vercel with { productId, variantId } per key.",
  );
  console.log("Printify dashboard: attach interior PDF where `interiorPdfPath` is set in nursing-study-printify-flagships.config.ts.");
  for (const row of NURSING_STUDY_PRINTIFY_FLAGSHIPS) {
    if (row.interiorPdfPath) {
      console.log(`  • ${row.printifySkuKey} → ${row.interiorPdfPath}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
