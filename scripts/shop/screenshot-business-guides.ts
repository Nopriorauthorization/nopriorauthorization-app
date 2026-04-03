/**
 * Screenshots first `.page` of business-systems HTML guides in delivery-assets/forms.
 * Run: npx tsx scripts/shop/screenshot-business-guides.ts
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const ROOT = process.cwd();
const FORMS_DIR = path.join(ROOT, "delivery-assets", "forms");
const OUT_DIR = path.join(ROOT, "public", "shop-previews", "business-systems");

const ENTRIES: { slug: string; html: string }[] = [
  {
    slug: "insurance-legal-compliance-guide",
    html: "NPA-Insurance-Legal-Compliance-Guide.html",
  },
  { slug: "phase-2-business-bundle", html: "NPA-Phase2-Business-Bundle.html" },
  { slug: "difficult-client-scripts", html: "NPA-Difficult-Client-Scripts.html" },
  { slug: "before-after-photo-system", html: "NPA-Before-After-Photo-System.html" },
  { slug: "vendor-supplier-directory", html: "NPA-Vendor-Supplier-Directory.html" },
];

async function main() {
  const puppeteer = await import("puppeteer");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const { slug, html } of ENTRIES) {
      const filePath = path.join(FORMS_DIR, html);
      if (!fs.existsSync(filePath)) {
        console.error(`[business-guide-thumb] missing: ${filePath}`);
        process.exitCode = 1;
        continue;
      }

      const page = await browser.newPage();
      await page.setViewport({
        width: 1400,
        height: 2600,
        deviceScaleFactor: 2,
      });

      const url = pathToFileURL(filePath).href;
      await page.goto(url, { waitUntil: "networkidle2", timeout: 120_000 });
      await page.waitForSelector(".page", { timeout: 30_000 });
      await new Promise((r) => setTimeout(r, 2000));

      const firstPage = await page.$(".page");
      if (!firstPage) {
        console.error(`[business-guide-thumb] no .page in ${html}`);
        process.exitCode = 1;
        await page.close();
        continue;
      }

      const outPath = path.join(OUT_DIR, `${slug}.png`);
      await firstPage.screenshot({ path: outPath, type: "png" });
      await page.close();
      console.log(`[business-guide-thumb] wrote ${path.relative(ROOT, outPath)}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
