#!/usr/bin/env node
/**
 * Generates 4 flagship nursing study spiral-notebook covers (1810×2534px).
 * Outputs to printify-assets/nursing-flagships/<coverDir>/cover.png
 * Run: node scripts/printify/generate-nursing-flagship-covers.mjs
 */
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT   = path.join(__dirname, "../..");
const ASSETS = path.join(ROOT, "printify-assets/nursing-flagships");
const W = 1810, H = 2534;

const COVERS = [
  {
    dir: "complete-microbiology",
    accent: "#00C896",
    glow: "rgba(0,200,150,0.13)",
    eyebrow: "Complete Study Series · Microbiology",
    headline1: "COMPLETE",
    headline2: "MICROBIOLOGY",
    sub: "Prokaryotes to Pathogens · Everything on the Exam",
    topics: [
      "Prokaryotes · Eukaryotes · Cell Structure",
      "Viral & Bacterial Pathogenesis",
      "Immunity · Vaccines · Antimicrobials",
      "Genetics · Metabolism · Epidemiology",
      "Infections · Lab Techniques · Case Studies",
    ],
    quote: "\"I covered every lecture so you could study smarter, not longer.\"",
    bottom: "17 Chapters · 244+ Study Questions · nopriorauthorization.com",
  },
  {
    dir: "complete-anatomy",
    accent: "#60A5FA",
    glow: "rgba(96,165,250,0.13)",
    eyebrow: "Complete Study Series · Anatomy & Physiology",
    headline1: "COMPLETE",
    headline2: "A&P",
    sub: "Cells to Systems · The Full Body in One Book",
    topics: [
      "Cells · Tissues · Integumentary System",
      "Skeletal · Muscular · Nervous System",
      "Cardiovascular · Respiratory · Renal",
      "Endocrine · Reproductive · Immune",
      "Homeostasis · Feedback Loops · Lab Values",
    ],
    quote: "\"Every system. Every mechanism. Built so you stop dreading this class.\"",
    bottom: "12 Body Systems · NCLEX-Aligned · nopriorauthorization.com",
  },
  {
    dir: "complete-nursing-core",
    accent: "#FB923C",
    glow: "rgba(251,146,60,0.13)",
    eyebrow: "Complete Study Series · Nursing Core",
    headline1: "COMPLETE",
    headline2: "NURSING\nCORE",
    sub: "Fundamentals Through Med-Surg · NCLEX Ready",
    topics: [
      "Nursing Process · Head-to-Toe Assessment",
      "Pharmacology · Dosage Calculations",
      "Med-Surg · Critical Care · Fluids & Electrolytes",
      "Mental Health · Mother-Baby · Pediatrics",
      "NCLEX Strategies · Priority Questions",
    ],
    quote: "\"The core content you keep forgetting — organized so it finally sticks.\"",
    bottom: "NCLEX-Focused · Clinical Reasoning · nopriorauthorization.com",
  },
  {
    dir: "nclex-essentials-cards",
    accent: "#C084FC",
    glow: "rgba(192,132,252,0.13)",
    eyebrow: "Flashcard Deck Series · NCLEX",
    headline1: "NCLEX",
    headline2: "ESSENTIALS",
    sub: "High-Yield Cards · Study Anywhere",
    topics: [
      "Priority · Delegation · Safety ABCs",
      "Pharmacology Mnemonics + Side Effects",
      "Lab Values · Critical Ranges",
      "Cardiac · Respiratory · Neuro",
      "Infection Control · Therapeutic Communication",
    ],
    quote: "\"Everything on the NCLEX that nursing school glossed over.\"",
    bottom: "High-Yield Essentials · Portable Card Deck · nopriorauthorization.com",
  },
];

