#!/usr/bin/env node
/**
 * Exports public/micro-exam-prep/micro250-exam-prep.html → PDF.
 * Run: node scripts/printify/export-micro250-pdf.mjs
 */
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const HTML = path.join(ROOT, "public/micro-exam-prep/micro250-exam-prep.html");
const OUT  = path.join(ROOT, "public/micro-exam-prep/micro250-exam-prep.pdf");

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();

  console.log("Loading HTML...");
  await page.goto("file://" + HTML, { waitUntil: "networkidle0", timeout: 60000 });

  console.log("Exporting PDF...");
  await page.pdf({
    path: OUT,
    format: "Letter",
    printBackground: true,
    margin: { top: "0.4in", bottom: "0.4in", left: "0.5in", right: "0.5in" },
  });

  await browser.close();
  console.log(`✓ PDF saved → ${OUT}`);
}

run().catch(e => { console.error(e); process.exit(1); });
