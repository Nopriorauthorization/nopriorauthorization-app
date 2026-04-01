import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const MANIFEST_DIR = path.join(ROOT, "imports", "npa-manifests-and-spec");
const TRACKER_PATH = path.join(MANIFEST_DIR, "MASTER_TEMPLATE_PRODUCTION_TRACKER.csv");

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  cells.push(current);
  return cells;
}

function parseCsv(content) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);

  if (!lines.length) return [];

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? "";
    });
    return row;
  });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function isRealCanvaUrl(value) {
  return (
    typeof value === "string" &&
    value.startsWith("https://www.canva.com/") &&
    value !== "PLACEHOLDER_CANVA_URL"
  );
}

function main() {
  if (!fs.existsSync(TRACKER_PATH)) {
    throw new Error(`Missing tracker: ${TRACKER_PATH}`);
  }

  const rows = parseCsv(fs.readFileSync(TRACKER_PATH, "utf8"));
  const updatesByProduct = new Map();

  for (const row of rows) {
    const productId = row.productId;
    const templateId = row.templateId;
    const url = row.canvaTemplateUrl;

    if (!productId || !templateId) continue;
    if (!isRealCanvaUrl(url)) continue;

    if (!updatesByProduct.has(productId)) {
      updatesByProduct.set(productId, new Map());
    }
    updatesByProduct.get(productId).set(templateId, url);
  }

  let productsTouched = 0;
  let templatesUpdated = 0;
  const warnings = [];

  for (const [productId, templateMap] of updatesByProduct.entries()) {
    const manifestPath = path.join(MANIFEST_DIR, `${productId}.json`);
    if (!fs.existsSync(manifestPath)) {
      warnings.push(`Missing manifest for productId: ${productId}`);
      continue;
    }

    const manifest = readJson(manifestPath);
    if (!Array.isArray(manifest.templates)) {
      warnings.push(`Manifest has no templates array: ${productId}`);
      continue;
    }

    let changed = false;
    for (const template of manifest.templates) {
      const targetUrl = templateMap.get(template.id);
      if (!targetUrl) continue;
      if (template.canvaTemplateUrl === targetUrl) continue;
      template.canvaTemplateUrl = targetUrl;
      templatesUpdated += 1;
      changed = true;
    }

    if (changed) {
      writeJson(manifestPath, manifest);
      productsTouched += 1;
    }
  }

  console.log(`Synced ${templatesUpdated} template URL(s) across ${productsTouched} product manifest(s)`);
  if (warnings.length) {
    console.log("Warnings:");
    for (const warning of warnings) {
      console.log(`- ${warning}`);
    }
  }
}

main();
