#!/usr/bin/env node
/**
 * Exports public/micro-exam-prep/micro250-exam-prep.html → PDF (Puppeteer / Chromium).
 * Run: node scripts/printify/export-micro250-pdf.mjs
 *
 * Uses load + fonts.ready (not networkidle0) so Google Fonts on file:// do not hang.
 */
import fs from "fs";
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const HTML = path.join(ROOT, "public/micro-exam-prep/micro250-exam-prep.html");
const OUT = path.join(ROOT, "public/micro-exam-prep/micro250-exam-prep.pdf");

async function run() {
  if (!fs.existsSync(HTML)) {
    console.error("Missing:", HTML);
    process.exit(1);
  }

  console.log("Launching browser...");
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();

  const fileUrl = pathToFileURL(HTML).href;
  console.log("Loading HTML…", fileUrl);
  await page.goto(fileUrl, { waitUntil: "load", timeout: 120000 });
  await page.evaluate(() => document.fonts?.ready ?? Promise.resolve());
  await new Promise((r) => setTimeout(r, 1200));

  console.log("Exporting PDF…");
  await page.pdf({
    path: OUT,
    format: "Letter",
    printBackground: true,
    margin: { top: "0.35in", bottom: "0.35in", left: "0.45in", right: "0.45in" },
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log("✓ PDF saved →", OUT);
}

run().catch(e => { console.error(e); process.exit(1); });
