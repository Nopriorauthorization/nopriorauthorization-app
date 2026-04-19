#!/usr/bin/env node
/**
 * Uploads 10 card design images to Printify and creates the
 * GLP-1 Starter 5-Pack product in the NoPriorAuthorization shop.
 *
 * Blueprint: 1232 (Multi-Design Greeting Cards, 5-Pack)
 * Provider:  84  (CatPrint)
 * Variant:   93763 (4.25" x 5.5" Vertical / Uncoated)
 * Shop:      27239803 (NoPriorAuthorization)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const ASSETS = path.join(ROOT, "printify-assets/glp1-card-pack");

// Load .env.local
function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const TOKEN   = process.env.PRINTIFY_API_TOKEN;
const SHOP_ID = 27239803;
const BASE    = "https://api.printify.com/v1";

if (!TOKEN) { console.error("Missing PRINTIFY_API_TOKEN in .env.local"); process.exit(1); }

function headers() {
  return { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json" };
}

// ── Upload image from disk (with retries) ───────────────────────────────────
async function uploadImage(filePath, retries = 3) {
  const fileName = path.basename(filePath);
  const base64 = fs.readFileSync(filePath).toString("base64");
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE}/uploads/images.json`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ file_name: fileName, contents: base64 }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(`Upload failed for ${fileName}: ${JSON.stringify(json)}`);
      return json.id;
    } catch (e) {
      if (attempt === retries) throw e;
      console.log(` retry ${attempt}...`);
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Uploading 10 card design images to Printify...\n");

  // Resume from saved progress
  const progressPath = path.join(ASSETS, "upload-progress.json");
  const imageIds = fs.existsSync(progressPath) ? JSON.parse(fs.readFileSync(progressPath, "utf8")) : {};

  for (let i = 1; i <= 5; i++) {
    for (const side of ["front", "inside"]) {
      const key = `card${i}_${side}`;
      if (imageIds[key]) {
        console.log(`  SKIP ${key}.png (already uploaded: ${imageIds[key]})`);
        continue;
      }
      const filePath = path.join(ASSETS, `${key}.png`);
      if (!fs.existsSync(filePath)) {
        console.error(`Missing: ${filePath}\nRun generate-glp1-card-designs.mjs first.`);
        process.exit(1);
      }
      process.stdout.write(`  Uploading ${key}.png ...`);
      const id = await uploadImage(filePath);
      imageIds[key] = id;
      fs.writeFileSync(progressPath, JSON.stringify(imageIds, null, 2));
      console.log(` ✓  id=${id}`);
    }
  }

  console.log("\nCreating Printify product...");

  // All placeholders in a single print_area for the one variant
  const placeholders = [];
  for (let i = 1; i <= 5; i++) {
    placeholders.push({ position: `card${i}_front`,  images: [{ id: imageIds[`card${i}_front`],  x: 0.5, y: 0.5, scale: 1, angle: 0 }] });
    placeholders.push({ position: `card${i}_inside`, images: [{ id: imageIds[`card${i}_inside`], x: 0.5, y: 0.5, scale: 1, angle: 0 }] });
  }
  const printAreas = [{ variant_ids: [93763], placeholders }];

  const body = {
    title: "GLP-1 Clinical Reference Card Pack — 5 Cards for Med Spa Providers",
    description: `A 5-card clinical reference set for GLP-1 / weight loss program providers and staff.\n\nIncludes:\n• Card 1: GLP-1 Clinical Overview\n• Card 2: Titration Schedule\n• Card 3: Tirzepatide vs Semaglutide Comparison\n• Card 4: Patient FAQ Quick Reference\n• Card 5: No Prior Authorization Brand Card\n\nPrinted on high-quality uncoated paper. 4.25" × 5.5" with envelopes.`,
    blueprint_id: 1232,
    print_provider_id: 84,
    variants: [{ id: 93763, price: 2499, is_enabled: true }],
    print_areas: printAreas,
  };

  const res = await fetch(`${BASE}/shops/${SHOP_ID}/products.json`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  const product = await res.json();
  if (!res.ok) {
    console.error("Product creation failed:", JSON.stringify(product, null, 2));
    process.exit(1);
  }

  console.log(`\n✓  Product created!`);
  console.log(`   ID:    ${product.id}`);
  console.log(`   Title: ${product.title}`);
  console.log(`\nNext: publish the product to your sales channel in Printify dashboard,`);
  console.log(`then connect your Etsy shop via Printify → Sales Channels → Etsy.`);

  // Save product ID for future reference
  const outPath = path.join(ROOT, "printify-assets/glp1-card-pack/product-id.json");
  fs.writeFileSync(outPath, JSON.stringify({ productId: product.id, title: product.title, createdAt: new Date().toISOString() }, null, 2));
  console.log(`\nProduct ID saved to: printify-assets/glp1-card-pack/product-id.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
