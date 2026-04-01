"use client";
export const dynamic = "force-dynamic";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";

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
  templates: ManifestTemplate[];
  deliveryNote: string;
  expirationDays: number;
}

interface FileStatus {
  file: File;
  manifest: Manifest | null;
  status:
    | "pending"
    | "validating"
    | "valid"
    | "error"
    | "importing"
    | "imported";
  error: string | null;
  warnings: string[];
  filledCount: number;
  totalCount: number;
}

function validateManifest(data: unknown): {
  manifest: Manifest | null;
  error: string | null;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (!data || typeof data !== "object") {
    return { manifest: null, error: "Not a valid JSON object", warnings };
  }

  const m = data as Record<string, unknown>;
  if (!m.productId || typeof m.productId !== "string") {
    return { manifest: null, error: "Missing or invalid productId", warnings };
  }
  if (!m.displayName || typeof m.displayName !== "string") {
    return { manifest: null, error: "Missing displayName", warnings };
  }
  if (!Array.isArray(m.templates) || m.templates.length === 0) {
    return { manifest: null, error: "Missing or empty templates array", warnings };
  }

  const templates = m.templates as Record<string, unknown>[];
  for (let i = 0; i < templates.length; i++) {
    const t = templates[i];
    if (!t.id) {
      return {
        manifest: null,
        error: `Template ${i + 1} missing id`,
        warnings,
      };
    }
    if (!t.name) {
      return {
        manifest: null,
        error: `Template ${i + 1} missing name`,
        warnings,
      };
    }
    if (!t.canvaTemplateUrl || t.canvaTemplateUrl === "PLACEHOLDER_CANVA_URL") {
      warnings.push(
        `Template "${t.name}": URL is still a placeholder and won't be delivery-ready yet`
      );
    } else if (
      typeof t.canvaTemplateUrl === "string" &&
      !t.canvaTemplateUrl.startsWith("https://www.canva.com/") &&
      !t.canvaTemplateUrl.startsWith("/forms/")
    ) {
      warnings.push(
        `Template "${t.name}": URL doesn't look like a Canva or local form link`
      );
    }
  }

  return { manifest: data as Manifest, error: null, warnings };
}

function Chip({
  color,
  bg,
  children,
}: {
  color: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        color,
        background: bg,
        borderRadius: 9999,
        padding: "6px 10px",
      }}
    >
      {children}
    </span>
  );
}

