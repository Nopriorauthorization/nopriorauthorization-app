# Canva Build Sheet — Complete Injector Bundle

Product manifest: `imports/npa-manifests-and-spec/complete-injector-bundle.json`  
Product ID: `complete-injector-bundle`  
SKU: `NPA-INJ-001`  
Target format: `1080x1080` (all templates)

## Build Rules

1. Keep design titles exactly as listed in **Canva Design Title**.
2. Build in this order (overview -> education -> trust -> consult -> promo -> CTA).
3. Maintain luxury med spa visual style (photo-led, clean typography, premium spacing).
4. Keep language provider-safe and conversion-focused.
5. Paste Canva template links back into the manifest as each template is completed.

## Production Queue

| Order | Template ID | Manifest Template Name | Canva Design Title | Category |
|---|---|---|---|---|
| 1 | `inj-overview-01` | Complete Injector Service Menu | `INJ-01 Complete Injector Service Menu` | social |
| 2 | `inj-botox-01` | Botox Education Spotlight | `INJ-02 Botox Education Spotlight` | social |
| 3 | `inj-filler-01` | Filler Education Spotlight | `INJ-03 Filler Education Spotlight` | social |
| 4 | `inj-myth-01` | Injectables Myth vs Fact Carousel Cover | `INJ-04 Injectables Myth vs Fact Carousel Cover` | social |
| 5 | `inj-beforeafter-01` | Before and After Policy Card | `INJ-05 Before and After Policy Card` | social |
| 6 | `inj-consult-01` | Injectables Consultation CTA | `INJ-06 Injectables Consultation CTA` | marketing |
| 7 | `inj-promo-01` | New Patient Injectables Offer | `INJ-07 New Patient Injectables Offer` | marketing |
| 8 | `inj-membership-01` | Injectables Membership Highlight | `INJ-08 Injectables Membership Highlight` | marketing |
| 9 | `inj-crosssell-01` | Botox + Filler Combo Value Post | `INJ-09 Botox and Filler Combo Value Post` | marketing |
| 10 | `inj-cta-01` | Book Your Injector Appointment | `INJ-10 Book Your Injector Appointment` | marketing |

## Paste-Back Map (Fill During Build)

Copy each Canva template link and paste into `canvaTemplateUrl` for the matching template ID.

| Template ID | Canva Design Title | Canva Template URL |
|---|---|---|
| `inj-overview-01` | INJ-01 Complete Injector Service Menu | `PLACEHOLDER_CANVA_URL` |
| `inj-botox-01` | INJ-02 Botox Education Spotlight | `PLACEHOLDER_CANVA_URL` |
| `inj-filler-01` | INJ-03 Filler Education Spotlight | `PLACEHOLDER_CANVA_URL` |
| `inj-myth-01` | INJ-04 Injectables Myth vs Fact Carousel Cover | `PLACEHOLDER_CANVA_URL` |
| `inj-beforeafter-01` | INJ-05 Before and After Policy Card | `PLACEHOLDER_CANVA_URL` |
| `inj-consult-01` | INJ-06 Injectables Consultation CTA | `PLACEHOLDER_CANVA_URL` |
| `inj-promo-01` | INJ-07 New Patient Injectables Offer | `PLACEHOLDER_CANVA_URL` |
| `inj-membership-01` | INJ-08 Injectables Membership Highlight | `PLACEHOLDER_CANVA_URL` |
| `inj-crosssell-01` | INJ-09 Botox and Filler Combo Value Post | `PLACEHOLDER_CANVA_URL` |
| `inj-cta-01` | INJ-10 Book Your Injector Appointment | `PLACEHOLDER_CANVA_URL` |

## QA Checklist

- [ ] All 10 designs are created in Canva.
- [ ] Titles match the naming convention exactly (`INJ-## ...`).
- [ ] All links in manifest are real Canva template links (no placeholders).
- [ ] Manifest validates in `/admin/import` with 10/10 links filled.
- [ ] Test delivery link opens and all templates load as editable copies.
