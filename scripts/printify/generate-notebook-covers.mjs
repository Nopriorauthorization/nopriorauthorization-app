#!/usr/bin/env node
/**
 * Generates notebook cover images (1810×2534px portrait) for 5 core NPA notebooks.
 * Blueprint 74 — Spiral Notebook Ruled Line (6"×8", front cover, SPOKE Custom Products)
 *
 * Output: printify-assets/notebooks/<slug>/cover.png
 */
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const FORMS = path.join(ROOT, "delivery-assets/forms");

const W = 1810;
const H = 2534;

const NOTEBOOKS = [
  {
    slug: "glp1-clinical-notebook",
    title: "GLP-1 & Weight Loss",
    subtitle: "Clinical Reference Notebook",
    accentColor: "#1a7a6e",
    cheatSheet: "NPA-GLP1-Clinical-Cheat-Sheet.html",
    tags: ["Weight Loss", "GLP-1", "Semaglutide", "Tirzepatide", "Titration"],
  },
  {
    slug: "botox-clinical-notebook",
    title: "Botox & Neurotoxin",
    subtitle: "Clinical Reference Notebook",
    accentColor: "#D4537E",
    cheatSheet: "NPA-Botox-Clinical-Cheat-Sheet.html",
    tags: ["Botox", "Dysport", "Neurotoxin", "Dosing", "Zones"],
  },
  {
    slug: "filler-clinical-notebook",
    title: "Dermal Filler",
    subtitle: "Clinical Reference Notebook",
    accentColor: "#6c3483",
    cheatSheet: "NPA-Dermal-Filler-Clinical-Cheat-Sheet.html",
    tags: ["Filler", "Lip Filler", "Cannula", "Anatomy", "Hyaluronidase"],
  },
  {
    slug: "iv-therapy-clinical-notebook",
    title: "IV Therapy",
    subtitle: "Clinical Reference Notebook",
    accentColor: "#1a2940",
    cheatSheet: "NPA-IV-Therapy-Clinical-Cheat-Sheet.html",
    tags: ["IV Therapy", "Drip", "Vitamins", "Dosing", "Protocols"],
  },
  {
    slug: "injection-techniques-notebook",
    title: "Injection Techniques",
    subtitle: "Clinical Reference Notebook",
    accentColor: "#b8760a",
    cheatSheet: "NPA-Injection-Techniques-Cheat-Sheet.html",
    tags: ["Injections", "Technique", "Cannula", "Needle", "Anatomy"],
  },
];

function coverHtml({ title, subtitle, accentColor, tags, cheatSheetDataUrl }) {
  const tagPills = tags.map(t =>
    `<span class="tag">${t}</span>`
  ).join("");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{width:${W}px;height:${H}px;overflow:hidden}
    body{
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;
      background:#1A1A1A;
      color:white;
      display:flex;
      flex-direction:column;
      position:relative;
      overflow:hidden;
    }
    .top-bar{
      position:relative;
      z-index:1;
      background:${accentColor};
      padding:40px 70px;
      display:flex;
      align-items:center;
      justify-content:space-between;
    }
    .brand{font-size:28px;font-weight:900;letter-spacing:5px;text-transform:uppercase;color:white;opacity:.9;}
    .series{font-size:20px;letter-spacing:3px;color:rgba(255,255,255,.7);text-transform:uppercase;}
    .preview-wrap{
      position:absolute;
      inset:0;
      z-index:0;
    }
    .preview-wrap img{
      width:100%;
      height:100%;
      object-fit:cover;
      object-position:top center;
      opacity:0.22;
      transform:scale(1.6);
      transform-origin:top center;
    }
    .overlay{
      position:absolute;
      inset:0;
      background:linear-gradient(to bottom, rgba(26,26,26,0.0) 0%, rgba(26,26,26,0.15) 30%, rgba(26,26,26,0.82) 58%, rgba(26,26,26,0.99) 72%);
    }
    .bottom{
      position:absolute;
      bottom:116px; left:0; right:0;
      padding:0 70px;
      display:flex;
      flex-direction:column;
      gap:20px;
      z-index:1;
    }
    .accent-line{width:80px;height:5px;background:${accentColor};border-radius:3px;}
    h1{
      font-size:116px;
      font-weight:900;
      line-height:1.0;
      letter-spacing:-2px;
      color:white;
    }
    .subtitle{
      font-size:34px;
      font-weight:600;
      color:${accentColor};
      letter-spacing:3px;
      text-transform:uppercase;
    }
    .tags{display:flex;flex-wrap:wrap;gap:14px;margin-top:8px;}
    .tag{
      font-size:20px;
      padding:8px 18px;
      border:1.5px solid rgba(255,255,255,0.2);
      border-radius:4px;
      color:rgba(255,255,255,.6);
      letter-spacing:1px;
    }
    .footer{
      position:relative;
      z-index:1;
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:28px 70px;
      background:${accentColor};
      margin-top:auto;
    }
    .footer-brand{font-size:22px;font-weight:800;letter-spacing:3px;text-transform:uppercase;}
    .footer-url{font-size:20px;opacity:.8;letter-spacing:1px;}
  </style></head><body>
  <div class="top-bar">
    <span class="brand">No Prior Authorization</span>
    <span class="series">Clinical Reference Series</span>
  </div>
  <div class="preview-wrap">
    ${cheatSheetDataUrl ? `<img src="${cheatSheetDataUrl}" />` : ""}
    <div class="overlay"></div>
  </div>
  <div class="bottom">
    <div class="accent-line"></div>
    <h1>${title}</h1>
    <div class="subtitle">${subtitle}</div>
    <div class="tags">${tagPills}</div>
  </div>
  <div class="footer">
    <span class="footer-brand">NPA Clinical Series</span>
    <span class="footer-url">nopriorauthorization.com</span>
  </div>
</body></html>`;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const nb of NOTEBOOKS) {
    const outDir = path.join(ROOT, "printify-assets/notebooks", nb.slug);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, "cover.png");

    // Step 1: render cheat sheet at landscape size and capture as base64
    let cheatSheetDataUrl = null;
    const csPath = path.join(FORMS, nb.cheatSheet);
    if (fs.existsSync(csPath)) {
      const csPage = await browser.newPage();
      await csPage.setViewport({ width: 2646, height: 1725, deviceScaleFactor: 1 });
      await csPage.goto(`file://${csPath}`, { waitUntil: "networkidle0", timeout: 20000 });
      const csBuffer = await csPage.screenshot({ encoding: "base64", clip: { x: 0, y: 0, width: 2646, height: 1725 } });
      cheatSheetDataUrl = `data:image/png;base64,${csBuffer}`;
      await csPage.close();
    }

    // Step 2: render cover at portrait size
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    await page.setContent(coverHtml({ ...nb, cheatSheetDataUrl }), { waitUntil: "domcontentloaded" });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: W, height: H } });
    await page.close();

    console.log(`✓  ${nb.slug}/cover.png`);
  }

  await browser.close();
  console.log(`\nAll covers saved to: printify-assets/notebooks/`);
  console.log("Next: run create-notebook-products.mjs to upload + create Printify products.");
}

main().catch((e) => { console.error(e); process.exit(1); });
