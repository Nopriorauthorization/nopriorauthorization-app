/**
 * Renders public/book/sneak-peek.html to a static PDF for sharing (social, email, etc.).
 *
 * RUN: npm run sneak-peek:pdf
 * OUT: public/book/HelloGorgeous-Book-Sneak-Peek.pdf
 * URL: https://nopriorauthorization.com/book/HelloGorgeous-Book-Sneak-Peek.pdf
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const HTML_PATH = path.join(ROOT, "public", "book", "sneak-peek.html");
const OUT_PATH = path.join(ROOT, "public", "book", "HelloGorgeous-Book-Sneak-Peek.pdf");

async function main() {
  if (!fs.existsSync(HTML_PATH)) {
    console.error("Missing:", HTML_PATH);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });
  await page.goto(`file://${path.resolve(HTML_PATH)}`, { waitUntil: "networkidle0", timeout: 120000 });
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await new Promise((r) => setTimeout(r, 1500));
  await page.emulateMediaType("print");

  await page.pdf({
    path: OUT_PATH,
    format: "A4",
    printBackground: true,
    margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
    preferCSSPageSize: false,
  });

  await browser.close();

  const bytes = fs.statSync(OUT_PATH).size;
  const mb = (bytes / 1024 / 1024).toFixed(2);
  console.log(`Wrote ${OUT_PATH} (${mb} MB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
