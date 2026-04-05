# No Prior Authorization (NPA)

**No Prior Authorization** is Danielle Alcala’s med-spa education brand—built from **Hello Gorgeous Med Spa** (Oswego, IL). This monorepo powers **[nopriorauthorization.com](https://nopriorauthorization.com)**: the **digital product shop** (cheat sheets, playbooks, consent-style HTML, peptide and GLP-1 resources), **free lead magnets**, marketing and SEO pages, **email automation**, and deeper **app / vault** experiences for members.

---

## What this app does today

| Area | Description |
|------|-------------|
| **Shop** | `/shop` — large catalog of instant-download assets (mostly HTML templates under `public/forms/`). Checkout uses **Square** (`/api/shop/checkout`, Square webhooks for fulfillment). |
| **Free template pack** | `/free-templates` — name + email capture; `/free-templates/downloads` — stable download hub. Ten files are defined in [`src/config/free-templates-lead-magnet.config.ts`](src/config/free-templates-lead-magnet.config.ts) (clinical freebies, premium patient handouts, retail/intake tools, and the **Vault Roadmap** cheat sheet that maps freebies → paid shop SKUs). |
| **Leads & email** | `POST /api/leads/free-templates` upserts into Prisma **`Lead`** (`leads` table), sends delivery via **Resend**, and schedules nurture sends processed by the same cron as the legacy funnel. `GET /api/leads/unsubscribe?token=` opts out. |
| **7-step marketing funnel** | Separate subscriber flow configured in [`src/config/email-funnel.config.ts`](src/config/email-funnel.config.ts); advanced by `/api/cron/email-funnel` (Bearer `CRON_SECRET`). |
| **Homepage hero** | Video **avatar strip** (founder + mascots) — trust and positioning; see [Hero Avatar System](#hero-avatar-system-v1) below. |
| **Auth** | **NextAuth** for protected app routes. |
| **Data** | **Prisma** + **PostgreSQL** (commonly **Supabase**). `postbuild` syncs delivery manifests into the DB when `DATABASE_URL` is set (e.g. Vercel). |

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
