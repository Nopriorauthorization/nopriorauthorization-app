# Etsy Open API — register your app

Use this when you want programmatic access to your shop (listings, orders, etc.) via [Etsy’s Open API v3](https://developers.etsy.com/), not for manual listing uploads in Seller Dashboard.

## 1. Register the app (browser)

1. Sign in to Etsy with the account that owns (or will own) the shop.
2. Open **[Register as a developer](https://www.etsy.com/developers/register)**.
3. Create an app and complete the form (see **§1a** below). Keep scrolling; **redirect URIs** and **scopes** often appear below App Overview / App Details.

Etsy shows **Keystring** and **Shared secret** after the app exists. The keystring is your OAuth **client ID**; the shared secret is your **client secret**. Treat the shared secret like a password.

**Shop number / shop ID (not a secret)**  

Etsy may show a **shop identifier** (sometimes called a shop number) in Seller tools or API responses. It is **not** the shared secret. Use it in config (e.g. `ETSY_SHOP_ID` in `.env`) when your code needs to know which shop to act on after OAuth. Confirm the exact field name in the [Open API v3 reference](https://developers.etsy.com/documentation/reference) for the endpoint you call—some flows return `shop_id` from the API after you authorize, so you might not hardcode it at all.

### 1a. “Create a New App” form — what to choose (for this shop)

These answers match a **private operator tool** for the No Prior Authorization digital-template shop: you automate listing work, inventory, and related seller workflows from your own server or scripts. Adjust if your situation is different.

**App overview**

| Field | What to put |
|--------|-------------|
| **Name** | Something clear and professional, e.g. `No Prior Authorization seller tools` or `NPA Etsy listing automation`. |
| **Describe your application** (up to 500 characters, Etsy-internal only) | Say honestly that you **connect your own Etsy seller account** to internal software to create or update digital product listings, manage shop content, and optionally read sales or inventory data to keep fulfillment aligned. Mention that access is **OAuth** to **your** shop only, not a public marketplace for API keys. Example (shorten to fit): *This app connects my Etsy seller account to my private Next.js tooling so I can draft and publish digital product listings, sync listing metadata with my template pipeline, and keep inventory and fulfillment consistent. Authentication is OAuth 2; only I (and my team) authorize access to our shop.* |
| **Website URL** | Your real brand site or app URL if you have one (must be `https://`). If you do not have a public site yet, use the URL you will ship first (e.g. production app domain) or a simple landing page—Etsy expects a legitimate URL. |

**App details** (screenshots: type, audience, commercial, capabilities)

| Question | Suggested choice | Why |
|----------|------------------|-----|
| **What type of application are you building?** | **Seller Tools** | You manage your own shop and listings. |
| **Who will be the users?** | **Just myself or colleagues** | Typical for an in-house listing + fulfillment workflow. Use **A small group of users** only if you will onboard a small trusted team with the same OAuth pattern. |
| **Is your application commercial?** | **No** | “Commercial” here means **charging others to use the app**. Selling templates on Etsy is your product; the integration itself is usually not a paid SaaS. Choose **Yes** only if you will sell access to this software. |
| **Will your app do any of the following?** | **Upload or edit listings** (required for listing automation). Add **Read sales data** if you will pull orders or revenue for fulfillment. Add **Send email** only if your integration will use Etsy’s APIs to send email (many workflows do not). |

**Terms reminder (shown on the form)**  

Do **not** tell buyers or third parties to “create their own Etsy API keys” for your products. Keys are for **your** developer account and app. If you need help, Etsy points people to `developer@etsy.com`.

## 2. Redirect URIs to plan for this repo (Next.js)

Etsy’s **[Authentication](https://developers.etsy.com/documentation/essentials/authentication)** guide requires the **`redirect_uri` used in the authorize request** to use the **`https://` prefix** — **`http://localhost` is not accepted** for that step. For local coding, use an **HTTPS** callback on your real domain (deploy the app or use an HTTPS tunnel) and register that exact URL under [Your Apps](https://www.etsy.com/developers/your-apps).

Implemented in this repo:

| Route | Purpose |
|-------|---------|
| `GET /etsy` | Dev landing + **Connect Etsy account** |
| `GET /api/etsy/auth` | Starts OAuth (PKCE + cookies) |
| `GET /api/etsy/callback` | Finishes OAuth, sets httpOnly token cookies |
| `GET /api/etsy/status` | JSON: whether tokens are present |
| `GET /api/etsy/shops` | Read-only probe: fetch the connected seller's shop data |
| `GET /etsy/connected` | Success / error message |

Example production callback to register: `https://nopriorauthorization.com/api/etsy/callback`

Set `ETSY_OAUTH_REDIRECT_URI` to that **exact** string in `.env` / `.env.local` (Next.js does not load `.env.etsy.local` unless you merge vars there).

## 3. Environment variables (local)

Copy from the root `.env.example` into `.env` (which is gitignored):

- `ETSY_API_KEYSTRING` — Keystring from Etsy
- `ETSY_API_SHARED_SECRET` — Shared secret from Etsy
- `ETSY_OAUTH_REDIRECT_URI` — must match a registered redirect URI exactly
- `ETSY_SHOP_ID` — optional; your shop identifier if you pin one shop in scripts (see note above)

Optional:

- `ETSY_OAUTH_SCOPES` — space- or comma-separated scopes (see Etsy docs for current names). Request only what you need.

Never commit real secrets or put the shared secret in client-side code.

## 4. OAuth flow (high level)

Etsy uses OAuth 2.0. At a high level:

1. Your server sends the user to Etsy’s authorization URL with `client_id`, `redirect_uri`, `scope`, and a random `state`.
2. After approval, Etsy redirects to your redirect URI with `code` and `state`.
3. Your server exchanges `code` for tokens using the shared secret (server-side only).

Exact URLs, parameters, and token refresh behavior are defined in **[Etsy’s API documentation](https://developers.etsy.com/)** (they occasionally update endpoints; always verify there).

### 4a. Authorization URL (what each query parameter means)

Etsy sends users to **`https://www.etsy.com/oauth/connect`** with query parameters. Example shape (from Etsy docs):

```
https://www.etsy.com/oauth/connect?
  response_type=code
  &redirect_uri=https://www.example.com/some/location
  &scope=transactions_r%20transactions_w
  &client_id=YOUR_KEYSTRING
  &state=RANDOM_CSRF_TOKEN
  &code_challenge=BASE64URL_SHA256_OF_VERIFIER
  &code_challenge_method=S256
```

| Parameter | Role |
|-----------|------|
| `response_type=code` | Authorization code flow (you swap the `code` for tokens). |
| `redirect_uri` | Must **exactly** match a URI registered on your Etsy app (including `https`, path, and trailing slash). URL-encode it in the query string. |
| `scope` | Space-separated scopes; in URLs the space is encoded as **`%20`**. The sample uses **`transactions_r` and `transactions_w`** (read/write shop transactions). For **listing automation**, use the **listing** scopes Etsy documents (e.g. `listings_r` / `listings_w` or current equivalents)—pick only what you need. |
| `client_id` | Your app’s **Keystring** (not the shared secret). |
| `state` | Random value you generate; **verify** it matches on callback to prevent CSRF. |
| `code_challenge` / `code_challenge_method=S256` | **PKCE**: generate a `code_verifier`, hash it with SHA-256, base64url-encode for `code_challenge`. Send the **verifier** again when exchanging `code` for tokens. Follow Etsy’s current guide for whether PKCE is required for your client type. |

**For this project:** replace `redirect_uri` with your real callback, e.g. `https://nopriorauthorization.com/api/etsy/callback` (registered in the Etsy app) or `http://localhost:3000/api/etsy/callback` for local dev. Do **not** copy the example `client_id` or `state` values.

## 5. Request standards (Open API v3)

Stay aligned with Etsy’s current **[Request Standards](https://developers.etsy.com/documentation/essentials/requests/)** and **[Authentication](https://developers.etsy.com/documentation/essentials/authentication/)** guides—Etsy can change details over time.

### Base URL (either hostname)

Endpoints use **`https://api.etsy.com/v3/`** or **`https://openapi.etsy.com/v3/`** — Etsy documents them as **equivalent**; you can use either host.

### Headers on every v3 request

| Header | Value |
|--------|--------|
| **`x-api-key`** | **`{keystring}:{shared_secret}`** — your app **Keystring** and **Shared secret** from [Your Apps](https://www.etsy.com/developers/your-apps), separated by a **colon** (`:`). |
| **`Authorization`** | For calls that need OAuth scopes: **`Bearer {numeric_user_id}.{access_token}`** — a **numeric user id**, a **period**, then the **access token** (not “Bearer” + token alone). See [Authentication](https://developers.etsy.com/documentation/essentials/authentication/) for how user id and token are obtained. |

Example (from Etsy’s docs, values illustrative only):

```http
GET https://api.etsy.com/v3/application/listings?state=active
x-api-key: YOUR_KEYSTRING:YOUR_SHARED_SECRET
Authorization: Bearer 12345678.VJTv9qyjwJbYlARxdFmEEQ
```

Use **HTTPS** only. Request bodies should use **UTF-8** (e.g. `Content-Type: application/json; charset=utf-8` or form encoding with charset as in Etsy’s examples).

### Reference

- [Request Standards](https://developers.etsy.com/documentation/essentials/requests/)
- [Authentication](https://developers.etsy.com/documentation/essentials/authentication/)
- [API Reference](https://developers.etsy.com/documentation/reference)

## 6. Before you rely on automation

- Confirm your app has the scopes you need for the endpoints you will call.
- Read Etsy’s API / developer terms and rate limits.
- For this codebase, wiring real routes (e.g. `/api/etsy/callback`) is a separate step once credentials exist.

## 7. Batch digital publisher (this repo)

After OAuth works and migrations include `EtsyListingSync`:

| Command | Purpose |
|---------|---------|
| `pnpm etsy:smoke` | Read-only: one active listing page (token + shop + key). |
| `pnpm etsy:verify-write` | `listings_r` GET + `listings_w` create **disposable draft** (delete in Shop Manager). |
| `pnpm etsy:verify-e2e` | Full pipeline for **one** test product (draft → image → file → type → optional `--publish`). Writes `EtsyListingSync`. |
| `pnpm etsy:batch-publish -- etsy-products/your-table.json` | Processes a **single JSON table** with `defaults` + `products[]` (idempotent; skips rows already `active`). |

Copy `etsy-products/batch-publish-table.example.json` and fill real copy + **PDF** paths for `digitalFilePath` (Etsy may reject non-PDF types).

Pipeline and Etsy tutorial: [Listings tutorial](https://developer.etsy.com/documentation/tutorials/listings).

## 8. Links

- [Register a developer app](https://www.etsy.com/developers/register)
- [Etsy Developers](https://developers.etsy.com/)
- [Request Standards](https://developers.etsy.com/documentation/essentials/requests/)
