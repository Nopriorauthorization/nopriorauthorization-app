# Etsy + Canva API — Product Automation Pipeline (DEV TICKET)

**Status:** Spec + gap analysis (this document)  
**Last updated:** 2026-04-01  

**Next implementation ticket (build-ready):** [TICKET-PIPELINE-IMPLEMENTATION-NEXT.md](./TICKET-PIPELINE-IMPLEMENTATION-NEXT.md)

This file stores the original internal ticket and records **what the repo already implements** versus **what is still to build** for the unified “product automation engine.”

---

## At a glance

| Topic | Answer |
|-------|--------|
| **What already exists** | Canva OAuth + list/match designs; Etsy OAuth + DB tokens + draft script; JSON manifests + `catalog.generated.json`; HTML `/public/forms` delivery; admin import/library/sync; scattered npm scripts (`delivery:import`, `store:*`, etc.). See **Full ticket: deliverables checklist** and **What we already have**. |
| **What is still missing** | Unified `DigitalProductConfig`; `canva.service` / `etsy.service` modules; single `product-builder` writing `/output/{slug}/`; metadata generator (13 tags + guardrails); instructions + ZIP packager; `pnpm product:build*`. See **Gap summary**. |
| **Exact gap to the one-command pipeline** | One orchestrator (`product-builder`) + CLI that: loads a **typed config** → writes **listing.json** + **instructions** → (optional) Canva **exports** → **ZIP** → optional **Etsy draft** — with a **build manifest** per run. Today those steps exist only as **separate** scripts and JSON files, not one command or one output folder contract. |
| **Definition of done (target pipeline)** | From a seed config: `pnpm product:build <slug>` produces `output/{slug}/manifest.json`, `listing.json`, `delivery/*`, `archives/{slug}.zip`, and logs per-step success/failure; optional `product:create-draft` does not wipe artifacts on Etsy errors. |

---

## Original objective (ticket summary)

Build a **production-ready internal pipeline** to create, package, and prepare digital template products for Etsy using the Etsy developer account, Canva API integration, and Cursor-based development.

**Target flow:** define a product once in structured config → generate Canva assets, Etsy metadata, previews, buyer delivery files, instructions, ZIP, optional Etsy draft.

**V1 focus:** internal generation, packaging, listing prep — **not** a public customer dashboard.

**Non-goals:** public storefront UI, customer login, post-purchase portals, bulk marketplace beyond Etsy, advanced AI workflows.

---

## Full ticket: deliverables checklist

| # | Deliverable | Status in repo |
|---|-------------|----------------|
| 1 | **Product definition system** (`DigitalProductConfig`, add configs by file) | **Partial** — manifests are JSON in `imports/npa-manifests-and-spec/` and Etsy copy in `etsy-products/store-launch/listings/listing-definitions.json`; **no** unified TS type or `content/products/*.ts` seeds (`npa-appeal-kit`, etc.) |
| 2 | **Canva service** `lib/integrations/canva/canva.service.ts` + `types.ts` | **Not built** — OAuth + URL helpers live in `src/lib/canva/oauth.ts`; API routes under `src/app/api/canva/*` (list-designs, match-manifests, …). **No** export/download/polling service layer |
| 3 | **Etsy service** `lib/integrations/etsy/etsy.service.ts` + `types.ts` | **Not built** — OAuth + DB tokens in `src/lib/etsy/oauth.ts`, `src/lib/etsy/tokens.ts`; draft script `scripts/create-etsy-draft-listings.mjs`. **No** typed service abstraction for create/update/upload |
| 4 | **Product builder pipeline** `lib/products/product-builder.ts` | **Not built** — related scripts exist (see below) but **no** single orchestrator producing `/output/{slug}/manifest.json`, `listing.json`, `previews/`, `delivery/`, `archives/*.zip` |
| 5 | **Listing / SEO metadata generator** `lib/products/etsy-metadata-generator.ts` | **Not built** — copy lives in `listing-definitions.json` and markdown listing files; **no** enforced 13-tag generator, title-length guardrails module, or central compliance block |
| 6 | **Instructions generator** `lib/products/instructions-generator.ts` | **Not built** — delivery pages describe HTML/Canva in-app; **no** standard MD/HTML/PDF buyer instructions generator |
| 7 | **ZIP packaging** `lib/products/package-product.ts` | **Not built** — **no** assembler that zips buyer-facing exports only with validation |
| 8 | **CLI scripts** `pnpm product:build`, `product:build-all`, `product:create-draft` | **Not built** — see **Existing scripts** below for what exists instead |
| 9 | **Admin/debug logging** for pipeline steps | **Partial** — script console logs; **no** unified build manifest per product under `/output` |
| 10 | **Env + docs** | **Partial** — `.env.example` documents Canva, Etsy, delivery keys; **no** `PRODUCT_OUTPUT_DIR` or full pipeline env block |

