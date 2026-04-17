/**
 * Hello Gorgeous — THE BOOK · PDF Builder (v2)
 *
 * - Cover + title + copyright HTML (front matter) before chapters
 * - Final order: Cover (p1) · TOC roman i (p2) · title · copyright · chapters
 * - Table of contents with pink page numbers (physical page # in final PDF)
 * - Running headers / footers skipped on dark openers + front matter
 * - Optional: drop footer-only “blank” last page per chapter (heuristic)
 *
 * SETUP: npm install puppeteer pdf-lib
 * RUN:   node build-book-pdf.js
 *        CHAPTERS_DIR=~/Desktop/chapters node build-book-pdf.js
 *        HG_PREMIUM=off|light|full  (default light — see book-front-matter/PREMIUM-CONTROL.md)
 *        EXPORT_CHAPTER_STANDALONE=1  (single-chapter PDF only → OUTPUT_DIR, no full merge)
 *        EXPORT_STANDALONE_FILENAME=My-Ch1.pdf  (optional)
 *        node build-book-pdf.js --premium-map   (writes premium-implementation-map.md)
 *
 * Front matter HTML: HelloGorgeous-Cover-Page.html, HelloGorgeous-Title-Page.html,
 * HelloGorgeous-Copyright-Page.html — resolved from CHAPTERS_DIR first, then ./book-front-matter/.
 */

const puppeteer = require("puppeteer");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { pathToFileURL } = require("url");
const { execFileSync } = require("child_process");

const _defaultChapters = path.join(os.homedir(), "Desktop", "chapters");
const SCRIPT_DIR = __dirname;
const PREMIUM_CHAPTER_CSS_PATH = path.join(SCRIPT_DIR, "book-front-matter", "chapter-premium-visual-system.css");
const PRINT_LUXURY_CSS_PATH = path.join(SCRIPT_DIR, "book-front-matter", "print-luxury-typography.css");

function isChapterHtmlFile(htmlPath) {
  return /^HelloGorgeous-Chapter-\d+.*\.html$/i.test(path.basename(htmlPath));
}

/** Chapters that open a new Part — only these get cinematic first section by default (HG_PREMIUM_CINEMATIC=part). */
const PART_OPENER_CHAPTERS = new Set([1, 5, 9, 13, 15, 19]);
const FINALE_JSON_PATH = path.join(SCRIPT_DIR, "book-front-matter", "chapter-finale-lines.json");

const VISUAL_KEYWORD_PATTERNS = [
  "epidermis|dermis|subcutaneous|\\blayers?\\b.*skin|anatomy|five layers",
  "fitzpatrick|phototype|skin type",
  "contraindicat|before you say|absolute contraindication",
  "device compar|every laser|morpheus|ipl\\b|fractional|nd:yag|co₂|co2",
  "filler|injection depth|smas|periosteum|injectable|neuromodulator|botox",
  "hormone|peptide|estradiol|thyroid panel|endocrine|glp-1|glp1",
];

