# Canva Build Sheet — New Patient Offer and Membership Pack

Product manifest: `imports/npa-manifests-and-spec/new-patient-membership-pack.json`  
Product ID: `new-patient-membership-pack`  
SKU: `NPA-NPM-001`  
Target format: `1080x1080` + `1080x1920` (story)

## Build Rules

1. Keep design titles exactly as listed in **Canva Design Title**.
2. Build in this order (consult -> membership -> referral -> package -> CTA -> story).
3. Keep premium aesthetic and clear offer hierarchy.
4. Keep pricing language editable for local offer changes.
5. Paste Canva template links into manifest as each design is completed.

## Production Queue

| Order | Template ID | Manifest Template Name | Canva Design Title | Category |
|---|---|---|---|---|
| 1 | `npm-consult-01` | New Patient Consultation Offer | `NPM-01 New Patient Consultation Offer` | marketing |
| 2 | `npm-consult-02` | Consultation Promo Variant | `NPM-02 Consultation Promo Variant` | marketing |
| 3 | `npm-member-01` | Membership Program Overview | `NPM-03 Membership Program Overview` | marketing |
| 4 | `npm-member-02` | Membership Savings Breakdown | `NPM-04 Membership Savings Breakdown` | marketing |
| 5 | `npm-ref-01` | Referral Bonus Graphic | `NPM-05 Referral Bonus Graphic` | marketing |
| 6 | `npm-ref-02` | Bring-a-Friend Offer | `NPM-06 Bring-a-Friend Offer` | marketing |
| 7 | `npm-package-01` | Package Comparison Chart | `NPM-07 Package Comparison Chart` | marketing |
| 8 | `npm-cta-01` | Book Your Consult Today | `NPM-08 Book Your Consult Today` | marketing |
| 9 | `npm-cta-02` | Limited Membership Spots | `NPM-09 Limited Membership Spots` | marketing |
| 10 | `npm-story-01` | Membership Story Promo | `NPM-10 Membership Story Promo` | marketing |

## Paste-Back Map (Fill During Build)

| Template ID | Canva Design Title | Canva Template URL |
|---|---|---|
| `npm-consult-01` | NPM-01 New Patient Consultation Offer | `PLACEHOLDER_CANVA_URL` |
| `npm-consult-02` | NPM-02 Consultation Promo Variant | `PLACEHOLDER_CANVA_URL` |
| `npm-member-01` | NPM-03 Membership Program Overview | `PLACEHOLDER_CANVA_URL` |
| `npm-member-02` | NPM-04 Membership Savings Breakdown | `PLACEHOLDER_CANVA_URL` |
| `npm-ref-01` | NPM-05 Referral Bonus Graphic | `PLACEHOLDER_CANVA_URL` |
| `npm-ref-02` | NPM-06 Bring-a-Friend Offer | `PLACEHOLDER_CANVA_URL` |
| `npm-package-01` | NPM-07 Package Comparison Chart | `PLACEHOLDER_CANVA_URL` |
| `npm-cta-01` | NPM-08 Book Your Consult Today | `PLACEHOLDER_CANVA_URL` |
| `npm-cta-02` | NPM-09 Limited Membership Spots | `PLACEHOLDER_CANVA_URL` |
| `npm-story-01` | NPM-10 Membership Story Promo | `PLACEHOLDER_CANVA_URL` |

## QA Checklist

- [ ] All 10 designs are created in Canva.
- [ ] Titles match the naming convention exactly (`NPM-## ...`).
- [ ] All links in manifest are real Canva template links (no placeholders).
- [ ] Manifest validates in `/admin/import` with 10/10 links filled.
- [ ] Test delivery link opens and all templates load as editable copies.
