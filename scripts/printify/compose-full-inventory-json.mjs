#!/usr/bin/env node
/**
 * Builds printify-assets/PRINTIFY_INVENTORY_JSON.json from committed product-id manifests.
 * Copy the file contents (or minify to one line) into Vercel → PRINTIFY_INVENTORY_JSON.
 *
 * If production already has extra keys, merge this object into the existing JSON — do not
 * blindly delete keys you added only in Vercel.
 *
 * Run: node scripts/printify/compose-full-inventory-json.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function line(row) {
  if (!row?.productId || row.variantId == null) {
    throw new Error(`Invalid row in ${JSON.stringify(row)}`);
  }
  return { productId: String(row.productId), variantId: Number(row.variantId) };
}

const studyKitsPath = path.join(ROOT, "printify-assets/study-kits/product-ids.json");
const nursingPath = path.join(ROOT, "printify-assets/nursing-flagships/product-ids.json");
const hgPath = path.join(ROOT, "printify-assets/hello-gorgeous-the-book/product-id.json");
const examPrepPath = path.join(ROOT, "imports/npa-manifests-and-spec/exam-prep-products.json");

for (const p of [studyKitsPath, nursingPath, hgPath, examPrepPath]) {
  if (!fs.existsSync(p)) {
    console.error("Missing required file:", p);
    process.exit(1);
  }
}

const kits = readJson(studyKitsPath);
const apNotebook = line(kits["ap-notebook"]);
const microNotebook = line(kits["micro-notebook"]);

const nursing = readJson(nursingPath);
const hg = readJson(hgPath);
const examPrep = readJson(examPrepPath);

/** @type {Record<string, unknown>} */
const inventory = {
  "ap-survival-kit": [apNotebook],
  "micro-270-kit": [microNotebook],
  "pre-nursing-bundle": [apNotebook, microNotebook],
  "give-me-everything-kit": [apNotebook, microNotebook],
  "NPA-STUDY-AP-BOOKLET": apNotebook,
};

for (const [k, v] of Object.entries(nursing)) {
  inventory[k] = line(v);
}

inventory["NPA-HG-BOOK-SPIRAL"] = line({
  productId: hg.productId,
  variantId: hg.variantId,
});

const micro250 = examPrep["micro250-exam-prep-physical"];
if (!micro250) {
  console.error("Missing micro250-exam-prep-physical in exam-prep-products.json");
  process.exit(1);
}
inventory["micro250-exam-prep-physical"] = line(micro250);

const outPath = path.join(ROOT, "printify-assets/PRINTIFY_INVENTORY_JSON.json");
fs.writeFileSync(outPath, JSON.stringify(inventory, null, 2) + "\n");

console.log("Wrote", outPath);
console.log("Next: Vercel → Project → Settings → Environment Variables → PRINTIFY_INVENTORY_JSON");
console.log("      Paste JSON (single-line ok). Merge with any production-only keys you already have.");
