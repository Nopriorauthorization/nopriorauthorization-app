/**
 * Renders `delivery-assets/forms/NPA-Informed-Beauty-Guide-PREMIUM.html` to PDFs
 * on the user's Desktop: print-ready (CMYK + bleed metadata) and a lighter web PDF.
 *
 * Requires: Puppeteer (devDependency), pdf-lib, Ghostscript (`brew install ghostscript`).
 *
 * Run: pnpm ibg:pdf   or   npx tsx scripts/ebooks/generate-informed-beauty-guide-pdfs.ts
 */
import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { pathToFileURL } from "url";
import { PDFDocument } from "pdf-lib";

const ROOT = process.cwd();
const HTML_PATH = path.join(ROOT, "delivery-assets", "forms", "NPA-Informed-Beauty-Guide-PREMIUM.html");
const DESKTOP = path.join(process.env.HOME ?? "", "Desktop");
const OUT_PRINT = path.join(DESKTOP, "Informed-Beauty-Guide-PRINT-FINAL.pdf");
const OUT_WEB = path.join(DESKTOP, "Informed-Beauty-Guide-WEB-FINAL.pdf");
const TMP_RGB = path.join(os.tmpdir(), `ibg-master-rgb-${process.pid}.pdf`);
const TMP_BLEED = path.join(os.tmpdir(), `ibg-bleed-rgb-${process.pid}.pdf`);

/** 0.125" bleed in PDF points (1 pt = 1/72") */
const BLEED_PT = 0.125 * 72;

const PRINT_CSS = `
@media print {
  @page {
    size: letter;
    margin: 0;
  }
  html, body {
    background: #fff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
  }
  .main-nav,
  .print-bar {
    display: none !important;
    height: 0 !important;
    overflow: hidden !important;
    visibility: hidden !important;
  }
  .book-section,
  .sheet-section {
    display: block !important;
  }
  .page {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    background: #fff !important;
  }
  .cover {
    min-height: 0 !important;
  }
  .sheet-wrapper {
    background: #fff !important;
    padding: 0 !important;
    min-height: 0 !important;
  }
  .cs-page {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    box-shadow: none !important;
    min-height: 0 !important;
    page-break-after: always;
    page-break-inside: avoid;
  }
}
`;

function findGhostscript(): string | null {
  const candidates = ["/opt/homebrew/bin/gs", "/usr/local/bin/gs", "gs"];
  for (const c of candidates) {
    try {
      if (c === "gs") {
        execFileSync("gs", ["--version"], { stdio: "pipe" });
        return "gs";
      }
      if (fs.existsSync(c)) return c;
    } catch {
      /* try next */
    }
  }
  return null;
}

async function renderHtmlToPdf(outPath: string): Promise<void> {
  if (!fs.existsSync(HTML_PATH)) {
    throw new Error(`Missing HTML: ${HTML_PATH}`);
  }

  const puppeteer = await import("puppeteer");
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 1224,
      height: 1584,
      deviceScaleFactor: 2,
    });
    const url = pathToFileURL(HTML_PATH).href;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 180_000 });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: PRINT_CSS });
    await page.emulateMediaType("print");
    await new Promise((r) => setTimeout(r, 800));

    await page.pdf({
      path: outPath,
      format: "Letter",
      margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
      printBackground: true,
      preferCSSPageSize: false,
      scale: 1,
      tagged: true,
      displayHeaderFooter: false,
    });
  } finally {
    await browser.close();
  }
}

async function addBleedBoxes(pdfPath: string, outPath: string): Promise<void> {
  const bytes = fs.readFileSync(pdfPath);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pages = doc.getPages();

  for (const page of pages) {
    const mb = page.getMediaBox();
    const tx = mb.x;
    const ty = mb.y;
    const w = mb.width;
    const h = mb.height;
    page.setMediaBox(tx - BLEED_PT, ty - BLEED_PT, w + 2 * BLEED_PT, h + 2 * BLEED_PT);
    page.setTrimBox(tx, ty, w, h);
    page.setBleedBox(tx - BLEED_PT, ty - BLEED_PT, w + 2 * BLEED_PT, h + 2 * BLEED_PT);
    page.setCropBox(tx - BLEED_PT, ty - BLEED_PT, w + 2 * BLEED_PT, h + 2 * BLEED_PT);
  }

  const out = await doc.save();
  fs.writeFileSync(outPath, out);
}

