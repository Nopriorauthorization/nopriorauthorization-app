# No Prior Authorization (NPA)

**No Prior Authorization** is Danielle Alcala’s med-spa education brand—built from **Hello Gorgeous Med Spa** (Oswego, IL). This monorepo powers **[nopriorauthorization.com](https://nopriorauthorization.com)**: the **digital product shop** (cheat sheets, playbooks, consent-style HTML, peptide and GLP-1 resources), **free lead magnets**, marketing and SEO pages, **email automation**, and deeper **app / vault** experiences for members.

---

## Custom-built for what you actually need

Most template shops stop at “here’s the same file everyone else bought.” **That is not the ceiling here.**

The shop is the **library**—fast wins, proven layouts, and price points that respect solo injectors. The differentiator is **custom work scoped to *your* practice**: your state and scope rules, your service menu, your peptide or weight-loss program, your brand voice, your photo zones, and the gaps nothing off-the-shelf fixes. You get artifacts that fit **your** charting, **your** consent workflow, and **your** front desk—not a generic PDF that still says “insert practice name.”

That combination—**operator-built defaults** plus **built-for-you deliverables**—is what separates NPA from volume marketplaces. If you need something that does not exist in the catalog yet, that is the lane.

**On the website:** [nopriorauthorization.com/custom](https://nopriorauthorization.com/custom) explains the offer and links to contact. **Start a conversation:** [nopriorauthorization.com/contact](https://nopriorauthorization.com/contact) — brief your specialty, state, and what you wish you had on paper tomorrow (start the message with `Custom build:`).

---

## What this app does today

| Area | Description |
|------|-------------|
| **Shop** | `/shop` — large catalog of instant-download assets (mostly HTML templates under `public/forms/`). Checkout uses **Square** (`/api/shop/checkout`, Square webhooks for fulfillment). Optional **configurable product funnels** (bumps, post-purchase upsells, analytics) — see [Shop product funnels](#shop-product-funnels-configurable) below. |
| **Free template pack** | `/free-templates` — name + email capture; `/free-templates/downloads` — stable download hub. Ten files are defined in [`src/config/free-templates-lead-magnet.config.ts`](src/config/free-templates-lead-magnet.config.ts). **Lead-off file (Eric):** `public/forms/NPA-Free-Treatment-Guide-Cheat-Sheet.html` — not the skin analysis sheet. The standalone skin analysis lead magnet (`/shop/free/skin-analysis-cheat-sheet`) still uses `NPA-Skin-Analysis-Free-Cheat-Sheet.html` via signed `/api/shop/lead-magnet` links. |
| **Leads & email** | `POST /api/leads/free-templates` upserts into Prisma **`Lead`** (`leads` table), sends delivery via **Resend**, and schedules nurture sends processed by the same cron as the legacy funnel. `GET /api/leads/unsubscribe?token=` opts out. |
| **7-step marketing funnel** | Separate subscriber flow configured in [`src/config/email-funnel.config.ts`](src/config/email-funnel.config.ts); advanced by `/api/cron/email-funnel` (Bearer `CRON_SECRET`). |
| **Homepage hero** | Video **avatar strip** (founder + mascots) — trust and positioning; see [Hero Avatar System](#hero-avatar-system-v1) below. |
| **Auth** | **NextAuth** for protected app routes. |
| **Data** | **Prisma** + **PostgreSQL** (commonly **Supabase**). `postbuild` syncs delivery manifests into the DB when `DATABASE_URL` is set (e.g. Vercel). |
| **Custom builds** | Marketing page [`/custom`](https://nopriorauthorization.com/custom); inquiries via [`/contact`](https://nopriorauthorization.com/contact). See [Custom-built for what you actually need](#custom-built-for-what-you-actually-need) above. |

---

## Shop product funnels (configurable)

This repo includes a **per-product (or per-category) checkout funnel** you control from **Admin → Shop funnels** (`/admin/product-funnels`). It layers on top of the existing Square shop flow without replacing it.

### What you built

| Piece | What it does |
|--------|----------------|
| **Pre-checkout landing** | Optional dedicated page at `/shop/[slug]/funnel` when the funnel is **enabled** and **Dedicated pre-checkout landing** is on. Shoppers pick **order bumps** (up to 3 SKUs) before email + Square. |
| **Single Square charge** | Main product + selected bumps are one **quick-pay** total. The payment note encodes all SKUs (`npa:multi:slug1|slug2…`) so the **Square webhook** can create **one `Purchase` + delivery email per SKU** and split revenue by catalog price ratio. |
| **Post-purchase upsells** | Up to **two** upsell SKUs in **admin-defined order** on `/shop/post-purchase?p=…`. Shown as steps on one page (no full reload between steps). Falls back to [`post-purchase-upsell.config.ts`](src/config/post-purchase-upsell.config.ts) when no funnel upsells are set. |
| **Final redirect** | After payment, Square can send buyers to the post-purchase flow, **`/shop/thank-you`**, or **`/membership`** depending on funnel settings and whether post-upsells are configured. |
| **Resolution rules** | **Product-specific** funnel row wins; else **category default**; else legacy behavior (no funnel). |
| **Tracking** | Client events → `POST /api/funnel/track` → **`FunnelAnalyticsEvent`** (step, session id, optional revenue). Webhook records **`payment_complete`** when it can tie a payment to a **`CheckoutAttempt`** with `funnelSessionId`. Admin: **Load funnel analytics** on the same admin page. |

**Data model (Prisma):** `ShopProductFunnel`, `FunnelAnalyticsEvent`, and extra fields on `CheckoutAttempt` (`funnelSessionId`, `selectedBumpSlugs`). Migration: `prisma/migrations/20260411120000_shop_product_funnel/`.

**Public APIs:** `GET /api/shop/funnel-config/[slug]` (read-only config for a SKU), `POST /api/funnel/track` (analytics).

### Why it matters (benefits)

1. **Higher average order value** — Order bumps are optional add-ons in one checkout; no second “go find another product” step.
2. **Controlled merchandising** — You assign bumps and upsells per product or per category default, reorder post-upsells, and turn a funnel on or off without code deploys.
3. **Smoother UX** — Funnel landing and post-purchase steps are mobile-friendly; post-upsell steps use client state instead of full page reloads between offers.
4. **Measurable funnel** — Step events, bump selection metadata, upsell accept/decline, and payment attribution give you material for conversion and attach-rate analysis (export/query via `FunnelAnalyticsEvent` or the admin analytics loader).
5. **Cart abandonment still works** — `CheckoutAttempt` remains the source of truth; resume links go to `/shop/[slug]/funnel` when a funnel session id was stored on the attempt.

### Operating notes

- **First-time setup:** Run migrations so `ShopProductFunnel` and related columns exist (`npm run db:migrate:local` or `npx prisma migrate deploy` with `DATABASE_URL` set).
- **Existing databases** that already contained tables from `db push` may need `prisma migrate resolve --applied …` for older migrations before deploy; see [Database & migrations](#database--migrations).
- **No funnel rows in DB** → behavior matches the classic shop (single product page checkout, config-driven post-upsell only).

---

## Tech stack

- **Next.js 14** (App Router), **React 18**, **TypeScript**, **Tailwind CSS**
- **Prisma 5** ORM
- **Resend** (transactional + funnel email)
- **Square** (shop checkout + webhooks)
- **Vitest** for tests
- **Vercel** deployment; cron jobs in [`vercel.json`](vercel.json)

---

## Local development

```bash
npm install
cp .env.example .env.local
# Fill DATABASE_URL, NextAuth, Square, Resend, CRON_SECRET, etc. — see .env.example

npm run db:generate:local   # Prisma client (loads .env.local via scripts/prisma-with-env.cjs)
npm run dev               # http://localhost:3000
```

**Prisma note:** Prisma CLI does not load `.env.local` by default. Use `npm run db:*:local` wrappers, or put `DATABASE_URL` in `.env`.

```bash
npm run build             # prisma generate + next build + postbuild (manifests + sitemap)
npm run lint
npm test                  # vitest
```

---

## Environment variables

Authoritative list and comments: **[`.env.example`](.env.example)**.

**Commonly required for production-like behavior:**

- `DATABASE_URL` — Postgres (Supabase pooler URL is fine)
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `SQUARE_APPLICATION_ID`, `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_WEBHOOK_SIGNATURE_KEY`, `SQUARE_ENVIRONMENT`
- `RESEND_API_KEY`, `EMAIL_FROM` (verified domain)
- `CRON_SECRET` — Vercel cron + protected cron routes

Optional: Supabase storage keys, Facebook posting, Etsy/Canva pipeline keys, Stripe (legacy scripts), Anthropic/OpenAI, etc.

---

## Database & migrations

- Apply schema: `npx prisma migrate deploy` (or `npm run db:migrate:local` with env loaded).
- The **`leads`** table supports the free-templates flow. If your database was created with `db push` only and lacks `_prisma_migrations`, use the reconciler SQL:  
  [`prisma/migrations/20260406120000_leads/supabase-reconcile.sql`](prisma/migrations/20260406120000_leads/supabase-reconcile.sql)  
  (creates `leads` + migration history safely).  
- CLI-only alternative after DDL: `npm run db:migrate:resolve:leads`.

---

## Deploy

- **Git → Vercel** auto-deploys on push to the connected branch.
- **Manual / full check:** `npm run deploy` runs navigation `tsc`, `npm run build`, and `npx vercel --prod` (see [`deploy.sh`](deploy.sh)).
- Ensure **Vercel env vars** match `.env.example` for email, Square, DB, and cron.
- **Crons:** `/api/cron/email-funnel` (hourly), `/api/cron/publish-scheduled-posts` (per [`vercel.json`](vercel.json)).

---

## Useful npm scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next dev server |
| `npm run deploy` | Pre-checks, build, Vercel production |
| `npm run email:test-resend` | Smoke-test Resend + `EMAIL_FROM` |
| `npm run db:studio:local` | Prisma Studio with `.env.local` |
| `npm run catalog:rebuild` | Regenerate shop/catalog artifacts (see script) |
| `npm run delivery:sync-db` | Sync delivery manifests (also in postbuild) |

Full list: [`package.json`](package.json).

---

## Repository layout (short)

```
src/app/           # Routes: marketing, shop, free-templates, api/*, admin, etc.
src/lib/shop/    # Products, checkout helpers, pricing
src/lib/leads/   # Free-templates signup, nurture, delivery email builders
src/config/      # free-templates pack, email-funnel steps
public/forms/    # Downloadable HTML templates (shop + free pack)
prisma/          # schema.prisma, migrations
docs/            # Runbooks, pipeline tickets, deployment notes
```

---

## Hero Avatar System (V1)

The homepage **Hero** introduces NPA through short video intros (founder + domain mascots). It is a **trust and conversion** surface—not decorative.

**Rules (summary):** muted autoplay; subtitles on by default; tap toggles audio; one voice at a time; CTAs like “Ask [Name]”. **Do not burn captions into video** — UI renders subtitles for accessibility and A/B flexibility.

**Media location (swap by filename only):**

```
public/hero/avatars/
  founder.mp4
  beau-tox.mp4
  peppi.mp4
  f-ill.mp4
  rn-lisa-grace.mp4
  slim-t.mp4
  ryan.mp4
```

Optional **WebM** variants for performance. **Scripts and tone** are source-of-truth copy—do not improvise without approval.

---

## Internal: digital product pipeline (Etsy + Canva)

- Gap analysis and build status: **[docs/PRODUCT_AUTOMATION_PIPELINE.md](./docs/PRODUCT_AUTOMATION_PIPELINE.md)**
- Next implementation ticket: **[docs/TICKET-PIPELINE-IMPLEMENTATION-NEXT.md](./docs/TICKET-PIPELINE-IMPLEMENTATION-NEXT.md)**

---

## License / content

Private repository. Downloadable templates are for licensed purchasers or approved free-pack subscribers; medical and legal review is the buyer’s responsibility unless otherwise stated on each asset.
