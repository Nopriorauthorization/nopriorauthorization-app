# TICKET — Implement unified product automation pipeline (build from this repo)

**Type:** Implementation (not documentation-only)  
**Depends on:** `docs/PRODUCT_AUTOMATION_PIPELINE.md` (gap analysis)  
**Branch:** `main` @ commit prior to this ticket’s PR (see git history)  

---

## Goal

Ship the **one-command internal pipeline**: `pnpm product:build <slug>` produces a complete folder under `PRODUCT_OUTPUT_DIR` (default `output/`) with listing metadata, instructions, buyer-safe files, ZIP, and optional Etsy draft — using typed services and seed configs.

---

## Out of scope (this ticket)

- Public buyer UI, auth for buyers, analytics dashboards  
- Guaranteed Canva **export** if API scopes not enabled (service must **fail clearly** and still generate metadata + ZIP from non-export assets)  
- Etsy digital file **upload** to listing (stub + types only if API unclear)  

---

## File tree to create

```
src/lib/integrations/canva/
  types.ts              # CanvaExportJob, DesignSummary, service errors
  canva.service.ts      # class CanvaService — token resolution, list designs, export (when available)

src/lib/integrations/etsy/
  types.ts              # DraftListingInput, EtsyListingResult, errors
  etsy.service.ts      # class EtsyService — draft create, validate payload; wrap fetch to Open API v3

src/lib/products/
  types.ts              # DigitalProductConfig + BuildManifest + validation helpers
  product-builder.ts    # buildProduct(slug): orchestrates generator, canva, package, manifest
  etsy-metadata-generator.ts  # title, description, exactly 13 tags, guardrails
  instructions-generator.ts   # MD + HTML; optional PDF via simple approach or deferred with TODO
  package-product.ts    # assemble delivery/, validate names, write ZIP

content/products/
  npa-appeal-kit.config.ts
  npa-checklist-bundle.config.ts
  npa-intake-template-pack.config.ts
  index.ts                # registry: slug -> config

scripts/products/
  build-product.mjs       # node scripts/products/build-product.mjs <slug>
  build-all-products.mjs
  create-draft.mjs        # optional: call EtsyService after build

output/                   # gitignored via .gitignore entry `output/`
```

**Note:** Use `src/lib/integrations/...` (not `lib/` at repo root) to match Next.js `@/` imports. Adjust ticket wording accordingly.

---

## 1) `DigitalProductConfig` (`src/lib/products/types.ts`)

Define and export:

```ts
export type BrandId = "npa" | "hello-gorgeous";

export type CanvaDesignStrategy =
  | "use-existing-template"
  | "create-from-template"
  | "export-existing-design";

export type DigitalProductConfig = {
  slug: string;
  internalName: string;
  listingTitleSeed: string;
  brand: "No Prior Authorization" | "Hello Gorgeous";
  brandId: BrandId;
  category: string;
  audience: string[];
  keywords: string[];
  tagsSeed: string[];
  descriptionSeed: string;
  canvaTemplateIds?: string[];
  canvaDesignIds?: string[]; // optional: explicit design IDs for export-existing-design
  canvaDesignStrategy: CanvaDesignStrategy;
  exportFormats: ("png" | "pdf")[];
  deliveryFiles: {
    includeInstructions: boolean;
    includeCanvaLinks: boolean;
    includeBonusFiles: boolean;
  };
  etsy: {
    priceUsd: number;
    quantity: number;
    isDigital: true;
    shouldCreateDraft: boolean;
  };
};
```

**Validation:** `assertValidConfig(config)` — throw `ConfigError` with field path if invalid (slug format, non-empty seeds, etsy.priceUsd > 0, etc.).

---

## 2) Seed configs (`content/products/`)

Three **working** placeholder configs (copy can be refined later):

| File | slug |
|------|------|
| `npa-appeal-kit.config.ts` | `npa-appeal-kit` |
| `npa-checklist-bundle.config.ts` | `npa-checklist-bundle` |
| `npa-intake-template-pack.config.ts` | `npa-intake-template-pack` |

`content/products/index.ts` exports `PRODUCT_REGISTRY: Record<string, DigitalProductConfig>` and `getProductConfig(slug: string)`.

---

## 3) `CanvaService` (`canva.service.ts`)

**Responsibilities:**

- Resolve access token: prefer **env** `CANVA_ACCESS_TOKEN` for scripts; document that OAuth cookies are browser-only — for CLI, user sets token from connected session or future token refresh store.
- **listDesigns** (paginate): delegate to same HTTP contract as `GET /api/canva/list-designs` (reuse URL constants from `src/lib/canva/oauth.ts`).
- **exportDesign** (optional P1): if `design:export` or equivalent not available in V1, implement **stub** that returns structured `NotImplementedError` with message to enable scope in portal.
- Normalize downloaded file paths under `output/{slug}/previews/` or `canva-exports/`.

**Logging:** prefix `[canva]` every outbound request + duration + design id.

**Tests (minimal):** mock fetch for listDesigns happy path + 401.

---

## 4) `EtsyService` (`etsy.service.ts`)

**Responsibilities:**

- Resolve token: same as `scripts/create-etsy-draft-listings.mjs` — `ETSY_ACCESS_TOKEN` + optional DB read pattern **or** import shared helper from `src/lib/etsy/tokens.ts` (may need `getEtsyTokens` usable from Node script context).
- **createDraftListing(payload)** — validate body before POST; map errors to `EtsyServiceError` with `etsyErrorCode` if present.
- **updateListing** (optional P1): stub with clear `NotImplementedError` if not needed for V1.

