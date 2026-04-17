/**
 * One-off / reusable: GLP-1 Side Effect Support Guide → PDF on Desktop.
 * Run: npx tsx scripts/ebooks/generate-glp1-side-effect-pdf.ts
 */
import fs from "fs";
import os from "os";
import path from "path";
import { pathToFileURL } from "url";

const ROOT = process.cwd();
const HTML_PATH = path.join(ROOT, "public", "hello-gorgeous", "glp1-side-effect-support-guide.html");
const OUT_PDF = path.join(os.homedir(), "Desktop", "GLP1-Side-Effect-Support-Guide.pdf");

async function main(): Promise<void> {
  if (!fs.existsSync(HTML_PATH)) {
    throw new Error(`Missing: ${HTML_PATH}`);
  }

  const puppeteer = await import("puppeteer");
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    await page.goto(pathToFileURL(HTML_PATH).href, {
      waitUntil: "networkidle0",
      timeout: 300_000,
    });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMediaType("print");
    await new Promise((r) => setTimeout(r, 1500));

    await page.pdf({
      path: OUT_PDF,
      format: "Letter",
      margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
    });

    const bytes = fs.statSync(OUT_PDF).size;
    console.log(`Wrote ${OUT_PDF} (${(bytes / 1e6).toFixed(2)} MB)`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
