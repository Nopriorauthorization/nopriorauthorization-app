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
const DEFAULT_OUT_DIR = path.join(ROOT, "public", "shop-previews", "cheat-sheets");

const ENTRIES: { slug: string; html: string; outSubdir?: string }[] = [
  { slug: "botox-clinical-cheat-sheet", html: "NPA-Botox-Clinical-Cheat-Sheet.html" },
  { slug: "iv-therapy-clinical-cheat-sheet", html: "NPA-IV-Therapy-Clinical-Cheat-Sheet.html" },
  { slug: "peptide-therapy-clinical-cheat-sheet", html: "NPA-Peptide-Therapy-Clinical-Cheat-Sheet.html" },
  { slug: "hormone-therapy-clinical-cheat-sheet", html: "NPA-Hormone-Therapy-Clinical-Cheat-Sheet.html" },
  { slug: "glp1-clinical-cheat-sheet", html: "NPA-GLP1-Clinical-Cheat-Sheet.html" },
  { slug: "dermal-filler-clinical-cheat-sheet", html: "NPA-Dermal-Filler-Clinical-Cheat-Sheet.html" },
  { slug: "pellet-therapy-clinical-cheat-sheet", html: "NPA-Pellet-Therapy-Clinical-Cheat-Sheet.html" },
  { slug: "pharmaceutical-reference-cheat-sheet", html: "NPA-Pharmaceutical-Reference-Cheat-Sheet.html" },
  { slug: "olympia-iv-dosing-guide-cheat-sheet", html: "NPA-Olympia-IV-Dosing-Guide-Cheat-Sheet.html" },
  { slug: "lash-extensions-clinical-cheat-sheet", html: "NPA-Lash-Extensions-Cheat-Sheet.html" },
  { slug: "lash-lift-perm-clinical-cheat-sheet", html: "NPA-Lash-Lift-Perm-Cheat-Sheet.html" },
  { slug: "brow-henna-clinical-cheat-sheet", html: "NPA-Brow-Henna-Cheat-Sheet.html" },
  { slug: "waxing-clinical-cheat-sheet", html: "NPA-Waxing-Cheat-Sheet.html" },
  { slug: "ipl-laser-clinical-cheat-sheet", html: "NPA-IPL-Laser-Cheat-Sheet.html" },
  { slug: "lip-filler-anatomy-cheat-sheet", html: "NPA-Lip-Filler-Anatomy-Cheat-Sheet.html" },
  { slug: "botox-dosing-zones-cheat-sheet", html: "NPA-Botox-Dosing-Zones-Cheat-Sheet.html" },
  { slug: "cannula-vs-needle-cheat-sheet", html: "NPA-Cannula-vs-Needle-Cheat-Sheet.html" },
  { slug: "filler-product-comparison-cheat-sheet", html: "NPA-Filler-Product-Comparison-Cheat-Sheet.html" },
  { slug: "vascular-occlusion-protocol-cheat-sheet", html: "NPA-Vascular-Occlusion-Protocol-Cheat-Sheet.html" },
  { slug: "tirzepatide-vs-semaglutide-cheat-sheet", html: "NPA-Tirzepatide-vs-Semaglutide-Cheat-Sheet.html" },
  { slug: "glp1-titration-cheat-sheet", html: "NPA-GLP1-Titration-Cheat-Sheet.html" },
  { slug: "hormone-lab-reference-cheat-sheet", html: "NPA-Hormone-Lab-Reference-Cheat-Sheet.html" },
  { slug: "pellet-therapy-dosing-cheat-sheet", html: "NPA-Pellet-Therapy-Dosing-Cheat-Sheet.html" },
  { slug: "trt-men-vs-women-cheat-sheet", html: "NPA-TRT-Men-vs-Women-Cheat-Sheet.html" },
  { slug: "chemical-peel-reference-cheat-sheet", html: "NPA-Chemical-Peel-Reference-Cheat-Sheet.html" },
  { slug: "fitzpatrick-classification-cheat-sheet", html: "NPA-Fitzpatrick-Classification-Cheat-Sheet.html" },
  { slug: "microneedling-depth-cheat-sheet", html: "NPA-Microneedling-Depth-Cheat-Sheet.html" },
  { slug: "laser-wavelength-reference-cheat-sheet", html: "NPA-Laser-Wavelength-Reference-Cheat-Sheet.html" },
  { slug: "skincare-ingredient-interactions-cheat-sheet", html: "NPA-Skincare-Ingredient-Interactions-Cheat-Sheet.html" },
  { slug: "retail-pricing-formula-cheat-sheet", html: "NPA-Retail-Pricing-Formula-Cheat-Sheet.html" },
  { slug: "membership-pricing-calculator-cheat-sheet", html: "NPA-Membership-Pricing-Calculator-Cheat-Sheet.html" },
  { slug: "staff-roles-cheat-sheet", html: "NPA-Staff-Roles-Cheat-Sheet.html" },
  { slug: "new-patient-intake-cheat-sheet", html: "NPA-New-Patient-Intake-Cheat-Sheet.html" },
  { slug: "treatment-room-setup-cheat-sheet", html: "NPA-Treatment-Room-Setup-Cheat-Sheet.html" },
  { slug: "injection-techniques-cheat-sheet", html: "NPA-Injection-Techniques-Cheat-Sheet.html" },
  {
    slug: "31-day-social-media-content-calendar",
    html: "NPA-31-Day-Social-Media-Content-Calendar.html",
    outSubdir: "social-media",
  },
];

async function main() {
  const puppeteer = await import("puppeteer");
  fs.mkdirSync(DEFAULT_OUT_DIR, { recursive: true });

  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const { slug, html, outSubdir } of ENTRIES) {
      const filePath = path.join(FORMS_DIR, html);
      if (!fs.existsSync(filePath)) {
        console.error(`[cheat-sheet-thumb] missing: ${filePath}`);
        process.exitCode = 1;
        continue;
      }

      const outDir = outSubdir
        ? path.join(ROOT, "public", "shop-previews", outSubdir)
        : DEFAULT_OUT_DIR;
      fs.mkdirSync(outDir, { recursive: true });

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

      const outPath = path.join(outDir, `${slug}.png`);
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
