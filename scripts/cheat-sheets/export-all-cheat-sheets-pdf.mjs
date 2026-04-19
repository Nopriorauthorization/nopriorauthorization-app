/**
 * Export every shop "cheat sheet" HTML (from catalog) to PDF, then merge into one omnibus PDF.
 *
 * Output (gitignored `output/`):
 *   output/cheat-sheets-pdf/<slug>.pdf   — one PDF per product
 *   output/NPA-All-Cheat-Sheets-Omnibus.pdf — all sheets concatenated (order: slug A→Z)
 *
 * Requires: local HTML under public/forms (paths from catalog). Run on a machine with Chrome
 * (Puppeteer bundled Chromium works).
 *
 * Usage:
 *   node scripts/cheat-sheets/export-all-cheat-sheets-pdf.mjs
 *   node scripts/cheat-sheets/export-all-cheat-sheets-pdf.mjs --no-merge   # per-sheet only
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { PDFDocument } from "pdf-lib";

const ROOT = process.cwd();
const CATALOG_PATH = path.join(ROOT, "src", "lib", "delivery", "catalog.generated.json");
const OUT_DIR = path.join(ROOT, "output", "cheat-sheets-pdf");
const OMNIBUS_PATH = path.join(ROOT, "output", "NPA-All-Cheat-Sheets-Omnibus.pdf");

function loadRows() {
  const raw = fs.readFileSync(CATALOG_PATH, "utf8");
  const catalog = JSON.parse(raw);
  const products = catalog.products || [];
  return products
    .filter((p) => {
      const slug = String(p.productSlug || "");
      if (!slug.includes("cheat-sheet")) return false;
      const url = p.templates?.[0]?.editUrl;
      if (!url || typeof url !== "string") return false;
      if (!url.startsWith("/forms/") || !url.endsWith(".html")) return false;
      return true;
    })
    .map((p) => {
      const rel = p.templates[0].editUrl;
      const primary = path.join(ROOT, "public", rel.replace(/^\//, ""));
      const base = path.basename(rel, ".html");
      const preview = path.join(
        ROOT,
        "public",
        "forms",
        "previews",
        `${base}-PREVIEW.html`,
      );
      let abs = primary;
      let source = "primary";
      if (!fs.existsSync(primary) && fs.existsSync(preview)) {
        abs = preview;
        source = "preview-fallback";
      }
      return {
        slug: p.productSlug,
        title: p.productTitle,
        rel,
        abs,
        source,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

async function exportOne(browser, row, pdfPath) {
  if (!fs.existsSync(row.abs)) {
    console.error(`[skip] missing file (no preview fallback): ${row.rel}`);
    return false;
  }
  if (row.source === "preview-fallback") {
    console.error(`[warn] using preview HTML for ${row.slug} (full ${row.rel} not in repo)`);
  }
  const page = await browser.newPage();
  try {
    const fileUrl = pathToFileURL(row.abs).href;
    await page.goto(fileUrl, { waitUntil: "load", timeout: 120000 });
    await page.evaluate(() => document.fonts?.ready ?? Promise.resolve());
    await new Promise((r) => setTimeout(r, 800));
    await page.pdf({
      path: pdfPath,
      printBackground: true,
      preferCSSPageSize: true,
    });
    return true;
  } finally {
    await page.close();
  }
}

async function mergePdfs(pdfPaths, destPath) {
  const merged = await PDFDocument.create();
  for (const p of pdfPaths) {
    const bytes = fs.readFileSync(p);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const copied = await merged.copyPages(doc, doc.getPageIndices());
    copied.forEach((page) => merged.addPage(page));
  }
  const outBytes = await merged.save();
  fs.writeFileSync(destPath, outBytes);
}

async function main() {
  const noMerge = process.argv.includes("--no-merge");
  const rows = loadRows();
  if (rows.length === 0) {
    console.error("No cheat-sheet rows found in catalog.");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const puppeteer = await import("puppeteer");
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const exported = [];
  try {
    for (const row of rows) {
      const pdfPath = path.join(OUT_DIR, `${row.slug}.pdf`);
      process.stdout.write(`PDF  ${row.slug} … `);
      const ok = await exportOne(browser, row, pdfPath);
      if (ok) {
        exported.push({ row, pdfPath });
        console.log("ok");
      } else {
        console.log("skipped");
      }
    }
  } finally {
    await browser.close();
  }

  if (exported.length === 0) {
    console.error("Nothing exported.");
    process.exit(1);
  }

  if (!noMerge && exported.length > 0) {
    console.log(`Merging ${exported.length} PDFs → ${OMNIBUS_PATH}`);
    await mergePdfs(
      exported.map((e) => e.pdfPath),
      OMNIBUS_PATH,
    );
    const mb = (fs.statSync(OMNIBUS_PATH).size / (1024 * 1024)).toFixed(1);
    console.log(`Done. Omnibus size ~${mb} MB`);
  }

  console.log(`Per-sheet folder: ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
