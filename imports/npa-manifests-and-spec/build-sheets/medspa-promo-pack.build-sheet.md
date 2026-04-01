# Canva Build Sheet — Med Spa Promo Templates Pack

Product manifest: `imports/npa-manifests-and-spec/medspa-promo-pack.json`  
Product ID: `medspa-promo-pack`  
SKU: `NPA-PRM-001`  
Target format: `1080x1080` (all templates)

## Build Rules

1. Keep design titles exactly as listed in **Canva Design Title**.
2. Build in this order (offers -> urgency -> consult -> membership/referral -> seasonal -> CTA).
3. Keep premium med spa aesthetic and clear conversion hierarchy.
4. Avoid overpromising language; keep offers policy-safe.
5. Paste Canva template links into manifest as each design is completed.

## Production Queue

| Order | Template ID | Manifest Template Name | Canva Design Title | Category |
|---|---|---|---|---|
| 1 | `prm-offer-01` | New Patient Offer Graphic | `PRM-01 New Patient Offer Graphic` | marketing |
| 2 | `prm-offer-02` | Flash Sale Announcement | `PRM-02 Flash Sale Announcement` | marketing |
| 3 | `prm-offer-03` | BOGO or Package Offer | `PRM-03 BOGO or Package Offer` | marketing |
| 4 | `prm-urgency-01` | Limited Appointments This Week | `PRM-04 Limited Appointments This Week` | marketing |
| 5 | `prm-urgency-02` | Last Chance Promo Reminder | `PRM-05 Last Chance Promo Reminder` | marketing |
| 6 | `prm-consult-01` | Free Consultation CTA | `PRM-06 Free Consultation CTA` | marketing |
| 7 | `prm-membership-01` | Membership Savings Promo | `PRM-07 Membership Savings Promo` | marketing |
| 8 | `prm-referral-01` | Referral Reward Graphic | `PRM-08 Referral Reward Graphic` | marketing |
| 9 | `prm-seasonal-01` | Seasonal Offer Spotlight | `PRM-09 Seasonal Offer Spotlight` | marketing |
| 10 | `prm-cta-01` | Book Now Action Post | `PRM-10 Book Now Action Post` | marketing |

## Paste-Back Map (Fill During Build)

Copy each Canva template link and paste into `canvaTemplateUrl` for the matching template ID.

| Template ID | Canva Design Title | Canva Template URL |
|---|---|---|
| `prm-offer-01` | PRM-01 New Patient Offer Graphic | `PLACEHOLDER_CANVA_URL` |
| `prm-offer-02` | PRM-02 Flash Sale Announcement | `PLACEHOLDER_CANVA_URL` |
| `prm-offer-03` | PRM-03 BOGO or Package Offer | `PLACEHOLDER_CANVA_URL` |
| `prm-urgency-01` | PRM-04 Limited Appointments This Week | `PLACEHOLDER_CANVA_URL` |
| `prm-urgency-02` | PRM-05 Last Chance Promo Reminder | `PLACEHOLDER_CANVA_URL` |
| `prm-consult-01` | PRM-06 Free Consultation CTA | `PLACEHOLDER_CANVA_URL` |
| `prm-membership-01` | PRM-07 Membership Savings Promo | `PLACEHOLDER_CANVA_URL` |
| `prm-referral-01` | PRM-08 Referral Reward Graphic | `PLACEHOLDER_CANVA_URL` |
| `prm-seasonal-01` | PRM-09 Seasonal Offer Spotlight | `PLACEHOLDER_CANVA_URL` |
| `prm-cta-01` | PRM-10 Book Now Action Post | `PLACEHOLDER_CANVA_URL` |

## QA Checklist

- [ ] All 10 designs are created in Canva.
- [ ] Titles match the naming convention exactly (`PRM-## ...`).
- [ ] All links in manifest are real Canva template links (no placeholders).
- [ ] Manifest validates in `/admin/import` with 10/10 links filled.
- [ ] Test delivery link opens and all templates load as editable copies.
