# Shop checkout & digital delivery (Square)

This document describes how a customer gets from **Buy** to **download links**, and how to **test** the flow end-to-end.

## Flow overview

1. **Product page** — Customer clicks checkout on `/shop/[slug]`. The client calls `POST /api/shop/checkout` with `productSlug`.

2. **Square payment link** — The API creates a Square Online Checkout payment link (`src/lib/square/client.ts` → `createCheckoutLink`). Each link includes:
   - **`payment_note`**: `npa:{productSlug}` — required so the webhook can identify the product.
   - **`checkout_options.redirect_url`**: `{origin}/shop/thank-you` — after payment, Square redirects here with query parameters.

3. **Payment** — Customer completes payment on Square’s hosted page.

4. **Thank-you page** — Browser lands on `/shop/thank-you`. Square typically appends **`transactionId`** (and often `checkoutId`, `orderId`, `referenceId`). The page displays the **Square transaction ID** when `transactionId` is present, with fallbacks for other Square params; **`session_id`** is still supported for legacy Stripe checkouts.

5. **Webhook** — Square sends **`payment.updated`** (when `payment.status` becomes **`COMPLETED`**) to `POST /api/square/webhook`. The handler also accepts legacy **`payment.completed`** if subscribed. See Square’s [Webhook Events Reference](https://developer.squareup.com/docs/webhooks/v2webhook-events-tech-ref) — Payments API lists `payment.created` / `payment.updated`, not `payment.completed`. Code: `src/app/api/square/webhook/route.ts`. The handler:
   - Verifies the HMAC signature when `SQUARE_WEBHOOK_SIGNATURE_KEY` is set (notification URL must match **`SQUARE_WEBHOOK_URL`** exactly).
   - Reads **`buyer_email_address`** and **`payment.note`**, parses `npa:{slug}`.
   - Dedupes using `Purchase.stripeSessionId = sq_{paymentId}`.
   - Issues a signed delivery token (`src/lib/delivery/token.ts`), stores `Purchase`, emails **`{NEXTAUTH_URL}/delivery/{token}`**.

6. **Delivery page** — Customer opens the email link. `/delivery/[token]` verifies the token, loads templates from `catalog.generated.json`, and renders links (public `/forms/...`, gated HTML via `/api/delivery/html?...`, or external Canva URLs).

## Environment variables (checklist)

| Variable | Role |
|----------|------|
| `SQUARE_ACCESS_TOKEN` | Create payment links |
| `SQUARE_LOCATION_ID` | Location for quick pay |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Verify webhook body (omit only for local debugging — not recommended in prod) |
| `SQUARE_WEBHOOK_URL` | Full URL Square signs (e.g. `https://yourdomain.com/api/square/webhook`) — must match dashboard subscription URL |
| `NEXTAUTH_URL` | Base URL for delivery links in email |
| `DELIVERY_TOKEN_SECRET` or `NEXTAUTH_SECRET` | Sign delivery tokens |

Email sending uses your existing mail configuration (`sendEmail`).

## Test checklist

Use **Square Sandbox** first; expose your dev server with a tunnel (e.g. ngrok) so Square can reach the webhook.

### Square Developer Dashboard

- [ ] Webhook subscription points to **`https://<your-host>/api/square/webhook`** (same string as `SQUARE_WEBHOOK_URL` in that environment).
- [ ] Subscription includes **`payment.updated`** (and optionally **`payment.created`**) under Payments — delivery runs when status is **`COMPLETED`**. Legacy **`payment.completed`** is still handled if your app shows it.
- [ ] Sandbox **application** has access token and location ID copied into env for the app you are testing.

### Create checkout & pay

- [ ] From `/shop/<slug>`, click through to Square checkout (no 500 from `/api/shop/checkout`).
- [ ] Complete payment with a **sandbox** card (Square test card numbers).
- [ ] Redirect lands on `/shop/thank-you?...` with at least one of: **`transactionId`**, `checkoutId`, `orderId` (Square may omit some in sandbox — see [Square docs / community](https://developer.squareup.com)).
- [ ] Thank-you page shows **Square transaction ID** (or a fallback label + value).

### Webhook & server logs

- [ ] Logs show `[square/webhook] Event: payment.updated` (or inspect webhook delivery in Square dashboard) and delivery proceeds after **`COMPLETED`**.
- [ ] No `Invalid signature` (401) — if you see this, fix `SQUARE_WEBHOOK_URL` and signature key to match the subscribed URL.
- [ ] No `No buyer email` — ensure checkout collects buyer email (Square payment link default behavior).
- [ ] No persistent `No product slug in payment note` — confirms `payment_note` is `npa:{slug}` on the created link.

### Database

- [ ] New `Purchase` row: `stripeSessionId` like `sq_<paymentId>`, correct `productSlug`, `customerEmail`, `deliveryToken` set.
- [ ] Duplicate webhook retry does **not** create a second purchase (idempotency).

### Email & delivery

- [ ] Buyer receives email with subject like **Your {product} is ready!**
- [ ] Link opens `/delivery/{token}` without “invalid or expired”.
- [ ] Template list matches catalog: correct count, **View & Print** / **Open in Canva** work as expected.

### Failure recovery

- [ ] If email fails, purchase row still exists; use admin **resend delivery** (`/api/admin/purchases/resend` or your admin UI) to resend.

### Production smoke test

- [ ] Repeat with **production** Square credentials on the live domain after deploy.
- [ ] Confirm production webhook URL and env vars match production only (no sandbox token on prod).

## Related files

| Area | Path |
|------|------|
| Checkout API | `src/app/api/shop/checkout/route.ts` |
| Square client | `src/lib/square/client.ts` |
| Webhook | `src/app/api/square/webhook/route.ts` |
| Thank-you | `src/app/shop/thank-you/page.tsx` |
| Delivery UI | `src/app/delivery/[token]/page.tsx` |
| Gated HTML | `src/app/api/delivery/html/route.ts`, `src/lib/delivery/form-access.ts` |
| Catalog | `src/lib/delivery/catalog.generated.json` (regenerated by `node scripts/import-canva-delivery-manifests.mjs`) |
