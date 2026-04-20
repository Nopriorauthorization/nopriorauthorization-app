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
    series: "Complete Study Series · Microbiology",
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
    series: "Complete Study Series · Anatomy & Physiology",
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
    series: "Complete Study Series · Nursing Core",
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
    series: "Flashcard Deck Series · NCLEX",
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
  const topicRows = c.topics.map(t =>
    `<div class="topic-row"><span class="dot" style="background:${c.accent}"></span><span>${t}</span></div>`
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

/* Color header band */
.header-band {
  position:absolute; top:0; left:0; right:0; height:1050px;
  background: linear-gradient(160deg, ${c.accent}22 0%, ${c.accent}08 100%);
  border-bottom: 3px solid ${c.accent}55;
}

/* Top radial glow */
.glow {
  position:absolute; top:-200px; left:-200px;
  width:1100px; height:1100px; border-radius:50%;
  background: radial-gradient(circle, ${c.glow} 0%, transparent 65%);
}

/* Safe-zone content wrapper — 220px margin all sides */
.wrap {
  position:relative; z-index:2;
  margin:220px;
  width:${W - 440}px;
  height:${H - 440}px;
  display:flex; flex-direction:column;
}

.top-section {}

/* Brand label */
.brand {
  font-size:26px; letter-spacing:0.28em; text-transform:uppercase;
  color:rgba(255,255,255,0.4); font-weight:600;
  margin-bottom:52px;
}

/* Series pill */
.series {
  display:inline-block;
  background:${c.accent}22; border:1px solid ${c.accent}66;
  color:${c.accent}; font-size:24px; font-weight:700;
  letter-spacing:0.18em; text-transform:uppercase;
  padding:16px 36px; border-radius:4px;
  margin-bottom:72px; align-self:flex-start;
}

/* Main title block */
.title-block { margin-bottom:56px; }
.complete-word {
  font-size:62px; font-weight:700; letter-spacing:0.1em;
  text-transform:uppercase; color:rgba(255,255,255,0.35);
  line-height:1; margin-bottom:14px;
}
.main-title {
  font-size:156px; font-weight:900; line-height:0.95;
  color:#ffffff; letter-spacing:-3px; text-transform:uppercase;
}

/* Subtitle */
.subtitle {
  font-size:34px; color:rgba(255,255,255,0.5);
  font-style:italic; font-family:Georgia,serif;
  line-height:1.5; margin-bottom:0;
}

/* Divider */
.div {
  width:100%; height:2px; margin:60px 0;
  background:linear-gradient(to right, ${c.accent}99, transparent);
}

/* Topics list */
.topics { flex:1; display:flex; flex-direction:column; justify-content:space-between; margin-bottom:0; }
.topic-row {
  display:flex; align-items:center; gap:28px;
  padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.08);
  font-size:34px; color:rgba(255,255,255,0.75); font-weight:400;
  line-height:1.3;
}
.dot {
  width:10px; height:10px; border-radius:50%;
  flex-shrink:0; margin-top:2px;
}

/* Author */
.author {
  padding-top:48px; border-top:1px solid rgba(255,255,255,0.12);
}
.author-name {
  font-family:Georgia,serif; font-style:italic;
  font-size:48px; color:${c.accent}; margin-bottom:14px;
}
.author-creds {
  font-size:22px; letter-spacing:3px; font-weight:600;
  color:rgba(255,255,255,0.3); text-transform:uppercase;
}

/* Bottom NPA bar */
.bar {
  position:absolute; bottom:0; left:0; right:0; height:120px;
  background:#E8559F;
  display:flex; align-items:center; justify-content:center;
  font-size:22px; font-weight:800; letter-spacing:4px;
  color:white; text-transform:uppercase; z-index:3;
}
</style>
</head><body>
  <div class="header-band"></div>
  <div class="glow"></div>
  <div class="wrap">
    <div class="top-section">
      <div class="brand">No Prior Authorization</div>
      <div class="series">${c.series}</div>
      <div class="title-block">
        <div class="complete-word">${c.headline1}</div>
        <div class="main-title">${c.headline2.replace("\n","<br>")}</div>
      </div>
      <div class="subtitle">${c.sub}</div>
    </div>
    <div class="div"></div>
    <div class="topics">${topicRows}</div>
    <div class="author">
      <div class="author-name">Danielle Alcala</div>
      <div class="author-creds">RN Student · Esthetician · CNA · Phlebotomist</div>
    </div>
  </div>
  <div class="bar">${c.bottom}</div>
</body></html>`;
}

async function run() {
  const force = process.argv.includes("--force");
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  for (const cover of COVERS) {
    const outDir = path.join(ASSETS, cover.dir);
    const outPath = path.join(outDir, "cover.png");
    fs.mkdirSync(outDir, { recursive: true });

    if (fs.existsSync(outPath) && !force) {
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
