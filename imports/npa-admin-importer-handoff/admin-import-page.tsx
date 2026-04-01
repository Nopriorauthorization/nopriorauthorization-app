/**
 * NPA Admin — Manifest Importer
 * File: src/app/admin/import/page.tsx
 *
 * Drop-in page for nopriorauthorization.com/admin/import
 * Lets Dani upload finished JSON manifests from the v2 collector tool
 * and imports them into the delivery catalog without touching the filesystem.
 *
 * REQUIRES: src/app/api/admin/import-manifest/route.ts (included in handoff)
 * PROTECT:  Wrap this route with your existing auth middleware or add
 *           a simple password check via environment variable ADMIN_SECRET.
 */

"use client";

import { useState, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ManifestTemplate {
  id: string;
  name: string;
  description: string;
  canvaTemplateUrl: string;
  format: string;
  pages: number;
  category: string;
}

interface Manifest {
  productId: string;
  displayName: string;
  description: string;
  version: string;
  priceUSD: number;
  etsySku: string;
  _importStatus?: string;
  templates: ManifestTemplate[];
  deliveryNote: string;
  expirationDays: number;
  generatedAt?: string;
}

interface FileStatus {
  file: File;
  manifest: Manifest | null;
  status: "pending" | "validating" | "valid" | "error" | "importing" | "imported" | "skipped";
  error: string | null;
  warnings: string[];
  filledCount: number;
  totalCount: number;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateManifest(data: unknown): { manifest: Manifest | null; error: string | null; warnings: string[] } {
  const warnings: string[] = [];

  if (!data || typeof data !== "object") return { manifest: null, error: "Not a valid JSON object", warnings };

  const m = data as Record<string, unknown>;

  if (!m.productId || typeof m.productId !== "string")
    return { manifest: null, error: "Missing or invalid productId", warnings };
  if (!m.displayName || typeof m.displayName !== "string")
    return { manifest: null, error: "Missing displayName", warnings };
  if (!Array.isArray(m.templates) || m.templates.length === 0)
    return { manifest: null, error: "Missing or empty templates array", warnings };

  const templates = m.templates as Record<string, unknown>[];
  for (let i = 0; i < templates.length; i++) {
    const t = templates[i];
    if (!t.id)   { return { manifest: null, error: `Template ${i + 1} missing id`, warnings }; }
    if (!t.name) { return { manifest: null, error: `Template ${i + 1} missing name`, warnings }; }
    if (!t.canvaTemplateUrl || t.canvaTemplateUrl === "PLACEHOLDER_CANVA_URL") {
      warnings.push(`Template "${t.name}": Canva URL is still a placeholder — will be skipped in delivery`);
    } else if (typeof t.canvaTemplateUrl === "string" && !t.canvaTemplateUrl.startsWith("https://www.canva.com/")) {
      warnings.push(`Template "${t.name}": URL doesn't look like a Canva template link`);
    }
  }

  return { manifest: data as Manifest, error: null, warnings };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminImportPage() {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((incoming: File[]) => {
    const jsonFiles = incoming.filter(f => f.name.endsWith(".json"));
    if (!jsonFiles.length) return;

    const newStatuses: FileStatus[] = jsonFiles.map(file => ({
      file,
      manifest: null,
      status: "validating",
      error: null,
      warnings: [],
      filledCount: 0,
      totalCount: 0,
    }));

    setFiles(prev => {
      const existingNames = new Set(prev.map(f => f.file.name));
      return [...prev, ...newStatuses.filter(f => !existingNames.has(f.file.name))];
    });

    jsonFiles.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          const { manifest, error, warnings } = validateManifest(data);
          const filled = manifest ? manifest.templates.filter(
            t => t.canvaTemplateUrl && t.canvaTemplateUrl !== "PLACEHOLDER_CANVA_URL" && t.canvaTemplateUrl.startsWith("https://www.canva.com/")
          ).length : 0;
          const total = manifest ? manifest.templates.length : 0;

          setFiles(prev => prev.map(f =>
            f.file.name === file.name
              ? { ...f, manifest, status: error ? "error" : "valid", error, warnings, filledCount: filled, totalCount: total }
              : f
          ));
        } catch {
          setFiles(prev => prev.map(f =>
            f.file.name === file.name
              ? { ...f, status: "error", error: "File is not valid JSON" }
              : f
          ));
        }
      };
      reader.readAsText(file);
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  }, [processFiles]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.file.name !== name));
  };

  const importAll = async () => {
    const toImport = files.filter(f => f.status === "valid" && f.manifest);
    if (!toImport.length) return;
    setImporting(true);

    for (const fs of toImport) {
      setFiles(prev => prev.map(f => f.file.name === fs.file.name ? { ...f, status: "importing" } : f));
      try {
        const res = await fetch("/api/admin/import-manifest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fs.manifest),
        });
        const result = await res.json();
        if (!res.ok) {
          setFiles(prev => prev.map(f =>
            f.file.name === fs.file.name
              ? { ...f, status: "error", error: result.error || "Import failed" }
              : f
          ));
        } else {
          setFiles(prev => prev.map(f =>
            f.file.name === fs.file.name ? { ...f, status: "imported" } : f
          ));
        }
      } catch (err) {
        setFiles(prev => prev.map(f =>
          f.file.name === fs.file.name
            ? { ...f, status: "error", error: "Network error — check the console" }
            : f
        ));
      }
    }

    setImporting(false);
    setDone(true);
  };

  const readyCount  = files.filter(f => f.status === "valid").length;
  const doneCount   = files.filter(f => f.status === "imported").length;
  const errorCount  = files.filter(f => f.status === "error").length;

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F5", fontFamily: "'Lato', sans-serif" }}>

      {/* Top bar */}
      <div style={{ background: "#1A1A1A", padding: "14px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "serif", fontSize: 17, color: "#fff" }}>
            No Prior <span style={{ color: "#D4537E" }}>Authorization</span>
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A96E", background: "rgba(201,169,110,0.15)", padding: "3px 8px", borderRadius: 4 }}>
            Admin
          </span>
        </div>
        <span style={{ fontSize: 12, color: "#888" }}>Manifest Importer</span>
      </div>

      {/* Header */}
      <div style={{ background: "#FBEAF0", borderBottom: "1px solid #E8D5DE", padding: "28px 36px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#D4537E", marginBottom: 8 }}>
          Delivery Catalog
        </div>
        <h1 style={{ fontFamily: "serif", fontSize: 26, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>
          Import product manifests
        </h1>
        <p style={{ fontSize: 14, color: "#6B6B6B", maxWidth: 560, lineHeight: 1.6 }}>
          Upload the JSON files generated by the <strong>Canva Link Collector v2</strong>.
          Each file is validated, then written to the delivery catalog — no folder access needed.
        </p>
        {/* Status chips */}
        {files.length > 0 && (
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" as const }}>
            <Chip color="#2D7A4F" bg="#E8F5EE">{doneCount} imported</Chip>
            <Chip color="#993556" bg="#FBEAF0">{readyCount} ready</Chip>
            {errorCount > 0 && <Chip color="#9B2335" bg="#FEF0F2">{errorCount} errors</Chip>}
          </div>
        )}
      </div>

      <div style={{ padding: "28px 36px", maxWidth: 800 }}>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "#D4537E" : "#E8D5DE"}`,
            borderRadius: 12,
            padding: "36px 24px",
            textAlign: "center" as const,
            background: dragging ? "#FBEAF0" : "#fff",
            cursor: "pointer",
            transition: "all 0.15s",
            marginBottom: 24,
          }}
        >
          <input ref={inputRef} type="file" accept=".json" multiple onChange={onFileInput} style={{ display: "none" }} />
          <div style={{ fontSize: 28, marginBottom: 10 }}>↑</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
            Drop JSON manifest files here
          </div>
          <div style={{ fontSize: 13, color: "#6B6B6B" }}>
            or click to browse — accepts multiple files at once
          </div>
          <div style={{ fontSize: 11, color: "#AAAAAA", marginTop: 8 }}>
            Generated by npa-canva-link-collector-v2.html
          </div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 24 }}>
            {files.map(fs => (
              <FileCard key={fs.file.name} fs={fs} onRemove={() => removeFile(fs.file.name)} />
            ))}
          </div>
        )}

        {/* Actions */}
        {files.length > 0 && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={importAll}
              disabled={importing || readyCount === 0}
              style={{
                fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                padding: "11px 24px", borderRadius: 8, border: "none",
                background: readyCount > 0 && !importing ? "#D4537E" : "#DDD",
                color: readyCount > 0 && !importing ? "#fff" : "#999",
                cursor: readyCount > 0 && !importing ? "pointer" : "not-allowed",
                transition: "all 0.15s",
              }}
            >
              {importing ? "Importing…" : `Import ${readyCount} manifest${readyCount !== 1 ? "s" : ""}`}
            </button>
            <button
              onClick={() => { setFiles([]); setDone(false); }}
              style={{
                fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                padding: "11px 18px", borderRadius: 8,
                border: "1px solid #E8D5DE", background: "transparent",
                color: "#6B6B6B", cursor: "pointer",
              }}
            >
              Clear all
            </button>
            {done && doneCount > 0 && (
              <div style={{ fontSize: 13, color: "#2D7A4F", fontWeight: 700 }}>
                ✓ {doneCount} product{doneCount !== 1 ? "s" : ""} now live in the delivery portal
              </div>
            )}
          </div>
        )}

        {/* Next step guide */}
        <div style={{ marginTop: 32, background: "#fff", border: "1px solid #E8D5DE", borderRadius: 10, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#6B6B6B", marginBottom: 12 }}>
            Full workflow
          </div>
          {[
            ["1", "Fill links", "Open npa-canva-link-collector-v2.html and paste your 44 Canva template links"],
            ["2", "Export JSONs", "Click Download all 6 in the collector — saves 6 manifest files to your downloads"],
            ["3", "Upload here", "Drag those 6 files onto this page — they're validated instantly"],
            ["4", "Import", "Click Import — they're written to the catalog, no terminal needed"],
            ["5", "Done", "Every product is live in the delivery portal immediately"],
          ].map(([num, title, desc]) => (
            <div key={num} style={{ display: "flex", gap: 14, marginBottom: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: "#FBEAF0", border: "1px solid #E8D5DE",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#D4537E", flexShrink: 0, marginTop: 1,
              }}>{num}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{title}</div>
                <div style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Chip({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, color, background: bg }}>
      {children}
    </span>
  );
}

function FileCard({ fs, onRemove }: { fs: FileStatus; onRemove: () => void }) {
  const statusConfig = {
    pending:    { label: "Pending",    color: "#888",    bg: "#F4F4F2" },
    validating: { label: "Checking…", color: "#888",    bg: "#F4F4F2" },
    valid:      { label: "Ready",     color: "#2D7A4F", bg: "#E8F5EE" },
    error:      { label: "Error",     color: "#9B2335", bg: "#FEF0F2" },
    importing:  { label: "Importing…",color: "#8A6500", bg: "#FFF8E8" },
    imported:   { label: "✓ Imported",color: "#2D7A4F", bg: "#E8F5EE" },
    skipped:    { label: "Skipped",   color: "#888",    bg: "#F4F4F2" },
  };
  const cfg = statusConfig[fs.status];
  const allFilled = fs.filledCount === fs.totalCount && fs.totalCount > 0;

  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${fs.status === "imported" ? "#A8D5BE" : fs.status === "error" ? "#F0A0A8" : "#E8D5DE"}`,
      borderRadius: 10, padding: "14px 16px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" as const }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{fs.file.name}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, color: cfg.color, background: cfg.bg }}>
              {cfg.label}
            </span>
            {fs.manifest && (
              <span style={{ fontSize: 10, color: "#6B6B6B" }}>
                {fs.filledCount}/{fs.totalCount} links filled
                {allFilled ? " — delivery-ready" : " — has placeholders"}
              </span>
            )}
          </div>
          {fs.manifest && (
            <div style={{ fontSize: 12, color: "#6B6B6B", marginBottom: fs.warnings.length > 0 || fs.error ? 6 : 0 }}>
              {fs.manifest.displayName} · {fs.manifest.etsySku} · ${fs.manifest.priceUSD}
            </div>
          )}
          {fs.error && (
            <div style={{ fontSize: 12, color: "#9B2335", background: "#FEF0F2", padding: "5px 9px", borderRadius: 5, marginTop: 4 }}>
              {fs.error}
            </div>
          )}
          {fs.warnings.length > 0 && fs.warnings.map((w, i) => (
            <div key={i} style={{ fontSize: 11, color: "#8A6500", background: "#FFF8E8", padding: "4px 9px", borderRadius: 5, marginTop: 4 }}>
              ⚠ {w}
            </div>
          ))}
        </div>
        {fs.status !== "imported" && fs.status !== "importing" && (
          <button
            onClick={onRemove}
            style={{ background: "none", border: "none", color: "#AAAAAA", cursor: "pointer", fontSize: 16, padding: "0 4px", lineHeight: 1 }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