Refactor **duplicate HTTP logic** out of `create-etsy-draft-listings.mjs` into `EtsyService`, then thin the script to call the service.

---

## 5) `etsy-metadata-generator.ts`

**Inputs:** `DigitalProductConfig`  
**Outputs:** `{ title, description, tags: string[13], materialsLine?, faqMarkdown?, imageHeadlines: string[] }`

**Rules:**

- Etsy title length cap (~140 chars — verify current Etsy limit in code constant).
- **Exactly 13 tags** when possible (pad from `keywords` / `tagsSeed` without duplication).
- **Guardrails module** (same file or `listing-guardrails.ts`): strip/guard medical guarantees, legal guarantees, deceptive outcomes — log warnings when adjusting.

**Output:** also produce `listing.json` compatible with existing `listing-definitions.json` shape where practical for `create-draft` reuse.

---

## 6) `instructions-generator.ts`

**Outputs:**

- `instructions.md` and `instructions.html` under `output/{slug}/delivery/`
- PDF: if `pdf-lib` or puppeteer is too heavy for V1, write **TODO** and ship TXT fallback `instructions.txt` generated from same AST/string builder.

**Sections (required):** what’s included, Canva access steps, edit/export tips, usage terms, digital disclaimer, support placeholder.

---

## 7) `package-product.ts`

**Inputs:** paths to include (buyer-facing only), output zip path  
**Behavior:**

- Reject empty file list
- Sanitize archive entry names (no `..`, no absolute paths)
- Write `archives/{slug}.zip`
- Return manifest checksums optional (sha256 per file)

---

## 8) `product-builder.ts`

**Pipeline:**

1. Load config by slug → validate  
2. Ensure `output/{slug}/` directories: `previews/`, `delivery/`, `archives/`  
3. Run `generateEtsyMetadata` → write `listing.json`  
4. Run `generateInstructions` → write delivery files  
5. Call `CanvaService` for exports → write previews (or record SKIPPED in `build-manifest.json`)  
6. Assemble ZIP via `package-product`  
7. Write `manifest.json` (build id, timestamps, git sha optional, per-step status)

**Exit codes:** 0 success; 1 config; 2 canva; 3 etsy; 4 packaging  

---

## 9) CLI (`scripts/products/*.mjs`)

Use **Node** + dynamic `import()` of compiled TS **or** implement builder in `.ts` and run with `tsx` (already in repo for `db:seed`).

Recommended:

- `tsx scripts/products/build-product.ts <slug>`
- Add to `package.json`:  
  `"product:build": "tsx scripts/products/build-product.ts"`  
  `"product:build-all": "tsx scripts/products/build-all-products.ts"`  
  `"product:create-draft": "tsx scripts/products/create-draft.ts"`

---

## 10) Environment

Add to `.env.example`:

```
PRODUCT_OUTPUT_DIR=./output
# Optional CLI: long-lived or pasted token for Canva API scripts (OAuth cookies not available in Node)
# CANVA_ACCESS_TOKEN=
```

Document that Etsy tokens may come from DB in production (match existing pattern).

---

## 11) `.gitignore`

Add: `/output/` (or `output/`)

---

## Acceptance criteria (Definition of Done for this ticket)

- [ ] `pnpm product:build npa-appeal-kit` creates `output/npa-appeal-kit/` with `manifest.json`, `listing.json`, `delivery/*instructions*`, `archives/npa-appeal-kit.zip`
- [ ] Invalid slug fails with exit 1 and readable error
- [ ] All three seed configs build without manual edits
- [ ] `listing.json` contains title, description, **13 tags**
- [ ] Guardrails applied (unit test or snapshot on forbidden phrases)
- [ ] `pnpm product:create-draft npa-appeal-kit` creates Etsy draft **when** env + token valid; isolates failure (build artifacts still on disk)
- [ ] README section in `docs/PRODUCT_AUTOMATION_PIPELINE.md` updated with link to this ticket **Done** status

---

## Implementation phases (execution order)

### P0 (ship first)

1. `types.ts` + `content/products/*` seeds + registry  
2. `etsy-metadata-generator.ts` + tests for 13 tags + title length  
3. `instructions-generator.ts` (MD + HTML + TXT fallback)  
4. `package-product.ts` + `output/` gitignore  
5. `product-builder.ts` skeleton **without** Canva export (mark step SKIPPED)  
6. `scripts/products/build-product.ts` + npm scripts  

### P1

7. `CanvaService` list + export when token + scopes available; integrate into builder  
8. `EtsyService` + wire `create-draft`  
9. `build-all-products` + `create-draft` single product  

### P2

10. PDF instructions (if lightweight dep approved)  
11. Etsy listing file upload API (when permissions confirmed)  
12. Preview collage / admin local preview page  

---

## References in this repo (do not duplicate logic blindly)

| Existing | Use for |
|----------|---------|
| `src/lib/canva/oauth.ts` | URLs, env parsing |
| `src/app/api/canva/list-designs/route.ts` | Request shape |
| `src/lib/etsy/tokens.ts`, `oauth.ts` | Token patterns |
| `scripts/create-etsy-draft-listings.mjs` | Etsy API draft payload |
| `imports/npa-manifests-and-spec/*.json` | Optional future: map `DigitalProductConfig` → delivery manifest |

---

## Estimates

- P0: 2–4 dev days  
- P1: 2–3 dev days (export + Etsy depends on API trial)  
- P2: iterative  

---

**End of implementation ticket**
