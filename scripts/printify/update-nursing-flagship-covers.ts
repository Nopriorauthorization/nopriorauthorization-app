/**
 * Re-uploads cover PNGs and updates print_areas on the 4 existing flagship products.
 * Run after regenerating covers: node scripts/printify/generate-nursing-flagship-covers.mjs --force
 *
 * Run: npx tsx scripts/printify/update-nursing-flagship-covers.ts
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
const PRODUCT_IDS = path.join(ASSETS, "product-ids.json");

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

async function updateProduct(productId: string, variantId: number, imageId: string) {
  const res = await fetch(`${BASE}/shops/${SHOP_ID}/products/${productId}.json`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({
      print_areas: [
        {
          variant_ids: [variantId],
          placeholders: [
            {
              position: "front",
              images: [{ id: imageId, x: 0.5, y: 0.5, scale: 1, angle: 0 }],
            },
          ],
        },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data).slice(0, 500));
  return data;
}

async function main() {
  if (!fs.existsSync(PRODUCT_IDS)) {
    console.error("product-ids.json not found — run create-nursing-flagships.ts first");
    process.exit(1);
  }

  const ids: Record<string, { productId: string; variantId: number }> = JSON.parse(
    fs.readFileSync(PRODUCT_IDS, "utf8"),
  );

  for (const row of NURSING_STUDY_PRINTIFY_FLAGSHIPS) {
    const key = row.printifySkuKey;
    const entry = ids[key];
    if (!entry?.productId) {
      console.warn(`⚠  SKIP ${key} — no productId in product-ids.json`);
      continue;
    }

    const coverPath = path.join(ASSETS, row.coverDir, "cover.png");
    if (!fs.existsSync(coverPath)) {
      console.warn(`⚠  SKIP ${key} — missing cover: ${coverPath}`);
      continue;
    }

    process.stdout.write(`Upload ${row.coverDir}/cover.png …`);
    const imageId = await uploadImage(coverPath);
    console.log(` id=${imageId}`);

    process.stdout.write(`Update product ${entry.productId} …`);
    await updateProduct(entry.productId, entry.variantId, imageId);
    console.log(` ✓`);
  }

  console.log("\nAll covers updated on Printify.");
  console.log("Go to Printify dashboard to review and publish each product.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