function parseChapterNumberFromPath(htmlPath) {
  const m = path.basename(htmlPath).match(/Chapter-0*(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

function loadFinaleLines() {
  try {
    return JSON.parse(fs.readFileSync(FINALE_JSON_PATH, "utf8"));
  } catch {
    return {
      fallback: "Take one concrete line from this chapter to your next appointment.",
      chapters: {},
    };
  }
}

function finaleLineForChapter(num, cfg) {
  if (num == null) return cfg.fallback || "";
  const c = cfg.chapters || {};
  const line = (c[String(num)] && c[String(num)].finale) || (c[String(num).padStart(2, "0")] && c[String(num).padStart(2, "0")].finale);
  return (line && String(line).trim()) || cfg.fallback || "";
}

async function readPremiumBodyDataset(page) {
  return page.evaluate(() => {
    const b = document.body;
    return {
      dataPremium: b.getAttribute("data-premium") || "",
      dataPremiumCinematic: b.getAttribute("data-premium-cinematic") || "",
      dataPremiumVisuals: b.getAttribute("data-premium-visuals") || "",
      dataPremiumStamp: b.getAttribute("data-premium-stamp") || "",
      dataPremiumFinale: b.getAttribute("data-premium-finale") || "",
      dataPremiumStampVariant: b.getAttribute("data-premium-stamp-variant") || "",
    };
  });
}

function mergePremiumOptions(dataset, chapterNum) {
  const env = (process.env.HG_PREMIUM || "light").toLowerCase();
  if (env === "off") return { active: false };

  const bp = (dataset.dataPremium || "").trim().toLowerCase();
  if (bp === "off") return { active: false };

  let mode = ["light", "full"].includes(bp) ? bp : env;
  if (!["light", "full"].includes(mode)) mode = "light";

  const cine = (dataset.dataPremiumCinematic || "").toLowerCase();
  let cinematicMode = "part";
  if (cine === "off") cinematicMode = "off";
  else if (cine === "all") cinematicMode = "all";
  else if (cine === "part") cinematicMode = "part";

  const vis = (dataset.dataPremiumVisuals || "").toLowerCase();
  /** Production default: `light` = markers only (manual `.hg-visual-slot`); `full` env = keyword heuristics unless body overrides. */
  let visualsMode;
  if (vis === "off") visualsMode = "off";
  else if (vis === "markers") visualsMode = "markers";
  else if (vis === "heuristic") visualsMode = "heuristic";
  else visualsMode = mode === "full" ? "heuristic" : "markers";

  const stampOn = (dataset.dataPremiumStamp || "").trim().toLowerCase() !== "off";
  const finaleOn = (dataset.dataPremiumFinale || "").trim().toLowerCase() !== "off";

  /** Conservative caps: light + heuristic max 2; full + heuristic max 3. */
  const maxHeuristic = mode === "full" ? 3 : 2;

  return {
    active: true,
    mode,
    cinematicMode,
    visualsMode,
    stampOn,
    finaleOn,
    chapterNum,
    maxHeuristic,
    isPartOpener: chapterNum != null && PART_OPENER_CHAPTERS.has(chapterNum),
  };
}

const STAMP_COPY_VARIANTS = [
  ["From Danielle", "Use one sentence you highlighted — it turns a vague worry into a real clinical question."],
  ["From Danielle", "If a plan ignores your layer, your type, or your timeline — pause and ask why."],
  ["From Danielle", "The best visits start when you bring your own biology as the brief."],
];

/**
 * Premium layout: gated by HG_PREMIUM + body data-premium-* (see book-front-matter/PREMIUM-CONTROL.md).
 */
async function applyPremiumChapterTransforms(page, htmlPath) {
  if (!isChapterHtmlFile(htmlPath) || !fs.existsSync(PREMIUM_CHAPTER_CSS_PATH)) return;

  const dataset = await readPremiumBodyDataset(page);
  const chapterNum = parseChapterNumberFromPath(htmlPath);
  const opts = mergePremiumOptions(dataset, chapterNum);
  if (!opts.active) return;

  const premiumCss = fs.readFileSync(PREMIUM_CHAPTER_CSS_PATH, "utf8");
  await page.addStyleTag({ content: premiumCss });

  const finaleCfg = loadFinaleLines();
  const finaleLine = finaleLineForChapter(chapterNum, finaleCfg);
  let stampVariant = chapterNum != null ? (chapterNum - 1) % 3 : 0;
  const svRaw = (dataset.dataPremiumStampVariant || "").trim();
  if (/^[012]$/.test(svRaw)) stampVariant = parseInt(svRaw, 10);
  const stampCopy = STAMP_COPY_VARIANTS[stampVariant];

  await page.evaluate(
    (payload) => {
      const body = document.querySelector(".body-content");
      if (!body) return;
      const o = payload.opts;
      const ch = payload.chapterNum;
      const chPad = ch != null ? String(ch).padStart(2, "0") : "00";

      document.querySelectorAll(".dq").forEach((el) => el.classList.add("hg-dq-premium"));
      document.querySelectorAll(".bts").forEach((el) => el.classList.add("hg-bts--premium"));
      document.querySelectorAll(".visual-box").forEach((box) => {
        if (box.querySelector(".guide-table, table, .timeline")) box.classList.add("hg-infographic");
      });

      const firstH2 = body.querySelector(".ch-h2");
      if (firstH2 && o.cinematicMode !== "off") {
        if (o.cinematicMode === "all") {
          firstH2.classList.add("hg-cinematic", "hg-cinematic--full");
        } else if (o.cinematicMode === "part" && o.isPartOpener) {
          firstH2.classList.add("hg-cinematic", "hg-cinematic--part-opener");
        }
      }

      if (o.visualsMode !== "off") {
        document.querySelectorAll(".hg-visual-slot").forEach((slot, i) => {
          if (slot.querySelector(".hg-visual-spread__inner, img")) return;
          const bleed = (slot.getAttribute("data-bleed") || "contained").toLowerCase();
          const ratio = slot.getAttribute("data-ratio") || "3:2";
          const id = slot.getAttribute("data-slot") || String(i + 1).padStart(2, "0");
          const moment = (slot.getAttribute("data-moment") || "").toLowerCase();
          const isHero = moment === "hero";
          const isAging = moment === "aging";
          slot.classList.add("hg-visual-spread", "hg-visual-spread--placeholder");
          if (isHero) slot.classList.add("hg-visual-spread--hero-moment");
          if (isAging) slot.classList.add("hg-visual-spread--aging-moment");
          slot.classList.add(bleed === "full" || isHero ? "hg-visual-spread--bleed-full" : "hg-visual-spread--bleed-contained");
          const pathHint = "assets/chapter-" + chPad + "/visual-" + id + ".png";
          const hint = document.createElement("div");
          hint.className = "hg-visual-spread__inner" + (isHero ? " hg-visual-spread__inner--hero" : "");
          const labelText = isHero
            ? "Signature spread — facial depth & injection planes"
            : isAging
              ? "Moment — aging, collagen & structural change"
              : "Art — " + ratio;
          const subHint = isHero
            ? "Full-bleed hero: pink layer labels, depth callouts, injection arrows → replace with " + pathHint + " (300dpi+)."
            : isAging
              ? "Bone · fat · dermis · turnover in one visual → " + pathHint
              : "File: " +
                pathHint +
                " (or .jpg) · 2400px+ wide · " +
                (bleed === "full" || isHero ? "full-bleed — safe margin for type" : "contained — text-overlay safe");
          hint.innerHTML =
            '<span class="hg-visual-spread__label">' +
            labelText +
            '</span><p class="hg-visual-spread__hint"></p>' +
            (isHero
              ? '<div class="hg-visual-spread__hero-fake" aria-hidden="true"><span class="hg-visual-spread__arrow hg-visual-spread__arrow--down"></span><span class="hg-visual-spread__depth">surface → bone</span><span class="hg-visual-spread__arrow hg-visual-spread__arrow--down"></span></div>'
              : "");
          hint.querySelector(".hg-visual-spread__hint").textContent = subHint;
          slot.appendChild(hint);
        });
      }

      if (o.visualsMode === "heuristic") {
        const patterns = payload.patterns.map((s) => new RegExp(s, "i"));
        let used = 0;
        body.querySelectorAll(".ch-h2").forEach((h2) => {
          if (used >= o.maxHeuristic) return;
          const text = h2.textContent || "";
          if (!patterns.some((re) => re.test(text))) return;
          let n = h2.nextElementSibling;
          while (n && n.classList && !n.classList.contains("body-text")) n = n.nextElementSibling;
          if (!n || !n.classList.contains("body-text")) return;
          if (n.nextElementSibling && n.nextElementSibling.classList && n.nextElementSibling.classList.contains("hg-visual-spread")) return;
          const wrap = document.createElement("div");
          wrap.className =
            "hg-visual-spread hg-visual-spread--placeholder hg-visual-spread--auto hg-visual-spread--bleed-contained";
          const inner = document.createElement("div");
          inner.className = "hg-visual-spread__inner";
          const lab = document.createElement("span");
          lab.className = "hg-visual-spread__label";
          lab.textContent = "Visual — " + text.trim().slice(0, 52) + (text.length > 52 ? "…" : "");
          const p = document.createElement("p");
          p.className = "hg-visual-spread__hint";
          p.textContent =
            "Suggested: assets/chapter-" +
            chPad +
            "/visual-auto-" +
            String(used + 1).padStart(2, "0") +
            ".png — or add <!-- hg-visual-slot --> in HTML for exact placement.";
          inner.appendChild(lab);
          inner.appendChild(p);
          wrap.appendChild(inner);
          n.parentNode.insertBefore(wrap, n.nextSibling);
          used++;
        });
      }

      if (o.stampOn) {
        const anchor = body.querySelector(".contra-section") || body.querySelector(".ask-section");
        if (anchor && !body.querySelector(".hg-danielle-stamp")) {
          const variantClass = ["hg-danielle-stamp--ribbon", "hg-danielle-stamp--minimal", "hg-danielle-stamp--inset"][payload.stampVariant] || "";
          const stamp = document.createElement("div");
          stamp.className = "hg-danielle-stamp " + variantClass;
          const labEl = document.createElement("div");
          labEl.className = "hg-danielle-stamp__label";
          labEl.textContent = payload.stampCopy[0];
          const txtEl = document.createElement("div");
          txtEl.className = "hg-danielle-stamp__text";
          txtEl.textContent = payload.stampCopy[1];
          stamp.appendChild(labEl);
          stamp.appendChild(txtEl);
          anchor.parentNode.insertBefore(stamp, anchor.nextSibling);
        }
      }

      if (o.finaleOn && !body.querySelector(".hg-chapter-finale")) {
        const footer = body.querySelector(".chapter-footer");
        const openerTitle = document.querySelector(".opener-title");
        let ctx = "Chapter";
        if (openerTitle) {
          ctx = openerTitle.innerText.replace(/\s+/g, " ").trim();
          if (ctx.length > 90) ctx = ctx.slice(0, 89) + "…";
        }
        const fin = document.createElement("div");
        fin.className = "hg-chapter-finale";
        const e1 = document.createElement("p");
        e1.className = "hg-finale-eyebrow";
        e1.textContent = "Closing thought";
        const e2 = document.createElement("p");
        e2.className = "hg-finale-statement";
        e2.textContent = payload.finaleLine;
        const e3 = document.createElement("p");
        e3.className = "hg-finale-context";
        e3.textContent = ctx;
        fin.appendChild(e1);
        fin.appendChild(e2);
        fin.appendChild(e3);
        if (footer) body.insertBefore(fin, footer);
        else body.appendChild(fin);
      }
    },
    {
      opts: {
        cinematicMode: opts.cinematicMode,
        visualsMode: opts.visualsMode,
        stampOn: opts.stampOn,
        finaleOn: opts.finaleOn,
        maxHeuristic: opts.maxHeuristic,
        isPartOpener: opts.isPartOpener,
      },
      chapterNum,
      patterns: VISUAL_KEYWORD_PATTERNS,
      finaleLine,
      stampVariant,
      stampCopy,
    }
  );
}

const CONFIG = {
  chaptersDir: process.env.CHAPTERS_DIR || _defaultChapters,
  outputDir: process.env.OUTPUT_DIR || path.join(process.env.CHAPTERS_DIR || _defaultChapters, "output"),
  /** Override: OUTPUT_FILENAME=HelloGorgeous-THE-BOOK-2026-04-07.pdf node build-book-pdf.js */
  outputFilename: process.env.OUTPUT_FILENAME || "HelloGorgeous-THE-BOOK.pdf",
  pageWidth: 8.5 * 72,
  pageHeight: 11 * 72,
  tocPageCount: 1,
  title: "Hello Gorgeous",
  author: "Danielle Alcala",
  subject: "Medical Aesthetics & Wellness",
  publisher: "Hello Gorgeous Med Spa / No Prior Authorization",
};

/** Same horizontal inset as chapter `.body-content` (64px → ~48pt @ 96dpi) — TOC + running heads/feet */
const GUTTER_PT = 48;
const RUNNING_FOOTER_Y_PT = 28;
/** Slightly lower on page so gray header is less likely to collide with body text after a print page break */
const RUNNING_HEADER_Y_FROM_TOP_PT = 32;

const FRONT_MATTER = [
  { file: "HelloGorgeous-Cover-Page.html", label: "Cover-Page", isOpener: true },
  { file: "HelloGorgeous-Title-Page.html", label: "Title-Page", isOpener: true },
  { file: "HelloGorgeous-Copyright-Page.html", label: "Copyright-Page", isOpener: false },
];

/**
 * Sprite is tiny (~682×1024 for 6 panels); stretched to 8.5×11" it looks soft. We upscale before PDF
 * (cached under output/.cache). Integer 2–8; default 5. Override: PART_DIVIDER_UPSCALE=6
 */
const PART_DIVIDER_UPSCALE = Math.min(8, Math.max(2, parseInt(process.env.PART_DIVIDER_UPSCALE || "5", 10) || 5));

/** Full-bleed visual spread before each Part (sprite: book-front-matter/assets/part-dividers.png). */
const PART_DIVIDER_BEFORE = {
  1: { file: "HelloGorgeous-Part-01-Divider.html", label: "Part-01-Divider" },
  5: { file: "HelloGorgeous-Part-02-Divider.html", label: "Part-02-Divider" },
  9: { file: "HelloGorgeous-Part-03-Divider.html", label: "Part-03-Divider" },
  13: { file: "HelloGorgeous-Part-04-Divider.html", label: "Part-04-Divider" },
  15: { file: "HelloGorgeous-Part-05-Divider.html", label: "Part-05-Divider" },
  19: { file: "HelloGorgeous-Part-06-Divider.html", label: "Part-06-Divider" },
};

const CHAPTERS = [
  { file: "HelloGorgeous-Chapter-01-Your-Skin.html", num: 1, title: "How Skin Actually Works", part: "Part One — Your Skin" },
  { file: "HelloGorgeous-Chapter-02-Fitzpatrick.html", num: 2, title: "Your Skin Type & the Fitzpatrick Scale", part: "Part One — Your Skin" },
  { file: "HelloGorgeous-Chapter-03-Skincare-Routine.html", num: 3, title: "Building Your Skincare Routine", part: "Part One — Your Skin" },
  { file: "HelloGorgeous-Chapter-04-Facials-Peels-Treatments.html", num: 4, title: "Facials, Peels & Professional Treatments", part: "Part One — Your Skin" },
  { file: "HelloGorgeous-Chapter-05-Lasers-Devices.html", num: 5, title: "Lasers & Devices — The Science", part: "Part Two — Lasers & Devices" },
  { file: "HelloGorgeous-Chapter-06-Every-Laser-Decoded.html", num: 6, title: "Every Laser Decoded", part: "Part Two — Lasers & Devices" },
  { file: "HelloGorgeous-Chapter-07-RF-Body-Contouring.html", num: 7, title: "RF & Body Contouring", part: "Part Two — Lasers & Devices" },
  { file: "HelloGorgeous-Chapter-08-Before-You-Book-Any-Laser.html", num: 8, title: "Before You Book Any Laser", part: "Part Two — Lasers & Devices" },
  { file: "HelloGorgeous-Chapter-09-What-Botox-Does.html", num: 9, title: "What Botox Actually Does", part: "Part Three — Injectables" },
  { file: "HelloGorgeous-Chapter-10-Dermal-Filler.html", num: 10, title: "Dermal Filler — Architecture for Your Face", part: "Part Three — Injectables" },
  { file: "HelloGorgeous-Chapter-11-Finding-Safe-Injector.html", num: 11, title: "Finding a Safe Injector", part: "Part Three — Injectables" },
  { file: "HelloGorgeous-Chapter-12-Aging-Gracefully.html", num: 12, title: "Aging Gracefully with Injectables", part: "Part Three — Injectables" },
  { file: "HelloGorgeous-Chapter-13-GLP1-Medications.html", num: 13, title: "GLP-1 Medications", part: "Part Four — Your Body" },
  { file: "HelloGorgeous-Chapter-14-Body-Contouring.html", num: 14, title: "Body Contouring — Surgery vs. Devices", part: "Part Four — Your Body" },
  { file: "HelloGorgeous-Chapter-15-Your-Hormones.html", num: 15, title: "Your Hormones", part: "Part Five — Hormones & Blood Work" },
  { file: "HelloGorgeous-Chapter-16-BHRT.html", num: 16, title: "BHRT — Bioidentical Hormone Replacement", part: "Part Five — Hormones & Blood Work" },
  { file: "HelloGorgeous-Chapter-17-Reading-Lab-Work.html", num: 17, title: "Reading Your Own Lab Work", part: "Part Five — Hormones & Blood Work" },
  { file: "HelloGorgeous-Chapter-18-IV-Therapy.html", num: 18, title: "Vitamin Injections & IV Therapy", part: "Part Five — Hormones & Blood Work" },
  { file: "HelloGorgeous-Chapter-19-Peptide-Therapy.html", num: 19, title: "Peptide Therapy", part: "Part Six — Wellness" },
  { file: "HelloGorgeous-Chapter-20-Clean-Beauty.html", num: 20, title: "Clean Beauty & Toxic Ingredients", part: "Part Six — Wellness" },
  { file: "HelloGorgeous-Chapter-21-Mens-Health.html", num: 21, title: "Men's Health & Aesthetics", part: "Part Six — Wellness" },
  { file: "HelloGorgeous-Chapter-22-Provider-Team.html", num: 22, title: "Building Your Provider Team", part: "Part Six — Wellness" },
  { file: "HelloGorgeous-Chapter-23-Journey-by-Decade.html", num: 23, title: "Your Aesthetic Journey by Decade", part: "Part Six — Wellness" },
  { file: "HelloGorgeous-Chapter-24-Closing-Letter.html", num: 24, title: "Hello Gorgeous — A Closing Letter", part: "Part Six — Wellness" },
];

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
}

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function getPartDividerSpriteSource(chaptersDir) {
  const chaptersAssets = path.join(chaptersDir, "assets");
  for (const name of ["part-dividers.png", "part-dividers.jpg", "part-dividers.jpeg"]) {
    const p = path.join(chaptersAssets, name);
    if (fs.existsSync(p)) return p;
  }
  const partHtml = resolveChapterPath(chaptersDir, "HelloGorgeous-Part-01-Divider.html");
  if (!partHtml) return null;
  const assetsDir = path.join(path.dirname(partHtml), "assets");
  for (const name of ["part-dividers.png", "part-dividers.jpg", "part-dividers.jpeg"]) {
    const p = path.join(assetsDir, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/** Absolute disk path to sprite for file:// injection (Chromium sometimes misses relative assets). */
function resolvePartDividerSpriteDiskPath(htmlPath, chaptersDir) {
  const fromChapters = path.join(chaptersDir, "assets", "part-dividers.png");
  if (fs.existsSync(fromChapters)) return path.resolve(fromChapters);
  const besideHtml = path.join(path.dirname(htmlPath), "assets", "part-dividers.png");
  if (fs.existsSync(besideHtml)) return path.resolve(besideHtml);
  const repo = path.join(SCRIPT_DIR, "book-front-matter", "assets", "part-dividers.png");
  if (fs.existsSync(repo)) return path.resolve(repo);
  return null;
}

/** Copy repo sprite into CHAPTERS_DIR/assets if missing so Part dividers never render as blank #0a0612. */
function ensurePartDividerSpriteInChaptersAssets(chaptersDir) {
  const repoSprite = path.join(SCRIPT_DIR, "book-front-matter", "assets", "part-dividers.png");
  if (!fs.existsSync(repoSprite)) return;
  const destDir = path.join(chaptersDir, "assets");
  ensureDir(destDir);
  const dest = path.join(destDir, "part-dividers.png");
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(repoSprite, dest);
    log("Copied part-dividers.png → chapters/assets (Part divider pages need this file)");
  }
}

function readSpriteDimensions(srcPath) {
  let w = 682;
  let h = 1024;
  if (process.platform === "darwin") {
    try {
      const out = execFileSync("/usr/bin/sips", ["-g", "pixelWidth", "-g", "pixelHeight", srcPath], { encoding: "utf8" });
      const mw = out.match(/pixelWidth:\s*(\d+)/);
      const mh = out.match(/pixelHeight:\s*(\d+)/);
      if (mw) w = +mw[1];
      if (mh) h = +mh[1];
    } catch {
      /* keep defaults */
    }
  }
  return { w, h };
}

/**
 * Writes a Lanczos-style upscaled JPEG so Chromium embeds more pixels per panel (still not true
 * print press quality — replace sprite with a 2400+ px master when available).
 */
async function writeUpscaledPartDividerSprite(srcPath, destPath) {
  const { w, h } = readSpriteDimensions(srcPath);
  const tw = Math.round(w * PART_DIVIDER_UPSCALE);
  const th = Math.round(h * PART_DIVIDER_UPSCALE);
  ensureDir(path.dirname(destPath));
  if (process.platform === "darwin") {
    execFileSync("/usr/bin/sips", ["-z", String(th), String(tw), srcPath, "--out", destPath]);
    return;
  }
  let sharpMod;
  try {
    sharpMod = require("sharp");
  } catch {
    throw new Error("non-macOS: install sharp (npm i sharp) or build on macOS to upscale part dividers");
  }
  await sharpMod(srcPath)
    .resize(tw, th, { fit: "fill", kernel: sharpMod.kernel.lanczos3 })
    .jpeg({ quality: 93, mozjpeg: true })
    .toFile(destPath);
}

/**
 * @returns {Promise<string | null>} file: URL of upscaled sprite, or null to keep HTML default asset
 */
async function ensureUpscaledPartDividerSprite(chaptersDir, outputDir) {
  const src = getPartDividerSpriteSource(chaptersDir);
  if (!src) return null;
  const cacheDir = path.join(outputDir, ".cache");
  const dest = path.join(cacheDir, `part-dividers-sprite-${PART_DIVIDER_UPSCALE}x.jpg`);
  const metaPath = path.join(cacheDir, "part-dividers-sprite.meta.json");
  let needRebuild = true;
  try {
    const st = fs.statSync(src);
    if (fs.existsSync(dest)) {
      let meta = {};
      try {
        meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
      } catch {
        /* */
      }
      if (meta.mtimeMs === st.mtimeMs && meta.size === st.size && meta.upscale === PART_DIVIDER_UPSCALE) {
        needRebuild = false;
      }
    }
  } catch {
    needRebuild = true;
  }
  if (needRebuild) {
    try {
      await writeUpscaledPartDividerSprite(src, dest);
      const st = fs.statSync(src);
      fs.writeFileSync(metaPath, JSON.stringify({ mtimeMs: st.mtimeMs, size: st.size, upscale: PART_DIVIDER_UPSCALE }));
      log(`Part divider sprite upscaled ${PART_DIVIDER_UPSCALE}× (cached for PDF)`);
    } catch (e) {
      log(`⚠ Part divider upscale skipped (${e.message}) — dividers will look soft`);
      return null;
    }
  }
  return pathToFileURL(path.resolve(dest)).href;
}

/** Search rootDir recursively for filename; then try fallback dirs. */
function resolveChapterPath(rootDir, filename) {
  const tryPaths = [path.join(rootDir, filename), path.join(SCRIPT_DIR, "book-front-matter", filename)];
  for (const p of tryPaths) {
    if (fs.existsSync(p)) return p;
  }
  function walk(dir) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return null;
    }
    for (const e of entries) {
      if (e.name.startsWith(".")) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        const r = walk(p);
        if (r) return r;
      } else if (e.name === filename) return p;
    }
    return null;
  }
  return walk(rootDir);
}

/**
 * @param {{ partDividerSpriteFileUrl?: string | null; deviceScaleFactor?: number; chaptersDir?: string }} [opts]
 */
async function htmlToPdf(browser, htmlPath, outputPath, opts = {}) {
  const deviceScaleFactor = opts.deviceScaleFactor ?? 1;
  const partDividerSpriteFileUrl = opts.partDividerSpriteFileUrl ?? null;
  const chaptersDir = opts.chaptersDir ?? CONFIG.chaptersDir;
  const page = await browser.newPage();
  /** Fixed layout width (8.5in @ 96dpi) so every chapter paginates with the same horizontal measure */
  await page.setViewport({ width: 816, height: 1056, deviceScaleFactor });
  await page.goto(`file://${path.resolve(htmlPath)}`, { waitUntil: "networkidle0", timeout: 120000 });
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await new Promise((r) => setTimeout(r, 1200));
  await page.emulateMediaType("print");
  await page.evaluate(() => {
    document.querySelectorAll(".print-bar, .main-nav, nav.main-nav").forEach((el) => {
      el.style.setProperty("display", "none", "important");
    });
    const id = "hg-book-pdf-normalize";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @page { size: 8.5in 11in; margin: 0; }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 8.5in !important;
        max-width: 8.5in !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .page {
        width: 8.5in !important;
        max-width: 8.5in !important;
        margin: 0 !important;
        box-shadow: none !important;
      }
      /* Avoid double footers: we add running heads/feet in pdf-lib after merge */
      .chapter-footer { display: none !important; }
      /*
       * Print hardening — applied to every chapter HTML→PDF (no per-chapter edits).
       * Keeps bordered / tinted blocks from tearing across page breaks (gray gaps, clipped borders).
       * "avoid" is a hint: if a block is taller than one page, the engine may still break inside.
       */
      .dq,
      .bts,
      .visual-box,
      .contra-section,
      .ask-section,
      .pep-card,
      .hormone-card,
      .laser-card,
      .device-card,
      .checklist-hero,
      .timeline,
      .opener-visual,
      .opener-hero {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        -webkit-column-break-inside: avoid !important;
        box-decoration-break: clone !important;
        -webkit-box-decoration-break: clone !important;
      }
      .ask-item,
      .contra-item,
      .pep-cell,
      .hormone-cell,
      .laser-cell,
      .device-spec {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        -webkit-column-break-inside: avoid !important;
      }
      .ch-h2 {
        break-after: avoid !important;
        page-break-after: avoid !important;
      }
      .body-text {
        orphans: 2;
        widows: 2;
      }
      .hg-visual-spread,
      .hg-behind-scenes,
      .hg-red-flag,
      .hg-dont-waste,
      .hg-pull-quote,
      .hg-fullpage-quote,
      .hg-chapter-finale,
      .hg-chapter-mic-drop,
      .hg-danielle-stamp {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        -webkit-column-break-inside: avoid !important;
        box-decoration-break: clone !important;
        -webkit-box-decoration-break: clone !important;
      }
      .ch-h2.hg-cinematic {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
    `;
    document.head.appendChild(s);
  });
  await applyPremiumChapterTransforms(page, htmlPath);
  if (isChapterHtmlFile(htmlPath) && fs.existsSync(PRINT_LUXURY_CSS_PATH)) {
    await page.addStyleTag({ content: fs.readFileSync(PRINT_LUXURY_CSS_PATH, "utf8") });
  }
  const hasPartSpread = await page.evaluate(() => !!document.querySelector(".part-spread"));
  if (hasPartSpread) {
    const disk = resolvePartDividerSpriteDiskPath(path.resolve(htmlPath), chaptersDir);
    const diskUrl = disk ? pathToFileURL(disk).href : null;
    const spriteUrl = partDividerSpriteFileUrl || diskUrl;
    if (spriteUrl) {
      await page.evaluate((u) => {
        document.querySelectorAll(".part-spread").forEach((el) => {
          el.style.backgroundImage = `url(${JSON.stringify(u)})`;
        });
      }, spriteUrl);
      await new Promise((r) => setTimeout(r, 500));
    } else {
      log("⚠ Part divider: no sprite file found — page may look solid black");
    }
  }
  await page.pdf({
    path: outputPath,
    width: "8.5in",
    height: "11in",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: false,
    scale: 1,
  });
  await page.close();
}

async function isBlankLastPage(srcDoc, pageIndex) {
  if (pageIndex < 1) return false;
  try {
    const page = srcDoc.getPage(pageIndex);
    const rawDict = srcDoc.context.lookup(page.ref);
    const contentsRef = rawDict.get(rawDict.context.obj("Contents"));
    if (!contentsRef) return true;
    const resolved = srcDoc.context.lookup(contentsRef);
    let totalLen = 0;
    if (resolved && resolved.contents) totalLen = resolved.contents.length;
    else if (resolved && resolved.array) {
      for (const ref of resolved.array) {
        const s = srcDoc.context.lookup(ref);
        if (s && s.contents) totalLen += s.contents.length;
      }
    }
    return totalLen > 0 && totalLen < 1500;
  } catch {
    return false;
  }
}

async function buildTOC(chapterPageMap) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([CONFIG.pageWidth, CONFIG.pageHeight]);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const pink = rgb(0.831, 0.325, 0.494);
  const dark = rgb(0.102, 0.102, 0.102);
  const mid = rgb(0.45, 0.45, 0.45);
  const { width, height } = page.getSize();

  const gx = GUTTER_PT;
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });
  page.drawRectangle({ x: 0, y: height - 4, width, height: 4, color: pink });
  page.drawText("HELLO GORGEOUS", { x: gx, y: height - 54, size: 9, font: bold, color: dark, characterSpacing: 4 });
  page.drawText("TABLE OF CONTENTS", { x: gx, y: height - 76, size: 22, font: bold, color: dark });
  page.drawRectangle({ x: gx, y: height - 84, width: 40, height: 3, color: pink });

  let y = height - 106;
  let currentPart = "";
  const tocBottomMinY = 52;
  for (const ch of CHAPTERS) {
    if (y < tocBottomMinY) break;
    const pageNum = chapterPageMap[ch.num] ?? "–";
    if (ch.part !== currentPart) {
      currentPart = ch.part;
      y -= 8;
      page.drawText(currentPart.toUpperCase(), {
        x: gx,
        y,
        size: 7,
        font: bold,
        color: pink,
        characterSpacing: 2.5,
      });
      y -= 16;
    }
    const label = `${ch.num}. `;
    const numStr = String(pageNum);
    const lW = bold.widthOfTextAtSize(label, 10);
    const tW = reg.widthOfTextAtSize(ch.title, 10);
    const nW = bold.widthOfTextAtSize(numStr, 10);
    const dotStart = gx + lW + tW + 6;
    const dotEnd = width - gx - nW - 6;
    const dots = ".".repeat(Math.max(0, Math.floor((dotEnd - dotStart) / 3)));
    page.drawText(label, { x: gx, y, size: 10, font: bold, color: dark });
    page.drawText(ch.title, { x: gx + lW, y, size: 10, font: reg, color: dark });
    if (dots) page.drawText(dots, { x: dotStart, y, size: 10, font: reg, color: mid });
    page.drawText(numStr, { x: width - gx - nW, y, size: 10, font: bold, color: pink });
    y -= 15;
  }
  page.drawRectangle({ x: 0, y: 0, width, height: 4, color: pink });
  page.drawText("nopriorauthorization.com  ·  hellogorgeousmedspa.com", {
    x: gx,
    y: 14,
    size: 8,
    font: reg,
    color: mid,
  });
  return await doc.save();
}

async function main() {
  if (process.argv.includes("--premium-map")) {
    const mapMod = path.join(SCRIPT_DIR, "scripts", "premium-map.cjs");
    if (fs.existsSync(mapMod)) {
      require(mapMod).generatePremiumImplementationMap(
        CONFIG.chaptersDir,
        path.join(SCRIPT_DIR, "book-front-matter", "premium-implementation-map.md")
      );
    }
    process.exit(0);
  }

  const standRaw = process.env.EXPORT_CHAPTER_STANDALONE;
  if (standRaw != null && String(standRaw).trim() !== "") {
    const n = parseInt(String(standRaw).trim(), 10);
    if (!Number.isFinite(n) || n < 1) {
      console.error("EXPORT_CHAPTER_STANDALONE must be a positive chapter number (e.g. 1).");
      process.exit(1);
    }
    const ch = CHAPTERS.find((c) => c.num === n);
    if (!ch) {
      console.error(`No chapter ${n} in build manifest.`);
      process.exit(1);
    }
    const hp = resolveChapterPath(CONFIG.chaptersDir, ch.file);
    if (!hp) {
      console.error(`Missing HTML: ${ch.file}`);
      process.exit(1);
    }
    ensureDir(CONFIG.outputDir);
    ensurePartDividerSpriteInChaptersAssets(CONFIG.chaptersDir);
    const partDividerHiResUrl = await ensureUpscaledPartDividerSprite(CONFIG.chaptersDir, CONFIG.outputDir);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
    });
    const outName =
      process.env.EXPORT_STANDALONE_FILENAME ||
      `HelloGorgeous-Chapter-${String(n).padStart(2, "0")}-STANDALONE.pdf`;
    const outPath = path.join(CONFIG.outputDir, outName);
    await htmlToPdf(browser, hp, outPath, {
      chaptersDir: CONFIG.chaptersDir,
      partDividerSpriteFileUrl: partDividerHiResUrl,
      deviceScaleFactor: 2,
    });
    await browser.close();
    console.log(`Standalone chapter PDF: ${outPath}`);
    process.exit(0);
  }

  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║  Hello Gorgeous — THE BOOK  ·  Builder v2               ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  ensureDir(CONFIG.outputDir);
  ensureDir(path.join(CONFIG.outputDir, "chapters"));

  log(`Chapters dir: ${CONFIG.chaptersDir}`);
  log(`Output dir:   ${CONFIG.outputDir}\n`);

  const partFiles = Object.values(PART_DIVIDER_BEFORE).map((p) => p.file);
  const missing = [];
  for (const f of [...FRONT_MATTER.map((x) => x.file), ...partFiles, ...CHAPTERS.map((c) => c.file)]) {
    if (!resolveChapterPath(CONFIG.chaptersDir, f)) missing.push(f);
  }
  if (missing.length) {
    console.error("\n❌ Missing files (add under chapters folder or repo book-front-matter/):\n");
    missing.forEach((f) => console.error(`   ${f}`));
    process.exit(1);
  }
  log(`✓ All ${FRONT_MATTER.length + partFiles.length + CHAPTERS.length} HTML files resolved\n`);

  ensurePartDividerSpriteInChaptersAssets(CONFIG.chaptersDir);

  const partDividerHiResUrl = await ensureUpscaledPartDividerSprite(CONFIG.chaptersDir, CONFIG.outputDir);
  if (partDividerHiResUrl) {
    log(`Part divider PDF raster: ${PART_DIVIDER_UPSCALE}× sprite + deviceScaleFactor 2\n`);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
  });

  log("── Front matter ─────────────────────────────────────────────\n");
  const frontPdfPaths = [];
  for (const item of FRONT_MATTER) {
    const hp = resolveChapterPath(CONFIG.chaptersDir, item.file);
    const pp = path.join(CONFIG.outputDir, "chapters", `${item.label}.pdf`);
    process.stdout.write(`  ${item.label.padEnd(22)}`);
    await htmlToPdf(browser, hp, pp, { chaptersDir: CONFIG.chaptersDir });
    process.stdout.write("✓\n");
    frontPdfPaths.push({ path: pp, isOpener: item.isOpener });
  }

  log("\n── Part dividers & chapters ────────────────────────────────\n");
  /** @type {{ type: 'front' | 'part' | 'chapter'; path: string; isOpener?: boolean; chapterNum?: number; label?: string }[]} */
  const mergeChain = [...frontPdfPaths.map((x) => ({ type: "front", path: x.path, isOpener: x.isOpener }))];
  for (const ch of CHAPTERS) {
    const pd = PART_DIVIDER_BEFORE[ch.num];
    if (pd) {
      const hPart = resolveChapterPath(CONFIG.chaptersDir, pd.file);
      const pPart = path.join(CONFIG.outputDir, "chapters", `${pd.label}.pdf`);
      process.stdout.write(`  ${pd.label.padEnd(22)}`);
      await htmlToPdf(browser, hPart, pPart, {
        chaptersDir: CONFIG.chaptersDir,
        partDividerSpriteFileUrl: partDividerHiResUrl,
        deviceScaleFactor: partDividerHiResUrl ? 2 : 1,
      });
      process.stdout.write("✓\n");
      mergeChain.push({ type: "part", path: pPart, label: pd.label });
    }
    const hp = resolveChapterPath(CONFIG.chaptersDir, ch.file);
    const pp = path.join(CONFIG.outputDir, "chapters", `Chapter-${String(ch.num).padStart(2, "0")}.pdf`);
    process.stdout.write(`  Ch${String(ch.num).padStart(2, " ")}: ${ch.title.substring(0, 40).padEnd(42, " ")}`);
    await htmlToPdf(browser, hp, pp, { chaptersDir: CONFIG.chaptersDir });
    const s = await PDFDocument.load(fs.readFileSync(pp));
    process.stdout.write(`${s.getPageCount()}p ✓\n`);
    mergeChain.push({ type: "chapter", path: pp, chapterNum: ch.num });
  }
  await browser.close();

  log("\n── Merging (strip blank last pages where detected) ──────────\n");
  const mergedDoc = await PDFDocument.create();
  mergedDoc.setTitle(CONFIG.title);
  mergedDoc.setAuthor(CONFIG.author);
  mergedDoc.setSubject(CONFIG.subject);
  mergedDoc.setCreator(CONFIG.publisher);
  mergedDoc.setCreationDate(new Date());

  const openerMergedIndices = new Set();
  const chapterPageMap = {};
  let totalPages = 0;
  let FRONT_PAGE_COUNT = 0;

  for (const piece of mergeChain) {
    if (piece.type === "front") {
      const src = await PDFDocument.load(fs.readFileSync(piece.path));
      const pgs = await mergedDoc.copyPages(src, src.getPageIndices());
      pgs.forEach((p, i) => {
        mergedDoc.addPage(p);
        if (piece.isOpener) openerMergedIndices.add(totalPages + i);
        totalPages++;
      });
      FRONT_PAGE_COUNT = totalPages;
      continue;
    }
    if (piece.type === "part") {
      const src = await PDFDocument.load(fs.readFileSync(piece.path));
      const pgs = await mergedDoc.copyPages(src, src.getPageIndices());
      pgs.forEach((p, i) => {
        mergedDoc.addPage(p);
        openerMergedIndices.add(totalPages + i);
        totalPages++;
      });
      process.stdout.write(`  ${piece.label}: merged ${pgs.length}p ✓\n`);
      continue;
    }
    if (piece.type === "chapter") {
      const chapterNum = piece.chapterNum;
      const src = await PDFDocument.load(fs.readFileSync(piece.path));
      const total = src.getPageCount();
      let added = 0;
      for (let i = 0; i < total; i++) {
        if (i === total - 1 && total > 1) {
          if (await isBlankLastPage(src, i)) {
            process.stdout.write(`  Ch${String(chapterNum).padStart(2, "0")}: dropped blank last page\n`);
            continue;
          }
        }
        const [copied] = await mergedDoc.copyPages(src, [i]);
        if (i === 0) {
          chapterPageMap[chapterNum] = totalPages + CONFIG.tocPageCount + 1;
          openerMergedIndices.add(totalPages);
        }
        mergedDoc.addPage(copied);
        added++;
        totalPages++;
      }
      process.stdout.write(`  Ch${String(chapterNum).padStart(2, "0")}: merged ${added}/${total} pages ✓\n`);
    }
  }

  log(`\n✓ Merged body: ${totalPages} pages (before TOC)\n`);

  log("── Headers / page numbers on body (skip front + openers) ──");
  const bold = await mergedDoc.embedFont(StandardFonts.HelveticaBold);
  const reg = await mergedDoc.embedFont(StandardFonts.Helvetica);
  const pink = rgb(0.831, 0.325, 0.494);
  const mid = rgb(0.6, 0.6, 0.6);

  mergedDoc.getPages().forEach((page, i) => {
    if (i < FRONT_PAGE_COUNT) return;
    if (openerMergedIndices.has(i)) return;
    const { width, height } = page.getSize();
    const displayNum = i - FRONT_PAGE_COUNT + 1;
    const numStr = String(displayNum);
    const numW = bold.widthOfTextAtSize(numStr, 9);
    const isOdd = displayNum % 2 === 1;
    const g = GUTTER_PT;
    const numX = isOdd ? width - g - numW : g;
    page.drawText(numStr, { x: numX, y: RUNNING_FOOTER_Y_PT, size: 9, font: bold, color: pink });
    const header = isOdd ? "Danielle Alcala" : "Hello Gorgeous";
    const hW = reg.widthOfTextAtSize(header, 7.5);
    const hX = isOdd ? width - g - hW : g;
    page.drawText(header, {
      x: hX,
      y: height - RUNNING_HEADER_Y_FROM_TOP_PT,
      size: 7.5,
      font: reg,
      color: mid,
      characterSpacing: 1.2,
    });
  });
  log("✓\n");

  log("── Table of contents PDF ────────────────────────────────────");
  const tocBytes = await buildTOC(chapterPageMap);

  const finalDoc = await PDFDocument.create();
  const tocSrc = await PDFDocument.load(tocBytes);
  const [tocPg] = await finalDoc.copyPages(tocSrc, [0]);
  const boldF = await finalDoc.embedFont(StandardFonts.HelveticaBold);
  const tw = tocPg.getSize().width;
  const tocNumW = boldF.widthOfTextAtSize("i", 9);
  tocPg.drawText("i", { x: tw - GUTTER_PT - tocNumW, y: RUNNING_FOOTER_Y_PT, size: 9, font: boldF, color: pink });

  /** Page 1 = cover, page 2 = TOC (reads like a physical book; TOC roman "i" on verso). */
  const mergedIndices = mergedDoc.getPageIndices();
  const [coverPage] = await finalDoc.copyPages(mergedDoc, [mergedIndices[0]]);
  finalDoc.addPage(coverPage);
  finalDoc.addPage(tocPg);
  const afterCover = mergedIndices.slice(1);
  if (afterCover.length > 0) {
    const restPages = await finalDoc.copyPages(mergedDoc, afterCover);
    restPages.forEach((p) => finalDoc.addPage(p));
  }

  finalDoc.setTitle(CONFIG.title);
  finalDoc.setAuthor(CONFIG.author);
  finalDoc.setSubject(CONFIG.subject);
  finalDoc.setCreator(CONFIG.publisher);

  const outPath = path.join(CONFIG.outputDir, CONFIG.outputFilename);
  fs.writeFileSync(outPath, await finalDoc.save());

  const bytes = fs.readFileSync(outPath);
  const sizeMB = (bytes.length / 1024 / 1024).toFixed(1);
  const n = finalDoc.getPageCount();

  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║  ✓ BUILD COMPLETE                                        ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log(`║  ${CONFIG.outputFilename.padEnd(54)}║`);
  console.log(`║  Pages: ${String(n).padEnd(47)}║`);
  console.log(`║  Size:  ${(sizeMB + " MB").padEnd(47)}║`);
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║  Order: Cover · TOC (i) · front · Part spreads · Ch 1–24 ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log(`\n→ ${outPath}\n`);
}

main().catch((err) => {
  console.error("\n❌", err.message, "\n", err.stack);
  process.exit(1);
});