function coverHtml(c) {
  const headline2Lines = c.headline2.split("\n");
  const h2Html = headline2Lines.map(l => `<span style="display:block">${l}</span>`).join("");
  const topicRows = c.topics.map(t =>
    `<div class="topic-row"><span class="dot" style="color:${c.accent}">◆</span><span>${t}</span></div>`
  ).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body {
  width:${W}px; height:${H}px; overflow:hidden;
  background:#0A0A0F;
  font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;
  color:white; position:relative;
}

/* Grid texture */
body::before {
  content:''; position:absolute; inset:0; z-index:0;
  background-image:
    linear-gradient(${c.glow.replace("0.13","0.05")} 1px, transparent 1px),
    linear-gradient(90deg, ${c.glow.replace("0.13","0.05")} 1px, transparent 1px);
  background-size:60px 60px;
}

/* Top radial glow */
.glow-top {
  position:absolute; top:-400px; right:-300px;
  width:1200px; height:1200px; border-radius:50%; z-index:0;
  background: radial-gradient(circle, ${c.glow} 0%, transparent 60%);
}
/* Bottom left glow */
.glow-btm {
  position:absolute; bottom:-200px; left:-200px;
  width:800px; height:800px; border-radius:50%; z-index:0;
  background: radial-gradient(circle, ${c.glow.replace("0.13","0.07")} 0%, transparent 60%);
}

/* Accent left bar */
.accent-bar {
  position:absolute; left:0; top:0; bottom:0;
  width:18px; background:${c.accent}; z-index:2;
}

/* Content wrapper */
.wrap {
  position:relative; z-index:1;
  padding:110px 130px 220px 160px;
  display:flex; flex-direction:column; height:100%;
}

/* Eyebrow */
.eyebrow {
  font-size:26px; letter-spacing:0.2em; text-transform:uppercase;
  color:${c.accent}; font-weight:700; margin-bottom:70px;
}

/* Main headline */
.hl1 {
  font-size:140px; font-weight:900; line-height:0.9;
  color:rgba(255,255,255,0.18); letter-spacing:-2px;
  text-transform:uppercase;
}
.hl2 {
  font-size:200px; font-weight:900; line-height:0.85;
  color:#ffffff; letter-spacing:-5px; text-transform:uppercase;
  margin-bottom:50px;
}

/* Sub */
.sub {
  font-size:38px; color:rgba(255,255,255,0.55);
  font-style:italic; font-family:Georgia,'Times New Roman',serif;
  line-height:1.4; margin-bottom:60px;
}

/* Divider */
.div {
  width:100%; height:1px;
  background: linear-gradient(to right, ${c.accent}, transparent);
  margin:50px 0;
}

/* Topics */
.topics { margin-bottom:50px; }
.topic-row {
  display:flex; align-items:center; gap:28px;
  padding:20px 0; border-bottom:1px solid rgba(255,255,255,0.06);
  font-size:34px; color:rgba(255,255,255,0.72); font-weight:400;
}
.dot { font-size:20px; flex-shrink:0; }

/* Quote */
.quote {
  font-family:Georgia,'Times New Roman',serif; font-style:italic;
  font-size:40px; color:rgba(255,255,255,0.45); line-height:1.6;
  margin-bottom:50px; max-width:1300px;
}

/* Author block */
.author-name {
  font-family:Georgia,'Times New Roman',serif; font-style:italic;
  font-size:58px; color:${c.accent}; margin-bottom:12px;
}
.author-creds {
  font-size:24px; letter-spacing:4px; font-weight:700;
  color:${c.accent}; text-transform:uppercase; opacity:0.8;
}

/* Bottom bar */
.bar {
  position:absolute; bottom:0; left:0; right:0;
  background:#E8559F; padding:38px 160px;
  font-size:26px; font-weight:700; letter-spacing:3px;
  color:white; text-transform:uppercase; z-index:2;
}
</style>
</head><body>
  <div class="glow-top"></div>
  <div class="glow-btm"></div>
  <div class="accent-bar"></div>
  <div class="wrap">
    <div class="eyebrow">${c.eyebrow}</div>
    <div class="hl1">${c.headline1}</div>
    <div class="hl2">${h2Html}</div>
    <div class="sub">${c.sub}</div>
    <div class="div"></div>
    <div class="topics">${topicRows}</div>
    <div class="div"></div>
    <div class="quote">${c.quote}</div>
    <div class="author-name">Danielle Alcala</div>
    <div class="author-creds">RN Student · Licensed Esthetician · CNA · Phlebotomist</div>
  </div>
  <div class="bar">${c.bottom}</div>
</body></html>`;
}

async function run() {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  for (const cover of COVERS) {
    const outDir = path.join(ASSETS, cover.dir);
    const outPath = path.join(outDir, "cover.png");
    fs.mkdirSync(outDir, { recursive: true });

    if (fs.existsSync(outPath)) {
      console.log(`  ↷ exists: ${cover.dir}/cover.png`);
      continue;
    }

    console.log(`  Generating ${cover.dir}/cover.png …`);
    await page.setContent(coverHtml(cover), { waitUntil: "domcontentloaded" });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: outPath, type: "png", clip: { x:0, y:0, width:W, height:H } });
    console.log(`  ✓ ${cover.dir}/cover.png`);
  }

  await browser.close();
  console.log(`\nAll covers written to printify-assets/nursing-flagships/`);
  console.log("Next: npm run printify:create-nursing-flagships");
}

run().catch(e => { console.error(e); process.exit(1); });
