#!/usr/bin/env node
/**
 * Builds ALL Printify physical products from NPA cheat sheet content.
 *
 * Products created:
 *   36 Spiral Notebooks (blueprint 74, SPOKE, variant 34240)
 *    7 Clinical Card Packs (blueprint 1232, CatPrint, variant 93763)
 *
 * Usage: node scripts/printify/build-all-products.mjs
 *   --skip-generate   skip image generation (use existing PNGs)
 *   --skip-upload     skip upload (use saved image IDs)
 *   --dry-run         generate images only, don't create Printify products
 */
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const FORMS = path.join(ROOT, "delivery-assets/forms");
const ASSETS = path.join(ROOT, "printify-assets");

const args = process.argv.slice(2);
const SKIP_GENERATE = args.includes("--skip-generate");
const SKIP_UPLOAD   = args.includes("--skip-upload");
const DRY_RUN       = args.includes("--dry-run");

// ── Env ───────────────────────────────────────────────────────────────────────
function loadEnv() {
  const p = path.join(ROOT, ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const TOKEN   = process.env.PRINTIFY_API_TOKEN;
const SHOP_ID = 27239803;
const BASE    = "https://api.printify.com/v1";
if (!TOKEN && !DRY_RUN) { console.error("Missing PRINTIFY_API_TOKEN"); process.exit(1); }

function apiHeaders() {
  return { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json" };
}

// ── Printify helpers ──────────────────────────────────────────────────────────
async function uploadImage(filePath, retries = 4) {
  const base64 = fs.readFileSync(filePath).toString("base64");
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await fetch(`${BASE}/uploads/images.json`, {
        method: "POST", headers: apiHeaders(),
        body: JSON.stringify({ file_name: path.basename(filePath), contents: base64 }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(j));
      return j.id;
    } catch (e) {
      if (i === retries) throw e;
      process.stdout.write(` retry${i}...`);
      await new Promise(r => setTimeout(r, 2500 * i));
    }
  }
}

async function createProduct(body) {
  const res = await fetch(`${BASE}/shops/${SHOP_ID}/products.json`, {
    method: "POST", headers: apiHeaders(), body: JSON.stringify(body),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(j));
  return j;
}

// ── Image helpers ─────────────────────────────────────────────────────────────
const NB_W = 1810, NB_H = 2534;   // notebook cover
const CARD_W = 2625, CARD_H = 1725; // card designs

const ACCENT_MAP = {
  glp1: "#1a7a6e", botox: "#D4537E", filler: "#6c3483",
  iv: "#1a2940", hormone: "#A83560", peptide: "#8e44ad",
  lash: "#c0392b", skin: "#c0392b", laser: "#2471a3",
  injection: "#b8760a", business: "#1a2940", waxing: "#7d6608",
  microneedling: "#6c3483", chemical: "#1e6b3c", fitzpatrick: "#935116",
  brow: "#7d6608", staff: "#1a2940", membership: "#117a65", retail: "#1a2940",
  treatment: "#2e86c1", pharmaceutical: "#1a2940", pellet: "#8e44ad",
  cannula: "#D4537E", vascular: "#c0392b", lip: "#D4537E",
  tirzepatide: "#1a7a6e", olympia: "#1a2940",
};

function accentFor(slug) {
  for (const [k, v] of Object.entries(ACCENT_MAP)) {
    if (slug.toLowerCase().includes(k)) return v;
  }
  return "#D4537E";
}

function notebookCoverHtml(title, subtitle, tags, accentColor, cheatSheetDataUrl) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{width:${NB_W}px;height:${NB_H}px;overflow:hidden}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#1A1A1A;color:white;display:flex;flex-direction:column;position:relative;overflow:hidden;}
    .top{position:relative;z-index:1;background:${accentColor};padding:40px 70px;display:flex;align-items:center;justify-content:space-between;}
    .brand{font-size:26px;font-weight:900;letter-spacing:5px;text-transform:uppercase;color:white;opacity:.9;}
    .series{font-size:18px;letter-spacing:3px;color:rgba(255,255,255,.7);text-transform:uppercase;}
    .preview{position:absolute;inset:0;z-index:0;}
    .preview img{width:100%;height:100%;object-fit:cover;object-position:top center;opacity:.22;transform:scale(1.6);transform-origin:top center;}
    .overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(26,26,26,0.0) 0%,rgba(26,26,26,0.15) 30%,rgba(26,26,26,0.82) 58%,rgba(26,26,26,0.99) 72%);}
    .bottom{position:absolute;bottom:116px;left:0;right:0;padding:0 70px;display:flex;flex-direction:column;gap:20px;z-index:1;}
    .line{width:70px;height:5px;background:${accentColor};border-radius:3px;}
    h1{font-size:116px;font-weight:900;line-height:1.0;letter-spacing:-2px;}
    .sub{font-size:34px;font-weight:600;color:${accentColor};letter-spacing:3px;text-transform:uppercase;}
    .tags{display:flex;flex-wrap:wrap;gap:12px;margin-top:6px;}
    .tag{font-size:18px;padding:7px 16px;border:1.5px solid rgba(255,255,255,.2);border-radius:4px;color:rgba(255,255,255,.55);letter-spacing:1px;}
    .footer{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:28px 70px;background:${accentColor};margin-top:auto;}
    .fb{font-size:20px;font-weight:800;letter-spacing:3px;text-transform:uppercase;}
    .fu{font-size:18px;opacity:.8;letter-spacing:1px;}
  </style></head><body>
  <div class="top"><span class="brand">No Prior Authorization</span><span class="series">Clinical Reference Series</span></div>
  <div class="preview">${cheatSheetDataUrl ? `<img src="${cheatSheetDataUrl}"/>` : ""}<div class="overlay"></div></div>
  <div class="bottom">
    <div class="line"></div>
    <h1>${title}</h1>
    <div class="sub">${subtitle}</div>
    <div class="tags">${tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
  </div>
  <div class="footer"><span class="fb">NPA Clinical Series</span><span class="fu">nopriorauthorization.com</span></div>
</body></html>`;
}

function cardInsideHtml(title, bullets) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{width:${CARD_W}px;height:${CARD_H}px;overflow:hidden}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#1A1A1A;color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:70px 110px;gap:36px;}
    .brand{font-size:20px;font-weight:800;color:#D4537E;letter-spacing:4px;text-transform:uppercase;}
    .line{width:110px;height:3px;background:#D4537E;border-radius:2px;}
    h2{font-size:68px;font-weight:900;letter-spacing:2px;text-align:center;line-height:1.1;}
    ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:18px 50px;width:100%;max-width:2200px;}
    ul li{font-size:25px;color:#f0f0f0;padding:14px 18px;border-left:4px solid #D4537E;background:rgba(255,255,255,.05);border-radius:0 6px 6px 0;line-height:1.4;}
    .foot{font-size:18px;color:#666;text-align:center;}
  </style></head><body>
  <span class="brand">No Prior Authorization</span>
  <div class="line"></div>
  <h2>${title}</h2>
  <ul>${bullets.map(b => `<li>${b}</li>`).join("")}</ul>
  <p class="foot">nopriorauthorization.com — Clinical Reference Series</p>
</body></html>`;
}

function brandCardFrontHtml(accentColor) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{width:${CARD_W}px;height:${CARD_H}px;overflow:hidden}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:${accentColor};color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:28px;}
    .tag{font-size:26px;letter-spacing:6px;text-transform:uppercase;opacity:.85;}
    .line{width:180px;height:3px;background:rgba(255,255,255,.4);border-radius:2px;}
    h1{font-size:110px;font-weight:900;text-align:center;line-height:1;}
    .url{font-size:28px;letter-spacing:2px;opacity:.85;}
  </style></head><body>
  <p class="tag">Clinical Reference Series</p>
  <div class="line"></div>
  <h1>No Prior<br/>Authorization</h1>
  <div class="line"></div>
  <p class="url">nopriorauthorization.com</p>
</body></html>`;
}

function brandCardInsideHtml() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{width:${CARD_W}px;height:${CARD_H}px;overflow:hidden}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#1A1A1A;color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:70px 110px;gap:32px;}
    .brand{font-size:20px;font-weight:800;color:#D4537E;letter-spacing:4px;text-transform:uppercase;}
    .line{width:110px;height:3px;background:#D4537E;border-radius:2px;}
    h2{font-size:60px;font-weight:900;text-align:center;line-height:1.1;}
    p{font-size:26px;color:#ccc;text-align:center;max-width:1800px;line-height:1.6;}
    .row{display:flex;gap:80px;margin-top:16px;}
    .item{text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center;}
    .lbl{font-size:20px;color:#D4537E;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
    .val{font-size:22px;color:#f0f0f0;}
  </style></head><body>
  <span class="brand">No Prior Authorization</span>
  <div class="line"></div>
  <h2>Questions? We've Got You.</h2>
  <p>These cards are part of the NPA Clinical Reference Series — designed for med spa providers, nurse injectors, and aesthetic practice staff.</p>
  <div class="row">
    <div class="item"><div class="lbl">Support</div><div class="val">hello@nopriorauthorization.com</div></div>
    <div class="item"><div class="lbl">Website</div><div class="val">nopriorauthorization.com</div></div>
  </div>
</body></html>`;
}

