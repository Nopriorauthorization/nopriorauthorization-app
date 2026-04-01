# Canva Build Sheet — Seasonal Med Spa Marketing Pack

Product manifest: `imports/npa-manifests-and-spec/seasonal-marketing-pack.json`  
Product ID: `seasonal-marketing-pack`  
SKU: `NPA-SEA-001`  
Target format: `1080x1080` (all templates)

## Build Rules

1. Keep design titles exactly as listed in **Canva Design Title**.
2. Build in this order (spring -> summer -> fall -> holiday -> new year -> countdown).
3. Leave dates and offer terms editable.
4. Keep campaign visual consistency across seasonal sets.
5. Paste Canva template links into manifest as each design is completed.

## Production Queue

| Order | Template ID | Manifest Template Name | Canva Design Title | Category |
|---|---|---|---|---|
| 1 | `sea-spring-01` | Spring Refresh Campaign Post | `SEA-01 Spring Refresh Campaign Post` | marketing |
| 2 | `sea-spring-02` | Spring Consultation CTA | `SEA-02 Spring Consultation CTA` | marketing |
| 3 | `sea-summer-01` | Summer Prep Treatment Promo | `SEA-03 Summer Prep Treatment Promo` | marketing |
| 4 | `sea-summer-02` | Hot Weather Skin Support Post | `SEA-04 Hot Weather Skin Support Post` | social |
| 5 | `sea-fall-01` | Fall Reset Campaign Post | `SEA-05 Fall Reset Campaign Post` | marketing |
| 6 | `sea-holiday-01` | Holiday Recovery Offer | `SEA-06 Holiday Recovery Offer` | marketing |
| 7 | `sea-holiday-02` | Gift Card and Membership Push | `SEA-07 Gift Card and Membership Push` | marketing |
| 8 | `sea-newyear-01` | New Year New You Campaign | `SEA-08 New Year New You Campaign` | marketing |
| 9 | `sea-newyear-02` | January Booking CTA | `SEA-09 January Booking CTA` | marketing |
| 10 | `sea-limited-01` | Limited-Time Seasonal Countdown | `SEA-10 Limited-Time Seasonal Countdown` | marketing |

## Paste-Back Map (Fill During Build)

| Template ID | Canva Design Title | Canva Template URL |
|---|---|---|
| `sea-spring-01` | SEA-01 Spring Refresh Campaign Post | `PLACEHOLDER_CANVA_URL` |
| `sea-spring-02` | SEA-02 Spring Consultation CTA | `PLACEHOLDER_CANVA_URL` |
| `sea-summer-01` | SEA-03 Summer Prep Treatment Promo | `PLACEHOLDER_CANVA_URL` |
| `sea-summer-02` | SEA-04 Hot Weather Skin Support Post | `PLACEHOLDER_CANVA_URL` |
| `sea-fall-01` | SEA-05 Fall Reset Campaign Post | `PLACEHOLDER_CANVA_URL` |
| `sea-holiday-01` | SEA-06 Holiday Recovery Offer | `PLACEHOLDER_CANVA_URL` |
| `sea-holiday-02` | SEA-07 Gift Card and Membership Push | `PLACEHOLDER_CANVA_URL` |
| `sea-newyear-01` | SEA-08 New Year New You Campaign | `PLACEHOLDER_CANVA_URL` |
| `sea-newyear-02` | SEA-09 January Booking CTA | `PLACEHOLDER_CANVA_URL` |
| `sea-limited-01` | SEA-10 Limited-Time Seasonal Countdown | `PLACEHOLDER_CANVA_URL` |

## QA Checklist

- [ ] All 10 designs are created in Canva.
- [ ] Titles match the naming convention exactly (`SEA-## ...`).
- [ ] All links in manifest are real Canva template links (no placeholders).
- [ ] Manifest validates in `/admin/import` with 10/10 links filled.
- [ ] Test delivery link opens and all templates load as editable copies.
