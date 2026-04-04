import fs from "fs";
import path from "path";
import { resolveCanvaListDesignsPath } from "./resolve-canva-list-designs-path.mjs";

const ROOT = process.cwd();
const MANIFEST_DIR = path.join(ROOT, "imports", "npa-manifests-and-spec");
const STRICT_DIR = path.join(ROOT, "imports", "npa-manifests-and-spec-prefilled-strict");
const LIST_DESIGNS_PATH = resolveCanvaListDesignsPath(ROOT);
const DESIGN_ID_MAP_PATH = path.join(ROOT, "imports", "canva-design-id-map.json");

function loadDesignIdMap() {
  if (!fs.existsSync(DESIGN_ID_MAP_PATH)) return {};
  const raw = readJson(DESIGN_ID_MAP_PATH);
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k.startsWith("_")) continue;
    if (typeof v === "string" && v.trim()) out[k] = v.trim();
  }
  return out;
}

function findDesignByCanvaId(canvaId, designs) {
  const want = String(canvaId || "").trim();
  if (!want) return null;
  for (const d of designs) {
    const id = d.id ? String(d.id).trim() : "";
    if (!id) continue;
    if (id === want || id.endsWith(want) || want.endsWith(id)) return d;
  }
  return null;
}

function normalizeText(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/\n/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

const EXACT_NAME_MAP = {
  "btx-consultation-form": "Neurotoxin Consultation Medical History Form",
  "btx-consent-form": "Botox Neurotoxin Informed Consent Form",
  "btx-precare": "Pre-Treatment Instructions Neurotoxin",
  "btx-postcare": "Post-Treatment Aftercare Neurotoxin",
  "btx-treatment-record": "Neurotoxin Treatment Record Dosing Log",
  "btx-photo-release": "Before After Photography Consent",

  "flr-consultation-form": "Dermal Filler Consultation Medical History Form",
  "flr-consent-form": "Dermal Filler Informed Consent Form",
  "flr-precare": "Pre-Treatment Instructions Dermal Filler",
  "flr-postcare": "Post-Treatment Aftercare Dermal Filler",
  "flr-treatment-record": "Filler Treatment Record Product Log",
  "flr-dissolving-consent": "Hyaluronidase Dissolution Consent Form",
  "flr-photo-release": "Before After Photography Consent",

  "wl-intake-form": "GLP-1 Patient Intake Form",
  "wl-consent-form": "GLP-1 Treatment Consent Form",
  "wl-expectation-guide": "What to Expect Your GLP-1 Journey",
  "wl-nutrition-tracker": "Weekly Nutrition Symptom Tracker",
  "wl-side-effect-log": "Side Effect Log Action Guide",
  "wl-aftercare-card": "Injection Day Aftercare Card",
  "wl-progress-photo-release": "Progress Photo Video Release Form",

  "lsh-intake-form": "Lash Client Intake Health History Form",
  "lsh-allergy-waiver": "Patch Test Waiver Allergy Release",
  "lsh-extension-consent": "Lash Extension Consent Form",
  "lsh-aftercare-extensions": "Lash Extension Aftercare Instructions",
  "lsh-lift-consent": "Lash Lift Tint Consent Form",
  "lsh-aftercare-lift": "Lash Lift Aftercare Instructions",
  "lsh-rebook-card": "Rebooking Reminder Card",

  "pep-what-are-peptides": "What Are Peptides Patient Education Guide",
  "pep-bhrt-guide": "Understanding BHRT Patient Guide",
  "pep-intake-form": "Peptide Hormone Therapy Intake Form",
  "pep-consent-form": "Peptide Therapy Informed Consent Form",
  "pep-self-injection-guide": "Self-Injection Training Guide",
  "pep-symptom-tracker": "Monthly Symptom Progress Tracker",
  "pep-faq-card": "Peptide Therapy FAQ Card",

  "cb-iv-intake": "IV Therapy Patient Intake Form",
  "cb-iv-menu": "IV Therapy Full Service Menu",
  "cb-iv-aftercare": "IV Therapy Aftercare Instructions",
  "cb-wl-intake": "GLP-1 Patient Intake Form",
  "cb-wl-consent": "GLP-1 Treatment Consent Form",
  "cb-wl-guide": "What to Expect Your GLP-1 Journey",
  "cb-social-ig-square": "IV Therapy Social Media Templates",
  "cb-social-story": "IV Therapy Story Templates",
  "cb-hipaa-release": "HIPAA Notice Photo Release Universal",
  "cb-cancellation-policy": "Cancellation No-Show Policy",
};

function matchDesignByExactName(targetName, designs) {
  const norm = normalizeText(targetName);
  if (!norm) return null;

  const titled = designs.filter((d) => d.title && d.title.trim().length > 0);

  for (const design of titled) {
    if (normalizeText(design.title) === norm) return design;
  }

  for (const design of titled) {
    const dNorm = normalizeText(design.title);
    if (!dNorm) continue;
    if (dNorm.includes(norm) || norm.includes(dNorm)) return design;
  }

  const normTokens = norm.split(/\s+/).filter(Boolean);
  if (normTokens.length < 2) return null;

  for (const design of titled) {
    const dNorm = normalizeText(design.title);
    if (!dNorm) continue;
    const dTokens = new Set(dNorm.split(/\s+/).filter(Boolean));
    if (dTokens.size < 2) continue;
    const hits = normTokens.filter((t) => dTokens.has(t)).length;
    if (hits / normTokens.length >= 0.7) return design;
  }

  return null;
}

function main() {
  if (!fs.existsSync(LIST_DESIGNS_PATH)) {
    console.error(
      `Missing Canva list file: ${LIST_DESIGNS_PATH}\n` +
        `  1) npm run dev → /canva → connect Canva\n` +
        `  2) Open /api/canva/list-designs?save=desktop (writes ~/Desktop/canva-list-designs.json)\n` +
        `     or save JSON to imports/canva-list-designs.json — or set CANVA_LIST_DESIGNS_JSON\n`,
    );
    process.exit(1);
  }
  const designPayload = readJson(LIST_DESIGNS_PATH);
  const designs = (Array.isArray(designPayload.designs) ? designPayload.designs : [])
    .filter((d) => d?.urls?.edit_url)
    .map((d) => ({
      id: d.id || null,
      title: (d.title || "").replace(/\n/g, " ").trim(),
      editUrl: d.urls.edit_url,
    }));

  console.log(`Loaded ${designs.length} Canva designs with edit URLs`);

  const designIdMap = loadDesignIdMap();
  const mapKeys = Object.keys(designIdMap).length;
  if (mapKeys > 0) {
    console.log(`Using ${mapKeys} template id → Canva design id mappings (${DESIGN_ID_MAP_PATH})`);
  }

  const manifestFiles = fs
    .readdirSync(MANIFEST_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  let totalFilled = 0;
  let totalAlreadyFilled = 0;
  let totalMissing = 0;
  const productResults = [];

  for (const fileName of manifestFiles) {
    const manifestPath = path.join(MANIFEST_DIR, fileName);
    const manifest = readJson(manifestPath);
    if (!manifest.productId || !Array.isArray(manifest.templates)) continue;

    const productId = manifest.productId;
    const usedUrls = new Set();
    let filledThisProduct = 0;
    let alreadyFilledThisProduct = 0;
    let missingThisProduct = 0;

    for (const template of manifest.templates) {
      if (
        template.canvaTemplateUrl &&
        template.canvaTemplateUrl !== "PLACEHOLDER_CANVA_URL" &&
        template.canvaTemplateUrl.startsWith("https://www.canva.com/")
      ) {
        usedUrls.add(template.canvaTemplateUrl);
        alreadyFilledThisProduct += 1;
        continue;
      }

      const mappedValue = designIdMap[template.id];
      if (mappedValue) {
        // Direct URL in map — use as-is (cross-workspace or pre-resolved)
        if (mappedValue.startsWith("https://")) {
          template.canvaTemplateUrl = mappedValue;
          filledThisProduct += 1;
          console.log(`  FILL ${productId} / ${template.id} <- direct URL`);
          continue;
        }
        // Canva design ID — look up edit URL in list-designs
        const byId = findDesignByCanvaId(mappedValue, designs);
        if (byId?.editUrl) {
          template.canvaTemplateUrl = byId.editUrl;
          filledThisProduct += 1;
          console.log(
            `  FILL ${productId} / ${template.id} <- design ${mappedValue} ("${byId.title}")`
          );
          continue;
        }
        missingThisProduct += 1;
        console.log(
          `  MISS ${productId} / ${template.id} (mapped design id "${mappedValue}" not in list-designs)`
        );
        continue;
      }

      const exactName = EXACT_NAME_MAP[template.id];
      let match = null;

      if (exactName) {
        match = matchDesignByExactName(exactName, designs.filter((d) => !usedUrls.has(d.editUrl)));
      }

      if (!match) {
        match = matchDesignByExactName(
          template.name || "",
          designs.filter((d) => !usedUrls.has(d.editUrl))
        );
      }

      if (match) {
        template.canvaTemplateUrl = match.editUrl;
        usedUrls.add(match.editUrl);
        filledThisProduct += 1;
        console.log(
          `  FILL ${productId} / ${template.id} <- "${match.title}"`
        );
      } else {
        missingThisProduct += 1;
        const searching = exactName || template.name || template.id;
        console.log(`  MISS ${productId} / ${template.id} (looking for: "${searching}")`);
      }
    }

    if (filledThisProduct > 0) {
      writeJson(manifestPath, manifest);

      const strictPath = path.join(STRICT_DIR, fileName);
      if (fs.existsSync(STRICT_DIR)) {
        writeJson(strictPath, manifest);
      }
    }

    totalFilled += filledThisProduct;
    totalAlreadyFilled += alreadyFilledThisProduct;
    totalMissing += missingThisProduct;

    productResults.push({
      productId,
      templates: manifest.templates.length,
      alreadyFilled: alreadyFilledThisProduct,
      newlyFilled: filledThisProduct,
      stillMissing: missingThisProduct,
    });
  }

  console.log("\n=== RESULTS ===");
  console.log(`Designs available: ${designs.length}`);
  console.log(`Already filled: ${totalAlreadyFilled}`);
  console.log(`Newly filled: ${totalFilled}`);
  console.log(`Still missing: ${totalMissing}`);
  console.log("");

  for (const pr of productResults) {
    const pct =
      pr.templates > 0
        ? (((pr.alreadyFilled + pr.newlyFilled) / pr.templates) * 100).toFixed(0)
        : 0;
    console.log(
      `${pr.productId}: ${pr.alreadyFilled + pr.newlyFilled}/${pr.templates} (${pct}%) [+${pr.newlyFilled} new]`
    );
  }

  console.log(
    `\nTo finish: create the missing designs in Canva using CANVA-NAMING-GUIDE.md names,`
  );
  console.log(`then re-pull /api/canva/list-designs and run this script again.`);
}

main();