function runGhostscript(gs: string, args: string[]): void {
  execFileSync(gs, args, { stdio: "inherit" });
}

async function main(): Promise<void> {
  if (!process.env.HOME) {
    throw new Error("HOME is not set; cannot resolve Desktop.");
  }
  if (!fs.existsSync(DESKTOP)) {
    throw new Error(`Desktop not found: ${DESKTOP}`);
  }

  console.log("Rendering Letter PDF (0.5\" margins, print media, no nav)…");
  await renderHtmlToPdf(TMP_RGB);

  console.log("Adding 0.125\" bleed / trim PDF boxes (metadata for print vendors)…");
  await addBleedBoxes(TMP_RGB, TMP_BLEED);

  const gs = findGhostscript();
  if (!gs) {
    console.warn("Ghostscript not found. Copying RGB PDF with bleed to PRINT; WEB will be uncompressed RGB.");
    fs.copyFileSync(TMP_BLEED, OUT_PRINT);
    fs.copyFileSync(TMP_RGB, OUT_WEB);
    try {
      fs.unlinkSync(TMP_RGB);
      fs.unlinkSync(TMP_BLEED);
    } catch {
      /* ignore */
    }
    console.log(`\nWrote:\n  ${OUT_PRINT}\n  ${OUT_WEB}`);
    return;
  }

  console.log("Converting to CMYK print PDF (prepress, fonts embedded, ~300 DPI raster policy)…");
  try {
    runGhostscript(gs, [
      "-dSAFER",
      "-dBATCH",
      "-dNOPAUSE",
      "-sDEVICE=pdfwrite",
      "-dPDFSETTINGS=/prepress",
      "-dCompatibilityLevel=1.7",
      "-dEmbedAllFonts=true",
      "-dSubsetFonts=true",
      "-dCompressFonts=true",
      "-dColorImageDownsampleType=/Bicubic",
      "-dColorImageResolution=300",
      "-dGrayImageDownsampleType=/Bicubic",
      "-dGrayImageResolution=300",
      "-dMonoImageDownsampleType=/Subsample",
      "-dMonoImageResolution=1200",
      "-sProcessColorModel=DeviceCMYK",
      "-sColorConversionStrategy=CMYK",
      "-sOutputFile=" + OUT_PRINT,
      TMP_BLEED,
    ]);
  } catch (e) {
    console.warn("CMYK Ghostscript step failed; writing RGB bleed PDF as PRINT fallback.", e);
    fs.copyFileSync(TMP_BLEED, OUT_PRINT);
  }

  console.log("Building lighter RGB web PDF…");
  try {
    runGhostscript(gs, [
      "-dSAFER",
      "-dBATCH",
      "-dNOPAUSE",
      "-sDEVICE=pdfwrite",
      "-dPDFSETTINGS=/ebook",
      "-dCompatibilityLevel=1.7",
      "-dEmbedAllFonts=true",
      "-dCompressFonts=true",
      "-dColorImageDownsampleType=/Bicubic",
      "-dColorImageResolution=150",
      "-dGrayImageDownsampleType=/Bicubic",
      "-dGrayImageResolution=150",
      "-sOutputFile=" + OUT_WEB,
      TMP_RGB,
    ]);
  } catch (e) {
    console.warn("Web compression failed; copying master RGB.", e);
    fs.copyFileSync(TMP_RGB, OUT_WEB);
  }

  try {
    fs.unlinkSync(TMP_RGB);
    fs.unlinkSync(TMP_BLEED);
  } catch {
    /* ignore */
  }

  const printBytes = fs.statSync(OUT_PRINT).size;
  const webBytes = fs.statSync(OUT_WEB).size;
  console.log(`\nDone.\n  PRINT (CMYK + bleed metadata): ${OUT_PRINT} (${(printBytes / 1e6).toFixed(2)} MB)\n  WEB (compressed RGB):            ${OUT_WEB} (${(webBytes / 1e6).toFixed(2)} MB)`);
  console.log(
    "\nNote: CMYK conversion shifts saturated screen colors (e.g. brand pink) to press-safe separations; proof before a large print run.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
