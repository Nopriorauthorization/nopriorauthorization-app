import fs from "fs";
import path from "path";

const canvaOutputRoot = "/Users/danid/Desktop/canva-automation/output/products";
const handoffRoot = path.join(
  process.cwd(),
  "imports",
  "npa-manifests-and-spec"
);
const targetPath = path.join(
  process.cwd(),
  "src",
  "lib",
  "delivery",
  "catalog.generated.json"
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeManifest(manifest) {
  const product = manifest.product || {};
  const templates = Array.isArray(manifest.templates)
    ? manifest.templates
        .filter((item) => item?.title && (item.editUrl || item.viewUrl))
        .map((item) => ({
          title: item.title,
          designId: item.designId || null,
          editUrl: item.editUrl || null,
          viewUrl: item.viewUrl || null,
        }))
    : [];

  return {
    productKey: product.key || product.slug,
    productSlug: product.slug,
    productTitle: product.title || product.slug,
    buildTimestamp: manifest.buildTimestamp || null,
    templateCount: templates.length,
    templates,
  };
}

function normalizeHandoffManifest(manifest) {
  const templates = Array.isArray(manifest.templates)
    ? manifest.templates
        .filter(
          (item) =>
            item?.name &&
            item.canvaTemplateUrl &&
            item.canvaTemplateUrl !== "PLACEHOLDER_CANVA_URL"
        )
        .map((item) => ({
          title: item.name,
          designId: item.id || null,
          editUrl: item.canvaTemplateUrl || null,
          viewUrl: null,
        }))
    : [];

  return {
    productKey: manifest.productId,
    productSlug: manifest.productId,
    productTitle: manifest.displayName || manifest.productId,
    buildTimestamp: manifest.importedAt || null,
    templateCount: templates.length,
    templates,
  };
}

function main() {
  const productsBySlug = new Map();
  const skipped = [];

  if (fs.existsSync(canvaOutputRoot)) {
    const dirEntries = fs
      .readdirSync(canvaOutputRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const dirName of dirEntries) {
      const manifestPath = path.join(canvaOutputRoot, dirName, "manifest.json");
      if (!fs.existsSync(manifestPath)) continue;
      const manifest = readJson(manifestPath);
      const normalized = normalizeManifest(manifest);
      if (!normalized.productSlug || normalized.templates.length === 0) continue;

      const existing = productsBySlug.get(normalized.productSlug);
      if (!existing) {
        productsBySlug.set(normalized.productSlug, normalized);
        continue;
      }

      const existingTs = existing.buildTimestamp
        ? new Date(existing.buildTimestamp).getTime()
        : 0;
      const incomingTs = normalized.buildTimestamp
        ? new Date(normalized.buildTimestamp).getTime()
        : 0;

      if (incomingTs >= existingTs) {
        productsBySlug.set(normalized.productSlug, normalized);
      }
    }
  } else if (fs.existsSync(targetPath)) {
    try {
      const prior = readJson(targetPath);
      for (const p of prior.products || []) {
        if (p?.productSlug) productsBySlug.set(p.productSlug, p);
      }
      console.warn(
        `[catalog] Canva root missing — seeded ${productsBySlug.size} product(s) from existing catalog`,
      );
    } catch (e) {
      console.warn("[catalog] Could not read existing catalog:", e?.message || e);
    }
  } else {
    console.warn(
      `[catalog] Canva root missing and no catalog file yet — only handoff JSON will define products`,
    );
  }

  if (fs.existsSync(handoffRoot)) {
    const files = fs
      .readdirSync(handoffRoot)
      .filter((name) => name.endsWith(".json"))
      .sort();

    for (const fileName of files) {
      const filePath = path.join(handoffRoot, fileName);
      const manifest = readJson(filePath);
      const totalTemplates = Array.isArray(manifest.templates)
        ? manifest.templates.length
        : 0;
      const readyTemplates = Array.isArray(manifest.templates)
        ? manifest.templates.filter(
            (item) =>
              item?.canvaTemplateUrl &&
              item.canvaTemplateUrl !== "PLACEHOLDER_CANVA_URL"
          ).length
        : 0;

      const normalized = normalizeHandoffManifest(manifest);
      if (!normalized.productSlug || normalized.templates.length === 0) {
        skipped.push({
          productSlug: manifest.productId || fileName,
          reason: `No real Canva template URLs yet (${readyTemplates}/${totalTemplates} ready)`,
        });
        continue;
      }

      const existing = productsBySlug.get(normalized.productSlug);
      if (!existing) {
        productsBySlug.set(normalized.productSlug, normalized);
        continue;
      }

      const existingTs = existing.buildTimestamp
        ? new Date(existing.buildTimestamp).getTime()
        : 0;
      const incomingTs = normalized.buildTimestamp
        ? new Date(normalized.buildTimestamp).getTime()
        : 0;

      if (incomingTs >= existingTs) {
        productsBySlug.set(normalized.productSlug, normalized);
      }
    }
  }

  const products = Array.from(productsBySlug.values()).sort((a, b) =>
    a.productSlug.localeCompare(b.productSlug)
  );

  const catalog = {
    generatedAt: new Date().toISOString(),
    sourceRoot: canvaOutputRoot,
    products,
  };

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(catalog, null, 2) + "\n");

  console.log(`Imported ${products.length} delivery manifest(s)`);
  for (const product of products) {
    console.log(`- ${product.productSlug}: ${product.templateCount} templates`);
  }
  if (skipped.length) {
    console.log("Skipped handoff manifests:");
    for (const item of skipped) {
      console.log(`- ${item.productSlug}: ${item.reason}`);
    }
  }
  console.log(`Wrote ${targetPath}`);
}

main();
