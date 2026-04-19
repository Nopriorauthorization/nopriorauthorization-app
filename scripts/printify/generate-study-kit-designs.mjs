#!/usr/bin/env node
/**
 * Generates print-ready design images for 5 physical study kit products:
 *   1. A&P Cheat Sheet Notebook cover       1810×2534  (bp74 front)
 *   2. Micro 270 Study Notebook cover       1810×2534  (bp74 front)
 *   3. A&P Flashcard Deck design             821×1122  (bp1138 front – shared back of all 54 cards)
 *   4. Micro 270 Flashcard Deck design       821×1122  (bp1138 front)
 *   5. Nurse Injector Ref Cards – front     1075×720   (bp812 front)
 *   5. Nurse Injector Ref Cards – back      1075×720   (bp812 back)
 *
 * Output: printify-assets/study-kits/
 */
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const OUT = path.join(ROOT, "printify-assets/study-kits");
fs.mkdirSync(OUT, { recursive: true });

// ─── notebook cover (1810×2534) ──────────────────────────────────────────────
function notebookCoverHtml({ title, subtitle, accentColor, tags }) {
  const tagPills = tags.map(t => `<span class="tag">${t}</span>`).join("");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{width:1810px;height:2534px;overflow:hidden}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#1A1A1A;color:white;display:flex;flex-direction:column;position:relative}
    .top-bar{background:${accentColor};padding:40px 70px;display:flex;align-items:center;justify-content:space-between;z-index:1}
    .brand{font-size:28px;font-weight:900;letter-spacing:5px;text-transform:uppercase;color:white;opacity:.9}
    .series{font-size:20px;letter-spacing:3px;color:rgba(255,255,255,.7);text-transform:uppercase}
    .bg{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 40%, ${accentColor}22 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, ${accentColor}15 0%, transparent 50%)}
    .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:80px 80px}
    .bottom{position:absolute;bottom:116px;left:0;right:0;padding:0 70px;display:flex;flex-direction:column;gap:20px;z-index:1}
    .accent-line{width:80px;height:5px;background:${accentColor};border-radius:3px}
    h1{font-size:116px;font-weight:900;line-height:1.0;letter-spacing:-2px;color:white}
    .subtitle{font-size:34px;font-weight:600;color:${accentColor};letter-spacing:3px;text-transform:uppercase}
    .tags{display:flex;flex-wrap:wrap;gap:14px;margin-top:8px}
    .tag{font-size:20px;padding:8px 18px;border:1.5px solid rgba(255,255,255,0.2);border-radius:4px;color:rgba(255,255,255,.6);letter-spacing:1px}
    .footer{position:absolute;bottom:0;left:0;right:0;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:28px 70px;background:${accentColor}}
    .footer-brand{font-size:22px;font-weight:800;letter-spacing:3px;text-transform:uppercase}
    .footer-url{font-size:20px;opacity:.8;letter-spacing:1px}
  </style></head><body>
  <div class="top-bar"><span class="brand">No Prior Authorization</span><span class="series">Study Series</span></div>
  <div class="bg"></div><div class="grid"></div>
  <div class="bottom">
    <div class="accent-line"></div>
    <h1>${title}</h1>
    <div class="subtitle">${subtitle}</div>
    <div class="tags">${tagPills}</div>
  </div>
  <div class="footer"><span class="footer-brand">NPA Study Series</span><span class="footer-url">nopriorauthorization.com</span></div>
</body></html>`;
}

// ─── flashcard design (821×1122) ─────────────────────────────────────────────
function flashcardHtml({ title, subtitle, accentColor, bullets }) {
  const items = bullets.map(b => `<li>${b}</li>`).join("");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{width:821px;height:1122px;overflow:hidden}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#1A1A1A;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative}
    .bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%, ${accentColor}30 0%, transparent 70%)}
    .card{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:24px;padding:48px 52px;text-align:center;width:100%}
    .logo{font-size:13px;font-weight:900;letter-spacing:5px;text-transform:uppercase;color:${accentColor};opacity:.8}
    .accent-line{width:60px;height:4px;background:${accentColor};border-radius:2px}
    h1{font-size:52px;font-weight:900;line-height:1.1;letter-spacing:-1px;color:white}
    .sub{font-size:18px;font-weight:600;color:${accentColor};letter-spacing:2px;text-transform:uppercase}
    ul{list-style:none;display:flex;flex-direction:column;gap:10px;text-align:left;width:100%;max-width:680px}
    li{font-size:16px;color:rgba(255,255,255,.75);padding-left:20px;position:relative;line-height:1.5}
    li::before{content:"→";position:absolute;left:0;color:${accentColor}}
    .footer{font-size:13px;color:rgba(255,255,255,.35);letter-spacing:1px}
  </style></head><body>
  <div class="bg"></div>
  <div class="card">
    <span class="logo">No Prior Authorization</span>
    <div class="accent-line"></div>
    <h1>${title}</h1>
    <div class="sub">${subtitle}</div>
    <ul>${items}</ul>
    <span class="footer">nopriorauthorization.com · Study Series</span>
  </div>
</body></html>`;
}

