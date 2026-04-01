# Canva Build Sheet — Botox Social Media Bundle

Product manifest: `imports/npa-manifests-and-spec/botox-social-bundle.json`  
Product ID: `botox-social-bundle`  
SKU: `NPA-BSX-001`  
Target format: `1080x1080` (all templates)

## Build Rules

1. Keep design titles exactly as listed in **Canva Design Title**.
2. Build in the order below (education -> myths -> consult -> promo -> CTA).
3. Use premium med spa visuals only (no cartoon/clip-art style).
4. Keep brand-safe medical language (educational, not clinical claims).
5. After each template is ready, paste its Canva template link in the manifest.

## Production Queue

| Order | Template ID | Manifest Template Name | Canva Design Title | Category |
|---|---|---|---|---|
| 1 | `bsx-ed-01` | Botox 101: How Neurotoxin Works | `BSX-01 Botox 101 How Neurotoxin Works` | social |
| 2 | `bsx-ed-02` | Forehead vs Frown Lines Guide | `BSX-02 Forehead vs Frown Lines Guide` | social |
| 3 | `bsx-myth-01` | Myth vs Fact: Frozen Face | `BSX-03 Myth vs Fact Frozen Face` | social |
| 4 | `bsx-myth-02` | Myth vs Fact: Too Young for Botox | `BSX-04 Myth vs Fact Too Young for Botox` | social |
| 5 | `bsx-consult-01` | Botox Consultation Checklist | `BSX-05 Botox Consultation Checklist` | social |
| 6 | `bsx-consult-02` | What to Ask at Your First Visit | `BSX-06 What to Ask at Your First Visit` | social |
| 7 | `bsx-promo-01` | New Patient Botox Offer | `BSX-07 New Patient Botox Offer` | marketing |
| 8 | `bsx-promo-02` | Limited Spots This Week | `BSX-08 Limited Spots This Week` | marketing |
| 9 | `bsx-retain-01` | When to Rebook Your Botox | `BSX-09 When to Rebook Your Botox` | social |
| 10 | `bsx-cta-01` | Book Your Botox Consultation | `BSX-10 Book Your Botox Consultation` | marketing |

## Paste-Back Map (Fill During Build)

Copy each Canva template link and paste into `canvaTemplateUrl` for the matching template ID.

| Template ID | Canva Design Title | Canva Template URL |
|---|---|---|
| `bsx-ed-01` | BSX-01 Botox 101 How Neurotoxin Works | `PLACEHOLDER_CANVA_URL` |
| `bsx-ed-02` | BSX-02 Forehead vs Frown Lines Guide | `PLACEHOLDER_CANVA_URL` |
| `bsx-myth-01` | BSX-03 Myth vs Fact Frozen Face | `PLACEHOLDER_CANVA_URL` |
| `bsx-myth-02` | BSX-04 Myth vs Fact Too Young for Botox | `PLACEHOLDER_CANVA_URL` |
| `bsx-consult-01` | BSX-05 Botox Consultation Checklist | `PLACEHOLDER_CANVA_URL` |
| `bsx-consult-02` | BSX-06 What to Ask at Your First Visit | `PLACEHOLDER_CANVA_URL` |
| `bsx-promo-01` | BSX-07 New Patient Botox Offer | `PLACEHOLDER_CANVA_URL` |
| `bsx-promo-02` | BSX-08 Limited Spots This Week | `PLACEHOLDER_CANVA_URL` |
| `bsx-retain-01` | BSX-09 When to Rebook Your Botox | `PLACEHOLDER_CANVA_URL` |
| `bsx-cta-01` | BSX-10 Book Your Botox Consultation | `PLACEHOLDER_CANVA_URL` |

## QA Checklist

- [ ] All 10 designs are created in Canva.
- [ ] Titles match the naming convention exactly (`BSX-## ...`).
- [ ] All links in manifest are real Canva template links (no placeholders).
- [ ] Manifest validates in `/admin/import` with 10/10 links filled.
- [ ] Test delivery link opens and all templates load as editable copies.
