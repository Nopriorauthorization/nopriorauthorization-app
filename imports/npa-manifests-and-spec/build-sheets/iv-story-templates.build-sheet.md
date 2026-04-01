# Canva Build Sheet — IV Therapy Story Templates

Product manifest: `imports/npa-manifests-and-spec/iv-story-templates.json`  
Product ID: `iv-story-templates`  
SKU: `NPA-IVS-001`  
Target format: `1080x1920` (all templates)

## Build Rules

1. Keep design titles exactly as listed in **Canva Design Title**.
2. Build in this order (service spotlights -> FAQs -> education -> promo -> CTA).
3. Use strong story readability (large text, high contrast, clear CTA).
4. Keep language short for story consumption.
5. Paste Canva template links into manifest as each design is completed.

## Production Queue

| Order | Template ID | Manifest Template Name | Canva Design Title | Category |
|---|---|---|---|---|
| 1 | `ivs-spot-01` | Hydration Drip Spotlight Story | `IVS-01 Hydration Drip Spotlight Story` | social |
| 2 | `ivs-spot-02` | Immunity Drip Spotlight Story | `IVS-02 Immunity Drip Spotlight Story` | social |
| 3 | `ivs-spot-03` | Beauty Drip Spotlight Story | `IVS-03 Beauty Drip Spotlight Story` | social |
| 4 | `ivs-faq-01` | IV FAQ: How Long Does It Take? | `IVS-04 IV FAQ How Long Does It Take` | social |
| 5 | `ivs-faq-02` | IV FAQ: How Often Should I Come? | `IVS-05 IV FAQ How Often Should I Come` | social |
| 6 | `ivs-edu-01` | How IV Therapy Works Story | `IVS-06 How IV Therapy Works Story` | social |
| 7 | `ivs-edu-02` | Who Is a Good Candidate? Story | `IVS-07 Who Is a Good Candidate Story` | social |
| 8 | `ivs-promo-01` | IV Promo Story | `IVS-08 IV Promo Story` | marketing |
| 9 | `ivs-promo-02` | Limited Slots Story | `IVS-09 Limited Slots Story` | marketing |
| 10 | `ivs-cta-01` | Book IV Session Story CTA | `IVS-10 Book IV Session Story CTA` | marketing |

## Paste-Back Map (Fill During Build)

| Template ID | Canva Design Title | Canva Template URL |
|---|---|---|
| `ivs-spot-01` | IVS-01 Hydration Drip Spotlight Story | `PLACEHOLDER_CANVA_URL` |
| `ivs-spot-02` | IVS-02 Immunity Drip Spotlight Story | `PLACEHOLDER_CANVA_URL` |
| `ivs-spot-03` | IVS-03 Beauty Drip Spotlight Story | `PLACEHOLDER_CANVA_URL` |
| `ivs-faq-01` | IVS-04 IV FAQ How Long Does It Take | `PLACEHOLDER_CANVA_URL` |
| `ivs-faq-02` | IVS-05 IV FAQ How Often Should I Come | `PLACEHOLDER_CANVA_URL` |
| `ivs-edu-01` | IVS-06 How IV Therapy Works Story | `PLACEHOLDER_CANVA_URL` |
| `ivs-edu-02` | IVS-07 Who Is a Good Candidate Story | `PLACEHOLDER_CANVA_URL` |
| `ivs-promo-01` | IVS-08 IV Promo Story | `PLACEHOLDER_CANVA_URL` |
| `ivs-promo-02` | IVS-09 Limited Slots Story | `PLACEHOLDER_CANVA_URL` |
| `ivs-cta-01` | IVS-10 Book IV Session Story CTA | `PLACEHOLDER_CANVA_URL` |

## QA Checklist

- [ ] All 10 story designs are created in Canva.
- [ ] Titles match the naming convention exactly (`IVS-## ...`).
- [ ] All links in manifest are real Canva template links (no placeholders).
- [ ] Manifest validates in `/admin/import` with 10/10 links filled.
- [ ] Test delivery link opens and all templates load as editable copies.
