#!/usr/bin/env node
/**
 * Generates Etsy-ready PDFs for all 6 GLP-1 / weight-loss products.
 * Output: etsy-products/store-launch/delivery/glp1-family/
 */
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "etsy-products/store-launch/delivery/glp1-family");
fs.mkdirSync(OUT, { recursive: true });

const CATALOG_PATH = path.join(ROOT, "src/lib/delivery/catalog.generated.json");
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
const products = catalog.products || [];

function getProduct(slug) {
  return products.find((p) => p.productSlug === slug) || null;
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildLinksHtml(title, tagline, templates) {
  const rows = templates.map((t, i) => `
    <tr>
      <td class="num">${i + 1}</td>
      <td class="title">${esc(t.title)}</td>
      <td class="link"><a href="${esc(t.editUrl)}">Open →</a></td>
    </tr>`).join("");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
    *{box-sizing:border-box}
    body{font-family:'DM Sans',system-ui,sans-serif;color:#1a1a1a;max-width:720px;margin:0 auto;padding:32px 24px 48px}
    h1{font-family:'Playfair Display',Georgia,serif;font-size:1.6rem;margin:0 0 8px}
    .brand{color:#d4537e;font-weight:700;font-size:.75rem;letter-spacing:.2em;text-transform:uppercase}
    .lead{color:#444;margin:16px 0 24px}
    h2{font-size:1rem;margin:24px 0 10px;border-bottom:2px solid #fbeaf0;padding-bottom:6px}
    ol{margin:0;padding-left:1.2rem;color:#333}
    ol li{margin:6px 0}
    table{width:100%;border-collapse:collapse;font-size:.9rem}
    th,td{text-align:left;padding:9px 8px;border-bottom:1px solid #eee;vertical-align:top}
    th{background:#fdf8fb;font-weight:600;font-size:.75rem;text-transform:uppercase;letter-spacing:.06em}
    .num{width:32px;color:#d4537e;font-weight:700}
    .title{font-weight:600}
    .link a{color:#d4537e;word-break:break-all}
    .note{margin-top:24px;padding:14px;background:#f9f4f7;border-radius:8px;font-size:.88rem;color:#444}
    @media print{body{padding:16px;max-width:none}.link a{color:#000;text-decoration:underline}tr{break-inside:avoid}}
  </style></head><body>
  <p class="brand">No Prior Authorization</p>
  <h1>${esc(title)}</h1>
  <p class="lead">${esc(tagline)}</p>
  <h2>How to use</h2>
  <ol>
    <li>Click <strong>Open →</strong> for each template below.</li>
    <li>In Canva, choose <strong>Use template</strong> to save your own copy.</li>
    <li>Customize with your practice name, logo, and colors.</li>
  </ol>
  <h2>Your ${templates.length} template${templates.length !== 1 ? "s" : ""}</h2>
  <table><thead><tr><th>#</th><th>Template</th><th>Link</th></tr></thead>
  <tbody>${rows}</tbody></table>
  <div class="note">Questions? <a href="mailto:hello@nopriorauthorization.com">hello@nopriorauthorization.com</a> — we respond within 24 hours on business days.<br/>
  © No Prior Authorization · nopriorauthorization.com</div>
</body></html>`;
}

const PRODUCTS = [
  {
    slug: "glp1-clinical-cheat-sheet",
    filename: "01-glp1-clinical-cheat-sheet",
    type: "html",
    htmlFile: "NPA-GLP1-Clinical-Cheat-Sheet.html",
  },
  {
    slug: "tirzepatide-vs-semaglutide-cheat-sheet",
    filename: "02-tirzepatide-vs-semaglutide",
    type: "html",
    htmlFile: "NPA-Tirzepatide-vs-Semaglutide-Cheat-Sheet.html",
  },
  {
    slug: "glp1-titration-cheat-sheet",
    filename: "03-glp1-titration-cheat-sheet",
    type: "html",
    htmlFile: "NPA-GLP1-Titration-Cheat-Sheet.html",
  },
  {
    slug: "consent-glp1-weight-loss",
    filename: "04-consent-glp1-weight-loss",
    type: "html",
    htmlFile: "NPA-Consent-GLP1-Weight-Loss.html",
  },
  {
    slug: "glp1-story-templates",
    filename: "05-glp1-story-templates",
    type: "links",
    title: "GLP-1 Story Templates",
    tagline: "10 Instagram story templates for your GLP-1 / semaglutide program. Free Canva account required.",
  },
  {
    slug: "weight-loss-kit",
    filename: "06-weight-loss-patient-onboarding-kit",
    type: "links",
    title: "GLP-1 Weight Loss Patient Onboarding Kit",
    tagline: "7 Canva templates: intake form, consent, patient guide, trackers, aftercare card, and photo release.",
  },
];

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const p of PRODUCTS) {
    const pdfPath = path.join(OUT, `${p.filename}.pdf`);
    const page = await browser.newPage();

    if (p.type === "html") {
      // Try delivery-assets first, then public/forms
      const candidates = [
        path.join(ROOT, "delivery-assets/forms", p.htmlFile),
        path.join(ROOT, "public/forms", p.htmlFile),
      ];
      const htmlFile = candidates.find((c) => fs.existsSync(c));
      if (!htmlFile) {
        console.warn(`⚠  SKIP ${p.slug}: HTML not found`);
        await page.close();
        continue;
      }
      await page.goto(`file://${htmlFile}`, { waitUntil: "networkidle0", timeout: 20000 });
    } else {
      // Build links delivery page from catalog
      const product = getProduct(p.slug);
      if (!product || !product.templates?.length) {
        console.warn(`⚠  SKIP ${p.slug}: not in catalog or no templates`);
        await page.close();
        continue;
      }
      const html = buildLinksHtml(p.title, p.tagline, product.templates);
      await page.setContent(html, { waitUntil: "networkidle0" });
    }

    await page.pdf({
      path: pdfPath,
      format: "Letter",
      printBackground: true,
      margin: { top: "0.5in", bottom: "0.5in", left: "0.5in", right: "0.5in" },
    });
    await page.close();
    console.log(`✓  ${p.filename}.pdf`);
  }

  await browser.close();

  console.log(`\nAll PDFs saved to:\n  ${path.relative(ROOT, OUT)}/`);
  console.log("\nUpload each PDF to its matching Etsy listing as the Digital file.");
}

main().catch((e) => { console.error(e); process.exit(1); });
