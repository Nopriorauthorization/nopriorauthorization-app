# NPA Delivery System — Product Manifest Build Spec
**For:** Anthony (Developer)
**From:** Dani / NPA
**Date:** 2026-03-30
**Status:** Ready to implement

---

## What This Doc Is

This is your complete handoff spec for importing the remaining 6 product manifests into the delivery system and (optionally) wiring up Etsy webhook automation. The IV therapy manifest is already live and working — these 6 follow the exact same pattern.

---

## Manifest File Summary

| File | Product ID | Etsy SKU | Price | Templates |
|------|-----------|----------|-------|-----------|
| `weight-loss-kit.json` | `weight-loss-kit` | NPA-WL-001 | $57 | 7 |
| `combo-bundle.json` | `combo-bundle` | NPA-CB-001 | $67 | 10 |
| `botox-consent-bundle.json` | `botox-consent-bundle` | NPA-BTX-001 | $37 | 6 |
| `filler-consent-bundle.json` | `filler-consent-bundle` | NPA-FLR-001 | $37 | 7 |
| `lash-aftercare-kit.json` | `lash-aftercare-kit` | NPA-LSH-001 | $27 | 7 |
| `peptide-patient-guide.json` | `peptide-patient-guide` | NPA-PEP-001 | $47 | 7 |

---

## Step 1 — Fill In the Canva Template URLs

Every template in each manifest has a placeholder:
```
"canvaTemplateUrl": "PLACEHOLDER_CANVA_URL"
```

Before importing, replace each placeholder with the real Canva share link for that template.

**How to get a Canva share link:**
1. Open the template in Canva
2. Click Share → Template link
3. Copy the URL (format: `https://www.canva.com/design/XXXXX/view?mode=preview`)
4. Paste it into the manifest JSON

**Important:** Use the "Template link" (not the "Edit" link). This gives buyers their own editable copy without access to the original.

---

## Step 2 — Drop Files Into the Products Folder

Place all 6 JSON files into the same directory as the existing IV manifest:

```
canva-automation/output/products/
├── iv-therapy-social-kit.json   ← already here, working
├── weight-loss-kit.json          ← add this
├── combo-bundle.json             ← add this
├── botox-consent-bundle.json     ← add this
├── filler-consent-bundle.json    ← add this
├── lash-aftercare-kit.json       ← add this
└── peptide-patient-guide.json    ← add this
```

---

## Step 3 — Run the Importer

From the repo root (same as you did for IV therapy):

```bash
npm run import-canva-manifests
```

This regenerates `src/lib/delivery/catalog.generated.json` to include all 7 products.

---

## Step 4 — Test Each Product

Issue a test delivery link for each new product and verify the buyer page loads correctly:

```bash
# Weight loss kit
npm run delivery:issue -- weight-loss-kit test@example.com TEST-WL-001

# Combo bundle
npm run delivery:issue -- combo-bundle test@example.com TEST-CB-001

# Botox consent bundle
npm run delivery:issue -- botox-consent-bundle test@example.com TEST-BTX-001

# Filler consent bundle
npm run delivery:issue -- filler-consent-bundle test@example.com TEST-FLR-001

# Lash aftercare kit
npm run delivery:issue -- lash-aftercare-kit test@example.com TEST-LSH-001

# Peptide patient guide
npm run delivery:issue -- peptide-patient-guide test@example.com TEST-PEP-001
```

For each: open the URL, confirm the product name/description shows correctly, and click at least one Canva link to verify it opens an editable copy.

---

## Step 5 (Big Unlock) — Etsy Webhook Automation

Once all manifests are live and tested, connect Etsy's order webhook to auto-issue delivery links.

### How Etsy webhooks work

When a buyer completes a purchase, Etsy sends a POST request to a URL you register. The payload includes order details including the buyer email and line items (which contain the SKU).

### What to build

**Register the webhook in Etsy Developer Portal:**
- Endpoint: `https://nopriorauthorization.com/api/etsy/webhook`
- Events: `RECEIPT_CREATED` (fires on completed purchase)

**Create the webhook handler:**

```
POST /api/etsy/webhook
```

Handler logic:
```typescript
// src/app/api/etsy/webhook/route.ts

export async function POST(req: Request) {
  const body = await req.json();

  // 1. Verify Etsy webhook signature (see Etsy docs for HMAC verification)
  // 2. Extract order details
  const buyerEmail = body.buyer_email;
  const lineItems = body.transactions; // array of purchased items

  for (const item of lineItems) {
    // 3. Map Etsy SKU → manifest productId
    const productId = SKU_TO_PRODUCT_MAP[item.sku];
    if (!productId) continue;

    // 4. Call the existing issue endpoint
    await fetch('https://nopriorauthorization.com/api/delivery/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        buyerEmail,
        orderId: body.receipt_id.toString(),
      }),
    });
  }

  return new Response('OK', { status: 200 });
}
```

**SKU mapping object (add to the handler file):**
```typescript
const SKU_TO_PRODUCT_MAP: Record<string, string> = {
  'NPA-IV-001':  'iv-therapy-social-kit',
  'NPA-WL-001':  'weight-loss-kit',
  'NPA-CB-001':  'combo-bundle',
  'NPA-BTX-001': 'botox-consent-bundle',
  'NPA-FLR-001': 'filler-consent-bundle',
  'NPA-LSH-001': 'lash-aftercare-kit',
  'NPA-PEP-001': 'peptide-patient-guide',
};
```

**Email the delivery link to the buyer:**

The existing `POST /api/delivery/issue` route returns the delivery token/URL. Pipe that into an email send via Resend (already in the stack):

```typescript
await resend.emails.send({
  from: 'hello@nopriorauthorization.com',
  to: buyerEmail,
  subject: 'Your NPA digital download is ready',
  html: `
    <p>Thank you for your purchase!</p>
    <p>Click below to access your templates:</p>
    <a href="${deliveryUrl}">Access Your Download</a>
    <p>This link expires in 365 days.</p>
  `,
});
```

### Etsy webhook security

Always verify the `X-Etsy-Signature` header before processing. Etsy signs webhooks with HMAC-SHA256 using your app secret. Reject any request that fails verification.

---

## Manifest JSON Schema Reference

If Dani needs to add new products in the future, every manifest must follow this structure:

```json
{
  "productId": "kebab-case-unique-id",
  "displayName": "Human Readable Product Name",
  "description": "1-2 sentence description shown on buyer delivery page",
  "version": "1.0.0",
  "priceUSD": 00,
  "etsySku": "NPA-XXX-001",
  "category": "forms | clinical-education | injectables | esthetics | bundle | social",
  "targetBuyer": "Who this is for (shown on Etsy listing)",
  "templates": [
    {
      "id": "unique-template-id",
      "name": "Template Display Name",
      "description": "What this template is and who uses it",
      "canvaTemplateUrl": "https://www.canva.com/design/XXXXX/...",
      "format": "8.5x11 | 1080x1080 | 1080x1920 | 3.5x2 | 5x7",
      "pages": 1,
      "category": "forms | education | marketing | tracker | clinical-record | social"
    }
  ],
  "deliveryNote": "Message shown to buyer on the delivery page",
  "expirationDays": 365,
  "importedAt": "ISO-8601 timestamp"
}
```

---

## Questions?

Everything in this spec mirrors what's already working for `iv-therapy-social-kit`. The only difference is swapping in the new productIds and Canva URLs. Should be fast.

— Built with Claude / NPA
