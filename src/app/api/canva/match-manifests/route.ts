import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { CANVA_DESIGNS_LIST_URL, getCanvaEnv } from "@/lib/canva/oauth";

const MAX_PAGES = 100;
const PAGE_LIMIT = 100;
const MATCH_THRESHOLD = 0.45;

const PRODUCT_KEYWORDS: Record<string, string[]> = {
  "weight-loss-kit": ["glp", "weight", "semaglutide", "tirzepatide", "wl"],
  "botox-consent-bundle": ["botox", "neurotoxin", "toxin"],
  "filler-consent-bundle": ["filler", "dermal", "lip"],
  "lash-aftercare-kit": ["lash", "extension", "lift", "aftercare"],
  "peptide-patient-guide": ["peptide", "bhrt", "hormone", "vitamin", "wellness"],
  "combo-bundle": [],
};

type ManifestTemplate = {
  id: string;
  name: string;
  description: string;
  canvaTemplateUrl: string;
  format: string;
  pages: number;
  category: string;
};

type Manifest = {
  productId: string;
  displayName: string;
  templates: ManifestTemplate[];
  [key: string]: unknown;
};

type CanvaDesign = {
  id: string | null;
  title: string | null;
  urls: { edit_url: string | null; view_url: string | null } | null;
};

type CanvaListResponse = {
  items?: Array<{
    id?: string;
    title?: string;
    urls?: { edit_url?: string; view_url?: string };
  }>;
  continuation?: string;
};

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(s: string): string[] {
  return normalizeText(s).split(/\s+/).filter(Boolean);
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size && !b.size) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

function scoreTemplateToDesign(templateName: string, designTitle: string): number {
  const tNorm = normalizeText(templateName);
  const dNorm = normalizeText(designTitle);
  if (!tNorm || !dNorm) return 0;
  if (tNorm === dNorm) return 1.5;

  const tTokens = new Set(tokenize(templateName));
  const dTokens = new Set(tokenize(designTitle));
  let score = jaccard(tTokens, dTokens);

  if (dNorm.includes(tNorm) || tNorm.includes(dNorm)) score += 0.25;
  const tFirst = tokenize(templateName)[0];
  const dFirst = tokenize(designTitle)[0];
  if (tFirst && dFirst && tFirst === dFirst) score += 0.1;

  return score;
}

function hasAnyKeyword(haystack: string, keywords: string[]): boolean {
  if (!keywords.length) return true;
  return keywords.some((k) => haystack.includes(k));
}

function inferTemplateKeywords(productId: string, templateName: string): string[] {
  const base = [...(PRODUCT_KEYWORDS[productId] || [])];
  const t = normalizeText(templateName);

  // Template-level intent signals outperform generic product names.
  if (/(instagram|story|social|post|carousel)/.test(t)) {
    base.push("instagram", "story", "social", "post");
  }
  if (/(iv|drip|hydration|myers|nad)/.test(t)) {
    base.push("iv", "drip", "hydration", "myers", "nad");
  }
  if (/(glp|weight|semaglutide|tirzepatide)/.test(t)) {
    base.push("glp", "weight", "semaglutide", "tirzepatide");
  }
  if (/(botox|neurotoxin|toxin)/.test(t)) {
    base.push("botox", "neurotoxin", "toxin");
  }
  if (/(filler|dermal|lip)/.test(t)) {
    base.push("filler", "dermal", "lip");
  }
  if (/(lash|lift|extension)/.test(t)) {
    base.push("lash", "lift", "extension");
  }
  if (/(peptide|bhrt|hormone|vitamin|wellness)/.test(t)) {
    base.push("peptide", "bhrt", "hormone", "vitamin", "wellness");
  }

  return Array.from(new Set(base));
}

