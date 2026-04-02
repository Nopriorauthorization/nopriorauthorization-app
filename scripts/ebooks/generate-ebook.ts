/**
 * Generate a branded PDF ebook from an NPA playbook HTML.
 *
 * Usage:
 *   tsx scripts/ebooks/generate-ebook.ts google-domination-playbook
 *   pnpm ebook:generate google-domination-playbook
 *   pnpm ebook:generate --all
 */
import fs from "fs";
import path from "path";
import { loadEnvLocal } from "../products/load-env";

loadEnvLocal();

const FORMS_DIR = path.join(process.cwd(), "public", "forms");
const OUTPUT_DIR = path.join(process.cwd(), "output", "ebooks");

const PLAYBOOK_MAP: Record<string, { file: string; title: string; subtitle: string; modules: string; pages: string }> = {
  "google-domination-playbook": {
    file: "NPA-Google-Domination-Playbook.html",
    title: "Google Domination Playbook",
    subtitle: "The Med Spa Local SEO System",
    modules: "7 Modules",
    pages: "120+ Pages",
  },
  "injectors-playbook": {
    file: "NPA-Botox-Filler-Playbook.html",
    title: "The Injector's Playbook",
    subtitle: "Botox & Filler Practice Guide",
    modules: "6 Modules",
    pages: "90+ Pages",
  },
  "hormone-therapy-playbook": {
    file: "NPA-Hormone-Therapy-Playbook.html",
    title: "Hormone Therapy Playbook",
    subtitle: "BHRT for Aesthetic Practices",
    modules: "7 Modules",
    pages: "100+ Pages",
  },
  "peptide-therapy-playbook": {
    file: "NPA-Peptide-Therapy-Playbook.html",
    title: "Peptide Therapy Playbook",
    subtitle: "For Prescribing Providers",
    modules: "7 Modules",
    pages: "110+ Pages",
  },
  "microblading-pmu-playbook": {
    file: "NPA-Microblading-PMU-Playbook.html",
    title: "Microblading & PMU Playbook",
    subtitle: "The Complete PMU Business System",
    modules: "6 Modules",
    pages: "80+ Pages",
  },
  "new-injector-onboarding-kit": {
    file: "NPA-New-Injector-Onboarding-Kit.html",
    title: "New Injector Onboarding Kit",
    subtitle: "30-Day Training System",
    modules: "5 Modules",
    pages: "60+ Pages",
  },
  "medspa-social-media-system": {
    file: "NPA-Social-Media-System.html",
    title: "The Social Media System",
    subtitle: "Stop Posting Randomly. Start Converting.",
    modules: "6 Modules",
    pages: "80+ Pages",
  },
  "medspa-content-strategy-system": {
    file: "NPA-Content-Strategy-System.html",
    title: "Content Strategy System",
    subtitle: "Every Decision Already Made",
    modules: "6 Modules",
    pages: "70+ Pages",
  },
};

function buildCoverHtml(meta: { title: string; subtitle: string; modules: string; pages: string }): string {
  return `<!DOCTYPE html>
<html><head>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { size: Letter; margin: 0; }
  body {
    width: 8.5in; height: 11in;
    background: #1A1A1A;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 1.5in 1in;
    position: relative; overflow: hidden;
    font-family: 'Lato', sans-serif;
  }
  .pattern {
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(212,83,126,0.04) 40px, rgba(212,83,126,0.04) 41px);
  }
  .glow {
    position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(212,83,126,0.12) 0%, transparent 70%);
    top: -100px; right: -100px;
  }
  .content { position: relative; z-index: 2; }
  .eyebrow {
    font-size: 10px; font-weight: 700; letter-spacing: 0.25em;
    text-transform: uppercase; color: #D4537E; margin-bottom: 40px;
  }
  .title {
    font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 900;
    color: #fff; line-height: 1.1; margin-bottom: 20px;
  }
  .title em { font-style: italic; color: #D4537E; display: block; }
  .bar { width: 60px; height: 3px; background: #D4537E; margin: 30px auto; }
  .subtitle {
    font-size: 16px; color: rgba(255,255,255,0.5); letter-spacing: 0.08em;
    text-transform: uppercase; margin-bottom: 40px;
  }
  .meta {
    font-size: 12px; color: rgba(255,255,255,0.35); letter-spacing: 0.06em;
    margin-bottom: 60px;
  }
  .author {
    font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.5);
    letter-spacing: 0.15em; text-transform: uppercase;
  }
  .brand {
    position: absolute; bottom: 50px; left: 0; right: 0;
    font-size: 10px; color: rgba(212,83,126,0.4);
    letter-spacing: 0.2em; text-transform: uppercase;
  }
  .border-frame {
    position: absolute; top: 30px; left: 30px; right: 30px; bottom: 30px;
    border: 1px solid rgba(212,83,126,0.15); border-radius: 2px;
  }
</style></head><body>
<div class="pattern"></div>
<div class="glow"></div>
<div class="border-frame"></div>
<div class="content">
  <div class="eyebrow">No Prior Authorization</div>
  <h1 class="title">${meta.title.replace(/ /g, "<br>").replace("Playbook", "<em>Playbook</em>").replace("System", "<em>System</em>").replace("Kit", "<em>Kit</em>")}</h1>
  <div class="bar"></div>
  <div class="subtitle">${meta.subtitle}</div>
  <div class="meta">${meta.modules} · ${meta.pages}</div>
  <div class="author">Danielle Alcala</div>
</div>
<div class="brand">nopriorauthorization.com</div>
</body></html>`;
}

