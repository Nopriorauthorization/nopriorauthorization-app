#!/usr/bin/env node
/**
 * Generates Etsy buyer delivery files (HTML + TXT) for all 7 Etsy SKUs.
 * Reads catalog.generated.json — re-run after catalog rebuilds.
 *
 * Usage: node scripts/generate-all-etsy-delivery.mjs
 *
 * Output: etsy-products/store-launch/delivery/<slug>/
 *   - <slug>-etsy-delivery.html  → Print → Save as PDF → upload to Etsy
 *   - <slug>-links.txt           → optional second file for Etsy download
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG = path.join(ROOT, "src/lib/delivery/catalog.generated.json");

/** Etsy SKU folder → catalog slug + buyer-facing display name */
const SKUS = [
  {
    folder: "weight-loss",
    slug: "glp1-story-templates",
    displayName: "GLP-1 / Weight Loss Story Templates",
    tagline: "10 Instagram story templates for your GLP-1 / semaglutide program.",
  },
  {
    folder: "botox",
    slug: "botox-social-bundle",
    displayName: "Botox & Neurotoxin Social Media Bundle",
    tagline: "10 Canva templates for promoting Botox, Dysport, and neurotoxin treatments.",
  },
  {
    folder: "filler",
    slug: "filler-social-bundle",
    displayName: "Dermal Filler Social Media Bundle",
    tagline: "10 Canva templates for lip filler, cheek filler, and all dermal filler services.",
  },
  {
    folder: "iv-therapy",
    slug: "iv-therapy-social-kit",
    displayName: "IV Therapy Social Media Kit",
    tagline: "14 Canva templates for IV drip therapy, vitamin shots, and hydration services.",
  },
  {
    folder: "combo-bundle",
    slug: "combo-bundle",
    displayName: "Complete Med Spa Digital Bundle — IV + Weight Loss + Social",
    tagline: "9 Canva templates spanning IV therapy, GLP-1 weight loss, and med spa social content.",
  },
  {
    folder: "complete-injector",
    slug: "complete-injector-bundle",
    displayName: "Complete Injector Bundle",
    tagline: "10 Canva templates covering every angle of your injectable services.",
  },
  {
    folder: "lash",
    slug: "lash-aftercare-kit",
    displayName: "Lash Extension & Lash Lift Client Education Kit",
    tagline: "5 Canva templates for lash extension and lash lift aftercare education.",
  },
];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(sku, templates) {
  const rows = templates
    .map(
      (t, i) => `
    <tr>
      <td class="num">${i + 1}</td>
      <td class="title">${esc(t.title)}</td>
      <td class="link"><a href="${esc(t.editUrl)}">Open in Canva →</a></td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(sku.displayName)} — Your download | No Prior Authorization</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
    * { box-sizing: border-box; }
    body {
      font-family: 'DM Sans', system-ui, sans-serif;
      color: #1a1a1a;
      line-height: 1.55;
      max-width: 720px;
      margin: 0 auto;
      padding: 32px 24px 48px;
    }
    h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.65rem; margin: 0 0 8px; color: #111; }
    .brand { color: #d4537e; font-weight: 700; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; }
    .lead { color: #444; margin: 16px 0 24px; font-size: 1rem; }
    h2 { font-size: 1rem; margin: 28px 0 12px; border-bottom: 2px solid #fbeaf0; padding-bottom: 6px; }
    ol.steps { margin: 0; padding-left: 1.2rem; color: #333; }
    ol.steps li { margin: 8px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 0.9rem; }
    th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #eee; vertical-align: top; }
    th { background: #fdf8fb; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; }
    .num { width: 36px; color: #d4537e; font-weight: 700; }
    .title { font-weight: 600; }
    .link a { color: #d4537e; word-break: break-all; }
    .note { margin-top: 28px; padding: 16px; background: #f9f4f7; border-radius: 8px; font-size: 0.88rem; color: #444; }
    .footer { margin-top: 32px; font-size: 0.8rem; color: #666; border-top: 1px solid #eee; padding-top: 16px; }
    @media print {
      body { padding: 16px; max-width: none; }
      .link a { color: #000; text-decoration: underline; }
      tr { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <p class="brand">No Prior Authorization</p>
  <h1>${esc(sku.displayName)}</h1>
  <p class="lead">
    Thank you for your purchase. ${esc(sku.tagline)}<br/>
    A free Canva account is all you need — open each link, choose <strong>Use template</strong>, and swap in your logo, colors, and practice name.
  </p>

  <h2>How to use</h2>
  <ol class="steps">
    <li>Click <strong>Open in Canva →</strong> for each row below (or copy the URL from the plain-text file).</li>
    <li>In Canva, choose <strong>Use template</strong> to save a copy to your own workspace.</li>
    <li>Edit text, colors, and your call-to-action; export as PNG or MP4 for Instagram, Facebook, or TikTok.</li>
  </ol>

  <h2>Your ${templates.length} template link${templates.length !== 1 ? "s" : ""}</h2>
  <table>
    <thead>
      <tr><th>#</th><th>Template</th><th>Canva</th></tr>
    </thead>
    <tbody>${rows}
    </tbody>
  </table>

  <div class="note">
    <strong>Please note:</strong> This is a digital product — nothing is shipped.
    For questions or a broken link, email <a href="mailto:hello@nopriorauthorization.com">hello@nopriorauthorization.com</a>.
    © No Prior Authorization · <a href="https://nopriorauthorization.com">nopriorauthorization.com</a>
  </div>

  <p class="footer">
    Questions? We respond within 24 hours on business days.
  </p>
</body>
</html>`;
}

function buildTxt(sku, templates) {
  const lines = [
    `NO PRIOR AUTHORIZATION — ${sku.displayName} (Etsy purchase)`,
    `Open each link in a browser while logged into Canva. Use "Use template" / duplicate to your workspace.`,
    "",
    "Support: hello@nopriorauthorization.com | https://nopriorauthorization.com",
    "",
    "---",
    "",
  ];
  for (let i = 0; i < templates.length; i++) {
    const t = templates[i];
    lines.push(`${i + 1}. ${t.title}`);
    lines.push(String(t.editUrl || "").trim());
    lines.push("");
  }
  return lines.join("\n");
}

function main() {
  const raw = fs.readFileSync(CATALOG, "utf8");
  const data = JSON.parse(raw);
  const products = data.products || [];

  let successCount = 0;

  for (const sku of SKUS) {
    const product = products.find((p) => p.productSlug === sku.slug);
    if (!product) {
      console.warn(`⚠  SKIP ${sku.folder}: slug "${sku.slug}" not found in catalog`);
      continue;
    }

    const templates = (product.templates || []).filter((t) => t.editUrl);
    if (templates.length === 0) {
      console.warn(`⚠  SKIP ${sku.folder}: no templates with editUrl`);
      continue;
    }

    const outDir = path.join(ROOT, "etsy-products/store-launch/delivery", sku.folder);
    fs.mkdirSync(outDir, { recursive: true });

    const htmlPath = path.join(outDir, `${sku.folder}-etsy-delivery.html`);
    const txtPath = path.join(outDir, `${sku.folder}-links.txt`);

    fs.writeFileSync(htmlPath, buildHtml(sku, templates), "utf8");
    fs.writeFileSync(txtPath, buildTxt(sku, templates), "utf8");

    console.log(`✓  ${sku.folder} (${templates.length} templates)`);
    console.log(`     HTML: ${path.relative(ROOT, htmlPath)}`);
    console.log(`     TXT:  ${path.relative(ROOT, txtPath)}`);
    successCount++;
  }

  console.log(`\nDone — ${successCount}/${SKUS.length} SKUs generated.`);
  console.log("\nNext for each folder:");
  console.log("  1. Open the HTML in Chrome → Print → Save as PDF");
  console.log("  2. Upload the PDF (+ optional .txt) as Etsy Digital files");
}

main();
