#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const GEN_DIR = path.join(ROOT, "public/shop-previews/generated");
const PRODUCTS_FILE = path.join(ROOT, "src/lib/shop/products.ts");
if (!fs.existsSync(GEN_DIR)) { console.error("Run generate-product-mockups.mjs first."); process.exit(1); }
const files = fs.readdirSync(GEN_DIR).filter(f => f.endsWith("-thumbnail.png"));
let src = fs.readFileSync(PRODUCTS_FILE, "utf8");
const slugThumbnailMatch = src.match(/const SLUG_THUMBNAIL: Record<string, string> = \{([\s\S]*?)\};/);
if (!slugThumbnailMatch) { console.error("Could not find SLUG_THUMBNAIL"); process.exit(1); }
const existingBlock = slugThumbnailMatch[1];
const newLines = [];
for (const file of files) {
  const slug = file.replace("-thumbnail.png", "");
  if (existingBlock.includes(`"${slug}"`)) continue;
  newLines.push(`  "${slug}": "/shop-previews/generated/${file}",`);
}
if (newLines.length === 0) { console.log("All already wired."); process.exit(0); }
const insertion = "\n  // ── Generated mockups ─────────────────────────────────────────────────\n" + newLines.join("\n") + "\n";
const updated = src.replace(/const SLUG_THUMBNAIL: Record<string, string> = \{([\s\S]*?)\};/, (match, inner) => match.replace(inner, inner.trimEnd() + insertion));
fs.writeFileSync(PRODUCTS_FILE, updated);
console.log(`✓ Added ${newLines.length} entries to SLUG_THUMBNAIL`);
