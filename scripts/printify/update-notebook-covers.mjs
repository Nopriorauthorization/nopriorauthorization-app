#!/usr/bin/env node
/**
 * Re-uploads the 5 existing notebook covers and PATCHes the Printify products.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");

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
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const TOKEN   = process.env.PRINTIFY_API_TOKEN;
const SHOP_ID = 27239803;
const BASE    = "https://api.printify.com/v1";

function headers() { return { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json" }; }

async function uploadImage(filePath, retries = 4) {
  const base64 = fs.readFileSync(filePath).toString("base64");
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await fetch(`${BASE}/uploads/images.json`, {
        method: "POST", headers: headers(),
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

const nbResultsPath = path.join(ROOT, "printify-assets/notebooks/product-ids.json");
const nbResults = JSON.parse(fs.readFileSync(nbResultsPath, "utf8"));

const SLUGS = ["glp1-clinical-notebook","botox-clinical-notebook","filler-clinical-notebook","iv-therapy-clinical-notebook","injection-techniques-notebook"];

for (const slug of SLUGS) {
  const productId = nbResults[slug]?.productId;
  if (!productId) { console.warn(`SKIP ${slug} — no product ID`); continue; }

  const coverPath = path.join(ROOT, "printify-assets/notebooks", slug, "cover.png");
  const progressPath = path.join(ROOT, "printify-assets/notebooks", slug, "upload-progress.json");

  process.stdout.write(`  Uploading ${slug}/cover.png ...`);
  const imageId = await uploadImage(coverPath);
  fs.writeFileSync(progressPath, JSON.stringify({ imageId }, null, 2));
  console.log(` ✓ id=${imageId}`);

  process.stdout.write(`  Patching product ${productId} ...`);
  const res = await fetch(`${BASE}/shops/${SHOP_ID}/products/${productId}.json`, {
    method: "PUT", headers: headers(),
    body: JSON.stringify({
      print_areas: [{
        variant_ids: [34240],
        placeholders: [{ position: "front", images: [{ id: imageId, x: 0.5, y: 0.5, scale: 1, angle: 0 }] }],
      }],
    }),
  });
  const j = await res.json();
  if (!res.ok) { console.log(` ✗\n  ${JSON.stringify(j)}`); continue; }
  console.log(` ✓`);
}

console.log("\nAll 5 products updated with new covers.");
