/**
 * NCLEX landing slideshow assets: at-a-glance (lab table section) vs
 * full-guide layout (pharm hero + TOC). Run: pnpm study-guides:nclex-slides
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const ROOT = process.cwd();
const FORMS = path.join(ROOT, "delivery-assets", "forms");
const OUT_DIR = path.join(ROOT, "public", "study-guides");

async function main() {
  const puppeteer = await import("puppeteer");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    // Slide 1: dense lab reference (BMP section)
    const labPath = path.join(FORMS, "NPA-NCLEX-01-Lab-Values.html");
    const labUrl = `${pathToFileURL(labPath).href}#bmp`;
    const p1 = await browser.newPage();
    await p1.setViewport({ width: 1100, height: 1200, deviceScaleFactor: 2 });
    await p1.goto(labUrl, { waitUntil: "networkidle2", timeout: 120_000 });
    await new Promise((r) => setTimeout(r, 2500));
    const bmp = await p1.$("#bmp");
    if (!bmp) throw new Error("Missing #bmp in lab values HTML");
    const out1 = path.join(OUT_DIR, "nclex-slide-at-a-glance.png");
    await bmp.screenshot({ path: out1, type: "png" });
    await p1.close();
    console.log(`[nclex-slides] wrote ${path.relative(ROOT, out1)}`);

    // Slide 2: structured guide (hero + TOC)
    const pharmPath = path.join(FORMS, "NPA-NCLEX-02-Pharmacology.html");
    const pharmUrl = pathToFileURL(pharmPath).href;
    const p2 = await browser.newPage();
    await p2.setViewport({ width: 1100, height: 920, deviceScaleFactor: 2 });
    await p2.goto(pharmUrl, { waitUntil: "networkidle2", timeout: 120_000 });
    await new Promise((r) => setTimeout(r, 2500));
    const out2 = path.join(OUT_DIR, "nclex-slide-study-guide-depth.png");
    await p2.screenshot({
      path: out2,
      type: "png",
      clip: { x: 0, y: 0, width: 1100, height: 920 },
    });
    await p2.close();
    console.log(`[nclex-slides] wrote ${path.relative(ROOT, out2)}`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
