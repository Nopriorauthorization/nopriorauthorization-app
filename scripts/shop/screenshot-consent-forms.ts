/**
 * Screenshots first `.page` of standalone NPA consent HTML in delivery-assets/forms
 * for honest shop card thumbnails.
 *
 * Run: npx tsx scripts/shop/screenshot-consent-forms.ts
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const ROOT = process.cwd();
const FORMS_DIR = path.join(ROOT, "delivery-assets", "forms");
const OUT_DIR = path.join(ROOT, "public", "shop-previews", "standalone-consents");

const ENTRIES: { slug: string; html: string }[] = [
  { slug: "consent-botox-neurotoxins", html: "NPA-Consent-Botox-Neurotoxins.html" },
  { slug: "consent-dermal-filler", html: "NPA-Consent-Dermal-Filler.html" },
  { slug: "consent-glp1-weight-loss", html: "NPA-Consent-GLP1-Weight-Loss.html" },
  { slug: "consent-hormone-therapy", html: "NPA-Consent-Hormone-Therapy.html" },
  { slug: "consent-iv-im-therapy", html: "NPA-Consent-IV-Therapy.html" },
  { slug: "consent-laser-ipl", html: "NPA-Consent-Laser-IPL.html" },
  { slug: "consent-lash-extensions", html: "NPA-Consent-Lash-Extensions.html" },
  { slug: "consent-waxing", html: "NPA-Consent-Waxing.html" },
  { slug: "consent-microneedling-rf", html: "NPA-Consent-Microneedling-RF.html" },
  { slug: "consent-photography-hipaa", html: "NPA-Consent-Photography-HIPAA.html" },
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
        console.error(`[consent-thumb] missing: ${filePath}`);
        process.exitCode = 1;
        continue;
      }

      const page = await browser.newPage();
      await page.setViewport({
        width: 1400,
        height: 2400,
        deviceScaleFactor: 2,
      });

      const url = pathToFileURL(filePath).href;
      await page.goto(url, { waitUntil: "networkidle2", timeout: 120_000 });
      await page.waitForSelector(".page", { timeout: 30_000 });
      await new Promise((r) => setTimeout(r, 2000));

      const firstPage = await page.$(".page");
      if (!firstPage) {
        console.error(`[consent-thumb] no .page in ${html}`);
        process.exitCode = 1;
        await page.close();
        continue;
      }

      const outPath = path.join(OUT_DIR, `${slug}.png`);
      await firstPage.screenshot({ path: outPath, type: "png" });
      await page.close();
      console.log(`[consent-thumb] wrote ${path.relative(ROOT, outPath)}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
