import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const STRICT_MANIFEST_DIR = path.join(
  ROOT,
  "imports",
  "npa-manifests-and-spec-prefilled-strict"
);
const LIST_DESIGNS_PATH =
  process.env.CANVA_LIST_DESIGNS_JSON?.trim() ||
  path.join(ROOT, "imports", "canva-list-designs.json");
const OUTPUT_DIR = path.join(ROOT, "imports", "store-build");
const OUTPUT_MANIFEST_DIR = path.join(OUTPUT_DIR, "manifests-clean");
const OUTPUT_REPORT_MD = path.join(OUTPUT_DIR, "store-build-checklist.md");
const OUTPUT_UNMATCHED_JSON = path.join(OUTPUT_DIR, "unmatched-templates.json");
const OUTPUT_STATUS_JSON = path.join(OUTPUT_DIR, "status.json");
const SUGGESTION_LIMIT = 3;
const MIN_SUGGESTION_SCORE = 0.12;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n");
}

function normalizeText(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(input) {
  const text = normalizeText(input);
  if (!text) return [];
  return text.split(/\s+/).filter(Boolean);
}

function jaccard(aTokens, bTokens) {
  const a = new Set(aTokens);
  const b = new Set(bTokens);
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union ? intersection / union : 0;
}

function topCandidatesForTemplate(template, product, indexedDesigns, max = SUGGESTION_LIMIT) {
  const templateTokens = tokenize(
    `${template.id || ""} ${template.name || ""} ${template.description || ""}`
  );
  const productTokens = tokenize(product.productId || "").filter(
    (token) => token.length >= 3
  );

  const scored = indexedDesigns
    .map((design) => {
      const base = jaccard(templateTokens, design.tokens);
      const productOverlap = productTokens.length
        ? productTokens.filter((t) => design.tokenSet.has(t)).length
        : 0;
      const score = base + productOverlap * 0.06;
      return {
        id: design.id || null,
        title: design.title || null,
        editUrl: design.editUrl || null,
        score: Number(score.toFixed(4)),
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score >= MIN_SUGGESTION_SCORE);

  const deduped = [];
  const seenKeys = new Set();
  for (const item of scored) {
    const key = item.id || item.title;
    if (!key || seenKeys.has(key)) continue;
    deduped.push(item);
    seenKeys.add(key);
    if (deduped.length >= max) break;
  }

  return deduped;
}

function stripInternalTemplateFields(template) {
  const cleaned = {};
  for (const [key, value] of Object.entries(template || {})) {
    if (!key.startsWith("_")) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

function stripInternalManifestFields(manifest) {
  const cleaned = {};
  for (const [key, value] of Object.entries(manifest || {})) {
    if (key === "templates" && Array.isArray(value)) {
      cleaned.templates = value.map(stripInternalTemplateFields);
      continue;
    }
    if (!key.startsWith("_")) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

function loadStrictManifestPaths() {
  return fs
    .readdirSync(STRICT_MANIFEST_DIR)
    .filter((name) => name.endsWith(".json") && !name.endsWith(".match-debug.json"))
    .filter((name) => name !== "match-summary.json")
    .sort()
    .map((name) => path.join(STRICT_MANIFEST_DIR, name));
}

function main() {
  if (!fs.existsSync(STRICT_MANIFEST_DIR)) {
    throw new Error(`Missing strict manifest directory: ${STRICT_MANIFEST_DIR}`);
  }
  if (!fs.existsSync(LIST_DESIGNS_PATH)) {
    throw new Error(`Missing list-designs file: ${LIST_DESIGNS_PATH}`);
  }

  const designPayload = readJson(LIST_DESIGNS_PATH);
  const designs = Array.isArray(designPayload.designs) ? designPayload.designs : [];
  const indexedDesigns = designs.map((design) => {
    const title = design?.title || "";
    const tokens = tokenize(title);
    return {
      id: design?.id || null,
      title,
      editUrl: design?.urls?.edit_url || null,
      tokens,
      tokenSet: new Set(tokens),
    };
  });

  const manifestPaths = loadStrictManifestPaths();
  const products = [];
  const unmatched = [];

  for (const manifestPath of manifestPaths) {
    const manifest = readJson(manifestPath);
    const cleanedManifest = stripInternalManifestFields(manifest);
    const templates = Array.isArray(cleanedManifest.templates)
      ? cleanedManifest.templates
      : [];

    const matchedTemplates = templates.filter(
      (template) =>
        template.canvaTemplateUrl &&
        template.canvaTemplateUrl !== "PLACEHOLDER_CANVA_URL" &&
        String(template.canvaTemplateUrl).startsWith("https://www.canva.com/")
    );

    const missingTemplates = templates.filter(
      (template) =>
        !template.canvaTemplateUrl ||
        template.canvaTemplateUrl === "PLACEHOLDER_CANVA_URL"
    );

    const productInfo = {
      productId: cleanedManifest.productId || path.basename(manifestPath, ".json"),
      displayName:
        cleanedManifest.displayName ||
        cleanedManifest.productId ||
        path.basename(manifestPath, ".json"),
      fileName: path.basename(manifestPath),
      templatesTotal: templates.length,
      templatesMatched: matchedTemplates.length,
      templatesMissing: missingTemplates.length,
      completionPct: templates.length
        ? Number(((matchedTemplates.length / templates.length) * 100).toFixed(1))
        : 0,
    };
    products.push(productInfo);

    for (const template of missingTemplates) {
      unmatched.push({
        productId: productInfo.productId,
        productName: productInfo.displayName,
        templateId: template.id || null,
        templateName: template.name || null,
        topCandidates: topCandidatesForTemplate(
          template,
          cleanedManifest,
          indexedDesigns,
          5
        ),
      });
    }

    const outManifestPath = path.join(OUTPUT_MANIFEST_DIR, productInfo.fileName);
    writeJson(outManifestPath, cleanedManifest);
  }

  const totals = products.reduce(
    (acc, product) => {
      acc.products += 1;
      acc.templates += product.templatesTotal;
      acc.matched += product.templatesMatched;
      acc.missing += product.templatesMissing;
      return acc;
    },
    { products: 0, templates: 0, matched: 0, missing: 0 }
  );
  const completionPct = totals.templates
    ? Number(((totals.matched / totals.templates) * 100).toFixed(1))
    : 0;

  writeJson(OUTPUT_UNMATCHED_JSON, unmatched);
  writeJson(OUTPUT_STATUS_JSON, {
    generatedAt: new Date().toISOString(),
    sources: {
      strictManifestDir: STRICT_MANIFEST_DIR,
      listDesignsPath: LIST_DESIGNS_PATH,
      designCount: indexedDesigns.length,
    },
    totals: {
      ...totals,
      completionPct,
    },
    products,
  });

  const reportLines = [];
  reportLines.push("# Store Build Checklist");
  reportLines.push("");
  reportLines.push(`Generated: ${new Date().toISOString()}`);
  reportLines.push(`Designs indexed: ${indexedDesigns.length}`);
  reportLines.push("");
  reportLines.push("## Build Progress");
  reportLines.push("");
  reportLines.push(
    `- Products: ${totals.products} | Templates: ${totals.templates} | Matched: ${totals.matched} | Missing: ${totals.missing} | Completion: ${completionPct}%`
  );
  reportLines.push("");
  reportLines.push("## Product Status");
  reportLines.push("");
  for (const product of products) {
    reportLines.push(
      `- ${product.displayName} (\`${product.productId}\`): ${product.templatesMatched}/${product.templatesTotal} matched (${product.completionPct}%)`
    );
  }
  reportLines.push("");
  reportLines.push("## Missing Template Checklist");
  reportLines.push("");
  for (const item of unmatched) {
    reportLines.push(
      `### ${item.productName} - ${item.templateName || item.templateId || "Unnamed template"}`
    );
    reportLines.push("");
    reportLines.push(`- Product: \`${item.productId}\``);
    reportLines.push(`- Template ID: \`${item.templateId || "n/a"}\``);
    if (!item.topCandidates.length) {
      reportLines.push("- Suggested Canva matches: none (rename Canva design for better matching)");
      reportLines.push("");
      continue;
    }
    reportLines.push("- Suggested Canva matches:");
    for (const candidate of item.topCandidates) {
      reportLines.push(
        `  - score ${candidate.score}: ${candidate.title || "Untitled"} (${candidate.editUrl || "no edit url"})`
      );
    }
    reportLines.push("");
  }
  fs.mkdirSync(path.dirname(OUTPUT_REPORT_MD), { recursive: true });
  fs.writeFileSync(OUTPUT_REPORT_MD, reportLines.join("\n") + "\n");

  console.log(`Wrote ${OUTPUT_REPORT_MD}`);
  console.log(`Wrote ${OUTPUT_STATUS_JSON}`);
  console.log(`Wrote ${OUTPUT_UNMATCHED_JSON}`);
  console.log(`Wrote cleaned manifests to ${OUTPUT_MANIFEST_DIR}`);
}

main();