async function fetchAllDesigns(accessToken: string): Promise<CanvaDesign[]> {
  const designs: CanvaDesign[] = [];
  let continuation: string | undefined;
  let pages = 0;

  while (pages < MAX_PAGES) {
    const listUrl = new URL(CANVA_DESIGNS_LIST_URL);
    listUrl.searchParams.set("limit", String(PAGE_LIMIT));
    listUrl.searchParams.set("ownership", "any");
    if (continuation) listUrl.searchParams.set("continuation", continuation);

    const res = await fetch(listUrl.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    let body: CanvaListResponse | Record<string, unknown> = {};
    try {
      body = (await res.json()) as CanvaListResponse;
    } catch {
      body = {};
    }

    if (!res.ok) {
      const err = new Error("Canva list designs failed");
      (err as Error & { status?: number; body?: unknown }).status = res.status;
      (err as Error & { status?: number; body?: unknown }).body = body;
      throw err;
    }

    for (const d of body.items ?? []) {
      designs.push({
        id: d.id ?? null,
        title: d.title ?? null,
        urls: d.urls
          ? {
              edit_url: d.urls.edit_url ?? null,
              view_url: d.urls.view_url ?? null,
            }
          : null,
      });
    }

    continuation = body.continuation;
    pages += 1;
    if (!continuation) break;
  }

  return designs;
}

async function readManifests(filterProductId?: string): Promise<Manifest[]> {
  const dir = path.join(process.cwd(), "imports", "npa-manifests-and-spec");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
  const manifests: Manifest[] = [];

  for (const file of files) {
    const raw = await fs.readFile(path.join(dir, file), "utf8");
    const json = JSON.parse(raw) as Manifest;
    if (!json.productId || !Array.isArray(json.templates)) continue;
    if (filterProductId && json.productId !== filterProductId) continue;
    manifests.push(json);
  }
  return manifests;
}

export async function GET(req: NextRequest) {
  const cfg = getCanvaEnv();
  if (!cfg) {
    return NextResponse.json(
      { error: "Missing Canva environment configuration." },
      { status: 503 }
    );
  }

  const accessToken = req.cookies.get("canva_access_token")?.value;
  if (!accessToken) {
    return NextResponse.json(
      { error: "Not connected to Canva yet. Visit /canva and connect first." },
      { status: 401 }
    );
  }

  const productId = req.nextUrl.searchParams.get("productId")?.trim() || undefined;

  try {
    const [designs, manifests] = await Promise.all([
      fetchAllDesigns(accessToken),
      readManifests(productId),
    ]);

    const results = manifests.map((manifest) => {
      const used = new Set<string>();
      let matchedCount = 0;

      const templateMatches = manifest.templates.map((template) => {
        const requiredKeywords = inferTemplateKeywords(manifest.productId, template.name);
        const candidates = designs
          .filter((d) => d.id && d.title)
          .map((d) => ({
            designId: d.id as string,
            title: d.title as string,
            score: scoreTemplateToDesign(template.name, d.title as string),
            urls: d.urls,
            keywordHit: hasAnyKeyword(normalizeText(d.title as string), requiredKeywords),
          }))
          .map((c) => {
            // Penalize weak semantic matches when required keywords are absent.
            const adjustedScore =
              requiredKeywords.length > 0 && !c.keywordHit ? c.score * 0.2 : c.score;
            // Small boost when keyword intent matches.
            const boostedScore = c.keywordHit ? adjustedScore + 0.15 : adjustedScore;
            return {
              ...c,
              score: boostedScore,
            };
          })
          .filter((c) => c.score >= MATCH_THRESHOLD)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        const bestAvailable = candidates.find((c) => !used.has(c.designId)) || null;
        if (bestAvailable) {
          used.add(bestAvailable.designId);
          matchedCount += 1;
        }

        return {
          templateId: template.id,
          templateName: template.name,
          requiredKeywords,
          currentCanvaTemplateUrl: template.canvaTemplateUrl,
          bestMatch: bestAvailable,
          topCandidates: candidates,
        };
      });

      const prefilledManifest = {
        ...manifest,
        _autoMatchNote:
          "Suggested URLs come from Canva list-designs edit/view URLs (temporary). Review before import.",
        _autoMatchedAt: new Date().toISOString(),
        templates: manifest.templates.map((t) => {
          const m = templateMatches.find((x) => x.templateId === t.id);
          return {
            ...t,
            canvaTemplateUrl:
              m?.bestMatch?.urls?.edit_url && m.bestMatch.score >= MATCH_THRESHOLD
                ? m.bestMatch.urls.edit_url
                : t.canvaTemplateUrl,
            _suggestedDesignId: m?.bestMatch?.designId ?? null,
            _suggestedDesignTitle: m?.bestMatch?.title ?? null,
            _suggestedScore: m?.bestMatch?.score ?? null,
          };
        }),
      };

      return {
        productId: manifest.productId,
        displayName: manifest.displayName,
        templatesTotal: manifest.templates.length,
        templatesMatched: matchedCount,
        templateMatches,
        prefilledManifest,
      };
    });

    return NextResponse.json({
      connected: true,
      productFilter: productId || null,
      manifestsAnalyzed: results.length,
      designsIndexed: designs.length,
      results,
    });
  } catch (e) {
    const err = e as Error & { status?: number; body?: unknown };
    return NextResponse.json(
      {
        connected: true,
        error: err.message || "Failed to match manifests",
        status: err.status || 500,
        data: err.body || null,
      },
      { status: 502 }
    );
  }
}
