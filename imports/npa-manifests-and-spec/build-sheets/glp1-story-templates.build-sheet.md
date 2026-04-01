# Canva Build Sheet — GLP-1 Story Templates

Product manifest: `imports/npa-manifests-and-spec/glp1-story-templates.json`  
Product ID: `glp1-story-templates`  
SKU: `NPA-GLS-001`  
Target format: `1080x1920` (all templates)

## Build Rules

1. Keep design titles exactly as listed in **Canva Design Title**.
2. Build in this order (education -> myths -> support -> milestones -> consult/promo/CTA).
3. Keep language supportive, clear, and medically responsible.
4. Prioritize story readability and single-message slides.
5. Paste Canva template links into manifest as each design is completed.

## Production Queue

| Order | Template ID | Manifest Template Name | Canva Design Title | Category |
|---|---|---|---|---|
| 1 | `gls-how-01` | How GLP-1 Works Story | `GLS-01 How GLP-1 Works Story` | social |
| 2 | `gls-how-02` | Week 1 Expectations Story | `GLS-02 Week 1 Expectations Story` | social |
| 3 | `gls-myth-01` | GLP-1 Myth vs Fact Story | `GLS-03 GLP-1 Myth vs Fact Story` | social |
| 4 | `gls-myth-02` | Weight Loss Timeline Reality Story | `GLS-04 Weight Loss Timeline Reality Story` | social |
| 5 | `gls-support-01` | Side Effect Support Story | `GLS-05 Side Effect Support Story` | social |
| 6 | `gls-support-02` | Hydration and Protein Reminder Story | `GLS-06 Hydration and Protein Reminder Story` | social |
| 7 | `gls-milestone-01` | Progress Milestone Celebration Story | `GLS-07 Progress Milestone Celebration Story` | social |
| 8 | `gls-consult-01` | GLP-1 Consultation Story CTA | `GLS-08 GLP-1 Consultation Story CTA` | marketing |
| 9 | `gls-promo-01` | Program Offer Story | `GLS-09 Program Offer Story` | marketing |
| 10 | `gls-cta-01` | Book Weight Loss Consult Story | `GLS-10 Book Weight Loss Consult Story` | marketing |

## Paste-Back Map (Fill During Build)

| Template ID | Canva Design Title | Canva Template URL |
|---|---|---|
| `gls-how-01` | GLS-01 How GLP-1 Works Story | `PLACEHOLDER_CANVA_URL` |
| `gls-how-02` | GLS-02 Week 1 Expectations Story | `PLACEHOLDER_CANVA_URL` |
| `gls-myth-01` | GLS-03 GLP-1 Myth vs Fact Story | `PLACEHOLDER_CANVA_URL` |
| `gls-myth-02` | GLS-04 Weight Loss Timeline Reality Story | `PLACEHOLDER_CANVA_URL` |
| `gls-support-01` | GLS-05 Side Effect Support Story | `PLACEHOLDER_CANVA_URL` |
| `gls-support-02` | GLS-06 Hydration and Protein Reminder Story | `PLACEHOLDER_CANVA_URL` |
| `gls-milestone-01` | GLS-07 Progress Milestone Celebration Story | `PLACEHOLDER_CANVA_URL` |
| `gls-consult-01` | GLS-08 GLP-1 Consultation Story CTA | `PLACEHOLDER_CANVA_URL` |
| `gls-promo-01` | GLS-09 Program Offer Story | `PLACEHOLDER_CANVA_URL` |
| `gls-cta-01` | GLS-10 Book Weight Loss Consult Story | `PLACEHOLDER_CANVA_URL` |

## QA Checklist

- [ ] All 10 story designs are created in Canva.
- [ ] Titles match the naming convention exactly (`GLS-## ...`).
- [ ] All links in manifest are real Canva template links (no placeholders).
- [ ] Manifest validates in `/admin/import` with 10/10 links filled.
- [ ] Test delivery link opens and all templates load as editable copies.
