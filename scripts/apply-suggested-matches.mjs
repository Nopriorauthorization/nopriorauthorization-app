import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const STRICT_DIR = path.join(ROOT, "imports", "npa-manifests-and-spec-prefilled-strict");
const UNMATCHED_PATH = path.join(ROOT, "imports", "store-build", "unmatched-templates.json");

function parseArgs(argv) {
  const args = {
    productId: "",
    minScore: 0.2,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--product" && argv[i + 1]) {
      args.productId = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--min-score" && argv[i + 1]) {
      const parsed = Number(argv[i + 1]);
      if (!Number.isNaN(parsed)) args.minScore = parsed;
      i += 1;
    }
  }

  if (!args.productId) {
    throw new Error("Missing required --product <productId>");
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function main() {
  const { productId, minScore } = parseArgs(process.argv);

  const unmatched = readJson(UNMATCHED_PATH);
  const manifestPath = path.join(STRICT_DIR, `${productId}.json`);
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }
  const manifest = readJson(manifestPath);
  const templates = Array.isArray(manifest.templates) ? manifest.templates : [];

  const usedUrls = new Set(
    templates
      .map((template) => template?.canvaTemplateUrl)
      .filter(
        (url) =>
          typeof url === "string" &&
          url.length > 0 &&
          url !== "PLACEHOLDER_CANVA_URL"
      )
  );

  const productItems = unmatched.filter((item) => item.productId === productId);
  const applied = [];

  for (const item of productItems) {
    const template = templates.find((entry) => entry.id === item.templateId);
    if (!template) continue;
    if (
      template.canvaTemplateUrl &&
      template.canvaTemplateUrl !== "PLACEHOLDER_CANVA_URL"
    ) {
      continue;
    }

    const candidate = (item.topCandidates || []).find(
      (entry) =>
        typeof entry?.score === "number" &&
        entry.score >= minScore &&
        typeof entry?.editUrl === "string" &&
        entry.editUrl.startsWith("https://www.canva.com/") &&
        !usedUrls.has(entry.editUrl)
    );

    if (!candidate) continue;

    template.canvaTemplateUrl = candidate.editUrl;
    usedUrls.add(candidate.editUrl);
    applied.push({
      templateId: template.id,
      templateName: template.name || null,
      score: candidate.score,
      designTitle: candidate.title || null,
      editUrl: candidate.editUrl,
    });
  }

  writeJson(manifestPath, manifest);

  console.log(
    `Applied ${applied.length} suggestion(s) to ${productId} with min score ${minScore}`
  );
  for (const item of applied) {
    console.log(
      `- ${item.templateId} (${item.score}) <- ${item.designTitle || "Untitled"}`
    );
  }
}

main();
