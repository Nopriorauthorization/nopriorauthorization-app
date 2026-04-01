import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  assertValidConfig,
  type BuildManifest,
  type BuildStepResult,
  type DigitalProductConfig,
  type StepStatus,
} from "./types";
import { generateEtsyMetadata } from "./etsy-metadata-generator";
import { generateInstructions } from "./instructions-generator";
import { packageProduct } from "./package-product";

const DEFAULT_OUTPUT_DIR = path.join(process.cwd(), "output");

export type BuildOptions = {
  outputRoot?: string;
};

export async function buildProduct(
  config: DigitalProductConfig,
  opts?: BuildOptions,
): Promise<BuildManifest> {
  assertValidConfig(config);

  const outputRoot = opts?.outputRoot || process.env.PRODUCT_OUTPUT_DIR || DEFAULT_OUTPUT_DIR;
  const slugDir = path.join(outputRoot, config.slug);
  const previewsDir = path.join(slugDir, "previews");
  const deliveryDir = path.join(slugDir, "delivery");
  const archivesDir = path.join(slugDir, "archives");

  const buildId = crypto.randomUUID();
  const steps: BuildStepResult[] = [];

  log(config.slug, `Build ${buildId} starting`);

  // ensure directories
  for (const d of [slugDir, previewsDir, deliveryDir, archivesDir]) {
    fs.mkdirSync(d, { recursive: true });
  }

  // Step 1: generate listing metadata
  const metaResult = runStep("generate-listing-metadata", () => {
    const metadata = generateEtsyMetadata(config);
    const listingJson = {
      productId: config.slug,
      title: metadata.title,
      description: metadata.description,
      tags: metadata.tags,
      materials: metadata.materialsLine,
      faq: metadata.faqMarkdown,
      imageHeadlines: metadata.imageHeadlines,
      guardrailWarnings: metadata.guardrailWarnings,
      price: config.etsy.priceUsd,
      quantity: config.etsy.quantity,
      isDigital: config.etsy.isDigital,
      taxonomy_id: 2078,
      who_made: "i_did",
      when_made: "made_to_order",
      type: "download",
    };
    const listingPath = path.join(slugDir, "listing.json");
    fs.writeFileSync(listingPath, JSON.stringify(listingJson, null, 2) + "\n");
    return [listingPath];
  });
  steps.push(metaResult);

  // Step 2: generate instructions
  const instrResult = runStep("generate-instructions", () => {
    const instr = generateInstructions(config);
    const files: string[] = [];

    const mdPath = path.join(deliveryDir, "instructions.md");
    fs.writeFileSync(mdPath, instr.markdown);
    files.push(mdPath);

    const htmlPath = path.join(deliveryDir, "instructions.html");
    fs.writeFileSync(htmlPath, instr.html);
    files.push(htmlPath);

    const txtPath = path.join(deliveryDir, "instructions.txt");
    fs.writeFileSync(txtPath, instr.text);
    files.push(txtPath);

    return files;
  });
  steps.push(instrResult);

  // Step 3: Canva export — full pipeline when token + design IDs present
  const canvaResult = await runStepAsync("canva-export", async () => {
    let token = process.env.CANVA_ACCESS_TOKEN?.trim() || "";

    if (!token) {
      const { CanvaService: CS } = await import("@/lib/integrations/canva/canva.service");
      const dbToken = await CS.tryLoadTokenFromDb();
      if (dbToken) {
        token = dbToken;
        log(config.slug, "  Loaded Canva token from database");
      }
    }

    if (!token) {
      return { status: "skipped" as const, message: "No CANVA_ACCESS_TOKEN set and none in DB; skipping Canva step" };
    }

    if (!config.canvaDesignIds?.length) {
      return { status: "skipped" as const, message: "No canvaDesignIds in config; export requires design IDs" };
    }

    const { CanvaService } = await import("@/lib/integrations/canva/canva.service");
    const canva = new CanvaService(token);
    const allFiles: string[] = [];
    const canvaLinks: string[] = [];

    for (const designId of config.canvaDesignIds) {
      const design = await canva.getDesign(designId);
      if (design) {
        canvaLinks.push(`${design.id}: ${design.title}`);
        log(config.slug, `  Canva design: ${design.title}`);
      } else {
        log(config.slug, `  Canva design ${designId}: NOT FOUND (skipping export)`);
        continue;
      }

      for (const fmt of config.exportFormats) {
        const job = await canva.exportDesign(designId, fmt, previewsDir);
        if (job.status === "completed" && job.outputPaths?.length) {
          allFiles.push(...job.outputPaths);
          log(config.slug, `  Exported ${job.outputPaths.length} ${fmt} file(s)`);
        } else if (job.status === "failed") {
          log(config.slug, `  Export ${fmt} failed: ${job.error}`);
        }
      }
    }

    if (canvaLinks.length && config.deliveryFiles.includeCanvaLinks) {
      const linksPath = path.join(deliveryDir, "canva-links.txt");
      fs.writeFileSync(linksPath, canvaLinks.join("\n") + "\n");
      allFiles.push(linksPath);
    }

    if (allFiles.length === 0) {
      return { status: "skipped" as const, message: "Designs found but no exports completed (scope may not be enabled)" };
    }
    return { files: allFiles };
  });
  steps.push(canvaResult);

  // Step 4: package ZIP
  let archivePath: string | null = null;
  const zipResult = runStep("package-zip", () => {
    const deliveryFiles = fs
      .readdirSync(deliveryDir)
      .filter((f) => !f.startsWith("."))
      .map((f) => ({
        diskPath: path.join(deliveryDir, f),
        archiveName: `${config.slug}/${f}`,
      }));

    if (deliveryFiles.length === 0) {
      throw new Error("No delivery files to package");
    }

    const zipPath = path.join(archivesDir, `${config.slug}.zip`);
    // packageProduct is async but we call synchronously in the step wrapper;
    // handle inline since the underlying impl is actually sync (buffer-based)
    const zipBuf = buildZipSync(deliveryFiles);
    fs.writeFileSync(zipPath, zipBuf);
    archivePath = zipPath;
    return [zipPath];
  });
  steps.push(zipResult);

  // Step 5: write build manifest
  const manifest: BuildManifest = {
    slug: config.slug,
    brand: config.brand,
    buildId,
    builtAt: new Date().toISOString(),
    steps,
    outputDir: slugDir,
    archivePath,
  };

  const manifestPath = path.join(slugDir, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  const ok = steps.filter((s) => s.status === "ok").length;
  const skipped = steps.filter((s) => s.status === "skipped").length;
  const errors = steps.filter((s) => s.status === "error").length;

  log(
    config.slug,
    `Build complete: ${ok} ok, ${skipped} skipped, ${errors} error(s) → ${slugDir}`,
  );

  return manifest;
}

function runStep(
  name: string,
  fn: () => string[] | null,
): BuildStepResult {
  const start = Date.now();
  try {
    const files = fn();
    return {
      step: name,
      status: files ? "ok" : "skipped",
      durationMs: Date.now() - start,
      files: files ?? undefined,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      step: name,
      status: "error",
      durationMs: Date.now() - start,
      message: msg,
    };
  }
}

async function runStepAsync(
  name: string,
  fn: () => Promise<{ files?: string[]; status?: StepStatus; message?: string }>,
): Promise<BuildStepResult> {
  const start = Date.now();
  try {
    const result = await fn();
    return {
      step: name,
      status: result.status || (result.files ? "ok" : "skipped"),
      durationMs: Date.now() - start,
      files: result.files,
      message: result.message,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      step: name,
      status: "error",
      durationMs: Date.now() - start,
      message: msg,
    };
  }
}

function log(slug: string, msg: string) {
  const ts = new Date().toISOString().slice(11, 23);
  console.log(`[${ts}] [product:${slug}] ${msg}`);
}

/**
 * Synchronous ZIP builder reusing the same pure-JS approach from package-product.
 * Re-imports the logic inline because packageProduct is async-typed but the data ops are sync.
 */
function buildZipSync(
  files: { diskPath: string; archiveName: string }[],
): Buffer {
  const entries: { name: string; data: Buffer }[] = files.map((f) => ({
    name: f.archiveName,
    data: fs.readFileSync(f.diskPath),
  }));

  const parts: Buffer[] = [];
  const centralDir: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = Buffer.from(entry.name, "utf8");
    const lh = localFileHeader(nameBytes, entry.data);
    parts.push(lh, nameBytes, entry.data);

    const cd = centralDirEntry(nameBytes, entry.data, offset);
    centralDir.push(cd);

    offset += lh.length + nameBytes.length + entry.data.length;
  }

  const cdOffset = offset;
  const cdBuf = Buffer.concat(centralDir);
  parts.push(cdBuf);

  const eocd = endOfCentralDir(entries.length, cdBuf.length, cdOffset);
  parts.push(eocd);

  return Buffer.concat(parts);
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function localFileHeader(name: Buffer, data: Buffer): Buffer {
  const b = Buffer.alloc(30);
  b.writeUInt32LE(0x04034b50, 0);
  b.writeUInt16LE(20, 4);
  b.writeUInt16LE(0, 8);
  b.writeUInt32LE(crc32(data), 14);
  b.writeUInt32LE(data.length, 18);
  b.writeUInt32LE(data.length, 22);
  b.writeUInt16LE(name.length, 26);
  return b;
}

function centralDirEntry(name: Buffer, data: Buffer, off: number): Buffer {
  const b = Buffer.alloc(46 + name.length);
  b.writeUInt32LE(0x02014b50, 0);
  b.writeUInt16LE(20, 4);
  b.writeUInt16LE(20, 6);
  b.writeUInt32LE(crc32(data), 16);
  b.writeUInt32LE(data.length, 20);
  b.writeUInt32LE(data.length, 24);
  b.writeUInt16LE(name.length, 28);
  b.writeUInt32LE(off, 42);
  name.copy(b, 46);
  return b;
}

function endOfCentralDir(count: number, cdSize: number, cdOffset: number): Buffer {
  const b = Buffer.alloc(22);
  b.writeUInt32LE(0x06054b50, 0);
  b.writeUInt16LE(count, 8);
  b.writeUInt16LE(count, 10);
  b.writeUInt32LE(cdSize, 12);
  b.writeUInt32LE(cdOffset, 16);
  return b;
}
