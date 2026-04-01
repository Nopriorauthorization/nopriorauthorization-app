import fs from "fs";
import path from "path";
import { CANVA_DESIGNS_LIST_URL } from "@/lib/canva/oauth";
import type {
  CanvaDesignSummary,
  CanvaExportFormat,
  CanvaExportJob,
} from "./types";
import { CanvaServiceError } from "./types";

const CANVA_EXPORT_URL = "https://api.canva.com/rest/v1/exports";
const EXPORT_POLL_INTERVAL_MS = 2000;
const EXPORT_POLL_MAX_ATTEMPTS = 30;

/**
 * Server-side Canva service for CLI / product pipeline.
 *
 * Token: env CANVA_ACCESS_TOKEN or explicit constructor arg.
 * Browser OAuth cookies are NOT accessible from Node.
 */
export class CanvaService {
  private token: string;

  constructor(token?: string) {
    const resolved = token || process.env.CANVA_ACCESS_TOKEN?.trim();
    if (!resolved) {
      throw new CanvaServiceError(
        "No Canva access token. Set CANVA_ACCESS_TOKEN in .env.local or pass to constructor.",
      );
    }
    this.token = resolved;
  }

  /**
   * Create a CanvaService with automatic token resolution.
   * Priority: explicit arg → DB lookup → env CANVA_ACCESS_TOKEN → error.
   */
  static async create(token?: string): Promise<CanvaService> {
    if (token) return new CanvaService(token);

    const dbToken = await CanvaService.tryLoadTokenFromDb();
    if (dbToken) {
      const ts = new Date().toISOString().slice(11, 23);
      console.log(`[${ts}] [canva] Token loaded from database`);
      return new CanvaService(dbToken);
    }

    const envToken = process.env.CANVA_ACCESS_TOKEN?.trim();
    if (envToken) return new CanvaService(envToken);

    throw new CanvaServiceError(
      "No Canva access token found.\n" +
        "  1. Re-authorize at http://127.0.0.1:3000/api/canva/auth (preferred)\n" +
        "  2. Or set CANVA_ACCESS_TOKEN in .env.local",
    );
  }