// ── Product definitions ───────────────────────────────────────────────────────

const ALL_NOTEBOOKS = [
  { slug: "glp1-clinical-notebook",           title: "GLP-1 & Weight Loss",              tags: ["GLP-1","Semaglutide","Tirzepatide","Titration","Weight Loss"],    file: "NPA-GLP1-Clinical-Cheat-Sheet.html" },
  { slug: "botox-clinical-notebook",           title: "Botox & Neurotoxin",               tags: ["Botox","Dysport","Neurotoxin","Dosing","Zones"],                   file: "NPA-Botox-Clinical-Cheat-Sheet.html" },
  { slug: "filler-clinical-notebook",          title: "Dermal Filler",                    tags: ["Filler","Lip Filler","Cannula","Anatomy","Hyaluronidase"],         file: "NPA-Dermal-Filler-Clinical-Cheat-Sheet.html" },
  { slug: "iv-therapy-clinical-notebook",      title: "IV Therapy",                       tags: ["IV Therapy","Drip","Vitamins","Dosing","Protocols"],               file: "NPA-IV-Therapy-Clinical-Cheat-Sheet.html" },
  { slug: "injection-techniques-notebook",     title: "Injection Techniques",             tags: ["Technique","Cannula","Needle","Anatomy","Depth"],                  file: "NPA-Injection-Techniques-Cheat-Sheet.html" },
  { slug: "hormone-therapy-notebook",          title: "Hormone Therapy (BHRT)",           tags: ["BHRT","TRT","Hormones","Pellet","Dosing"],                         file: "NPA-Hormone-Therapy-Clinical-Cheat-Sheet.html" },
  { slug: "peptide-therapy-notebook",          title: "Peptide Therapy",                  tags: ["Peptides","BPC-157","TB-500","NAD+","Sermorelin"],                  file: "NPA-Peptide-Therapy-Clinical-Cheat-Sheet.html" },
  { slug: "botox-dosing-zones-notebook",       title: "Botox Dosing Zones",               tags: ["Dosing","Zones","Units","Forehead","Crow's Feet"],                  file: "NPA-Botox-Dosing-Zones-Cheat-Sheet.html" },
  { slug: "cannula-vs-needle-notebook",        title: "Cannula vs Needle",                tags: ["Cannula","Needle","Technique","Safety","Filler"],                  file: "NPA-Cannula-vs-Needle-Cheat-Sheet.html" },
  { slug: "chemical-peel-notebook",            title: "Chemical Peel Reference",          tags: ["Chemical Peel","AHA","BHA","TCA","Fitzpatrick"],                   file: "NPA-Chemical-Peel-Reference-Cheat-Sheet.html" },
  { slug: "filler-comparison-notebook",        title: "Filler Product Comparison",        tags: ["Juvederm","Restylane","Sculptra","Radiesse","Product"],            file: "NPA-Filler-Product-Comparison-Cheat-Sheet.html" },
  { slug: "fitzpatrick-notebook",              title: "Fitzpatrick Classification",        tags: ["Fitzpatrick","Skin Type","Laser","Peel","Safety"],                 file: "NPA-Fitzpatrick-Classification-Cheat-Sheet.html" },
  { slug: "glp1-titration-notebook",           title: "GLP-1 Titration Schedule",         tags: ["Titration","Semaglutide","Dosing","Side Effects","Schedule"],      file: "NPA-GLP1-Titration-Cheat-Sheet.html" },
  { slug: "hormone-lab-notebook",              title: "Hormone Lab Reference",            tags: ["Labs","BHRT","Testosterone","Estrogen","Ranges"],                  file: "NPA-Hormone-Lab-Reference-Cheat-Sheet.html" },
  { slug: "ipl-laser-notebook",                title: "IPL & Laser Treatments",           tags: ["IPL","Laser","Wavelength","Fitzpatrick","Settings"],               file: "NPA-IPL-Laser-Cheat-Sheet.html" },
  { slug: "laser-wavelength-notebook",         title: "Laser Wavelength Reference",       tags: ["Wavelength","Nd:YAG","Alexandrite","Diode","CO2"],                 file: "NPA-Laser-Wavelength-Reference-Cheat-Sheet.html" },
  { slug: "lash-extensions-notebook",          title: "Lash Extensions",                  tags: ["Lash","Extensions","Curl","Diameter","Mapping"],                   file: "NPA-Lash-Extensions-Cheat-Sheet.html" },
  { slug: "lash-lift-notebook",                title: "Lash Lift & Perm",                 tags: ["Lash Lift","Perm","Processing","Rods","Keratin"],                  file: "NPA-Lash-Lift-Perm-Cheat-Sheet.html" },
  { slug: "lip-filler-anatomy-notebook",       title: "Lip Filler Anatomy",               tags: ["Lip Filler","Anatomy","Borders","Cupid's Bow","Philtrum"],         file: "NPA-Lip-Filler-Anatomy-Cheat-Sheet.html" },
  { slug: "membership-pricing-notebook",       title: "Membership Pricing Calculator",    tags: ["Membership","Pricing","Revenue","Calculator","Med Spa"],           file: "NPA-Membership-Pricing-Calculator-Cheat-Sheet.html" },
  { slug: "microneedling-depth-notebook",      title: "Microneedling Depth Guide",        tags: ["Microneedling","Depth","RF","PRP","Skin"],                         file: "NPA-Microneedling-Depth-Cheat-Sheet.html" },
  { slug: "new-patient-intake-notebook",       title: "New Patient Intake",               tags: ["Intake","Consultation","New Patient","Forms","Workflow"],          file: "NPA-New-Patient-Intake-Cheat-Sheet.html" },
  { slug: "olympia-iv-dosing-notebook",        title: "Olympia IV Therapy Dosing",        tags: ["Olympia","IV","Dosing","Myers Cocktail","NAD+"],                   file: "NPA-Olympia-IV-Dosing-Guide-Cheat-Sheet.html" },
  { slug: "pellet-therapy-clinical-notebook",  title: "Pellet Therapy Clinical",          tags: ["Pellet","BHRT","Testosterone","Dosing","Implant"],                 file: "NPA-Pellet-Therapy-Clinical-Cheat-Sheet.html" },
  { slug: "pellet-dosing-notebook",            title: "Pellet Therapy Dosing",            tags: ["Pellet","Dosing","mg","Testosterone","Estradiol"],                 file: "NPA-Pellet-Therapy-Dosing-Cheat-Sheet.html" },
  { slug: "pharmaceutical-reference-notebook", title: "Pharmaceutical Reference",         tags: ["Pharmaceuticals","Dosing","Dilution","Reconstitution","Rx"],       file: "NPA-Pharmaceutical-Reference-Cheat-Sheet.html" },
  { slug: "retail-pricing-notebook",           title: "Retail Pricing Formula",           tags: ["Retail","Pricing","Markup","Revenue","Products"],                  file: "NPA-Retail-Pricing-Formula-Cheat-Sheet.html" },
  { slug: "skincare-ingredients-notebook",     title: "Skincare Ingredient Interactions", tags: ["Retinol","Vitamin C","AHA","Niacinamide","Layering"],              file: "NPA-Skincare-Ingredient-Interactions-Cheat-Sheet.html" },
  { slug: "staff-roles-notebook",              title: "Staff Roles & Scope",              tags: ["Staff","Roles","Scope","MA","RN","NP"],                            file: "NPA-Staff-Roles-Cheat-Sheet.html" },
  { slug: "tirzepatide-vs-sema-notebook",      title: "Tirzepatide vs Semaglutide",       tags: ["Tirzepatide","Semaglutide","GLP-1","GIP","Comparison"],            file: "NPA-Tirzepatide-vs-Semaglutide-Cheat-Sheet.html" },
  { slug: "treatment-room-setup-notebook",     title: "Treatment Room Setup",             tags: ["Setup","Room","Supplies","Sterilization","Prep"],                  file: "NPA-Treatment-Room-Setup-Cheat-Sheet.html" },
  { slug: "trt-men-vs-women-notebook",         title: "TRT: Men vs Women",                tags: ["TRT","Testosterone","Men","Women","BHRT"],                         file: "NPA-TRT-Men-vs-Women-Cheat-Sheet.html" },
  { slug: "vascular-occlusion-notebook",       title: "Vascular Occlusion Protocol",      tags: ["Vascular","Occlusion","Emergency","Hyaluronidase","Safety"],       file: "NPA-Vascular-Occlusion-Protocol-Cheat-Sheet.html" },
  { slug: "waxing-notebook",                   title: "Professional Waxing",              tags: ["Waxing","Hard Wax","Soft Wax","Technique","Aftercare"],            file: "NPA-Waxing-Cheat-Sheet.html" },
  { slug: "brow-henna-notebook",               title: "Brow Henna & Tinting",             tags: ["Brow","Henna","Tinting","Mapping","Aftercare"],                    file: "NPA-Brow-Henna-Cheat-Sheet.html" },
  { slug: "skin-analysis-notebook",            title: "Skin Analysis",                    tags: ["Skin Analysis","Consultation","Fitzpatrick","Conditions","Assessment"], file: "NPA-Skin-Analysis-Free-Cheat-Sheet.html" },
];

