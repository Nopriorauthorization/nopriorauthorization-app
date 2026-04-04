# Dev ticket: Delivery email end-to-end verification (production)

**Goal:** Confirm Square webhook → delivery email → `/delivery/{token}` → file/Canva access works on the live site.

---

## 1 — Square Dashboard (manual)

- [ ] Webhook subscribed to **`payment.completed`**
- [ ] Webhook URL is **exactly:** `https://nopriorauthorization.com/api/square/webhook`
- [ ] **Signing key** copied into Vercel as **`SQUARE_WEBHOOK_SIGNATURE_KEY`** (must match the key for that subscription)

Code expects the notification URL string to match env: see `SQUARE_WEBHOOK_URL` in `src/app/api/square/webhook/route.ts`.

---

## 2 — Vercel environment variables

**Square (minimum)**

| Variable | Example / note |
|----------|----------------|
| `SQUARE_ACCESS_TOKEN` | Production access token |
| `SQUARE_LOCATION_ID` | Target location |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | From webhook subscription |
| `SQUARE_WEBHOOK_URL` | `https://nopriorauthorization.com/api/square/webhook` (must match dashboard URL exactly) |

**App / delivery**

| Variable | Note |
|----------|------|
| `NEXTAUTH_URL` | `https://nopriorauthorization.com` (used for links in delivery email) |
| `DELIVERY_TOKEN_SECRET` | Preferred for signing tokens; if unset, **`NEXTAUTH_SECRET`** is used (`src/lib/delivery/token.ts`) |

**Email (required for send)**

| Variable | Note |
|----------|------|
| `RESEND_API_KEY` | Without this, `sendEmail` returns “Email service not configured” (`src/lib/email.ts`) |
| `EMAIL_FROM` | Optional; default `noreply@nopriorauthorization.com` — **domain must be verified in Resend** |

**Database**

| Variable | Note |
|----------|------|
| `DATABASE_URL` | Prisma / Supabase Postgres — required for `Purchase` rows |

---

## 3 — Email provider (Resend)

- [ ] **`sendEmail`** uses Resend when `RESEND_API_KEY` is set (`src/lib/email.ts`).
- [ ] **`EMAIL_FROM`** (or the default from address) is **verified** in the Resend dashboard.
- [ ] Delivery HTML: **`generateDeliveryEmail`** in `src/lib/email/delivery-email.ts` — includes **product title**, **price**, and CTA to **`deliveryUrl`** (full URL with token).
- [ ] Square webhook subject: `Your ${productTitle} is ready!` (`src/app/api/square/webhook/route.ts`).

---

## 4 — Database (`Purchase` model)

Prisma model: `prisma/schema.prisma` → **`Purchase`**.

**Columns to verify (names differ from informal “buyerEmail” wording):**

| Prisma field | Purpose |
|--------------|---------|
| `customerEmail` | Buyer email (not `buyerEmail`) |
| `productSlug` | From `npa:{slug}` in payment note |
| `productTitle` | Resolved from shop catalog when possible |
| `deliveryToken` | Signed token for `/delivery/{token}` |
| `stripeSessionId` | **Unique** idempotency key; for Square: `sq_{paymentId}` |
| `stripePaymentId` | Square payment id |
| `amountPaid` | Integer **cents** (not a column named `amount`) |
| `deliveryEmailSent` / `deliveryEmailAt` | Set after successful send |

- [ ] Migrations / `prisma db push` applied on the **production** database Vercel uses.

---

## 5 — Live end-to-end test

- [ ] Buy **one real** product on `https://nopriorauthorization.com/shop/...` with production Square.
- [ ] **`/shop/thank-you`** shows a **Square transaction ID** (or fallback id from redirect params).
- [ ] **Delivery email** arrives within ~2 minutes (webhook + Resend latency).
- [ ] Link opens **`/delivery/{token}`** and lists the **correct product** and template count.
- [ ] Each **View & Print** / **Open in Canva** (or gated `/api/delivery/html?...`) works.

---

## 6 — Failure recovery

- [ ] **`POST /api/admin/purchases/resend`** — requires **admin session** (`getAdminUser`). Body: `{ "purchaseId": "<cuid>" }`. Reuses `deliveryToken` and `generateDeliveryEmail`.

If email failed but webhook ran, a `Purchase` row should still exist; resend after fixing Resend/config.

---

## Copy for Anthony

> Can you confirm the **FROM** address in Resend is verified and that **`RESEND_API_KEY`** (and **`EMAIL_FROM`** if you use it) are set in **production** on Vercel?  
> Please run **one live test purchase** on the real site and confirm the full chain: **payment → webhook → email → delivery page → file/Canva access**.  
> Report back on any step that fails (thank-you params, inbox, token page, or template links). A single purchase usually shows exactly where it breaks.

---

## Reference

- Webhook: `src/app/api/square/webhook/route.ts`
- Checkout: `src/app/api/shop/checkout/route.ts`, `src/lib/square/client.ts`
- Thank-you: `src/app/shop/thank-you/page.tsx`
- Delivery page: `src/app/delivery/[token]/page.tsx`
- Resend: `src/lib/email.ts`
- Checklist (overlap): `docs/shop-square-delivery.md`