  /**
   * Try loading a Canva access token from the database.
   * Returns null silently if DB is unavailable.
   */
  static async tryLoadTokenFromDb(): Promise<string | null> {
    try {
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) return null;

      const { default: pg } = await import("pg");
      const client = new pg.Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
      });
      await client.connect();
      const result = await client.query(
        `SELECT metadata FROM "Analytics" WHERE event = 'canva_oauth_token' ORDER BY "createdAt" DESC LIMIT 1`,
      );
      await client.end();

      if (result.rows.length && result.rows[0].metadata) {
        return (result.rows[0].metadata as Record<string, unknown>)
          .accessToken as string || null;
      }
    } catch {
      // Silently skip in non-server contexts
    }
    return null;
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  private log(msg: string) {
    const ts = new Date().toISOString().slice(11, 23);
    console.log(`[${ts}] [canva] ${msg}`);
  }

  /**
   * List all designs with pagination.
   * Requires scope: design:meta:read
   */
  async listDesigns(limit = 100): Promise<CanvaDesignSummary[]> {
    const all: CanvaDesignSummary[] = [];
    let continuation: string | undefined;

    do {
      const url = new URL(CANVA_DESIGNS_LIST_URL);
      if (continuation) url.searchParams.set("continuation", continuation);

      this.log(`GET ${url.pathname}${continuation ? " (page)" : ""}`);
      const start = Date.now();

      const res = await fetch(url.toString(), { headers: this.headers() });
      const dur = Date.now() - start;

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        if (res.status === 401) {
          throw new CanvaServiceError(
            "Canva token expired or invalid — re-authorize at http://127.0.0.1:3000/api/canva/auth",
            401,
          );
        }
        throw new CanvaServiceError(
          `Canva API ${res.status}: ${body.slice(0, 200)}`,
          res.status,
        );
      }

      const json = (await res.json()) as {
        items?: Array<{
          id?: string;
          title?: string;
          urls?: { edit_url?: string; thumbnail?: { url?: string } };
          created_at?: string;
          updated_at?: string;
        }>;
        continuation?: string;
      };

      this.log(`  ${json.items?.length ?? 0} designs in ${dur}ms`);

      for (const d of json.items || []) {
        all.push({
          id: d.id || "",
          title: (d.title || "").replace(/\n/g, " ").trim(),
          editUrl: d.urls?.edit_url || null,
          thumbnailUrl: d.urls?.thumbnail?.url,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        });
      }

      continuation = json.continuation;
      if (all.length >= limit) break;
    } while (continuation);

    return all;
  }

  /**
   * Find a single design by ID.
   */
  async getDesign(designId: string): Promise<CanvaDesignSummary | null> {
    this.log(`GET design ${designId}`);
    const url = `${CANVA_DESIGNS_LIST_URL}/${designId}`;
    const res = await fetch(url, { headers: this.headers() });
    if (res.status === 404) return null;
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new CanvaServiceError(
        `Canva API ${res.status}: ${body.slice(0, 200)}`,
        res.status,
      );
    }
    const d = (await res.json()) as {
      design?: {
        id?: string;
        title?: string;
        urls?: { edit_url?: string };
      };
    };
    const design = d.design;
    if (!design?.id) return null;
    return {
      id: design.id,
      title: (design.title || "").trim(),
      editUrl: design.urls?.edit_url || null,
    };
  }

  /**
   * Initiate an export job for a design.
   * Requires scope: design:content:read
   *
   * Returns export job ID for polling, or throws on scope/permission errors.
   */
  async startExport(
    designId: string,
    format: CanvaExportFormat,
  ): Promise<{ exportId: string }> {
    this.log(`POST export ${designId} → ${format}`);

    const body: Record<string, unknown> = {
      design_id: designId,
      format: { type: format === "pdf" ? "pdf" : "png" },
    };

    const res = await fetch(CANVA_EXPORT_URL, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new CanvaServiceError(
        `Export initiation failed (${res.status}): ${text.slice(0, 300)}`,
        res.status,
        text,
      );
    }

    const json = (await res.json()) as {
      job?: { id?: string };
    };

    const exportId = json.job?.id;
    if (!exportId) {
      throw new CanvaServiceError("Export response missing job.id");
    }

    this.log(`  export job started: ${exportId}`);
    return { exportId };
  }

  /**
   * Poll an export job until completed or failed.
   * Returns download URL(s) on success.
   */
  async pollExport(
    exportId: string,
  ): Promise<{ status: string; urls: string[] }> {
    for (let attempt = 0; attempt < EXPORT_POLL_MAX_ATTEMPTS; attempt++) {
      const url = `${CANVA_EXPORT_URL}/${exportId}`;
      const res = await fetch(url, { headers: this.headers() });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new CanvaServiceError(
          `Export poll failed (${res.status}): ${text.slice(0, 200)}`,
          res.status,
        );
      }

      const json = (await res.json()) as {
        job?: {
          status?: string;
          urls?: string[];
          error?: { code?: string; message?: string };
        };
      };

      const status = json.job?.status || "unknown";
      this.log(`  poll ${exportId}: ${status} (attempt ${attempt + 1})`);

      if (status === "success" || status === "completed") {
        return { status: "success", urls: json.job?.urls || [] };
      }
      if (status === "failed") {
        const errMsg =
          json.job?.error?.message || "Export failed with no details";
        throw new CanvaServiceError(`Export failed: ${errMsg}`);
      }

      await new Promise((r) => setTimeout(r, EXPORT_POLL_INTERVAL_MS));
    }

    throw new CanvaServiceError(
      `Export timed out after ${EXPORT_POLL_MAX_ATTEMPTS} polls`,
    );
  }

  /**
   * Download a URL to a local file path.
   */
  async downloadFile(url: string, destPath: string): Promise<void> {
    this.log(`  downloading → ${path.basename(destPath)}`);
    const res = await fetch(url);
    if (!res.ok) {
      throw new CanvaServiceError(`Download failed (${res.status}): ${url}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, buf);
    this.log(`  saved ${buf.length} bytes → ${destPath}`);
  }

  /**
   * Full export pipeline: initiate → poll → download all files.
   *
   * Returns a CanvaExportJob with status and output paths.
   * On scope errors (403), returns "failed" gracefully instead of throwing.
   */
  async exportDesign(
    designId: string,
    format: CanvaExportFormat,
    outputDir: string,
  ): Promise<CanvaExportJob> {
    try {
      const { exportId } = await this.startExport(designId, format);
      const { urls } = await this.pollExport(exportId);

      const outputPaths: string[] = [];
      for (let i = 0; i < urls.length; i++) {
        const ext = format === "pdf" ? "pdf" : "png";
        const fileName =
          urls.length === 1
            ? `${designId}.${ext}`
            : `${designId}-${i + 1}.${ext}`;
        const destPath = path.join(outputDir, fileName);
        await this.downloadFile(urls[i], destPath);
        outputPaths.push(destPath);
      }

      return {
        designId,
        format,
        status: "completed",
        outputPaths,
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const status =
        e instanceof CanvaServiceError && e.statusCode === 403
          ? 403
          : undefined;

      this.log(`  export ${designId} failed: ${msg}`);

      return {
        designId,
        format,
        status: "failed",
        error: msg,
        httpStatus: status,
      };
    }
  }
}
