#!/usr/bin/env node
/**
 * Screenshots the actual HTML deliverable for each product and composes
 * a 1200×1200 thumbnail:
 *   - Top 72%: content screenshot (shows real product)
 *   - Bottom 28%: dark brand bar (title, price, category)
 *
 * Output: public/shop-previews/content/[slug]-thumbnail.png
 * Run:    node scripts/shop/generate-content-thumbnails.mjs
 * Resume-safe: skips already-generated files unless --force is passed.
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT    = path.join(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "public/shop-previews/content");
const FORMS   = path.join(ROOT, "public/forms");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const FORCE = process.argv.includes("--force");

function resolveHtmlPath(relFile) {
  const primary = path.join(FORMS, relFile);
  if (fs.existsSync(primary)) return { abs: primary, kind: "primary" };
  const base = path.basename(relFile, ".html");
  const preview = path.join(FORMS, "previews", `${base}-PREVIEW.html`);
  if (fs.existsSync(preview)) return { abs: preview, kind: "preview" };
  return { abs: null, kind: "missing" };
}

// Slug → { file, title, price, category }
const PRODUCTS = {
  // ── Cheat Sheets ─────────────────────────────────────────────────────────
  "botox-clinical-cheat-sheet":                  { file: "NPA-Botox-Clinical-Cheat-Sheet.html",                   title: "Botox Clinical Cheat Sheet",               price: "$10", cat: "Cheat Sheet" },
  "botox-dosing-zones-cheat-sheet":              { file: "NPA-Botox-Dosing-Zones-Cheat-Sheet.html",               title: "Botox Dosing Zones",                        price: "$10", cat: "Cheat Sheet" },
  "cannula-vs-needle-cheat-sheet":               { file: "NPA-Cannula-vs-Needle-Cheat-Sheet.html",                title: "Cannula vs Needle",                         price: "$10", cat: "Cheat Sheet" },
  "chemical-peel-reference-cheat-sheet":         { file: "NPA-Chemical-Peel-Reference-Cheat-Sheet.html",          title: "Chemical Peel Reference",                   price: "$10", cat: "Cheat Sheet" },
  "dermal-filler-clinical-cheat-sheet":          { file: "NPA-Dermal-Filler-Clinical-Cheat-Sheet.html",           title: "Dermal Filler Clinical Guide",              price: "$10", cat: "Cheat Sheet" },
  "filler-product-comparison-cheat-sheet":       { file: "NPA-Filler-Product-Comparison-Cheat-Sheet.html",        title: "Filler Product Comparison",                 price: "$10", cat: "Cheat Sheet" },
  "fitzpatrick-classification-cheat-sheet":      { file: "NPA-Fitzpatrick-Classification-Cheat-Sheet.html",       title: "Fitzpatrick Classification",                price: "$10", cat: "Cheat Sheet" },
  "glp1-clinical-cheat-sheet":                   { file: "NPA-GLP1-Clinical-Cheat-Sheet.html",                    title: "GLP-1 Clinical Guide",                      price: "$10", cat: "Cheat Sheet" },
  "glp1-titration-cheat-sheet":                  { file: "NPA-GLP1-Titration-Cheat-Sheet.html",                   title: "GLP-1 Titration Protocol",                  price: "$10", cat: "Cheat Sheet" },
  "hormone-lab-reference-cheat-sheet":           { file: "NPA-Hormone-Lab-Reference-Cheat-Sheet.html",            title: "Hormone Lab Reference",                     price: "$10", cat: "Cheat Sheet" },
  "hormone-therapy-clinical-cheat-sheet":        { file: "NPA-Hormone-Therapy-Clinical-Cheat-Sheet.html",         title: "Hormone Therapy Clinical Guide",            price: "$10", cat: "Cheat Sheet" },
  "injection-techniques-cheat-sheet":            { file: "NPA-Injection-Techniques-Cheat-Sheet.html",             title: "Injection Techniques",                      price: "$10", cat: "Cheat Sheet" },
  "ipl-laser-clinical-cheat-sheet":              { file: "NPA-IPL-Laser-Cheat-Sheet.html",                        title: "IPL & Laser Clinical Guide",                price: "$10", cat: "Cheat Sheet" },
  "iv-therapy-clinical-cheat-sheet":             { file: "NPA-IV-Therapy-Clinical-Cheat-Sheet.html",              title: "IV Therapy Clinical Guide",                 price: "$10", cat: "Cheat Sheet" },
  "laser-wavelength-reference-cheat-sheet":      { file: "NPA-Laser-Wavelength-Reference-Cheat-Sheet.html",       title: "Laser Wavelength Reference",                price: "$10", cat: "Cheat Sheet" },
  "lash-extensions-clinical-cheat-sheet":        { file: "NPA-Lash-Extensions-Cheat-Sheet.html",                  title: "Lash Extensions Clinical Guide",            price: "$10", cat: "Cheat Sheet" },
  "lash-lift-perm-clinical-cheat-sheet":         { file: "NPA-Lash-Lift-Perm-Cheat-Sheet.html",                   title: "Lash Lift & Perm Guide",                    price: "$10", cat: "Cheat Sheet" },
  "lip-filler-anatomy-cheat-sheet":              { file: "NPA-Lip-Filler-Anatomy-Cheat-Sheet.html",               title: "Lip Filler Anatomy",                        price: "$10", cat: "Cheat Sheet" },
  "membership-pricing-calculator-cheat-sheet":   { file: "NPA-Membership-Pricing-Calculator-Cheat-Sheet.html",    title: "Membership Pricing Calculator",             price: "$10", cat: "Cheat Sheet" },
  "microneedling-depth-cheat-sheet":             { file: "NPA-Microneedling-Depth-Cheat-Sheet.html",              title: "Microneedling Depth Guide",                 price: "$10", cat: "Cheat Sheet" },
  "new-patient-intake-cheat-sheet":              { file: "NPA-New-Patient-Intake-Cheat-Sheet.html",               title: "New Patient Intake",                        price: "$10", cat: "Cheat Sheet" },
  "olympia-iv-dosing-guide-cheat-sheet":         { file: "NPA-Olympia-IV-Dosing-Guide-Cheat-Sheet.html",          title: "Olympia IV Dosing Guide",                   price: "$10", cat: "Cheat Sheet" },
  "pellet-therapy-clinical-cheat-sheet":         { file: "NPA-Pellet-Therapy-Clinical-Cheat-Sheet.html",          title: "Pellet Therapy Clinical Guide",             price: "$10", cat: "Cheat Sheet" },
  "pellet-therapy-dosing-cheat-sheet":           { file: "NPA-Pellet-Therapy-Dosing-Cheat-Sheet.html",            title: "Pellet Therapy Dosing",                     price: "$10", cat: "Cheat Sheet" },
  "peptide-therapy-clinical-cheat-sheet":        { file: "NPA-Peptide-Therapy-Clinical-Cheat-Sheet.html",         title: "Peptide Therapy Clinical Guide",            price: "$10", cat: "Cheat Sheet" },
  "pharmaceutical-reference-cheat-sheet":        { file: "NPA-Pharmaceutical-Reference-Cheat-Sheet.html",         title: "Pharmaceutical Reference",                  price: "$10", cat: "Cheat Sheet" },
  "retail-pricing-formula-cheat-sheet":          { file: "NPA-Retail-Pricing-Formula-Cheat-Sheet.html",           title: "Retail Pricing Formula",                    price: "$10", cat: "Cheat Sheet" },
  "skincare-ingredient-interactions-cheat-sheet":{ file: "NPA-Skincare-Ingredient-Interactions-Cheat-Sheet.html", title: "Skincare Ingredient Interactions",          price: "$10", cat: "Cheat Sheet" },
  "staff-roles-cheat-sheet":                     { file: "NPA-Staff-Roles-Cheat-Sheet.html",                      title: "Staff Roles Reference",                     price: "$10", cat: "Cheat Sheet" },
  "tirzepatide-vs-semaglutide-cheat-sheet":      { file: "NPA-Tirzepatide-vs-Semaglutide-Cheat-Sheet.html",       title: "Tirzepatide vs Semaglutide",                price: "$10", cat: "Cheat Sheet" },
  "treatment-room-setup-cheat-sheet":            { file: "NPA-Treatment-Room-Setup-Cheat-Sheet.html",             title: "Treatment Room Setup",                      price: "$10", cat: "Cheat Sheet" },
  "trt-men-vs-women-cheat-sheet":                { file: "NPA-TRT-Men-vs-Women-Cheat-Sheet.html",                 title: "TRT: Men vs Women",                         price: "$10", cat: "Cheat Sheet" },
  "vascular-occlusion-protocol-cheat-sheet":     { file: "NPA-Vascular-Occlusion-Protocol-Cheat-Sheet.html",      title: "Vascular Occlusion Protocol",               price: "$10", cat: "Cheat Sheet" },
  "brow-henna-clinical-cheat-sheet":             { file: "NPA-Brow-Henna-Cheat-Sheet.html",                       title: "Brow Henna Clinical Guide",                 price: "$10", cat: "Cheat Sheet" },
  "waxing-clinical-cheat-sheet":                 { file: "NPA-Waxing-Cheat-Sheet.html",                           title: "Waxing Clinical Guide",                     price: "$10", cat: "Cheat Sheet" },

  // ── Consent Forms ─────────────────────────────────────────────────────────
  "consent-botox-neurotoxins":   { file: "NPA-Consent-Botox-Neurotoxins.html",  title: "Botox & Neurotoxin Consent",  price: "$19", cat: "Consent Form" },
  "consent-dermal-filler":       { file: "NPA-Consent-Dermal-Filler.html",      title: "Dermal Filler Consent",       price: "$19", cat: "Consent Form" },
  "consent-glp1-weight-loss":    { file: "NPA-Consent-GLP1-Weight-Loss.html",   title: "GLP-1 Weight Loss Consent",   price: "$19", cat: "Consent Form" },
  "consent-hormone-therapy":     { file: "NPA-Consent-Hormone-Therapy.html",    title: "Hormone Therapy Consent",     price: "$19", cat: "Consent Form" },
  "consent-iv-im-therapy":       { file: "NPA-Consent-IV-Therapy.html",         title: "IV & IM Therapy Consent",     price: "$19", cat: "Consent Form" },
  "consent-laser-ipl":           { file: "NPA-Consent-Laser-IPL.html",          title: "Laser & IPL Consent",         price: "$19", cat: "Consent Form" },
  "consent-lash-extensions":     { file: "NPA-Consent-Lash-Extensions.html",    title: "Lash Extensions Consent",     price: "$19", cat: "Consent Form" },
  "consent-microneedling-rf":    { file: "NPA-Consent-Microneedling-RF.html",   title: "Microneedling & RF Consent",  price: "$19", cat: "Consent Form" },
  "consent-photography-hipaa":   { file: "NPA-Consent-Photography-HIPAA.html",  title: "Photography & HIPAA Consent", price: "$19", cat: "Consent Form" },
  "consent-waxing":              { file: "NPA-Consent-Waxing.html",             title: "Waxing Consent Form",         price: "$19", cat: "Consent Form" },

  // ── Playbooks ─────────────────────────────────────────────────────────────
  "injectors-playbook":           { file: "NPA-Botox-Filler-Playbook.html",        title: "The Injectors Playbook",          price: "$127", cat: "Playbook" },
  "hormone-therapy-playbook":     { file: "NPA-Hormone-Therapy-Playbook.html",     title: "Hormone Therapy Playbook",        price: "$127", cat: "Playbook" },
  "peptide-therapy-playbook":     { file: "NPA-Peptide-Therapy-Playbook.html",     title: "Peptide Therapy Playbook",        price: "$127", cat: "Playbook" },
  "google-domination-playbook":   { file: "NPA-Google-Domination-Playbook.html",   title: "Google Domination Playbook",      price: "$127", cat: "Playbook" },
  "medspa-social-media-system":   { file: "NPA-Social-Media-System.html",          title: "Med Spa Social Media System",     price: "$147", cat: "Playbook" },
  "medspa-content-strategy-system":{ file: "NPA-Content-Strategy-System.html",     title: "Med Spa Content Strategy System", price: "$147", cat: "Playbook" },
  "microblading-pmu-playbook":    { file: "NPA-Microblading-PMU-Playbook.html",    title: "Microblading & PMU Playbook",     price: "$127", cat: "Playbook" },
  "new-injector-onboarding-kit":  { file: "NPA-New-Injector-Onboarding-Kit.html",  title: "New Injector Onboarding Kit",     price: "$67",  cat: "Playbook" },
  "guidebook-category-strategy":  { file: "NPA-Guidebook-Category-Strategy.html",  title: "Category Strategy Guidebook",     price: "$47",  cat: "Playbook" },
  "facial-training-manual":       { file: "NPA-Complete-Facial-Training-Manual.html", title: "Complete Facial Training Manual", price: "$10", cat: "Playbook" },

  // ── Business Systems ──────────────────────────────────────────────────────
  "npa-49-star-system":            { file: "NPA-49-Star-System.html",                title: "The 4.9-Star Google System",      price: "$57",  cat: "Business" },
  "difficult-client-scripts":      { file: "NPA-Difficult-Client-Scripts.html",       title: "Difficult Client Scripts",        price: "$47",  cat: "Business" },
  "diy-google-setup-kit":          { file: "NPA-DIY-Google-Setup-Kit.html",           title: "DIY Google Setup Kit",            price: "$297", cat: "Business" },
  "facial-anatomy-nurse-injector": { file: "NPA-Facial-Anatomy-Nurse-Injector.html",  title: "Facial Anatomy for Injectors",    price: "$67",  cat: "Business" },
  "insurance-legal-compliance-guide":{ file: "NPA-Insurance-Legal-Compliance-Guide.html", title: "Insurance & Legal Guide",     price: "$47",  cat: "Business" },
  "patient-loyalty-system":        { file: "NPA-Patient-Loyalty-System.html",         title: "Patient Loyalty System",          price: "$97",  cat: "Business" },
  "phase-2-business-bundle":       { file: "NPA-Phase2-Business-Bundle.html",         title: "Phase 2 Business Bundle",         price: "$47",  cat: "Business" },
  "vendor-supplier-directory":     { file: "NPA-Vendor-Supplier-Directory.html",      title: "Vendor & Supplier Directory",     price: "$47",  cat: "Business" },

  // ── Practice Management ───────────────────────────────────────────────────
  "med-spa-starter-kit":      { file: "NPA-Med-Spa-Starter-Kit.html",          title: "Med Spa Starter Kit",         price: "$59", cat: "Practice Mgmt" },
  "aftercare-card-kit":       { file: "NPA-Aftercare-Card-Kit.html",           title: "Aftercare Card Kit",          price: "$37", cat: "Practice Mgmt" },
  "before-after-photo-system":{ file: "NPA-Before-After-Photo-System.html",    title: "Before & After Photo System", price: "$47", cat: "Practice Mgmt" },
  "patient-communication-kit":{ file: "NPA-Patient-Communication-Kit.html",    title: "Patient Communication Kit",   price: "$47", cat: "Practice Mgmt" },
  "medical-disclaimer-system":{ file: "NPA-Medical-Disclaimer-System.html",    title: "Medical Disclaimer System",   price: "$47", cat: "Practice Mgmt" },
  "treatment-menu-signage-kit":{ file: "NPA-Treatment-Menu-Signage-Kit.html",  title: "Treatment Menu & Signage Kit",price: "$47", cat: "Practice Mgmt" },

  // ── Patient Journey Kits ──────────────────────────────────────────────────
  "botox-patient-journey-kit":        { file: "NPA-Botox-Patient-Journey-Kit.html",       title: "Botox Patient Journey Kit",        price: "$67", cat: "Patient Journey" },
  "glp1-patient-journey-kit":         { file: "NPA-Patient-Journey-Kits-Batch.html",      title: "GLP-1 Patient Journey Kit",        price: "$67", cat: "Patient Journey" },
  "filler-patient-journey-kit":       { file: "NPA-Patient-Journey-Kits-Batch.html",      title: "Filler Patient Journey Kit",       price: "$67", cat: "Patient Journey" },
  "hormone-patient-journey-kit":      { file: "NPA-Patient-Journey-Kits-Batch.html",      title: "Hormone Patient Journey Kit",      price: "$67", cat: "Patient Journey" },
  "peptide-patient-journey-kit":      { file: "NPA-Patient-Journey-Kits-Batch.html",      title: "Peptide Patient Journey Kit",      price: "$67", cat: "Patient Journey" },
  "iv-therapy-patient-journey-kit":   { file: "NPA-Patient-Journey-Kits-Batch.html",      title: "IV Therapy Patient Journey Kit",   price: "$57", cat: "Patient Journey" },
  "microneedling-patient-journey-kit":{ file: "NPA-Patient-Journey-Kits-Batch.html",      title: "Microneedling Patient Journey Kit",price: "$57", cat: "Patient Journey" },
  "chemical-peel-patient-journey-kit":{ file: "NPA-Patient-Journey-Kits-Batch.html",      title: "Chemical Peel Patient Journey Kit",price: "$57", cat: "Patient Journey" },
};

// Canvas size
const THUMB_W = 1200;
const THUMB_H = 1200;
const CONTENT_H = 840; // top 70%
const BAR_H = THUMB_H - CONTENT_H; // bottom 30%

// Viewport to render HTML at
const VP_W = 1100;

// Category accent colors
const CAT_COLOR = {
  "Cheat Sheet":   "#FF69B4",
  "Consent Form":  "#60A5FA",
  "Playbook":      "#FF69B4",
  "Business":      "#60A5FA",
  "Practice Mgmt": "#34D399",
  "Patient Journey":"#C084FC",
};

function compositeHtml(contentDataUrl, product) {
  const accent = CAT_COLOR[product.cat] || "#FF69B4";
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:${THUMB_W}px; height:${THUMB_H}px; overflow:hidden; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:#0d1117; }
.content-frame {
  width:${THUMB_W}px; height:${CONTENT_H}px; overflow:hidden; position:relative;
  background:#fff;
}
.content-frame img {
  width:${THUMB_W}px; height:auto; display:block;
}
/* Fade out bottom of content */
.content-frame::after {
  content:'';
  position:absolute; bottom:0; left:0; right:0; height:180px;
  background:linear-gradient(transparent, rgba(13,17,23,0.95));
}
/* Brand bar */
.bar {
  width:${THUMB_W}px; height:${BAR_H}px;
  background: linear-gradient(135deg, #0d0a14 0%, #0d1117 100%);
  display:flex; align-items:center; justify-content:space-between;
  padding:0 60px;
  border-top:3px solid ${accent};
}
.bar-left { display:flex; flex-direction:column; gap:10px; }
.bar-cat {
  font-size:24px; font-weight:700; letter-spacing:0.12em;
  color:${accent}; text-transform:uppercase;
}
.bar-title {
  font-size:42px; font-weight:900; color:white;
  letter-spacing:-0.01em; line-height:1.05;
  max-width:700px;
}
.bar-brand { font-size:22px; color:rgba(255,255,255,0.3); letter-spacing:0.06em; text-transform:uppercase; margin-top:4px; }
.bar-right { text-align:right; }
.bar-price { font-size:72px; font-weight:900; color:${accent}; letter-spacing:-0.02em; line-height:1; }
.bar-delivery { font-size:22px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-top:6px; }
</style>
</head><body>
<div class="content-frame">
  <img src="${contentDataUrl}" />
</div>
<div class="bar">
  <div class="bar-left">
    <div class="bar-cat">${product.cat}</div>
    <div class="bar-title">${product.title}</div>
    <div class="bar-brand">No Prior Authorization</div>
  </div>
  <div class="bar-right">
    <div class="bar-price">${product.price}</div>
    <div class="bar-delivery">Instant Download</div>
  </div>
</div>
</body></html>`;
}

async function run() {
  const slugs = Object.keys(PRODUCTS);
  console.log(`Generating ${slugs.length} content thumbnails → ${OUT_DIR}${FORCE ? " (force overwrite)" : ""}\n`);

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const contentPage = await browser.newPage();
  const compositePage = await browser.newPage();

  let generated = 0, skipped = 0, failed = 0;

  for (const slug of slugs) {
    const outPath = path.join(OUT_DIR, `${slug}-thumbnail.png`);
    if (fs.existsSync(outPath) && !FORCE) {
      skipped++;
      continue;
    }

    const product = PRODUCTS[slug];
    const resolved = resolveHtmlPath(product.file);

    if (!resolved.abs) {
      console.log(`  ⚠ missing: ${product.file} (${slug})`);
      failed++;
      continue;
    }
    if (resolved.kind === "preview") {
      console.log(`  ↳ preview: ${path.basename(resolved.abs)} (${slug})`);
    }

    try {
      // 1. Screenshot the real content
      await contentPage.setViewport({ width: VP_W, height: 900, deviceScaleFactor: 1.5 });
      const fileUrl = pathToFileURL(resolved.abs).href;
      await contentPage.goto(fileUrl, { waitUntil: "load", timeout: 120000 });
      await contentPage.evaluate(() => document.fonts?.ready ?? Promise.resolve());
      await new Promise((r) => setTimeout(r, 1200));
      const contentH = await contentPage.evaluate(() => Math.min(document.body.scrollHeight, 1400));
      const contentBuf = await contentPage.screenshot({
        type: "png",
        clip: { x: 0, y: 0, width: VP_W, height: contentH },
      });
      const contentDataUrl = "data:image/png;base64," + contentBuf.toString("base64");

      // 2. Composite with brand bar
      await compositePage.setViewport({ width: THUMB_W, height: THUMB_H, deviceScaleFactor: 1 });
      await compositePage.setContent(compositeHtml(contentDataUrl, product), { waitUntil: "domcontentloaded" });
      await compositePage.screenshot({
        path: outPath,
        type: "png",
        clip: { x: 0, y: 0, width: THUMB_W, height: THUMB_H },
      });

      console.log(`  ✓ ${slug}`);
      generated++;
    } catch (e) {
      console.log(`  ✗ ${slug}: ${e.message.slice(0, 80)}`);
      failed++;
    }
  }

  await browser.close();
  console.log(`\n✓ Done — ${generated} generated, ${skipped} skipped, ${failed} failed`);
  console.log(`Output: public/shop-previews/content/`);
}

run().catch(e => { console.error(e); process.exit(1); });
