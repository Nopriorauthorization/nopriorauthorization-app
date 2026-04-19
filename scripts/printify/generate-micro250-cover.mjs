#!/usr/bin/env node
/**
 * Generates the Micro 250 Exam Prep spiral notebook cover (1810×2534px PNG).
 * Blueprint 74 / SPOKE Custom Products.
 * Run: node scripts/printify/generate-micro250-cover.mjs
 */
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const OUT  = path.join(ROOT, "public/micro-exam-prep/micro250-cover.png");

const W = 1810;
const H = 2534;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body {
  width: ${W}px; height: ${H}px; overflow: hidden;
  background: #0D0D0D;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Georgia, sans-serif;
  color: white;
  display: flex; flex-direction: column;
  align-items: center;
  padding: 100px 130px 0;
  position: relative;
}

/* Background texture */
body::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(232,85,159,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232,85,159,0.04) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Pink glow top-right */
body::after {
  content: '';
  position: absolute; top: -300px; right: -200px;
  width: 900px; height: 900px; border-radius: 50%;
  background: radial-gradient(circle, rgba(232,85,159,0.12) 0%, transparent 65%);
}

.content { position: relative; z-index: 1; width: 100%; display: flex; flex-direction: column; align-items: center; flex: 1; }

/* Series label */
.series-label {
  font-size: 28px; font-weight: 700;
  letter-spacing: 6px; text-transform: uppercase;
  color: #E8559F;
  margin-bottom: 80px;
  text-align: center;
}

/* Main number */
.main-number {
  font-family: 'Bebas Neue', -apple-system, sans-serif;
  font-size: 380px;
  font-weight: 400;
  color: white;
  line-height: 0.85;
  letter-spacing: -8px;
  text-align: center;
}

/* Exam Prep italic */
.exam-prep {
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-size: 110px;
  color: #E8559F;
  line-height: 1;
  margin-top: -20px;
  margin-bottom: 60px;
  text-align: center;
}

/* Subtitle */
.subtitle {
  font-size: 36px;
  color: rgba(255,255,255,0.7);
  font-weight: 400;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 60px;
}

/* Divider */
.divider {
  width: 100%;
  height: 1px;
  background: rgba(232,85,159,0.35);
  margin: 50px 0;
}

/* Topics */
.topics {
  text-align: center;
  margin-bottom: 20px;
}
.topics p {
  font-size: 28px;
  color: rgba(255,255,255,0.65);
  letter-spacing: 1px;
  line-height: 2;
}

/* Quote block */
.quote-block {
  text-align: center;
  margin-top: 20px;
}
.quote-text {
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-size: 40px;
  color: rgba(255,255,255,0.55);
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 1300px;
}
.author-name {
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-size: 52px;
  color: #E8559F;
  margin-bottom: 16px;
}
.author-credentials {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 4px;
  color: #E8559F;
  text-transform: uppercase;
}

/* Bottom bar */
.bottom-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: #E8559F;
  padding: 38px 130px;
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 3px;
  color: white;
  text-transform: uppercase;
}
</style>
</head><body>
<div class="content">
  <div class="series-label">Micro 250 · Exam Prep Series</div>
  <div class="main-number">250</div>
  <div class="exam-prep">Exam Prep</div>
  <div class="subtitle">Complete Study Guide · All 17 Chapters</div>

  <div class="divider"></div>

  <div class="topics">
    <p>Prokaryotes · Viruses · Genetics · Immunity</p>
    <p>Metabolism · Epidemiology · Pathogenicity</p>
    <p>Infections · Antimicrobial Drugs</p>
  </div>

  <div class="divider"></div>

  <div class="quote-block">
    <div class="quote-text">"I did the hard work so you don't have to."</div>
    <div class="author-name">Danielle Alcala</div>
    <div class="author-credentials">RN Student · Licensed Esthetician · Phlebotomist · CNA · CMAA</div>
  </div>
</div>

<div class="bottom-bar">
  244 Study Questions · 17 Chapters · nopriorauthorization.com
</div>
</body></html>`;

async function run() {
  if (fs.existsSync(OUT)) {
    console.log("Cover already exists — delete to regenerate:", OUT);
    return;
  }
  console.log("Generating Micro 250 cover...");
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: OUT, type: "png", clip: { x: 0, y: 0, width: W, height: H } });
  await browser.close();
  console.log(`✓ Cover saved → ${OUT}`);
}

run().catch(e => { console.error(e); process.exit(1); });