---

## What we already have (inventory)

### Canva

- OAuth (PKCE), authorize/callback routes, tokens in cookies (`src/app/api/canva/*`).
- `design:meta:read`: **list designs** (`/api/canva/list-designs`), profile, capabilities, status, reset.
- **Match manifests** route (`/api/canva/match-manifests`) + scripts (`scripts/canva-auto-fill-manifests.mjs`, `start-store-build.mjs`, etc.).
- **Not implemented:** `design:content:write`, **export** endpoints, async export polling, file download pipeline, `canva.service.ts`.

### Etsy

- OAuth callback, **tokens in database** (`src/lib/etsy/tokens.ts`), `/api/etsy/status`, `/api/etsy/shops`, `/api/etsy/auth`.
- **`scripts/create-etsy-draft-listings.mjs`**: reads `listing-definitions.json`, creates draft listings (DB token or `.env.local`).
- **Not implemented:** dedicated `etsy.service.ts`, listing update API wrapper, digital file upload to Etsy listing (structured stub only).

### Product / delivery data

- **Delivery manifests:** `imports/npa-manifests-and-spec/*.json` — `productId`, `displayName`, `templates[]`, `canvaTemplateUrl` (Canva **or** `/forms/*.html`).
- **Generated catalog:** `src/lib/delivery/catalog.generated.json` via `scripts/import-canva-delivery-manifests.mjs`.
- **Buyer delivery:** tokenized `/delivery/[token]`, issue API with `DELIVERY_ADMIN_KEY`.
- **HTML forms:** `public/forms/` for Path B delivery.
- **Store launch copy:** `etsy-products/store-launch/listings/listing-definitions.json`, markdown listings, assets.

### Scripts (related but not the unified “product:build”)

| Script / npm | Purpose |
|--------------|---------|
| `delivery:import` | Regenerate `catalog.generated.json` from manifests + Canva output dir |
| `delivery:sync-db` | Push manifests to DB (local `--force` / Vercel postbuild) |
| `store:build`, `store:apply`, `store:sync`, `store:fill` | Store build / CSV sync / Canva fill |
| `fill-html-form-urls.mjs` | Map template IDs → `/forms/` URLs |
| `generate-med-spa-legal-bundle.mjs` | Generate legal HTML + manifest |
| `create-etsy-draft-listings.mjs` | Etsy draft listings from definitions |
| `issue-delivery-link.mjs` | Issue delivery URL |

### Admin (internal)

- `/admin/import` — manifest import UI + **Sync from repository**
- `/admin/library` — browse all manifest products, templates, HTML/Canva links
- `/api/admin/sync-delivery-manifests` — bulk sync manifests to DB

---

## Gap summary (what we do **not** have yet)