async function generateEbook(slug: string) {
  const meta = PLAYBOOK_MAP[slug];
  if (!meta) {
    console.error(`Unknown playbook slug: ${slug}`);
    console.error("Available:", Object.keys(PLAYBOOK_MAP).join(", "));
    process.exit(1);
  }

  const htmlPath = path.join(FORMS_DIR, meta.file);
  if (!fs.existsSync(htmlPath)) {
    console.error(`HTML file not found: ${htmlPath}`);
    process.exit(1);
  }

  let puppeteer;
  try {
    puppeteer = await import("puppeteer");
  } catch {
    console.error("Puppeteer not installed. Run: npm install --save-dev puppeteer");
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`[ebook] Generating: ${meta.title}`);
  console.log(`[ebook] Source: ${htmlPath}`);

  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    // Step 1: Generate cover page PDF
    console.log("[ebook] Step 1: Rendering cover page...");
    const coverPage = await browser.newPage();
    await coverPage.setContent(buildCoverHtml(meta), { waitUntil: "networkidle0" });
    await coverPage.evaluateHandle("document.fonts.ready");
    const coverPdf = await coverPage.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });
    await coverPage.close();

    // Step 2: Generate content pages PDF
    console.log("[ebook] Step 2: Loading playbook content...");
    const contentPage = await browser.newPage();
    const html = fs.readFileSync(htmlPath, "utf-8");
    await contentPage.setContent(html, { waitUntil: "networkidle0" });
    await contentPage.evaluateHandle("document.fonts.ready");

    // Expand all tabs/modules and clean up UI elements
    console.log("[ebook] Step 3: Expanding all modules...");
    await contentPage.evaluate(() => {
      // Show all hidden sections
      document.querySelectorAll(".sec-hide").forEach((el) => {
        (el as HTMLElement).classList.remove("sec-hide");
        (el as HTMLElement).style.display = "block";
      });

      // Also try showing by ID pattern (m0, m1, m2...)
      for (let i = 0; i < 20; i++) {
        const el = document.getElementById(`m${i}`);
        if (el) {
          el.style.display = "block";
          el.classList.remove("sec-hide");
        }
        const s = document.getElementById(`s${i}`);
        if (s) {
          s.style.display = "block";
          s.classList.remove("sec-hide");
        }
      }

      // Hide nav tabs
      const nav = document.querySelector(".pb-nav");
      if (nav) (nav as HTMLElement).style.display = "none";

      // Hide copy buttons
      document.querySelectorAll(".copy-btn, .cap-copy, .hook-copy, .copy-code").forEach((btn) => {
        (btn as HTMLElement).style.display = "none";
      });

      // Hide toast
      const toast = document.getElementById("toast");
      if (toast) toast.style.display = "none";

      // Set max width for print
      const body = document.querySelector(".pb, .wrap");
      if (body) (body as HTMLElement).style.maxWidth = "100%";
    });

    console.log("[ebook] Step 4: Generating PDF...");
    const contentPdf = await contentPage.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0.5in", bottom: "0.75in", left: "0.5in", right: "0.5in" },
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `
        <div style="font-size:9px;color:#888;width:100%;text-align:center;font-family:Lato,sans-serif;padding:0 0.5in;">
          No Prior Authorization &middot; Danielle Alcala &middot; nopriorauthorization.com
          <span style="float:right"><span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>`,
    });
    await contentPage.close();

    // Step 5: Merge cover + content PDFs
    console.log("[ebook] Step 5: Merging cover + content...");
    const { PDFDocument } = await import("pdf-lib");
    const merged = await PDFDocument.create();

    const coverDoc = await PDFDocument.load(coverPdf);
    const contentDoc = await PDFDocument.load(contentPdf);

    const coverPages = await merged.copyPages(coverDoc, coverDoc.getPageIndices());
    for (const p of coverPages) merged.addPage(p);

    const contentPages = await merged.copyPages(contentDoc, contentDoc.getPageIndices());
    for (const p of contentPages) merged.addPage(p);

    const finalPdf = await merged.save();
    const outputPath = path.join(OUTPUT_DIR, `${slug}.pdf`);
    fs.writeFileSync(outputPath, finalPdf);

    const sizeMb = (finalPdf.length / 1024 / 1024).toFixed(1);
    const pageCount = coverPages.length + contentPages.length;
    console.log(`[ebook] Done: ${outputPath}`);
    console.log(`[ebook] ${pageCount} pages, ${sizeMb} MB`);

    return outputPath;
  } finally {
    await browser.close();
  }
}

async function main() {
  const arg = process.argv[2];

  if (!arg) {
    console.error("Usage: pnpm ebook:generate <slug|--all>");
    console.error("Available:", Object.keys(PLAYBOOK_MAP).join(", "));
    process.exit(1);
  }

  if (arg === "--all") {
    for (const slug of Object.keys(PLAYBOOK_MAP)) {
      try {
        await generateEbook(slug);
      } catch (e) {
        console.error(`[ebook] FAILED: ${slug} — ${e instanceof Error ? e.message : e}`);
      }
    }
  } else {
    await generateEbook(arg);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
