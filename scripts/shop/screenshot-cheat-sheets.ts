/**
 * Renders each clinical cheat sheet HTML from delivery-assets/forms and
 * screenshots the first `.page` for honest shop card thumbnails.
 *
 * Run: pnpm shop:screenshot-cheat-sheets
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const ROOT = process.cwd();
const FORMS_DIR = path.join(ROOT, "delivery-assets", "forms");
const OUT_DIR = path.join(ROOT, "public", "shop-previews", "cheat-sheets");

const ENTRIES: { slug: string; html: string }[] = [
  { slug: "botox-clinical-cheat-sheet", html: "NPA-Botox-Clinical-Cheat-Sheet.html" },
  { slug: "iv-therapy-clinical-cheat-sheet", html: "NPA-IV-Therapy-Clinical-Cheat-Sheet.html" },
  { slug: "peptide-therapy-clinical-cheat-sheet", html: "NPA-Peptide-Therapy-Clinical-Cheat-Sheet.html" },
  { slug: "hormone-therapy-clinical-cheat-sheet", html: "NPA-Hormone-Therapy-Clinical-Cheat-Sheet.html" },
  { slug: "glp1-clinical-cheat-sheet", html: "NPA-GLP1-Clinical-Cheat-Sheet.html" },
  { slug: "dermal-filler-clinical-cheat-sheet", html: "NPA-Dermal-Filler-Clinical-Cheat-Sheet.html" },
  { slug: "pellet-therapy-clinical-cheat-sheet", html: "NPA-Pellet-Therapy-Clinical-Cheat-Sheet.html" },
  { slug: "pharmaceutical-reference-cheat-sheet", html: "NPA-Pharmaceutical-Reference-Cheat-Sheet.html" },
  { slug: "olympia-iv-dosing-guide-cheat-sheet", html: "NPA-Olympia-IV-Dosing-Guide-Cheat-Sheet.html" },
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
        console.error(`[cheat-sheet-thumb] missing: ${filePath}`);
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
      // Let @import Google Fonts settle
      await new Promise((r) => setTimeout(r, 2000));

      const firstPage = await page.$(".page");
      if (!firstPage) {
        console.error(`[cheat-sheet-thumb] no .page in ${html}`);
        process.exitCode = 1;
        await page.close();
        continue;
      }

      const outPath = path.join(OUT_DIR, `${slug}.png`);
      await firstPage.screenshot({ path: outPath, type: "png" });
      await page.close();
      console.log(`[cheat-sheet-thumb] wrote ${path.relative(ROOT, outPath)}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