// ─── business/reference card (1075×720) ──────────────────────────────────────
function referenceCardHtml({ side, title, subtitle, accentColor, content }) {
  if (side === "back") {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      html,body{width:1075px;height:720px;overflow:hidden}
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:${accentColor};color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}
      .brand{font-size:28px;font-weight:900;letter-spacing:5px;text-transform:uppercase}
      .sub{font-size:14px;letter-spacing:3px;opacity:.75;text-transform:uppercase}
      .url{font-size:16px;opacity:.6;letter-spacing:1px}
    </style></head><body>
      <span class="brand">No Prior Authorization</span>
      <span class="sub">Clinical Reference Cards</span>
      <span class="url">nopriorauthorization.com</span>
    </body></html>`;
  }
  const cols = content.map(col => `
    <div class="col">
      <div class="col-title">${col.title}</div>
      ${col.items.map(i => `<div class="item">${i}</div>`).join("")}
    </div>
  `).join("");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{width:1075px;height:720px;overflow:hidden}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#1a1a1a;color:white;display:flex;flex-direction:column;padding:0}
    .top{background:${accentColor};padding:18px 28px;display:flex;align-items:center;justify-content:space-between}
    .brand{font-size:14px;font-weight:900;letter-spacing:4px;text-transform:uppercase}
    .title{font-size:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase}
    .grid{display:flex;flex:1;gap:0}
    .col{flex:1;padding:14px 16px;border-right:1px solid rgba(255,255,255,.08)}
    .col:last-child{border-right:none}
    .col-title{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${accentColor};margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid ${accentColor}55}
    .item{font-size:11px;color:rgba(255,255,255,.75);padding:3px 0;line-height:1.4}
    .footer{background:${accentColor}22;padding:8px 28px;font-size:10px;color:rgba(255,255,255,.4);letter-spacing:1px;text-align:right}
  </style></head><body>
    <div class="top"><span class="brand">NPA Clinical</span><span class="title">${title}</span></div>
    <div class="grid">${cols}</div>
    <div class="footer">nopriorauthorization.com · For reference only — always follow clinical protocols</div>
  </body></html>`;
}

const DESIGNS = [
  {
    file: "ap-notebook-cover.png",
    w: 1810, h: 2534,
    html: notebookCoverHtml({
      title: "Anatomy &\nPhysiology",
      subtitle: "Study Notebook",
      accentColor: "#1a6b8a",
      tags: ["A&P", "Nursing", "Cell Biology", "Organ Systems", "Histology"],
    }),
  },
  {
    file: "micro-notebook-cover.png",
    w: 1810, h: 2534,
    html: notebookCoverHtml({
      title: "Micro 270",
      subtitle: "Study Notebook",
      accentColor: "#2d6e3e",
      tags: ["Microbiology", "Bacteria", "Viruses", "Immunology", "Lab Skills"],
    }),
  },
  {
    file: "ap-flashcard-front.png",
    w: 821, h: 1122,
    html: flashcardHtml({
      title: "A&P Study\nDeck",
      subtitle: "240 Clinical Reference Cards",
      accentColor: "#1a6b8a",
      bullets: [
        "Cell structure, organelles & membrane transport",
        "Tissues: epithelial, connective, muscle, nervous",
        "Organ system anatomy & physiology",
        "Homeostasis, feedback loops & regulation",
        "Lab values & clinical tie-ins for nursing",
      ],
    }),
  },
  {
    file: "micro-flashcard-front.png",
    w: 821, h: 1122,
    html: flashcardHtml({
      title: "Micro 270\nStudy Deck",
      subtitle: "1,000 Q&A Cards",
      accentColor: "#2d6e3e",
      bullets: [
        "Bacteria, viruses, fungi & parasites",
        "Gram staining, culture & identification",
        "Infection, immunity & inflammation",
        "Antimicrobials: mechanism, resistance, use",
        "Case-based clinical application questions",
      ],
    }),
  },
  {
    file: "injector-card-front.png",
    w: 1075, h: 720,
    html: referenceCardHtml({
      side: "front",
      title: "Nurse Injector Quick Reference",
      accentColor: "#D4537E",
      content: [
        {
          title: "Botox Dosing",
          items: ["Glabella: 20–25 u", "Frontalis: 10–20 u", "Crow's feet: 12–15 u", "DAO: 5–7 u", "Masseter: 25–50 u"],
        },
        {
          title: "Filler Landmarks",
          items: ["Nasolabial: 0.3–1.0 mL", "Lips: 0.5–1.0 mL", "Cheeks: 1.0–2.0 mL", "Chin: 0.5–1.0 mL", "Tear trough: 0.3–0.5 mL"],
        },
        {
          title: "GLP-1 Titration",
          items: ["Sema wk 1–4: 0.25 mg", "Sema wk 5–8: 0.5 mg", "Tirz wk 1–4: 2.5 mg", "Tirz wk 5–8: 5 mg", "Max Tirz: 15 mg"],
        },
        {
          title: "Safety / Reversal",
          items: ["Hyaluronidase: 150–200 u", "Occlusion signs: pain, pallor", "Wait 5 min post-inject", "Vascular kit on-site", "Always aspiration check"],
        },
      ],
    }),
  },
  {
    file: "injector-card-back.png",
    w: 1075, h: 720,
    html: referenceCardHtml({
      side: "back",
      title: "Nurse Injector Clinical Reference",
      accentColor: "#D4537E",
      content: [],
    }),
  },
];

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const d of DESIGNS) {
    const page = await browser.newPage();
    await page.setViewport({ width: d.w, height: d.h, deviceScaleFactor: 1 });
    await page.setContent(d.html, { waitUntil: "domcontentloaded" });
    await new Promise(r => setTimeout(r, 300));
    const outPath = path.join(OUT, d.file);
    await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: d.w, height: d.h } });
    await page.close();
    console.log(`✓  ${d.file}`);
  }

  await browser.close();
  console.log("\nAll designs saved to: printify-assets/study-kits/");
}

main().catch(e => { console.error(e); process.exit(1); });
