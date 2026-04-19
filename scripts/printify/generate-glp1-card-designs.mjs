#!/usr/bin/env node
/**
 * Generates 10 card design images (2625×1725px) for the GLP-1 Starter 5-Pack
 * Printify blueprint 1232 / variant 93763 (Multi-Design Greeting Cards, 5-Pack).
 *
 * Output: printify-assets/glp1-card-pack/
 *   card1_front.png  card1_inside.png
 *   card2_front.png  card2_inside.png
 *   card3_front.png  card3_inside.png
 *   card4_front.png  card4_inside.png
 *   card5_front.png  card5_inside.png
 */
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const OUT = path.join(ROOT, "printify-assets/glp1-card-pack");
const FORMS = path.join(ROOT, "delivery-assets/forms");
fs.mkdirSync(OUT, { recursive: true });

const W = 2625;
const H = 1725;

// ── Inside page HTML builder ────────────────────────────────────────────────
function insideHtml({ title, subtitle, bullets, footer }) {
  const items = bullets.map(b => `<li>${b}</li>`).join("");
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
  <style>
    /* system fonts — no external requests in headless */
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{width:${W}px;height:${H}px;overflow:hidden}
    body{
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;
      background:#1A1A1A;
      color:white;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      padding:80px 120px;
      gap:40px;
    }
    .brand{font-family:'Arial Black',Impact,sans-serif;font-size:22px;color:#D4537E;letter-spacing:4px;text-transform:uppercase;}
    h2{font-family:'Arial Black',Impact,sans-serif;font-size:72px;letter-spacing:3px;text-align:center;line-height:1.1;color:white;}
    .sub{font-size:28px;color:#ccc;text-align:center;max-width:1800px;line-height:1.5;}
    ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:20px 60px;width:100%;max-width:2200px;margin-top:10px;}
    ul li{font-size:26px;color:#f0f0f0;padding:16px 20px;border-left:4px solid #D4537E;background:rgba(255,255,255,0.05);border-radius:0 6px 6px 0;line-height:1.4;}
    .footer{font-size:20px;color:#888;text-align:center;margin-top:10px;}
    .divider{width:120px;height:3px;background:#D4537E;border-radius:2px;}
  </style></head><body>
  <span class="brand">No Prior Authorization</span>
  <div class="divider"></div>
  <h2>${title}</h2>
  ${subtitle ? `<p class="sub">${subtitle}</p>` : ""}
  <ul>${items}</ul>
  ${footer ? `<p class="footer">${footer}</p>` : ""}
</body></html>`;
}

// ── Brand card HTML (card 5) ─────────────────────────────────────────────────
function brandCardHtml() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
  <style>
    /* system fonts — no external requests in headless */
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{width:${W}px;height:${H}px;overflow:hidden}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#D4537E;color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:32px;}
    h1{font-family:'Arial Black',Impact,sans-serif;font-size:120px;letter-spacing:6px;text-align:center;line-height:1;}
    .tag{font-size:28px;letter-spacing:6px;text-transform:uppercase;opacity:.85;}
    .divider{width:200px;height:3px;background:rgba(255,255,255,0.5);border-radius:2px;}
    .url{font-size:30px;letter-spacing:2px;opacity:.9;}
  </style></head><body>
  <p class="tag">Clinical Reference Series</p>
  <div class="divider"></div>
  <h1>No Prior<br/>Authorization</h1>
  <div class="divider"></div>
  <p class="url">nopriorauthorization.com</p>
</body></html>`;
}

function brandInsideHtml() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
  <style>
    /* system fonts — no external requests in headless */
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{width:${W}px;height:${H}px;overflow:hidden}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#1A1A1A;color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:80px 120px;gap:36px;}
    .brand{font-family:'Arial Black',Impact,sans-serif;font-size:22px;color:#D4537E;letter-spacing:4px;}
    h2{font-family:'Arial Black',Impact,sans-serif;font-size:64px;letter-spacing:3px;text-align:center;}
    p{font-size:26px;color:#ccc;text-align:center;max-width:1800px;line-height:1.6;}
    .items{display:flex;gap:60px;margin-top:20px;}
    .item{text-align:center;display:flex;flex-direction:column;gap:12px;align-items:center;}
    .item .icon{font-size:48px;}
    .item .label{font-size:22px;color:#D4537E;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
    .item .val{font-size:24px;color:#f0f0f0;}
    .divider{width:120px;height:3px;background:#D4537E;border-radius:2px;}
  </style></head><body>
  <span class="brand">No Prior Authorization</span>
  <div class="divider"></div>
  <h2>Questions? We've Got You.</h2>
  <p>These cards are part of the GLP-1 Clinical Reference Series — designed for med spa providers, nurse injectors, and weight loss program staff.</p>
  <div class="items">
    <div class="item"><div class="icon">✉</div><div class="label">Support</div><div class="val">hello@nopriorauthorization.com</div></div>
    <div class="item"><div class="icon">🌐</div><div class="label">Website</div><div class="val">nopriorauthorization.com</div></div>
    <div class="item"><div class="icon">📦</div><div class="label">More Products</div><div class="val">/shop</div></div>
  </div>
</body></html>`;
}

// ── Card definitions ──────────────────────────────────────────────────────────
const CARDS = [
  {
    id: 1,
    frontHtml: path.join(FORMS, "NPA-GLP1-Clinical-Cheat-Sheet.html"),
    inside: insideHtml({
      title: "How GLP-1 Works",
      subtitle: "GLP-1 receptor agonists mimic the incretin hormone to regulate blood sugar, slow gastric emptying, and reduce appetite.",
      bullets: [
        "Slows gastric emptying → earlier satiety",
        "Reduces glucagon release → lower blood sugar",
        "Acts on hypothalamus → decreased appetite",
        "Weekly subcutaneous injection",
        "Results visible at 4–8 weeks",
        "Max effect at 16–20 weeks",
      ],
      footer: "nopriorauthorization.com — GLP-1 Clinical Reference Series",
    }),
  },
  {
    id: 2,
    frontHtml: path.join(FORMS, "NPA-GLP1-Titration-Cheat-Sheet.html"),
    inside: insideHtml({
      title: "Titration Schedule",
      subtitle: "Escalate slowly to minimize GI side effects. Hold dose if patient cannot tolerate.",
      bullets: [
        "Weeks 1–4: 0.25mg weekly",
        "Weeks 5–8: 0.5mg weekly",
        "Weeks 9–12: 1mg weekly",
        "Weeks 13–16: 1.7mg weekly",
        "Week 17+: 2.4mg weekly (maintenance)",
        "Hold escalation if GI symptoms persist",
      ],
      footer: "Semaglutide (Ozempic/Wegovy) — verify with current prescribing guidelines",
    }),
  },
  {
    id: 3,
    frontHtml: path.join(FORMS, "NPA-Tirzepatide-vs-Semaglutide-Cheat-Sheet.html"),
    inside: insideHtml({
      title: "Tirzepatide vs Semaglutide",
      subtitle: "Both are effective GLP-1 agonists. Tirzepatide also targets GIP receptors for added metabolic benefit.",
      bullets: [
        "Sema: GLP-1 agonist only",
        "Tirze: GLP-1 + GIP dual agonist",
        "Tirze avg weight loss: ~20–22%",
        "Sema avg weight loss: ~15–17%",
        "Both: weekly subcutaneous injection",
        "Cost: Tirzepatide typically higher",
      ],
      footer: "nopriorauthorization.com — always verify with current clinical guidelines",
    }),
  },
  {
    id: 4,
    frontHtml: path.join(FORMS, "NPA-Consent-GLP1-Weight-Loss.html"),
    inside: insideHtml({
      title: "Patient FAQ",
      subtitle: "Common questions to address at every GLP-1 consultation.",
      bullets: [
        "\"How fast will I lose weight?\" — 1–2 lbs/week avg",
        "\"Will I keep the weight off?\" — Lifestyle changes essential",
        "\"What are the side effects?\" — Nausea, fatigue, GI upset",
        "\"Do I need labs?\" — Baseline recommended",
        "\"Can I drink alcohol?\" — Limit; may worsen GI effects",
        "\"What if I miss a dose?\" — Take within 5 days",
      ],
      footer: "nopriorauthorization.com — GLP-1 Clinical Reference Series",
    }),
  },
  {
    id: 5,
    frontHtml: null, // brand card
    inside: null,    // brand inside
  },
];

async function renderHtmlFile(page, filePath) {
  await page.goto(`file://${filePath}`, { waitUntil: "networkidle0", timeout: 20000 });
}

async function renderHtmlString(page, html) {
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 300));
}

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const card of CARDS) {
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

    // ── Front ──
    const frontPath = path.join(OUT, `card${card.id}_front.png`);
    if (card.frontHtml) {
      await renderHtmlFile(page, card.frontHtml);
    } else {
      await renderHtmlString(page, brandCardHtml());
    }
    await page.screenshot({ path: frontPath, clip: { x: 0, y: 0, width: W, height: H } });
    console.log(`✓  card${card.id}_front.png`);

    // ── Inside ──
    const insidePath = path.join(OUT, `card${card.id}_inside.png`);
    if (card.inside) {
      await renderHtmlString(page, card.inside);
    } else {
      await renderHtmlString(page, brandInsideHtml());
    }
    await page.screenshot({ path: insidePath, clip: { x: 0, y: 0, width: W, height: H } });
    console.log(`✓  card${card.id}_inside.png`);

    await page.close();
  }

  await browser.close();
  console.log(`\nAll 10 card designs saved to:\n  printify-assets/glp1-card-pack/`);
  console.log("\nNext: run scripts/printify/create-glp1-card-product.mjs to upload + create Printify product.");
}

main().catch((e) => { console.error(e); process.exit(1); });
