#!/usr/bin/env node
/**
 * Uploads notebook covers and creates 5 Printify products.
 * Blueprint 74 — Spiral Notebook Ruled Line (SPOKE Custom Products)
 * Variant 34240 — One Size | position: front | 1810×2534px
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");

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

if (!TOKEN) { console.error("Missing PRINTIFY_API_TOKEN"); process.exit(1); }

function headers() {
  return { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json" };
}

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
      if (!res.ok) throw new Error(`Upload failed: ${JSON.stringify(json)}`);
      return json.id;
    } catch (e) {
      if (attempt === retries) throw e;
      process.stdout.write(` retry ${attempt}...`);
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

const NOTEBOOKS = [
  {
    slug: "glp1-clinical-notebook",
    title: "GLP-1 & Weight Loss Clinical Reference Notebook",
    description: "A 6\"×8\" spiral notebook for GLP-1 / weight loss program providers. Features 118 ruled pages with a custom clinical reference cover — perfect for consult notes, titration tracking, and patient visit documentation.\n\n• 118 ruled line pages\n• 6\" × 8\" spiral bound\n• Front cover: GLP-1 clinical reference design\n• Dark grey back cover\n• Printed by SPOKE Custom Products",
    price: 1799,
  },
  {
    slug: "botox-clinical-notebook",
    title: "Botox & Neurotoxin Clinical Reference Notebook",
    description: "A 6\"×8\" spiral notebook for injectors and aesthetic providers. Features 118 ruled pages with a custom Botox clinical reference cover — perfect for treatment notes, dosing logs, and patient records.\n\n• 118 ruled line pages\n• 6\" × 8\" spiral bound\n• Front cover: Botox & neurotoxin clinical reference design\n• Dark grey back cover\n• Printed by SPOKE Custom Products",
    price: 1799,
  },
  {
    slug: "filler-clinical-notebook",
    title: "Dermal Filler Clinical Reference Notebook",
    description: "A 6\"×8\" spiral notebook for filler injectors and aesthetic providers. Features 118 ruled pages with a custom dermal filler clinical reference cover — ideal for treatment plans, patient notes, and anatomy reference.\n\n• 118 ruled line pages\n• 6\" × 8\" spiral bound\n• Front cover: Dermal filler clinical reference design\n• Dark grey back cover\n• Printed by SPOKE Custom Products",
    price: 1799,
  },
  {
    slug: "iv-therapy-clinical-notebook",
    title: "IV Therapy Clinical Reference Notebook",
    description: "A 6\"×8\" spiral notebook for IV therapy providers and med spa staff. Features 118 ruled pages with a custom IV therapy clinical reference cover — great for patient notes, protocol tracking, and drip documentation.\n\n• 118 ruled line pages\n• 6\" × 8\" spiral bound\n• Front cover: IV therapy clinical reference design\n• Dark grey back cover\n• Printed by SPOKE Custom Products",
    price: 1799,
  },
  {
    slug: "injection-techniques-notebook",
    title: "Injection Techniques Clinical Reference Notebook",
    description: "A 6\"×8\" spiral notebook for nurse injectors and aesthetic providers. Features 118 ruled pages with a custom injection techniques reference cover — perfect for training notes, technique logs, and anatomy study.\n\n• 118 ruled line pages\n• 6\" × 8\" spiral bound\n• Front cover: Injection techniques clinical reference design\n• Dark grey back cover\n• Printed by SPOKE Custom Products",
    price: 1799,
  },
];

async function main() {
  const resultsPath = path.join(ROOT, "printify-assets/notebooks/product-ids.json");
  const results = fs.existsSync(resultsPath) ? JSON.parse(fs.readFileSync(resultsPath, "utf8")) : {};

  for (const nb of NOTEBOOKS) {
    if (results[nb.slug]?.productId) {
      console.log(`SKIP ${nb.slug} — already created (${results[nb.slug].productId})`);
      continue;
    }

    const coverPath = path.join(ROOT, "printify-assets/notebooks", nb.slug, "cover.png");
    if (!fs.existsSync(coverPath)) {
      console.warn(`⚠  SKIP ${nb.slug} — cover.png not found, run generate-notebook-covers.mjs first`);
      continue;
    }

    // Upload cover
    const progressPath = path.join(ROOT, "printify-assets/notebooks", nb.slug, "upload-progress.json");
    const progress = fs.existsSync(progressPath) ? JSON.parse(fs.readFileSync(progressPath, "utf8")) : {};

    if (!progress.imageId) {
      process.stdout.write(`  Uploading ${nb.slug}/cover.png ...`);
      progress.imageId = await uploadImage(coverPath);
      fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
      console.log(` ✓  id=${progress.imageId}`);
    } else {
      console.log(`  SKIP upload ${nb.slug} (already uploaded: ${progress.imageId})`);
    }

    // Create product
    process.stdout.write(`  Creating product: ${nb.title} ...`);
    const body = {
      title: nb.title,
      description: nb.description,
      blueprint_id: 74,
      print_provider_id: 1,
      variants: [{ id: 34240, price: nb.price, is_enabled: true }],
      print_areas: [{
        variant_ids: [34240],
        placeholders: [{ position: "front", images: [{ id: progress.imageId, x: 0.5, y: 0.5, scale: 1, angle: 0 }] }],
      }],
    };

    const res = await fetch(`${BASE}/shops/${SHOP_ID}/products.json`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    });
    const product = await res.json();

    if (!res.ok) {
      console.log(` ✗`);
      console.error(`   Error: ${JSON.stringify(product)}`);
      continue;
    }

    results[nb.slug] = { productId: product.id, title: product.title, price: nb.price, createdAt: new Date().toISOString() };
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(` ✓  id=${product.id}`);
  }

  console.log("\n── Summary ──────────────────────────────────────────");
  for (const [slug, r] of Object.entries(results)) {
    console.log(`  ${slug}: ${r.productId}`);
  }
  console.log("\nAll products created. Go to Printify → publish each to Etsy.");
}

main().catch((e) => { console.error(e); process.exit(1); });