const CARD_PACKS = [
  // GLP-1 pack already done — skip
  {
    slug: "botox-card-pack",
    title: "Botox & Neurotoxin Clinical Reference Card Pack",
    accentColor: "#D4537E",
    price: 2499,
    cards: [
      { file: "NPA-Botox-Clinical-Cheat-Sheet.html",       insideTitle: "Botox Overview",           bullets: ["Onset: 3–5 days","Peak: 10–14 days","Duration: 3–4 months","Reconstitute: 2.5ml saline/100u","Store: refrigerated","Avoid: blood thinners 1 wk"] },
      { file: "NPA-Botox-Dosing-Zones-Cheat-Sheet.html",   insideTitle: "Dosing by Zone",            bullets: ["Glabella: 20–30u","Frontalis: 10–20u","Crow's feet: 10–15u ea","Brow lift: 2–4u","Lip flip: 4–6u","Platysma: 15–50u"] },
      { file: "NPA-Vascular-Occlusion-Protocol-Cheat-Sheet.html", insideTitle: "Vascular Emergency",  bullets: ["STOP injection immediately","Hyaluronidase 150–200u stat","Warm compress + massage","Aspirin 325mg PO","Recheck q15 min","Call 911 if no improvement 1hr"] },
      { file: "NPA-Cannula-vs-Needle-Cheat-Sheet.html",    insideTitle: "Cannula vs Needle",         bullets: ["Cannula: lower bruise risk","Needle: more precise placement","Cannula min: 25G","Cheeks/jawline: cannula preferred","Lips/glabella: needle preferred","Always aspirate with needle"] },
      { file: "NPA-Injection-Techniques-Cheat-Sheet.html", insideTitle: "Injection Techniques",     bullets: ["Serial puncture: multiple entry","Linear threading: retrograde","Fanning: radial spread","Cross-hatching: grid pattern","Bolus: one deposit","Depth: product-dependent"] },
    ],
  },
  {
    slug: "filler-card-pack",
    title: "Dermal Filler Clinical Reference Card Pack",
    accentColor: "#6c3483",
    price: 2499,
    cards: [
      { file: "NPA-Dermal-Filler-Clinical-Cheat-Sheet.html",    insideTitle: "Filler Overview",        bullets: ["HA filler: reversible","Duration: 6–18 months","Store at room temp","Avoid: NSAIDs 1 wk","Ice before/after","Avoid massage 24hrs"] },
      { file: "NPA-Filler-Product-Comparison-Cheat-Sheet.html", insideTitle: "Product Comparison",     bullets: ["Juvederm Ultra: lips/folds","Juvederm Voluma: cheeks","Restylane: versatile","Sculptra: collagen stimulator","Radiesse: hands/jawline","Belotero: superficial lines"] },
      { file: "NPA-Lip-Filler-Anatomy-Cheat-Sheet.html",        insideTitle: "Lip Anatomy",            bullets: ["Vermillion border: define","Cupid's bow: upper lip V","Philtrum columns: vertical","Tubercle: central projection","Commissures: corners","White roll: highlight"] },
      { file: "NPA-Fitzpatrick-Classification-Cheat-Sheet.html",insideTitle: "Fitzpatrick Scale",      bullets: ["Type I: always burns","Type II: usually burns","Type III: sometimes burns","Type IV: rarely burns","Type V: rarely burns/tans","Type VI: never burns"] },
      { file: "NPA-Microneedling-Depth-Cheat-Sheet.html",       insideTitle: "Microneedling Depth",    bullets: ["0.5mm: superficial/glow","1.0mm: fine lines","1.5mm: acne scars","2.0mm: stretch marks","2.5mm: deep scars","Always: numbing cream 30min"] },
    ],
  },
  {
    slug: "iv-therapy-card-pack",
    title: "IV Therapy Clinical Reference Card Pack",
    accentColor: "#1a2940",
    price: 2499,
    cards: [
      { file: "NPA-IV-Therapy-Clinical-Cheat-Sheet.html",           insideTitle: "IV Therapy Overview",     bullets: ["Myers Cocktail: classic blend","NAD+: energy/cognition","Glutathione: antioxidant","Vitamin C: immune boost","B12: energy/metabolism","Hydration: saline base"] },
      { file: "NPA-Olympia-IV-Dosing-Guide-Cheat-Sheet.html",        insideTitle: "Olympia Dosing Guide",    bullets: ["NAD+: 250–1000mg","Glutathione: 200–400mg","Vitamin C: 5–25g","B12: 1000mcg","MgCl2: 1–2g","Adjust for patient tolerance"] },
      { file: "NPA-Pharmaceutical-Reference-Cheat-Sheet.html",       insideTitle: "Pharmaceutical Reference",bullets: ["Always verify BUD dates","Dilute per protocol","Check compatibility","Label with date/initials","Store per manufacturer","Discard unused portions"] },
      { file: "NPA-Hormone-Lab-Reference-Cheat-Sheet.html",          insideTitle: "Hormone Lab Ranges",      bullets: ["Total T men: 300–1000 ng/dL","Free T men: 9–30 pg/mL","Total T women: 15–70 ng/dL","Estradiol women: 20–350 pg/mL","DHEA-S: 65–380 mcg/dL","Draw fasting AM"] },
      { file: "NPA-TRT-Men-vs-Women-Cheat-Sheet.html",               insideTitle: "TRT: Men vs Women",       bullets: ["Men: higher dose range","Women: micro-dose approach","Both: monitor hematocrit","Men: PSA baseline","Women: mammogram baseline","Recheck labs at 6–8 wks"] },
    ],
  },
  {
    slug: "hormone-peptide-card-pack",
    title: "Hormone & Peptide Clinical Reference Card Pack",
    accentColor: "#8e44ad",
    price: 2499,
    cards: [
      { file: "NPA-Hormone-Therapy-Clinical-Cheat-Sheet.html",   insideTitle: "Hormone Therapy",        bullets: ["BHRT: bioidentical hormones","Pellet: 3–6 month duration","Cream: daily application","Injectable: weekly/biweekly","Symptom onset: 2–4 weeks","Optimal levels: 3–6 months"] },
      { file: "NPA-Pellet-Therapy-Clinical-Cheat-Sheet.html",    insideTitle: "Pellet Therapy",          bullets: ["Insert: gluteal fat","Depth: 1.5–2 inches","Women: 75–150mg T","Men: 800–1200mg T","Duration: 3–4 months","Avoid heavy exercise 1 week"] },
      { file: "NPA-Pellet-Therapy-Dosing-Cheat-Sheet.html",      insideTitle: "Pellet Dosing",           bullets: ["Calculate by weight + labs","Women: 1mg/kg lean mass","Men: 5–10mg/kg lean mass","Estradiol: 6–12mg if needed","Adjust by symptoms","Recheck labs 4–6 wks post"] },
      { file: "NPA-Peptide-Therapy-Clinical-Cheat-Sheet.html",   insideTitle: "Peptide Overview",        bullets: ["BPC-157: healing/gut","TB-500: tissue repair","Sermorelin: GH release","NAD+: cellular energy","CJC-1295: GH secretagogue","Reconstitute with bac water"] },
      { file: "NPA-Tirzepatide-vs-Semaglutide-Cheat-Sheet.html", insideTitle: "GLP-1 Comparison",       bullets: ["Tirze: GLP-1 + GIP","Sema: GLP-1 only","Tirze avg loss: ~20–22%","Sema avg loss: ~15–17%","Both: weekly SubQ injection","Tirze: typically higher cost"] },
    ],
  },
  {
    slug: "lash-skin-card-pack",
    title: "Lash & Skin Clinical Reference Card Pack",
    accentColor: "#c0392b",
    price: 2499,
    cards: [
      { file: "NPA-Lash-Extensions-Cheat-Sheet.html",              insideTitle: "Lash Extensions",        bullets: ["Diameter: 0.03–0.25mm","Length: 8–15mm typical","Curl: J/B/C/D/L","Classic: 1:1 ratio","Volume: 2–6 lashes","Retention: 2–3 week fills"] },
      { file: "NPA-Lash-Lift-Perm-Cheat-Sheet.html",               insideTitle: "Lash Lift & Perm",        bullets: ["Step 1: perming solution 8–12min","Step 2: fixing solution 8min","Step 3: nourishing serum","Avoid water 24–48hrs","Results last 6–8 weeks","Contraindicated: damaged lashes"] },
      { file: "NPA-IPL-Laser-Cheat-Sheet.html",                    insideTitle: "IPL Treatment",           bullets: ["Test patch: always first","Fluence: 15–25 J/cm²","Fitzpatrick I–IV only","Avoid: tanned skin","Cooling: required","Series: 3–6 treatments"] },
      { file: "NPA-Laser-Wavelength-Reference-Cheat-Sheet.html",   insideTitle: "Laser Wavelengths",       bullets: ["532nm: superficial pigment","755nm: hair (Alexandrite)","810nm: hair (Diode)","1064nm: deep/darker skin","1320nm: skin tightening","2940nm: resurfacing (Er:YAG)"] },
      { file: "NPA-Chemical-Peel-Reference-Cheat-Sheet.html",      insideTitle: "Chemical Peels",          bullets: ["Glycolic: AHA superficial","Salicylic: BHA/acne","TCA 15–25%: medium","TCA 30–50%: deep","Jessner's: combination","Phenol: deepest (medical only)"] },
    ],
  },
  {
    slug: "business-practice-card-pack",
    title: "Med Spa Business & Practice Reference Card Pack",
    accentColor: "#1a2940",
    price: 2499,
    cards: [
      { file: "NPA-Staff-Roles-Cheat-Sheet.html",                  insideTitle: "Staff Roles & Scope",    bullets: ["MD/DO: prescribe + supervise","NP/PA: prescribe per state","RN: administer per protocol","MA: prep/assist (no injections)","Esthetician: skin/lash only","Always verify state scope"] },
      { file: "NPA-New-Patient-Intake-Cheat-Sheet.html",           insideTitle: "New Patient Intake",     bullets: ["ID verification","Medical history review","Medication review","Allergy confirmation","Consent signed before procedure","Baseline photos taken"] },
      { file: "NPA-Treatment-Room-Setup-Cheat-Sheet.html",         insideTitle: "Treatment Room Setup",   bullets: ["Sharps container accessible","Emergency kit stocked","Hyaluronidase on hand","Lighting: bright/adjustable","Mirror: patient use","Forms: pre-printed/digital"] },
      { file: "NPA-Membership-Pricing-Calculator-Cheat-Sheet.html",insideTitle: "Membership Pricing",     bullets: ["COGS: 25–35% of price","Labor: 20–30% of price","Overhead: 15–20%","Profit target: 20–30%","Membership: 10–15% discount","Minimum 12-month commitment"] },
      { file: "NPA-Retail-Pricing-Formula-Cheat-Sheet.html",       insideTitle: "Retail Pricing Formula", bullets: ["Keystone: 2× wholesale","Luxury: 2.5–3× wholesale","Check MAP policy","Bundle: slight discount","Display at checkout","Staff incentive: 10% commission"] },
    ],
  },
];

