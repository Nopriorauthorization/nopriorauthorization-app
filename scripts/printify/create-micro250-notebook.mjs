#!/usr/bin/env node
/**
 * Creates the Micro 250 Exam Prep spiral notebook in Printify (Blueprint 74 / SPOKE).
 * Run: node scripts/printify/create-micro250-notebook.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const COVER_PATH = path.join(ROOT, "public/micro-exam-prep/micro250-cover.png");
const IDS_FILE   = path.join(ROOT, "imports/npa-manifests-and-spec/exam-prep-products.json");
const PROGRESS   = path.join(ROOT, "public/micro-exam-prep/upload-progress.json");

const TOKEN   = process.env.PRINTIFY_API_TOKEN?.trim();
const SHOP_ID = process.env.PRINTIFY_SHOP_ID?.trim();
if (!TOKEN || !SHOP_ID) { console.error("Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID"); process.exit(1); }

const BLUEPRINT_ID = 74;
const PROVIDER_ID  = 1;   // SPOKE Custom Products
const VARIANT_ID   = 34240;

let progress = fs.existsSync(PROGRESS) ? JSON.parse(fs.readFileSync(PROGRESS, "utf8")) : {};
function saveProgress() { fs.writeFileSync(PROGRESS, JSON.stringify(progress, null, 2)); }

async function uploadImageB64(base64, filename) {
  const key = `img:${filename}`;
  if (progress[key]) { console.log(`  cached: ${filename} → ${progress[key]}`); return progress[key]; }
  const res = await fetch("https://api.printify.com/v1/uploads/images.json", {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ file_name: filename, contents: base64 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Upload failed: ${JSON.stringify(data).slice(0, 300)}`);
  progress[key] = data.id;
  saveProgress();
  return data.id;
}

async function run() {
  let ids = fs.existsSync(IDS_FILE) ? JSON.parse(fs.readFileSync(IDS_FILE, "utf8")) : {};

  if (ids["micro250-exam-prep-physical"]) {
    console.log("Already created:", ids["micro250-exam-prep-physical"]);
    return;
  }

  // 1. Upload cover PNG
  console.log("Uploading cover PNG...");
  const coverB64 = fs.readFileSync(COVER_PATH).toString("base64");
  const coverId = await uploadImageB64(coverB64, "micro250-cover.png");
  console.log(`  Cover ID: ${coverId}`);

  // 2. Create product (cover only — interior PDF added via Printify dashboard)
  console.log("Creating Printify product...");
  const payload = {
    title: "Micro 250 Complete Exam Prep Notebook | All 17 Chapters | 244 Questions | By Danielle Alcala",
    description: "Complete Micro 250 exam prep spiral notebook — all 17 chapters, 244 study questions answered in full with clinical context, mnemonics, and explanations. Written by Danielle Alcala, RN Student. No Prior Authorization.",
    blueprint_id: BLUEPRINT_ID,
    print_provider_id: PROVIDER_ID,
    variants: [{ id: VARIANT_ID, price: 2500, is_enabled: true }],
    print_areas: [
      {
        variant_ids: [VARIANT_ID],
        placeholders: [
          { position: "front", images: [{ id: coverId, x: 0.5, y: 0.5, scale: 1, angle: 0 }] },
        ],
      },
    ],
    tags: ["micro 250", "microbiology", "exam prep", "nursing school", "study guide", "spiral notebook", "danielle alcala", "no prior authorization"],
  };

  const res = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/products.json`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Product create failed: ${JSON.stringify(data).slice(0, 400)}`);

  ids["micro250-exam-prep-physical"] = { productId: data.id, variantId: VARIANT_ID, price: 2500 };
  fs.mkdirSync(path.dirname(IDS_FILE), { recursive: true });
  fs.writeFileSync(IDS_FILE, JSON.stringify(ids, null, 2));

  console.log(`\n✓ Created Printify product: ${data.id}`);
  console.log("Product ID saved to:", IDS_FILE);
  console.log("\n⚠️  MANUAL STEP: Go to Printify dashboard → Products → this notebook");
  console.log("   → Edit → upload public/micro-exam-prep/micro250-exam-prep.pdf as interior");
  console.log("\nNext: node scripts/printify/build-medspa-inventory-json.mjs");
}

run().catch(e => { console.error(e); process.exit(1); });
