# Email funnel — launch validation

## 1. Migration

**Name:** `20260404220000_email_funnel`

```bash
# Production / any environment with DATABASE_URL
npx prisma migrate deploy
```

## 2. Production env (Vercel)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres (required for funnel tables) |
| `RESEND_API_KEY` | Send transactional + funnel mail |
| `EMAIL_FROM` | Verified sender, e.g. `NPA <hello@yourdomain.com>` |
| `CRON_SECRET` | Bearer for Vercel crons |
| `EMAIL_FUNNEL_EVENTS_SECRET` | Bearer for `POST /api/email-funnel/tag-member` |
| `RESEND_WEBHOOK_SECRET` | Svix signing secret from Resend webhook settings (**required** when `VERCEL_ENV=production` on `/api/webhooks/resend`) |
| `NEXTAUTH_URL` | Canonical site URL (unsubscribe redirects, email links) |

## 3. Vercel cron

- Config: `vercel.json` → `/api/cron/email-funnel` at `0 * * * *`.
- **Proof:** Vercel → Project → Logs → filter path `cron/email-funnel` or **Cron Jobs** tab → last run status `200`.

Manual smoke (replace secrets/URLs):

```bash
curl -sS -H "Authorization: Bearer $CRON_SECRET" \
  "https://nopriorauthorization.com/api/cron/email-funnel"
```

Expect JSON: `{ "ok": true, "processed": N, "sent": M, "errors": 0 }` (values vary).

## 4. Resend webhook

- Dashboard → Webhooks → URL: `https://nopriorauthorization.com/api/webhooks/resend`
- Events: at minimum `email.opened`, `email.clicked`
- Copy **Signing secret** → `RESEND_WEBHOOK_SECRET` in Vercel

## 5. End-to-end QA (real inbox)

1. **Subscribe:** `POST /api/shop/subscribe` with `{ "email": "you+test@domain.com", "source": "sticky_bar" }`
2. **Step 1:** Confirm delivery email; in DB `EmailFunnelSubscriber.lastSentStep = 1`, `nextSendAt` ≈ now + `delivery.daysUntilNext` from config.
3. **Advance cron:** Set `nextSendAt` to the past for that row (SQL or Prisma Studio), then run cron GET (above) or wait for hourly run.
4. **Step 2:** Confirm second email; `lastSentStep = 2`; new `EmailFunnelSend` row.
5. **Unsubscribe:** Open link from footer → `/?funnel_unsub=ok`; row has `unsubscribedAt`, `stopReason = unsubscribed`.
6. **Purchase stop:** Complete a test Square/Stripe checkout with same email → `stopReason` buyer (or `growth_system_buyer` for Growth System slug); `nextSendAt` null.
7. **Member stop:** `curl -X POST -H "Authorization: Bearer $EMAIL_FUNNEL_EVENTS_SECRET" -H "Content-Type: application/json" -d '{"email":"you+test@domain.com"}' https://nopriorauthorization.com/api/email-funnel/tag-member` → `stopReason = member`.

## 6. Remaining risks

- **At-least-once webhooks:** duplicate `svix-id` deliveries can duplicate analytics rows; optional dedupe table later.
- **Opens/clicks:** Resend must record `email_id` matching `EmailFunnelSend.resendEmailId` (depends on Resend API returning id on send — already stored).
- **Cron drift:** hourly granularity; shorten schedule in `vercel.json` only if needed (Vercel plan limits).
- **Re-subscribe after buy:** Funnel does not restart for `buyer` / `growth_system_buyer` / `member` (by design).