// ── Puppeteer rendering ───────────────────────────────────────────────────────
async function renderFile(browser, filePath, W, H) {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`file://${filePath}`, { waitUntil: "networkidle0", timeout: 20000 });
  const buf = await page.screenshot({ encoding: "base64", clip: { x: 0, y: 0, width: W, height: H } });
  await page.close();
  return `data:image/png;base64,${buf}`;
}

async function renderHtml(browser, html, W, H) {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 300));
  const buf = await page.screenshot({ encoding: "buffer", clip: { x: 0, y: 0, width: W, height: H } });
  await page.close();
  return buf;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });

  // ── NOTEBOOKS ──────────────────────────────────────────────────────────────
  console.log(`\n${"═".repeat(60)}`);
  console.log(`NOTEBOOKS (${ALL_NOTEBOOKS.length} total)`);
  console.log("═".repeat(60));

  const nbResultsPath = path.join(ASSETS, "notebooks/product-ids.json");
  const nbResults = fs.existsSync(nbResultsPath) ? JSON.parse(fs.readFileSync(nbResultsPath, "utf8")) : {};

  for (const nb of ALL_NOTEBOOKS) {
    const outDir = path.join(ASSETS, "notebooks", nb.slug);
    fs.mkdirSync(outDir, { recursive: true });
    const coverPath = path.join(outDir, "cover.png");
    const progressPath = path.join(outDir, "upload-progress.json");
    const progress = fs.existsSync(progressPath) ? JSON.parse(fs.readFileSync(progressPath, "utf8")) : {};

    if (nbResults[nb.slug]?.productId) {
      console.log(`  SKIP ${nb.slug} (product exists)`);
      continue;
    }

    // Generate cover
    if (!SKIP_GENERATE && !fs.existsSync(coverPath)) {
      process.stdout.write(`  GEN  ${nb.slug}/cover.png ...`);
      const accent = accentFor(nb.slug);
      const csFile = path.join(FORMS, nb.file);
      let csDataUrl = null;
      if (fs.existsSync(csFile)) {
        csDataUrl = await renderFile(browser, csFile, 2646, 1725);
      }
      const html = notebookCoverHtml(nb.title, "Clinical Reference Notebook", nb.tags, accent, csDataUrl);
      const buf = await renderHtml(browser, html, NB_W, NB_H);
      fs.writeFileSync(coverPath, buf);
      console.log(" ✓");
    } else if (fs.existsSync(coverPath)) {
      console.log(`  SKIP GEN ${nb.slug} (cover exists)`);
    }

    if (DRY_RUN) continue;

    // Upload
    if (!SKIP_UPLOAD && !progress.imageId) {
      process.stdout.write(`  UP   ${nb.slug} ...`);
      progress.imageId = await uploadImage(coverPath);
      fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
      console.log(` ✓ id=${progress.imageId}`);
    }

    if (!progress.imageId) continue;

    // Create product
    process.stdout.write(`  POST ${nb.title.slice(0, 50)} ...`);
    const product = await createProduct({
      title: `${nb.title} — Clinical Reference Notebook`,
      description: `A 6"×8" spiral ruled notebook for aesthetic providers and med spa staff. Features 118 ruled pages with a custom clinical reference cover.\n\n• 118 ruled line pages\n• 6" × 8" spiral bound\n• Front cover: ${nb.title} clinical reference design\n• Dark grey back cover\n• Tags: ${nb.tags.join(", ")}`,
      blueprint_id: 74,
      print_provider_id: 1,
      variants: [{ id: 34240, price: 1799, is_enabled: true }],
      print_areas: [{ variant_ids: [34240], placeholders: [{ position: "front", images: [{ id: progress.imageId, x: 0.5, y: 0.5, scale: 1, angle: 0 }] }] }],
    });
    nbResults[nb.slug] = { productId: product.id, title: product.title, createdAt: new Date().toISOString() };
    fs.writeFileSync(nbResultsPath, JSON.stringify(nbResults, null, 2));
    console.log(` ✓ id=${product.id}`);
  }

  // ── CARD PACKS ─────────────────────────────────────────────────────────────
  console.log(`\n${"═".repeat(60)}`);
  console.log(`CARD PACKS (${CARD_PACKS.length} new packs)`);
  console.log("═".repeat(60));

  const cardResultsPath = path.join(ASSETS, "card-packs/product-ids.json");
  fs.mkdirSync(path.join(ASSETS, "card-packs"), { recursive: true });
  const cardResults = fs.existsSync(cardResultsPath) ? JSON.parse(fs.readFileSync(cardResultsPath, "utf8")) : {};

  for (const pack of CARD_PACKS) {
    const packDir = path.join(ASSETS, "card-packs", pack.slug);
    fs.mkdirSync(packDir, { recursive: true });
    const progressPath = path.join(packDir, "upload-progress.json");
    const progress = fs.existsSync(progressPath) ? JSON.parse(fs.readFileSync(progressPath, "utf8")) : {};

    if (cardResults[pack.slug]?.productId) {
      console.log(`  SKIP ${pack.slug} (product exists)`);
      continue;
    }

    console.log(`\n  Pack: ${pack.slug}`);

    // Generate + upload card images
    const placeholders = [];
    for (let i = 0; i < pack.cards.length; i++) {
      const card = pack.cards[i];
      const cardNum = i + 1;

      for (const side of ["front", "inside"]) {
        const key = `card${cardNum}_${side}`;
        const imgPath = path.join(packDir, `${key}.png`);

        if (!SKIP_GENERATE && !fs.existsSync(imgPath)) {
          process.stdout.write(`    GEN  ${key}.png ...`);
          let buf;
          if (side === "front") {
            const csFile = path.join(FORMS, card.file);
            const page = await browser.newPage();
            await page.setViewport({ width: CARD_W, height: CARD_H, deviceScaleFactor: 1 });
            await page.goto(`file://${csFile}`, { waitUntil: "networkidle0", timeout: 20000 });
            buf = await page.screenshot({ encoding: "buffer", clip: { x: 0, y: 0, width: CARD_W, height: CARD_H } });
            await page.close();
          } else {
            const html = cardInsideHtml(card.insideTitle, card.bullets);
            buf = await renderHtml(browser, html, CARD_W, CARD_H);
          }
          fs.writeFileSync(imgPath, buf);
          console.log(" ✓");
        }

        if (DRY_RUN) continue;

        if (!SKIP_UPLOAD && !progress[key]) {
          process.stdout.write(`    UP   ${key} ...`);
          progress[key] = await uploadImage(imgPath);
          fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
          console.log(` ✓ id=${progress[key]}`);
        }

        if (progress[key]) {
          placeholders.push({ position: key, images: [{ id: progress[key], x: 0.5, y: 0.5, scale: 1, angle: 0 }] });
        }
      }
    }

    // Brand card (card 5 = index 4, but we have 5 content cards so brand = card 6 is out of range)
    // Actually we defined 5 content cards per pack, so we use them all as content cards (no brand card needed)

    if (DRY_RUN || placeholders.length < 10) continue;

    process.stdout.write(`  POST ${pack.title.slice(0, 50)} ...`);
    const product = await createProduct({
      title: pack.title,
      description: `A 5-card clinical reference set printed on high-quality uncoated paper. 4.25"×5.5" with envelopes — perfect for med spa providers and aesthetic staff.\n\nIncludes 5 double-sided cards covering: ${pack.cards.map(c => c.insideTitle).join(", ")}.`,
      blueprint_id: 1232,
      print_provider_id: 84,
      variants: [{ id: 93763, price: pack.price, is_enabled: true }],
      print_areas: [{ variant_ids: [93763], placeholders }],
    });
    cardResults[pack.slug] = { productId: product.id, title: product.title, createdAt: new Date().toISOString() };
    fs.writeFileSync(cardResultsPath, JSON.stringify(cardResults, null, 2));
    console.log(` ✓ id=${product.id}`);
  }

  await browser.close();

  // ── Final summary ──────────────────────────────────────────────────────────
  console.log(`\n${"═".repeat(60)}`);
  console.log("SUMMARY");
  console.log("═".repeat(60));
  const nbCount = Object.keys(JSON.parse(fs.readFileSync(nbResultsPath, "utf8"))).length;
  const cardCount = Object.keys(JSON.parse(fs.readFileSync(cardResultsPath, "utf8"))).length;
  console.log(`  Notebooks:  ${nbCount}`);
  console.log(`  Card Packs: ${cardCount + 1} (including GLP-1 pack)`);
  console.log(`\nAll products in Printify. Go publish them to Etsy!`);
}

main().catch((e) => { console.error(e); process.exit(1); });
