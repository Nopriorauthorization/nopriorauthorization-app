# Canva Build Sheet — Myths vs Facts for Injectors

Product manifest: `imports/npa-manifests-and-spec/myths-facts-injectors.json`  
Product ID: `myths-facts-injectors`  
SKU: `NPA-MVF-001`  
Target format: `1080x1080` (all templates)

## Build Rules

1. Keep design titles exactly as listed in **Canva Design Title**.
2. Build in this order (Botox -> Filler -> IV/GLP-1 -> safety/consult -> engagement).
3. Keep educational tone and avoid absolute claims.
4. Use clear visual contrast between “Myth” and “Fact” sections.
5. Paste Canva template links into manifest as each design is completed.

## Production Queue

| Order | Template ID | Manifest Template Name | Canva Design Title | Category |
|---|---|---|---|---|
| 1 | `mvf-btx-01` | Botox Myth vs Fact #1 | `MVF-01 Botox Myth vs Fact 01` | social |
| 2 | `mvf-btx-02` | Botox Myth vs Fact #2 | `MVF-02 Botox Myth vs Fact 02` | social |
| 3 | `mvf-flr-01` | Filler Myth vs Fact #1 | `MVF-03 Filler Myth vs Fact 01` | social |
| 4 | `mvf-flr-02` | Filler Myth vs Fact #2 | `MVF-04 Filler Myth vs Fact 02` | social |
| 5 | `mvf-iv-01` | IV Therapy Myth vs Fact | `MVF-05 IV Therapy Myth vs Fact` | social |
| 6 | `mvf-glp1-01` | GLP-1 Myth vs Fact | `MVF-06 GLP-1 Myth vs Fact` | social |
| 7 | `mvf-safety-01` | Injectables Safety Myth vs Fact | `MVF-07 Injectables Safety Myth vs Fact` | social |
| 8 | `mvf-consult-01` | Consultation Myth vs Fact | `MVF-08 Consultation Myth vs Fact` | social |
| 9 | `mvf-engage-01` | Ask Us Anything Prompt | `MVF-09 Ask Us Anything Prompt` | social |
| 10 | `mvf-save-01` | Save This Educational Post | `MVF-10 Save This Educational Post` | social |

## Paste-Back Map (Fill During Build)

Copy each Canva template link and paste into `canvaTemplateUrl` for the matching template ID.

| Template ID | Canva Design Title | Canva Template URL |
|---|---|---|
| `mvf-btx-01` | MVF-01 Botox Myth vs Fact 01 | `PLACEHOLDER_CANVA_URL` |
| `mvf-btx-02` | MVF-02 Botox Myth vs Fact 02 | `PLACEHOLDER_CANVA_URL` |
| `mvf-flr-01` | MVF-03 Filler Myth vs Fact 01 | `PLACEHOLDER_CANVA_URL` |
| `mvf-flr-02` | MVF-04 Filler Myth vs Fact 02 | `PLACEHOLDER_CANVA_URL` |
| `mvf-iv-01` | MVF-05 IV Therapy Myth vs Fact | `PLACEHOLDER_CANVA_URL` |
| `mvf-glp1-01` | MVF-06 GLP-1 Myth vs Fact | `PLACEHOLDER_CANVA_URL` |
| `mvf-safety-01` | MVF-07 Injectables Safety Myth vs Fact | `PLACEHOLDER_CANVA_URL` |
| `mvf-consult-01` | MVF-08 Consultation Myth vs Fact | `PLACEHOLDER_CANVA_URL` |
| `mvf-engage-01` | MVF-09 Ask Us Anything Prompt | `PLACEHOLDER_CANVA_URL` |
| `mvf-save-01` | MVF-10 Save This Educational Post | `PLACEHOLDER_CANVA_URL` |

## QA Checklist

- [ ] All 10 designs are created in Canva.
- [ ] Titles match the naming convention exactly (`MVF-## ...`).
- [ ] All links in manifest are real Canva template links (no placeholders).
- [ ] Manifest validates in `/admin/import` with 10/10 links filled.
- [ ] Test delivery link opens and all templates load as editable copies.
