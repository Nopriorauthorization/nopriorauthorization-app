#!/usr/bin/env node
/**
 * Reads printify-assets/study-kits/product-ids.json and writes
 * PRINTIFY_INVENTORY_JSON to .env.local.
 *
 * Format (each slug maps to an array — supports multi-item kit orders):
 * {
 *   "ap-survival-kit":           [ap-notebook, ap-flashcards],
 *   "micro-270-kit":             [micro-notebook, micro-flashcards],
 *   "pre-nursing-bundle":        [ap-notebook, ap-flashcards, micro-notebook, micro-flashcards],
 *   "nurse-injector-clinical-kit":[injector-cards],
 *   "give-me-everything-kit":    [ap-notebook, ap-flashcards, micro-notebook, micro-flashcards, injector-cards],
 *   single-item SKUs:            {productId, variantId}  (backwards compatible)
 * }
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const idsPath = path.join(ROOT, "printify-assets/study-kits/product-ids.json");

if (!fs.existsSync(idsPath)) {
  console.error("Missing product-ids.json — run create-study-kit-products.mjs first");
  process.exit(1);
}

const ids = JSON.parse(fs.readFileSync(idsPath, "utf8"));

function line(key) {
  const r = ids[key];
  if (!r) { console.error(`Missing product entry for: ${key}`); process.exit(1); }
  return { productId: r.productId, variantId: r.variantId };
}

const apNotebook    = line("ap-notebook");
const apCards       = line("ap-flashcards");
const microNotebook = line("micro-notebook");
const microCards    = line("micro-flashcards");
const injectorCards = line("injector-cards");

const inventory = {
  // ── Kit bundles — notebooks only (card decks delivered as digital PDFs) ──────
  "ap-survival-kit":            [apNotebook],
  "micro-270-kit":              [microNotebook],
  "pre-nursing-bundle":         [apNotebook, microNotebook],
  // nurse-injector-clinical-kit is cards-only → fully digital, no Printify line
  "give-me-everything-kit":     [apNotebook, microNotebook],
  // ── Single-item legacy SKUs ──────────────────────────────────────────────────
  "NPA-STUDY-AP-BOOKLET":   apNotebook,
};

const json = JSON.stringify(inventory);
console.log("PRINTIFY_INVENTORY_JSON=" + json);

// Patch .env.local
const envPath = path.join(ROOT, ".env.local");
let existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const key = "PRINTIFY_INVENTORY_JSON";

if (existing.includes(key + "=")) {
  existing = existing.replace(new RegExp(`^${key}=.*$`, "m"), `${key}='${json}'`);
} else {
  existing = existing.trimEnd() + `\n${key}='${json}'\n`;
}
fs.writeFileSync(envPath, existing);
console.log(`\n✓  PRINTIFY_INVENTORY_JSON written to .env.local`);
console.log(`\nNext: copy the JSON above to Vercel → project ask-beau-tox → Environment Variables`);
console.log(`      team_RMdyhu1RXIusUPqvtSzeFGxN → Settings → Environment Variables → Add`);
