#!/usr/bin/env node
/**
 * Creates 5 Printify products for the physical study kit SKUs.
 * Uploads design images, creates each product, saves productId + variantId.
 *
 * Blueprints:
 *   Notebooks:  74   (SPOKE Custom Products, variant 34240)
 *   Flashcards: 1138 (District Photo, variant 87236)
 *   Ref Cards:  812  (Print Pigeons, variant 76854)
 *
 * Output: printify-assets/study-kits/product-ids.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const ASSETS = path.join(ROOT, "printify-assets/study-kits");

function loadEnv() {
  const p = path.join(ROOT, ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const TOKEN = process.env.PRINTIFY_API_TOKEN;
const SHOP_ID = 27239803;
const BASE = "https://api.printify.com/v1";

if (!TOKEN) { console.error("Missing PRINTIFY_API_TOKEN"); process.exit(1); }

function headers() {
  return { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
}

async function uploadImage(filePath, retries = 4) {
  const base64 = fs.readFileSync(filePath).toString("base64");
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await fetch(`${BASE}/uploads/images.json`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ file_name: path.basename(filePath), contents: base64 }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(j));
      return j.id;
    } catch (e) {
      if (i === retries) throw e;
      process.stdout.write(` retry${i}...`);
      await new Promise(r => setTimeout(r, 2500 * i));
    }
  }
}

async function createProduct(body, retries = 3) {
  for (let i = 1; i <= retries; i++) {
    const res = await fetch(`${BASE}/shops/${SHOP_ID}/products.json`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    });
    const j = await res.json();
    if (res.ok) return j;
    if (i < retries) {
      process.stdout.write(` retry${i}...`);
      await new Promise(r => setTimeout(r, 2000 * i));
    } else {
      throw new Error(JSON.stringify(j));
    }
  }
}

const PRODUCTS = [
  {
    key: "ap-notebook",
    title: "A&P Cheat Sheet Study Notebook — Nursing & Allied Health",
    description: "128-page wide-ruled spiral notebook with a custom Anatomy & Physiology study cover. Perfect for nursing school notes, lecture summaries, and exam prep.\n\n• 128 ruled pages\n• 6\" × 8\" spiral bound\n• Semi-gloss laminated cover\n• Printed by SPOKE Custom Products",
    blueprint_id: 74,
    print_provider_id: 1,
    variant_id: 34240,
    price: 1799,
    print_areas: (imageId) => [{
      variant_ids: [34240],
      placeholders: [{ position: "front", images: [{ id: imageId, x: 0.5, y: 0.5, scale: 1, angle: 0 }] }],
    }],
    images: [{ key: "cover", file: "ap-notebook-cover.png" }],
  },
  {
    key: "micro-notebook",
    title: "Micro 270 Study Notebook — Microbiology for Nursing Students",
    description: "128-page wide-ruled spiral notebook with a custom Microbiology 270 study cover. Built for nursing and allied health students tackling Micro 270.\n\n• 128 ruled pages\n• 6\" × 8\" spiral bound\n• Semi-gloss laminated cover\n• Printed by SPOKE Custom Products",
    blueprint_id: 74,
    print_provider_id: 1,
    variant_id: 34240,
    price: 1799,
    print_areas: (imageId) => [{
      variant_ids: [34240],
      placeholders: [{ position: "front", images: [{ id: imageId, x: 0.5, y: 0.5, scale: 1, angle: 0 }] }],
    }],
    images: [{ key: "cover", file: "micro-notebook-cover.png" }],
  },
  {
    key: "ap-flashcards",
    title: "A&P Clinical Reference Card Deck — 240 Study Cards for Nursing",
    description: "Compact 2.5\" × 3.7\" poker-size reference cards for Anatomy & Physiology. All 54 cards feature clinical study content — cell biology, organ systems, homeostasis, and lab tie-ins. Box included.\n\n• 52 cards + 2 jokers (54 total)\n• 2.5\" × 3.7\" glossy 300gsm\n• Custom back design: A&P content\n• Box included\n• Printed by District Photo (USA)",
    blueprint_id: 1138,
    print_provider_id: 28,
    variant_id: 87236,
    price: 1499,
    print_areas: (imageId) => [{
      variant_ids: [87236],
      placeholders: [{ position: "front", images: [{ id: imageId, x: 0.5, y: 0.5, scale: 1, angle: 0 }] }],
    }],
    images: [{ key: "front", file: "ap-flashcard-front.png" }],
  },
  {
    key: "micro-flashcards",
    title: "Micro 270 Q&A Card Deck — 1,000 Study Cards for Nursing",
    description: "Compact 2.5\" × 3.7\" poker-size reference cards for Microbiology 270. All 54 cards feature Micro 270 study content — bacteria, viruses, antimicrobials, and case questions. Box included.\n\n• 52 cards + 2 jokers (54 total)\n• 2.5\" × 3.7\" glossy 300gsm\n• Custom back design: Micro 270 content\n• Box included\n• Printed by District Photo (USA)",
    blueprint_id: 1138,
    print_provider_id: 28,
    variant_id: 87236,
    price: 1499,
    print_areas: (imageId) => [{
      variant_ids: [87236],
      placeholders: [{ position: "front", images: [{ id: imageId, x: 0.5, y: 0.5, scale: 1, angle: 0 }] }],
    }],
    images: [{ key: "front", file: "micro-flashcard-front.png" }],
  },
  {
    key: "injector-cards",
    title: "Nurse Injector Clinical Reference Cards — 100 Cards",
    description: "Business-card-size (3.5\" × 2.3\") laminated clinical reference cards for nurse injectors. 100 cards covering Botox dosing, filler landmarks, GLP-1 titration, and safety protocols. Box included.\n\n• 100 cards per box\n• 3.5\" × 2.3\" coated with laminate\n• Two-sided print: quick reference front + NPA brand back\n• Box included\n• Printed by Print Pigeons",
    blueprint_id: 812,
    print_provider_id: 36,
    variant_id: 76854,
    price: 1999,
    print_areas: (frontId, backId) => [{
      variant_ids: [76854],
      placeholders: [
        { position: "front", images: [{ id: frontId, x: 0.5, y: 0.5, scale: 1, angle: 0 }] },
        { position: "back",  images: [{ id: backId,  x: 0.5, y: 0.5, scale: 1, angle: 0 }] },
      ],
    }],
    images: [
      { key: "front", file: "injector-card-front.png" },
      { key: "back",  file: "injector-card-back.png" },
    ],
  },
];

async function main() {
  const resultsPath = path.join(ASSETS, "product-ids.json");
  const progressPath = path.join(ASSETS, "upload-progress.json");
  const results = fs.existsSync(resultsPath) ? JSON.parse(fs.readFileSync(resultsPath, "utf8")) : {};
  const progress = fs.existsSync(progressPath) ? JSON.parse(fs.readFileSync(progressPath, "utf8")) : {};

  for (const prod of PRODUCTS) {
    if (results[prod.key]?.productId) {
      console.log(`SKIP ${prod.key} (already created: ${results[prod.key].productId})`);
      continue;
    }

    console.log(`\n── ${prod.key} ──`);

    // Upload images
    const imageIds = {};
    for (const img of prod.images) {
      const cacheKey = `${prod.key}__${img.key}`;
      if (progress[cacheKey]) {
        console.log(`  SKIP upload ${img.file} (cached: ${progress[cacheKey]})`);
        imageIds[img.key] = progress[cacheKey];
      } else {
        process.stdout.write(`  Upload ${img.file} ...`);
        const id = await uploadImage(path.join(ASSETS, img.file));
        imageIds[img.key] = id;
        progress[cacheKey] = id;
        fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
        console.log(` ✓ id=${id}`);
      }
    }

    // Create product
    process.stdout.write(`  Create product ...`);
    const printAreas = prod.key === "injector-cards"
      ? prod.print_areas(imageIds.front, imageIds.back)
      : prod.print_areas(imageIds.cover || imageIds.front);

    const body = {
      title: prod.title,
      description: prod.description,
      blueprint_id: prod.blueprint_id,
      print_provider_id: prod.print_provider_id,
      variants: [{ id: prod.variant_id, price: prod.price, is_enabled: true }],
      print_areas: printAreas,
    };

    try {
      const product = await createProduct(body);
      results[prod.key] = {
        productId: product.id,
        variantId: prod.variant_id,
        title: product.title,
        price: prod.price,
        createdAt: new Date().toISOString(),
      };
      fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
      console.log(` ✓ id=${product.id}`);
    } catch (e) {
      console.log(` ✗\n  ${e.message}`);
    }
  }

  console.log("\n── Summary ──────────────────────────────────────────");
  for (const [key, r] of Object.entries(results)) {
    console.log(`  ${key}: ${r.productId} (variant ${r.variantId})`);
  }
  console.log("\nNext: run build-inventory-json.mjs to generate PRINTIFY_INVENTORY_JSON");
}

main().catch(e => { console.error(e); process.exit(1); });
