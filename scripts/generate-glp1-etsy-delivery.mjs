#!/usr/bin/env node
/**
 * Builds Etsy buyer delivery files for GLP-1 Story Templates (10 Canva links).
 * Reads src/lib/delivery/catalog.generated.json — re-run after catalog rebuilds.
 *
 * Usage: node scripts/generate-glp1-etsy-delivery.mjs
 *
 * Then: open the HTML in Chrome → Print → Save as PDF → upload to Etsy Digital files.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG = path.join(ROOT, "src/lib/delivery/catalog.generated.json");
const OUT_DIR = path.join(ROOT, "etsy-products/store-launch/delivery");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function main() {
  const raw = fs.readFileSync(CATALOG, "utf8");
  const data = JSON.parse(raw);
  const products = data.products || [];
  const product = products.find((p) => p.productSlug === "glp1-story-templates");
  if (!product) {
    console.error("glp1-story-templates not found in catalog.generated.json");
    process.exit(1);
  }
  const templates = product.templates || [];
  if (templates.length === 0) {
    console.error("No templates on product");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const txtLines = [
    "NO PRIOR AUTHORIZATION — GLP-1 Story Templates (Etsy purchase)",
    "Open each link in a browser while logged into Canva. Use “Use template” / duplicate to your workspace.",
    "",
    "Support: hello@nopriorauthorization.com | https://nopriorauthorization.com",
    "",
    "---",
    "",
  ];
  for (let i = 0; i < templates.length; i++) {
    const t = templates[i];
    txtLines.push(`${i + 1}. ${t.title}`);
    txtLines.push(String(t.editUrl || "").trim());
    txtLines.push("");
  }
  const txtPath = path.join(OUT_DIR, "glp1-story-templates-links.txt");
  fs.writeFileSync(txtPath, txtLines.join("\n"), "utf8");

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

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GLP-1 Story Templates — Your download | No Prior Authorization</title>
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
    h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.65rem;
      margin: 0 0 8px;
      color: #111;
    }
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
  <h1>Medical weight loss — GLP-1 story templates</h1>
  <p class="lead">
    Thank you for your purchase. Below are <strong>${templates.length} Canva templates</strong> (Instagram story format).
    A free Canva account is enough to open and duplicate each design, then add your logo, colors, and practice name.
  </p>

  <h2>How to use</h2>
  <ol class="steps">
    <li>Click <strong>Open in Canva →</strong> for each row (or copy the long URL from the plain-text file if you prefer).</li>
    <li>In Canva, choose <strong>Use template</strong> / save a copy to your workspace.</li>
    <li>Customize text, colors, and your CTA; export as PNG or MP4 for Instagram / Facebook / TikTok.</li>
  </ol>

  <h2>Your template links</h2>
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
    Tip for Etsy sellers: save this page as PDF (browser Print → Save as PDF) and attach that PDF as your Etsy “digital file”
    so buyers get one tidy document plus the optional <code>glp1-story-templates-links.txt</code> from the same download folder.
  </p>
</body>
</html>`;

  const htmlPath = path.join(OUT_DIR, "glp1-story-templates-etsy-delivery.html");
  fs.writeFileSync(htmlPath, html, "utf8");

  console.log("Wrote:");
  console.log(" ", htmlPath);
  console.log(" ", txtPath);
  console.log("\nNext: open the HTML in Chrome → Print → Save as PDF → upload PDF (+ optional .txt) to Etsy Digital files.");
}

main();