export default function AdminImportPage() {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const [repoSync, setRepoSync] = useState<
    "idle" | "loading" | "ok" | "error"
  >("idle");
  const [repoSyncMsg, setRepoSyncMsg] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const syncFromRepository = async () => {
    setRepoSync("loading");
    setRepoSyncMsg("");
    try {
      const res = await fetch("/api/admin/sync-delivery-manifests", {
        method: "POST",
      });
      const data = (await res.json()) as {
        message?: string;
        okCount?: number;
        failCount?: number;
        error?: string;
      };
      if (!res.ok) {
        setRepoSync("error");
        setRepoSyncMsg(data.error || "Sync failed");
        return;
      }
      setRepoSync("ok");
      setRepoSyncMsg(
        data.message ||
          `Synced ${data.okCount ?? 0} manifest(s). Failed: ${data.failCount ?? 0}.`
      );
    } catch {
      setRepoSync("error");
      setRepoSyncMsg("Network error");
    }
  };

  const processFiles = useCallback((incoming: File[]) => {
    const jsonFiles = incoming.filter((f) => f.name.endsWith(".json"));
    if (!jsonFiles.length) return;

    const newStatuses: FileStatus[] = jsonFiles.map((file) => ({
      file,
      manifest: null,
      status: "validating",
      error: null,
      warnings: [],
      filledCount: 0,
      totalCount: 0,
    }));

    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.file.name));
      return [...prev, ...newStatuses.filter((f) => !existingNames.has(f.file.name))];
    });

    jsonFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          const { manifest, error, warnings } = validateManifest(data);
          const filled = manifest
            ? manifest.templates.filter(
                (t) =>
                  t.canvaTemplateUrl &&
                  t.canvaTemplateUrl !== "PLACEHOLDER_CANVA_URL" &&
                  (t.canvaTemplateUrl.startsWith("https://www.canva.com/") ||
                    t.canvaTemplateUrl.startsWith("/forms/"))
              ).length
            : 0;
          const total = manifest ? manifest.templates.length : 0;

          setFiles((prev) =>
            prev.map((f) =>
              f.file.name === file.name
                ? {
                    ...f,
                    manifest,
                    status: error ? "error" : "valid",
                    error,
                    warnings,
                    filledCount: filled,
                    totalCount: total,
                  }
                : f
            )
          );
        } catch {
          setFiles((prev) =>
            prev.map((f) =>
              f.file.name === file.name
                ? { ...f, status: "error", error: "File is not valid JSON" }
                : f
            )
          );
        }
      };
      reader.readAsText(file);
    });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      processFiles(Array.from(e.dataTransfer.files));
    },
    [processFiles]
  );

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.file.name !== name));
  };

  const importAll = async () => {
    const toImport = files.filter((f) => f.status === "valid" && f.manifest);
    if (!toImport.length) return;
    setImporting(true);
    setDone(false);

    for (const fileStatus of toImport) {
      setFiles((prev) =>
        prev.map((f) =>
          f.file.name === fileStatus.file.name ? { ...f, status: "importing" } : f
        )
      );

      try {
        const res = await fetch("/api/admin/import-manifest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fileStatus.manifest),
        });
        const result = await res.json();

        if (!res.ok) {
          setFiles((prev) =>
            prev.map((f) =>
              f.file.name === fileStatus.file.name
                ? { ...f, status: "error", error: result.error || "Import failed" }
                : f
            )
          );
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.file.name === fileStatus.file.name ? { ...f, status: "imported" } : f
            )
          );
        }
      } catch {
        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === fileStatus.file.name
              ? { ...f, status: "error", error: "Network error during import" }
              : f
          )
        );
      }
    }

    setImporting(false);
    setDone(true);
  };

  const readyCount = files.filter((f) => f.status === "valid").length;
  const doneCount = files.filter((f) => f.status === "imported").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF7F5",
        fontFamily: "'Lato', sans-serif",
      }}
    >
      <div
        style={{
          background: "#1A1A1A",
          padding: "14px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "serif", fontSize: 17, color: "#fff" }}>
            No Prior <span style={{ color: "#D4537E" }}>Authorization</span>
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#C9A96E",
              background: "rgba(201,169,110,0.15)",
              padding: "3px 8px",
              borderRadius: 4,
            }}
          >
            Admin
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/admin/library"
            style={{ fontSize: 12, color: "#D4537E", fontWeight: 700 }}
          >
            Template library →
          </Link>
          <span style={{ fontSize: 12, color: "#888" }}>Manifest Importer</span>
        </div>
      </div>

      <div
        style={{
          background: "#FBEAF0",
          borderBottom: "1px solid #E8D5DE",
          padding: "28px 36px",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#D4537E",
            marginBottom: 8,
          }}
        >
          Delivery Catalog
        </div>
        <h1
          style={{
            fontFamily: "serif",
            fontSize: 26,
            fontWeight: 600,
            color: "#1A1A1A",
            marginBottom: 8,
          }}
        >
          Import product manifests
        </h1>
        <p style={{ fontSize: 14, color: "#6B6B6B", maxWidth: 620, lineHeight: 1.6 }}>
          Delivery reads bundled <code style={{ fontSize: 12 }}>catalog.generated.json</code> first.
          Use &quot;Sync from repository&quot; to push every manifest in{" "}
          <code style={{ fontSize: 12 }}>imports/npa-manifests-and-spec/</code> into the database
          (fallback for tooling). You can still drag JSON here for one-off imports.
        </p>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void syncFromRepository();
            }}
            disabled={repoSync === "loading"}
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              padding: "10px 18px",
              borderRadius: 8,
              border: "none",
              cursor: repoSync === "loading" ? "wait" : "pointer",
              background: "#1A1A1A",
              color: "#fff",
            }}
          >
            {repoSync === "loading" ? "Syncing…" : "Sync all from repository"}
          </button>
          {repoSync === "ok" && (
            <span style={{ fontSize: 13, color: "#2D7A4F" }}>{repoSyncMsg}</span>
          )}
          {repoSync === "error" && (
            <span style={{ fontSize: 13, color: "#9B2335" }}>{repoSyncMsg}</span>
          )}
        </div>
        {files.length > 0 && (
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <Chip color="#2D7A4F" bg="#E8F5EE">
              {doneCount} imported
            </Chip>
            <Chip color="#993556" bg="#FBEAF0">
              {readyCount} ready
            </Chip>
            {errorCount > 0 && (
              <Chip color="#9B2335" bg="#FEF0F2">
                {errorCount} errors
              </Chip>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: "28px 36px", maxWidth: 860 }}>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "#D4537E" : "#E8D5DE"}`,
            borderRadius: 12,
            padding: "36px 24px",
            textAlign: "center",
            background: dragging ? "#FBEAF0" : "#fff",
            cursor: "pointer",
            transition: "all 0.15s",
            marginBottom: 24,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".json"
            multiple
            onChange={onFileInput}
            style={{ display: "none" }}
          />
          <div style={{ fontSize: 28, marginBottom: 10 }}>↑</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
            Drop JSON manifest files here
          </div>
          <div style={{ fontSize: 13, color: "#6B6B6B" }}>
            or click to browse — accepts multiple files at once
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
          <button
            onClick={importAll}
            disabled={importing || readyCount === 0}
            style={{
              background: importing || readyCount === 0 ? "#DDD" : "#D4537E",
              color: importing || readyCount === 0 ? "#777" : "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 18px",
              fontWeight: 700,
              cursor: importing || readyCount === 0 ? "not-allowed" : "pointer",
            }}
          >
            {importing ? "Importing..." : `Import ${readyCount} manifest${readyCount === 1 ? "" : "s"}`}
          </button>
          {done && (
            <span style={{ alignSelf: "center", color: "#2D7A4F", fontWeight: 700 }}>
              Import complete
            </span>
          )}
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {files.map((fileStatus) => (
            <div
              key={fileStatus.file.name}
              style={{
                border: "1px solid #E8D5DE",
                borderRadius: 12,
                background: "#fff",
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 14,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "#1A1A1A" }}>{fileStatus.file.name}</div>
                  {fileStatus.manifest ? (
                    <div style={{ marginTop: 4, fontSize: 13, color: "#6B6B6B" }}>
                      {fileStatus.manifest.displayName} · {fileStatus.filledCount}/
                      {fileStatus.totalCount} Canva links filled
                    </div>
                  ) : null}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 8px",
                      borderRadius: 9999,
                      background:
                        fileStatus.status === "imported"
                          ? "#E8F5EE"
                          : fileStatus.status === "valid"
                          ? "#FBEAF0"
                          : fileStatus.status === "error"
                          ? "#FEF0F2"
                          : "#F4F4F2",
                      color:
                        fileStatus.status === "imported"
                          ? "#2D7A4F"
                          : fileStatus.status === "valid"
                          ? "#993556"
                          : fileStatus.status === "error"
                          ? "#9B2335"
                          : "#6B6B6B",
                    }}
                  >
                    {fileStatus.status}
                  </span>
                  <button
                    onClick={() => removeFile(fileStatus.file.name)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#888",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {fileStatus.error ? (
                <div style={{ marginTop: 10, color: "#9B2335", fontSize: 13 }}>
                  {fileStatus.error}
                </div>
              ) : null}

              {fileStatus.warnings.length > 0 ? (
                <ul style={{ marginTop: 10, paddingLeft: 18, color: "#8A6500", fontSize: 12 }}>
                  {fileStatus.warnings.map((warning, index) => (
                    <li key={index} style={{ marginTop: 4 }}>
                      {warning}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
