#!/usr/bin/env node
/**
 * Generates branded 2000×2000px mockup thumbnails for every NPA shop product
 * that doesn't already have a custom image.
 *
 * Output: public/shop-previews/generated/[slug]-thumbnail.png
 *
 * Run: node scripts/shop/generate-product-mockups.mjs
 * Resume-safe: skips already-generated files.
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "public/shop-previews/generated");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const SIZE = 2000;

const CATEGORY_CONFIG = {
  "Clinical Forms": { icon: "🩺", accent: "#FF69B4", badge: "Clinical Forms", bullets: ["Consent forms & patient docs", "Fully editable · Print-ready", "HIPAA-aware format", "Instant digital delivery"], deliveryLabel: "Instant Download" },
  "Social Media": { icon: "📱", accent: "#C084FC", badge: "Social Media", bullets: ["Done-for-you templates", "1080×1080 Instagram-ready", "Edit in Canva · Post in minutes", "Instant digital delivery"], deliveryLabel: "Instant Download" },
  "Legal": { icon: "⚖️", accent: "#FCD34D", badge: "Legal & Compliance", bullets: ["Contracts & business agreements", "HIPAA forms & policies", "Attorney-review recommended", "Instant digital delivery"], deliveryLabel: "Instant Download" },
  "Compliance": { icon: "✅", accent: "#FCD34D", badge: "HIPAA Compliance", bullets: ["Staff training & privacy forms", "Breach protocols", "Business associate agreements", "Audit-ready documentation"], deliveryLabel: "Instant Download" },
  "Practice Management": { icon: "🏥", accent: "#34D399", badge: "Practice Management", bullets: ["Built by Danielle Alcala, RN", "From day one to scale", "Customizable for your practice", "Instant digital delivery"], deliveryLabel: "Instant Download" },
  "Bundles": { icon: "📦", accent: "#FF69B4", badge: "Bundle", bullets: ["Multiple categories in one", "Best value in the shop", "Everything you need to start", "Instant digital delivery"], deliveryLabel: "Instant Download" },
  "Playbooks": { icon: "📖", accent: "#FF69B4", badge: "Playbook", bullets: ["Written by Danielle Alcala, RN", "Word-for-word consult scripts", "Clinical protocols you use tomorrow", "Instant digital delivery"], deliveryLabel: "Instant Download" },
  "Cheat Sheets": { icon: "⚡", accent: "#FF69B4", badge: "Quick Reference", bullets: ["One-page clinical reference", "Print or keep on a tablet", "Dosing · Landmarks · Protocols", "Instant digital delivery"], deliveryLabel: "Instant Download" },
  "Business Systems": { icon: "💼", accent: "#60A5FA", badge: "Business System", bullets: ["Built from real med spa practice", "Interactive HTML — any device", "Customize for your practice", "Instant digital delivery"], deliveryLabel: "Instant Download" },
  "Patient education": { icon: "💊", accent: "#FF69B4", badge: "Patient Education", bullets: ["Written by Danielle Alcala, RN", "Founder · Hello Gorgeous Med Spa", "24 chapters · Full clinical guide", "Instant digital delivery"], deliveryLabel: "Instant Download" },
  "Study guides": { icon: "🎓", accent: "#4ADE80", badge: "Study Guide", bullets: ["Built for nursing school", "Professor-style practice questions", "Clinical tie-ins on every card", "Instant digital delivery"], deliveryLabel: "Instant Download" },
  "Physical Kits": { icon: "📬", accent: "#FF69B4", badge: "Physical Product", bullets: ["Ships to your door", "Printed on-demand via Printify", "Arrives in 3–5 business days", "No subscription required"], deliveryLabel: "Ships 3–5 Days" },
  "General": { icon: "✨", accent: "#FF69B4", badge: "Digital Download", bullets: ["Editable templates", "Instant digital delivery", "Fully customizable", "nopriorauthorization.com"], deliveryLabel: "Instant Download" },
};

const PRODUCTS = [
  { slug: "injectors-playbook", title: "The Injectors Playbook", category: "Playbooks", price: "$127" },
  { slug: "new-injector-onboarding-kit", title: "New Injector Onboarding Kit", category: "Playbooks", price: "$67" },
  { slug: "guidebook-category-strategy", title: "Category Strategy Guidebook", category: "Playbooks", price: "$47" },
  { slug: "microblading-pmu-playbook", title: "Microblading & PMU Playbook", category: "Playbooks", price: "$127" },
  { slug: "google-domination-playbook", title: "Google Domination Playbook", category: "Playbooks", price: "$127" },
  { slug: "medspa-social-media-system", title: "Med Spa Social Media System", category: "Playbooks", price: "$147" },
  { slug: "medspa-content-strategy-system", title: "Med Spa Content Strategy System", category: "Playbooks", price: "$147" },
  { slug: "hormone-therapy-playbook", title: "Hormone Therapy Playbook", category: "Playbooks", price: "$127" },
  { slug: "peptide-therapy-playbook", title: "Peptide Therapy Playbook", category: "Playbooks", price: "$127" },
  { slug: "client-welcome-packet", title: "Client Welcome Packet", category: "Practice Management", price: "$27" },
  { slug: "medspa-startup-checklist", title: "Med Spa Startup Checklist", category: "Practice Management", price: "$27" },
  { slug: "med-spa-starter-kit", title: "Med Spa Starter Kit", category: "Practice Management", price: "$59" },
  { slug: "treatment-pricing-menu", title: "Treatment Pricing Menu", category: "Practice Management", price: "$19" },
  { slug: "treatment-menu-signage-kit", title: "Treatment Menu & Signage Kit", category: "Practice Management", price: "$47" },
  { slug: "aftercare-card-kit", title: "Aftercare Card Kit", category: "Practice Management", price: "$37" },
  { slug: "patient-communication-kit", title: "Patient Communication Kit", category: "Practice Management", price: "$47" },
  { slug: "patient-loyalty-system", title: "Patient Loyalty System", category: "Practice Management", price: "$97" },
  { slug: "med-spa-legal-startup-bundle", title: "Med Spa Legal Startup Bundle", category: "Legal", price: "$197" },
  { slug: "medical-disclaimer-system", title: "Medical Disclaimer System", category: "Legal", price: "$47" },
  { slug: "diy-google-setup-kit", title: "DIY Google Setup Kit", category: "Business Systems", price: "$297" },
  { slug: "phase-2-business-bundle", title: "Phase 2 Business Bundle", category: "Business Systems", price: "$47" },
  { slug: "difficult-client-scripts", title: "Difficult Client Scripts", category: "Business Systems", price: "$47" },
  { slug: "npa-49-star-system", title: "The 4.9-Star Google System", category: "Business Systems", price: "$57" },
  { slug: "botox-patient-journey-kit", title: "Botox Patient Journey Kit", category: "Clinical Forms", price: "$67" },
  { slug: "filler-patient-journey-kit", title: "Filler Patient Journey Kit", category: "Clinical Forms", price: "$67" },
  { slug: "glp1-patient-journey-kit", title: "GLP-1 Patient Journey Kit", category: "Clinical Forms", price: "$67" },
  { slug: "iv-therapy-patient-journey-kit", title: "IV Therapy Patient Journey Kit", category: "Clinical Forms", price: "$57" },
  { slug: "microneedling-patient-journey-kit", title: "Microneedling Patient Journey Kit", category: "Clinical Forms", price: "$57" },
  { slug: "chemical-peel-patient-journey-kit", title: "Chemical Peel Patient Journey Kit", category: "Clinical Forms", price: "$57" },
  { slug: "hormone-patient-journey-kit", title: "Hormone Therapy Patient Journey Kit", category: "Clinical Forms", price: "$67" },
  { slug: "peptide-patient-journey-kit", title: "Peptide Therapy Patient Journey Kit", category: "Clinical Forms", price: "$67" },
  { slug: "botox-social-bundle", title: "Botox Social Media Bundle", category: "Social Media", price: "$57" },
  { slug: "filler-social-bundle", title: "Filler Social Media Bundle", category: "Social Media", price: "$57" },
  { slug: "medspa-promo-pack", title: "Med Spa Promo Pack", category: "Social Media", price: "$27" },
  { slug: "myths-facts-injectors", title: "Myths & Facts — Injectors", category: "Social Media", price: "$27" },
  { slug: "new-patient-membership-pack", title: "New Patient Membership Pack", category: "Social Media", price: "$27" },
  { slug: "review-testimonial-pack", title: "Review & Testimonial Pack", category: "Social Media", price: "$27" },
  { slug: "seasonal-marketing-pack", title: "Seasonal Marketing Pack", category: "Social Media", price: "$27" },
  { slug: "glp1-story-templates", title: "GLP-1 Story Templates", category: "Social Media", price: "$27" },
  { slug: "peptide-canva-marketing-pack", title: "Peptide Canva Marketing Pack", category: "Social Media", price: "$67" },
  { slug: "lip-filler-anatomy-cheat-sheet", title: "Lip Filler Anatomy Cheat Sheet", category: "Cheat Sheets", price: "$10" },
  { slug: "botox-dosing-zones-cheat-sheet", title: "Botox Dosing Zones Cheat Sheet", category: "Cheat Sheets", price: "$10" },
  { slug: "cannula-vs-needle-cheat-sheet", title: "Cannula vs Needle Cheat Sheet", category: "Cheat Sheets", price: "$10" },
  { slug: "filler-product-comparison-cheat-sheet", title: "Filler Product Comparison Cheat Sheet", category: "Cheat Sheets", price: "$10" },
  { slug: "vascular-occlusion-protocol-cheat-sheet", title: "Vascular Occlusion Protocol", category: "Cheat Sheets", price: "$10" },
  { slug: "tirzepatide-vs-semaglutide-cheat-sheet", title: "Tirzepatide vs Semaglutide", category: "Cheat Sheets", price: "$10" },
  { slug: "glp1-titration-cheat-sheet", title: "GLP-1 Titration Cheat Sheet", category: "Cheat Sheets", price: "$10" },
  { slug: "hormone-lab-reference-cheat-sheet", title: "Hormone Lab Reference", category: "Cheat Sheets", price: "$10" },
  { slug: "pellet-therapy-dosing-cheat-sheet", title: "Pellet Therapy Dosing", category: "Cheat Sheets", price: "$10" },
  { slug: "trt-men-vs-women-cheat-sheet", title: "TRT: Men vs Women", category: "Cheat Sheets", price: "$10" },
  { slug: "chemical-peel-reference-cheat-sheet", title: "Chemical Peel Reference", category: "Cheat Sheets", price: "$10" },
  { slug: "fitzpatrick-classification-cheat-sheet", title: "Fitzpatrick Classification", category: "Cheat Sheets", price: "$10" },
  { slug: "microneedling-depth-cheat-sheet", title: "Microneedling Depth Guide", category: "Cheat Sheets", price: "$10" },
  { slug: "laser-wavelength-reference-cheat-sheet", title: "Laser Wavelength Reference", category: "Cheat Sheets", price: "$10" },
  { slug: "skincare-ingredient-interactions-cheat-sheet", title: "Skincare Ingredient Interactions", category: "Cheat Sheets", price: "$10" },
  { slug: "retail-pricing-formula-cheat-sheet", title: "Retail Pricing Formula", category: "Cheat Sheets", price: "$10" },
  { slug: "membership-pricing-calculator-cheat-sheet", title: "Membership Pricing Calculator", category: "Cheat Sheets", price: "$10" },
  { slug: "staff-roles-cheat-sheet", title: "Staff Roles Cheat Sheet", category: "Cheat Sheets", price: "$10" },
  { slug: "new-patient-intake-cheat-sheet", title: "New Patient Intake", category: "Cheat Sheets", price: "$10" },
  { slug: "treatment-room-setup-cheat-sheet", title: "Treatment Room Setup", category: "Cheat Sheets", price: "$10" },
  { slug: "injection-techniques-cheat-sheet", title: "Injection Techniques", category: "Cheat Sheets", price: "$10" },
  { slug: "hello-gorgeous-book", title: "Hello Gorgeous — The Book", category: "Patient education", price: "$29" },
  { slug: "anatomy-physiology-study-complete", title: "A&P Study Hub — Complete Access", category: "Study guides", price: "$39" },
  { slug: "micro270-question-bank", title: "Micro 270 Question Bank", category: "Study guides", price: "$47" },
  { slug: "micro270-bank-ai-bundle", title: "Micro 270 + AI Bundle", category: "Study guides", price: "$67" },
  { slug: "micro270-full-access", title: "Micro 270 Full Access", category: "Study guides", price: "$97" },
  { slug: "ap-survival-kit", title: "The A&P Survival Kit", category: "Physical Kits", price: "$49.99" },
  { slug: "micro-270-kit", title: "The Micro 270 Kit", category: "Physical Kits", price: "$49.99" },
  { slug: "pre-nursing-bundle", title: "Pre-Nursing Complete Bundle", category: "Physical Kits", price: "$89.99" },
  { slug: "nurse-injector-clinical-kit", title: "Nurse Injector Clinical Kit", category: "Physical Kits", price: "$79.99" },
  { slug: "give-me-everything-kit", title: "Give Me Everything Kit", category: "Physical Kits", price: "$149.99" },
  { slug: "medspa-clinical-kit", title: "Med Spa Clinical Kit", category: "Physical Kits", price: "$79.99" },
  { slug: "medspa-business-starter-kit", title: "Med Spa Business Starter Kit", category: "Physical Kits", price: "$79.99" },
  { slug: "give-me-everything-medspa-kit", title: "Give Me Everything Med Spa Kit", category: "Physical Kits", price: "$149.99" },
  { slug: "hello-gorgeous-notebook", title: "Hello Gorgeous Spiral Notebook", category: "Physical Kits", price: "$34.99" },
];

function buildHtml(product) {
  const cfg = CATEGORY_CONFIG[product.category] || CATEGORY_CONFIG["General"];
  const accent = cfg.accent;
  const words = product.title.split(" ");
  const lines = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > 18 && current) {
      lines.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  }
  if (current) lines.push(current.trim());
  const titleSize = lines.length >= 3 ? 108 : lines.length === 2 ? 128 : 148;
  const titleHtml = lines.map(l => `<div>${l}</div>`).join("");
  const bulletsHtml = cfg.bullets.map(b =>
    `<div class="bullet"><span class="bullet-dot">—</span><span>${b}</span></div>`
  ).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body {
  width:${SIZE}px; height:${SIZE}px; overflow:hidden;
  background: linear-gradient(145deg, #0d0a14 0%, #0d1117 55%, #0a1220 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  color: white; display: flex; flex-direction: column;
  padding: 100px 120px; position: relative;
}
body::before {
  content: ''; position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
  background-size: 80px 80px;
}
body::after {
  content: ''; position: absolute; top: -300px; right: -300px;
  width: 1000px; height: 1000px; border-radius: 50%;
  background: radial-gradient(circle, ${accent}14 0%, transparent 65%);
}
.content { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; }
.topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 70px; }
.brand { font-size: 36px; font-weight: 800; letter-spacing: 0.10em; color: ${accent}; text-transform: uppercase; }
.badge { font-size: 28px; font-weight: 700; letter-spacing: 0.05em; color: rgba(255,255,255,0.55); text-transform: uppercase; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.10); padding: 14px 36px; border-radius: 60px; }
.title { font-size: ${titleSize}px; font-weight: 900; line-height: 0.93; color: white; letter-spacing: -0.02em; margin-bottom: 50px; }
.accent-bar { width: 120px; height: 6px; background: ${accent}; border-radius: 3px; margin-bottom: 70px; }
.bullets { display: flex; flex-direction: column; justify-content: space-between; flex: 1; }
.bullet { display: flex; align-items: center; gap: 32px; font-size: 42px; color: rgba(255,255,255,0.65); font-weight: 500; line-height: 1.2; padding: 24px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
.bullet:last-child { border-bottom: none; }
.bullet-dot { color: ${accent}; font-weight: 900; font-size: 28px; flex-shrink: 0; }
.bottom { display: flex; align-items: flex-end; justify-content: space-between; border-top: 1.5px solid rgba(255,255,255,0.07); padding-top: 55px; margin-top: 60px; }
.price { font-size: 96px; font-weight: 900; color: ${accent}; letter-spacing: -0.03em; line-height: 1; }
.delivery { text-align: right; }
.delivery-main { font-size: 34px; font-weight: 700; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.08em; }
.delivery-sub { font-size: 26px; color: rgba(255,255,255,0.25); margin-top: 10px; letter-spacing: 0.05em; }
</style>
</head><body>
<div class="content">
  <div class="topbar"><span class="brand">No Prior Authorization</span><span class="badge">${cfg.icon} ${cfg.badge}</span></div>
  <div class="title">${titleHtml}</div>
  <div class="accent-bar"></div>
  <div class="bullets">${bulletsHtml}</div>
  <div class="bottom">
    <div class="price">${product.price}</div>
    <div class="delivery"><div class="delivery-main">${cfg.deliveryLabel}</div><div class="delivery-sub">nopriorauthorization.com</div></div>
  </div>
</div>
</body></html>`;
}

async function run() {
  console.log(`Generating ${PRODUCTS.length} product mockups → ${OUT_DIR}\n`);
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: SIZE, height: SIZE, deviceScaleFactor: 1 });
  let generated = 0, skipped = 0;
  for (const product of PRODUCTS) {
    const outPath = path.join(OUT_DIR, `${product.slug}-thumbnail.png`);
    if (fs.existsSync(outPath)) { skipped++; continue; }
    await page.setContent(buildHtml(product), { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: outPath, type: "png", clip: { x: 0, y: 0, width: SIZE, height: SIZE } });
    console.log(`  ✓ ${product.slug}`);
    generated++;
  }
  await browser.close();
  console.log(`\n✓ Done — ${generated} generated, ${skipped} skipped`);
}

run().catch(e => { console.error(e); process.exit(1); });
