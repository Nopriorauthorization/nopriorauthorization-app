#!/usr/bin/env node
/**
 * Converts all 7 Etsy delivery HTML files to PDFs using puppeteer.
 * Usage: node scripts/generate-etsy-pdfs.mjs
 */
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DELIVERY = path.join(ROOT, "etsy-products/store-launch/delivery");

const SKUS = [
  "weight-loss",
  "botox",
  "filler",
  "iv-therapy",
  "combo-bundle",
  "complete-injector",
  "lash",
];

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const sku of SKUS) {
    const htmlPath = path.join(DELIVERY, sku, `${sku}-etsy-delivery.html`);
    const pdfPath = path.join(DELIVERY, sku, `${sku}-etsy-delivery.pdf`);

    if (!existsSync(htmlPath)) {
      console.warn(`⚠  SKIP ${sku}: HTML not found at ${htmlPath}`);
      continue;
    }

    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0", timeout: 15000 });
    await page.pdf({
      path: pdfPath,
      format: "Letter",
      printBackground: true,
      margin: { top: "0.5in", bottom: "0.5in", left: "0.5in", right: "0.5in" },
    });
    await page.close();
    console.log(`✓  ${sku} → ${path.relative(ROOT, pdfPath)}`);
  }

  await browser.close();
  console.log("\nAll PDFs ready. Upload each one as the Etsy digital file for its listing.");
}

main().catch((e) => { console.error(e); process.exit(1); });
