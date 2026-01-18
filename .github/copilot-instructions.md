# No Prior Authorization — AI Copilot Instructions

## Project Overview
Next.js 14 app delivering aesthetic treatment education through AI-powered mascot experts. Each mascot (Beau-Tox, Peppi, Slim-T, etc.) has a unique personality and domain expertise, serving both consumers and healthcare providers.

## Architecture & Data Flow

### Mascot System (Core Concept)
- **Mascots are domain experts**, not generic chatbots — each has a unique `systemPrompt`, `temperature`, and knowledge library
- Mascot configs live in [`src/lib/ai/mascotPrompts.ts`](src/lib/ai/mascotPrompts.ts) — central source of truth for personality/behavior
- Content libraries are JSON files in [`src/content/mascots/`](src/content/mascots/) (e.g., `beau-tox.json`) with embeddings for semantic search
- Chat flow: `api/[mascot]/route.ts` → `generateChatResponse()` → mascot routing → library retrieval → OpenAI response

### User Memory & Context
- Anonymous users get a `anonId` (UUID) stored in localStorage; authenticated users use `userId`
- Memory tracked in [`UserMemory`](prisma/schema.prisma) table with goals, preferences, and topic history
- See [`src/lib/memory/userMemory.ts`](src/lib/memory/userMemory.ts) for extraction patterns (e.g., "my goal is X")

### Dual-Mode Architecture
- **Consumer mode**: Chat with mascots, build treatment history, export provider packets
- **Provider mode**: Embed widgets, track analytics, share patient education tools
- Mode switching via [`AppModeProvider`](src/components/layout/app-mode-provider.tsx) (`localStorage` + React Context)

### Provider Packet (Key Feature)
- Exports user's treatment history, supplements, and governance data (allergies, goals) for providers
- Generated in [`api/provider-packet/route.ts`](src/app/api/provider-packet/route.ts) from Prisma models
- Shareable via token-based links with revocation support

## Critical Conventions

### Mascot Development
1. New mascot = 3 files: add to `MASCOT_CONFIGS` (prompts), create JSON library (content), add API route
2. Always use tier-gated content (`free` vs `premium`) — see [`library.ts`](src/lib/ai/library.ts) for retrieval logic
3. Safety guardrails in [`safety.ts`](src/lib/ai/safety.ts) — no dosing, no diagnosis, always defer to consultation
4. Mascot routing uses embeddings to suggest correct expert if user asks off-topic question

### Database Patterns
- Use `prisma.userMemory.upsert()` for memory updates — supports both `userId` and `anonId` paths
- Cascade deletes configured on User model — safe to delete users
- `subscriptionTier` on User determines library access: `"beginner"` (free) or `"premium"`

### Authentication & Middleware
- NextAuth v4 with credential provider ([`auth-options.ts`](src/lib/auth/auth-options.ts))
- Public routes exempt from auth: `/chat`, `/api/[mascot]`, `/login`, `/signup`, etc. (see [`middleware.ts`](middleware.ts))
- `INTERNAL_ACCESS_BYPASS=true` env var disables auth for local dev

### Subscription & Billing
- Stripe integration: checkout sessions, webhooks, customer portal
- Webhook handler at [`api/stripe/webhook/route.ts`](src/app/api/stripe/webhook/route.ts) — excluded from auth middleware
- Tier changes update both `User.subscriptionTier` and `Subscription.tier`

## Commands & Workflows

```bash
# Development
npm run dev                    # Start dev server (default: localhost:3000)

# Database
npm run db:generate            # Generate Prisma client after schema changes
npm run db:push                # Push schema to database (no migration files)
npm run db:studio              # Open Prisma Studio GUI

# Embeddings
npm run embeddings:build       # Generate/update embeddings for mascot content libraries

# Build
npm run build                  # Prisma generate + Next.js build
```

## Environment Variables
Required: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`

Optional: `INTERNAL_ACCESS_BYPASS=true` (skip auth locally), `ANTHROPIC_API_KEY` (if using Claude models)

## Code Patterns

### API Routes
- Use `getServerSession(authOptions)` for protected routes — see [`provider-packet/route.ts`](src/app/api/provider-packet/route.ts)
- Return `NextResponse.json()` with proper status codes (401, 400, 500)
- Error messages should be user-friendly, never expose internals

### Component Structure
- Client components use `"use client"` directive (e.g., chat interfaces, mode switchers)
- Server components fetch data directly with Prisma — no API calls needed
- Hero avatar system uses media-swappable paths: `/public/hero/avatars/[mascot].mp4`

### Type Safety
- Mascot IDs are literal union type — enforce via `MascotId` from [`mascots.ts`](src/lib/mascots.ts)
- Subscription tiers: `"beginner" | "premium"` (do not use "free")
- Treatment status enum: `"current" | "past" | "considering"` (see [`types/storyboard.ts`](src/types/storyboard.ts))

## Key Files Reference
- [`src/lib/ai/generateChatResponse.ts`](src/lib/ai/generateChatResponse.ts) — Main chat orchestration
- [`src/lib/ai/library.ts`](src/lib/ai/library.ts) — Semantic search over mascot content
- [`prisma/schema.prisma`](prisma/schema.prisma) — Database schema (User, Subscription, UserMemory, etc.)
- [`README.md`](README.md) — Hero Avatar System V1 spec (positioning, file structure, subtitle rules)

## Medical/Legal Constraints
- Never provide dosing, injection sites, or treatment plans
- All responses include disclaimer: "This is educational information only, not medical advice."
- Safety responses trigger for dangerous queries (see `needsSafetyResponse()` patterns)
