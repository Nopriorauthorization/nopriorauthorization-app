/**
 * Generates book-front-matter/premium-implementation-map.md from chapter HTML on disk.
 * Run: CHAPTERS_DIR=~/Desktop/chapters node build-book-pdf.js --premium-map
 */
const fs = require("fs");
const path = require("path");

const PART_OPENERS = new Set([1, 5, 9, 13, 15, 19]);
const VISUAL_PRODUCTION_PATH = path.join(__dirname, "..", "book-front-matter", "chapter-visual-production.json");

function loadVisualProduction() {
  try {
    return JSON.parse(fs.readFileSync(VISUAL_PRODUCTION_PATH, "utf8"));
  } catch {
    return { chapters: {}, priorityChapters: [] };
  }
}

function fmtList(arr) {
  if (!arr || !arr.length) return "—";
  return arr.map((s) => s.replace(/\|/g, "\\|")).join("; ");
}

function findChapterHtmlFiles(rootDir) {
  const out = [];
  function walk(d) {
    let entries;
    try {
      entries = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      if (ent.name.startsWith(".")) continue;
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (/^HelloGorgeous-Chapter-\d+.*\.html$/i.test(ent.name)) out.push(p);
    }
  }
  walk(rootDir);
  return out.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function analyzeFile(p) {
  const raw = fs.readFileSync(p, "utf8");
  const numM = path.basename(p).match(/Chapter-0*(\d+)/i);
  const num = numM ? parseInt(numM[1], 10) : null;
  const h2s = (raw.match(/class="ch-h2"/g) || []).length;
  const slots = (raw.match(/class="hg-visual-slot"/g) || []).length;
  const words = raw.split(/\s+/).filter(Boolean).length;
  const bodyM = /<body([^>]*)>/i.exec(raw);
  const bodyAttrs = bodyM ? bodyM[1].replace(/\s+/g, " ").trim() : "(no body tag found)";
  const hasContra = /class="contra-section"/i.test(raw);
  const hasAsk = /class="ask-section"/i.test(raw);
  return {
    num,
    h2s,
    slots,
    words,
    bodyAttrs,
    hasContra,
    hasAsk,
    basename: path.basename(p),
  };
}

function generatePremiumImplementationMap(chaptersDir, outPath) {
  const files = findChapterHtmlFiles(chaptersDir);
  /** One row per chapter number (shortest path wins if duplicates exist in subfolders). */
  const byNum = new Map();
  for (const p of files) {
    const row = { path: p, ...analyzeFile(p) };
    if (row.num == null) continue;
    const prev = byNum.get(row.num);
    if (!prev || p.length < prev.path.length) byNum.set(row.num, row);
  }
  const rows = Array.from(byNum.values()).sort((a, b) => a.num - b.num);

  const visProd = loadVisualProduction();
  const vCh = visProd.chapters || {};

  const lines = [];
  lines.push("# Premium implementation map (generated)");
  lines.push("");
  lines.push(`- **Chapters dir:** \`${chaptersDir}\``);
  lines.push(`- **Generated:** ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`- **Regenerate:** \`CHAPTERS_DIR=... node build-book-pdf.js --premium-map\``);
  lines.push(`- **Visual production JSON:** \`book-front-matter/chapter-visual-production.json\` (priority chapters — hand off to design)`);
  lines.push("");
  lines.push("## Automation summary (default `HG_PREMIUM=light`)");
  lines.push("");
  lines.push("| Ch | File | Part opener? | H2 count | Manual `hg-visual-slot` | Words (approx) | Stamp anchor (contra/ask) | Body attrs (snippet) |");
  lines.push("|----|------|--------------|----------|-------------------------|----------------|----------------------------|------------------------|");
  for (const r of rows) {
    const po = r.num != null && PART_OPENERS.has(r.num) ? "yes" : "";
    const stamp = [r.hasContra ? "contra" : "", r.hasAsk ? "ask" : ""].filter(Boolean).join("+") || "—";
    lines.push(
      `| ${r.num ?? "?"} | \`${r.basename}\` | ${po} | ${r.h2s} | ${r.slots} | ${r.words} | ${stamp} | ${r.bodyAttrs.slice(0, 80)}${r.bodyAttrs.length > 80 ? "…" : ""} |`
    );
  }
  lines.push("");
  lines.push("## Visual slot map — production (required / optional / candidates / finale)");
  lines.push("");
  lines.push(
    "Editorial fields come from **`chapter-visual-production.json`** (priority chapters). Others: **TBD** until art-directed."
  );
  lines.push("");
  lines.push(
    "| Ch | Required visuals | Optional visuals | Quote-page candidates | Infographic candidates | Finale line status |"
  );
  lines.push("|----|------------------|------------------|----------------------|------------------------|--------------------|");
  for (const r of rows) {
    const k = String(r.num);
    const vp = vCh[k];
    if (vp) {
      lines.push(
        `| ${r.num} | ${fmtList(vp.requiredVisuals)} | ${fmtList(vp.optionalVisuals)} | ${fmtList(vp.quotePageCandidates)} | ${fmtList(vp.infographicCandidates)} | ${(vp.finaleStatus || "—").replace(/\|/g, "\\|")} |`
      );
    } else {
      lines.push(`| ${r.num} | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch ${r.num} |`);
    }
  }
  lines.push("");
  lines.push("## What the build applies per chapter (when premium active)");
  lines.push("");
  lines.push("- **CSS:** `chapter-premium-visual-system.css` + `print-luxury-typography.css` + `.hg-dq-premium` / `.hg-bts--premium` / `.hg-infographic` on relevant blocks.");
  lines.push("- **Cinematic first H2:** only chapters **1, 5, 9, 13, 15, 19** when `data-premium-cinematic` default / `part`. Use `all` for every chapter’s first H2.");
  lines.push("- **Heuristic visuals:** only when `HG_PREMIUM=full` (or chapter `data-premium=\"full\"`) **and** visuals not forced to `markers` — max **3** inserts (`light`+`heuristic` on a chapter: max **2**). Default **`HG_PREMIUM=light`:** **markers-only** (no keyword inserts).");
  lines.push("- **Manual visuals:** empty `div.hg-visual-slot` filled when visuals mode is `markers` or `heuristic` (not when `off`).");
  lines.push("- **Danielle stamp:** after first `.contra-section` or `.ask-section`; variant `data-premium-stamp-variant` **0–2** or chapter-rotation.");
  lines.push("- **Finale:** from `chapter-finale-lines.json` by chapter number.");
  lines.push("");
  lines.push("## Chapters by length (words, descending)");
  lines.push("");
  lines.push("| Ch | Words | Notes |");
  lines.push("|----|-------|-------|");
  const byLen = [...rows].sort((a, b) => b.words - a.words);
  for (const r of byLen) {
    const notes = [];
    if (r.words > 5500) notes.push("long — prioritize manual art plan");
    if (!r.hasContra && !r.hasAsk) notes.push("no contra/ask — auto Danielle stamp skipped");
    if (r.slots === 0) notes.push("no manual hg-visual-slot yet");
    lines.push(`| ${r.num} | ${r.words} | ${notes.join("; ") || "—"} |`);
  }
  lines.push("");
  lines.push("## Length heuristic");
  lines.push("");
  lines.push("Word count is a proxy; PDF page count comes from `node build-book-pdf.js` after layout.");
  lines.push("");

  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, lines.join("\n"));
  console.log(`Wrote ${outPath} (${rows.length} chapters).`);
}

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

module.exports = { generatePremiumImplementationMap, findChapterHtmlFiles };

if (require.main === module) {
  const chaptersDir = process.env.CHAPTERS_DIR || path.join(require("os").homedir(), "Desktop", "chapters");
  const out = path.join(__dirname, "..", "book-front-matter", "premium-implementation-map.md");
  generatePremiumImplementationMap(chaptersDir, out);
}