1. **Unified `DigitalProductConfig`** and `content/products/` seed files (`npa-appeal-kit`, `npa-checklist-bundle`, `npa-intake-template-pack`).
2. **`lib/integrations/canva/`** and **`lib/integrations/etsy/`** service layers (typed, testable, shared logging).
3. **End-to-end `product-builder`** producing **`/output/{slug}/`** with `manifest.json`, `listing.json`, `previews/`, `delivery/`, `archives/*.zip`.
4. **`etsy-metadata-generator`** with **13 tags**, title length limits, **central compliance guardrails** (no medical/legal guarantees).
5. **`instructions-generator`** (MD/HTML + optional PDF) and **`package-product`** ZIP validation.
6. **`pnpm product:build` / `product:build-all` / `product:create-draft`** as single entrypoints (can wrap or replace scattered scripts).
7. **Canva export** of PNG/PDF for previews and buyer package (requires API scope + implementation).
8. **Optional:** preview collage, local admin page for build artifacts, build status badges — listed as P2/nice-to-have in ticket.

---

## Recommended implementation order (from ticket)

| Priority | Item | Notes |
|----------|------|--------|
| P0 | Product config system + types | Align with existing JSON manifests or migrate gradually |
| P0 | Canva service (wrap existing OAuth + add export when scopes ready) | Start as facade over current `oauth.ts` + fetch helpers |
| P0 | Product builder + packaging + CLI | Orchestrate existing scripts first, then replace internals |
| P0 | Etsy metadata generator | Feed `listing-definitions.json` shape for compatibility |
| P1 | Etsy draft via service + PDF instructions | Extend `create-etsy-draft-listings.mjs` patterns |
| P2 | Digital file upload, collages, admin preview UI | After V1 stable |

---

## Environment variables (current vs ticket)

**Already in `.env.example`:** `DATABASE_URL`, NextAuth, Stripe, `ETSY_API_KEYSTRING`, `ETSY_API_SHARED_SECRET`, `ETSY_OAUTH_REDIRECT_URI`, `CANVA_*`, `DELIVERY_TOKEN_SECRET`, `DELIVERY_ADMIN_KEY`.

**Ticket also named:** `CANVA_ACCESS_TOKEN`, `ETSY_ACCESS_TOKEN`, `ETSY_REFRESH_TOKEN`, `PRODUCT_OUTPUT_DIR` — use **only** as documented when the pipeline is implemented; tokens today are **OAuth-derived** (Canva cookies / Etsy DB row), not necessarily long-lived env vars.

---

## QA / validation notes (living checklist)

| Area | Tested / working | Pending |
|------|------------------|---------|
| **Product build** | Manifest JSON validation in admin; `catalog.generated.json` generation; DB sync on Vercel | Unified `/output/{slug}` layout; invalid-config unit tests for `DigitalProductConfig` |
| **Canva** | List designs + match with `design:meta:read` | Export PNG/PDF; create copy per buyer (`design:content:write`) |
| **Etsy** | Draft creation script against shop when OAuth + keystring set | Service layer; digital file attach to listing |
| **ZIP / instructions** | N/A | Full ticket QA |

---

## Definition of done (from ticket)

Complete when: config → one command → Canva exports (where applicable) → listing metadata → delivery folder → ZIP → optional Etsy draft → docs + QA notes **for that pipeline**.

**Current repo:** delivers a strong **delivery + listing copy + draft script + admin library** foundation; the **unified automation engine** and **Canva export packaging** remain to be implemented per sections above.

---

## Appendix — proposed types (ticket reference)

```ts
// Target shape — not yet in codebase as a single exported type
type DigitalProductConfig = {
  slug: string;
  internalName: string;
  listingTitleSeed: string;
  brand: "No Prior Authorization" | "Hello Gorgeous";
  category: string;
  audience: string[];
  keywords: string[];
  tagsSeed: string[];
  descriptionSeed: string;
  canvaTemplateIds?: string[];
  canvaDesignStrategy:
    | "use-existing-template"
    | "create-from-template"
    | "export-existing-design";
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

---

## Compliance guardrails (for future metadata generator)

- No explicit regulated **medical claims**; frame as templates / workflow / educational business tools.
- No **legal guarantees**; disclaimers for DIY templates.
- No **deceptive outcome** language; conversion-focused but honest.
- Centralize guardrails in **`etsy-metadata-generator`** when built.
