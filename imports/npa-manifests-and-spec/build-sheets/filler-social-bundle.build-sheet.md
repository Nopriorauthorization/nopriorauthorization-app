# Canva Build Sheet — Filler Social Media Bundle

Product manifest: `imports/npa-manifests-and-spec/filler-social-bundle.json`  
Product ID: `filler-social-bundle`  
SKU: `NPA-FSX-001`  
Target format: `1080x1080` (all templates)

## Build Rules

1. Keep design titles exactly as listed in **Canva Design Title**.
2. Build in the order below (education -> safety -> myths -> consult -> promo -> CTA).
3. Use premium med spa visuals only (no cartoon/clip-art style).
4. Keep language clinically safe and trust-focused.
5. After each template is ready, paste its Canva template link in the manifest.

## Production Queue

| Order | Template ID | Manifest Template Name | Canva Design Title | Category |
|---|---|---|---|---|
| 1 | `fsx-ed-01` | Dermal Filler Basics | `FSX-01 Dermal Filler Basics` | social |
| 2 | `fsx-ed-02` | Lip Filler Expectations | `FSX-02 Lip Filler Expectations` | social |
| 3 | `fsx-ed-03` | Cheek and Chin Balancing Guide | `FSX-03 Cheek and Chin Balancing Guide` | social |
| 4 | `fsx-safety-01` | Safety First: Who Is a Candidate? | `FSX-04 Safety First Who Is a Candidate` | social |
| 5 | `fsx-myth-01` | Myth vs Fact: Filler Migration | `FSX-05 Myth vs Fact Filler Migration` | social |
| 6 | `fsx-myth-02` | Myth vs Fact: Filler Looks Fake | `FSX-06 Myth vs Fact Filler Looks Fake` | social |
| 7 | `fsx-consult-01` | Filler Consultation Prep | `FSX-07 Filler Consultation Prep` | social |
| 8 | `fsx-promo-01` | Signature Lip Day Promo | `FSX-08 Signature Lip Day Promo` | marketing |
| 9 | `fsx-promo-02` | Bundle and Save Filler Packages | `FSX-09 Bundle and Save Filler Packages` | marketing |
| 10 | `fsx-cta-01` | Book Your Filler Consultation | `FSX-10 Book Your Filler Consultation` | marketing |

## Paste-Back Map (Fill During Build)

Copy each Canva template link and paste into `canvaTemplateUrl` for the matching template ID.

| Template ID | Canva Design Title | Canva Template URL |
|---|---|---|
| `fsx-ed-01` | FSX-01 Dermal Filler Basics | `PLACEHOLDER_CANVA_URL` |
| `fsx-ed-02` | FSX-02 Lip Filler Expectations | `PLACEHOLDER_CANVA_URL` |
| `fsx-ed-03` | FSX-03 Cheek and Chin Balancing Guide | `PLACEHOLDER_CANVA_URL` |
| `fsx-safety-01` | FSX-04 Safety First Who Is a Candidate | `PLACEHOLDER_CANVA_URL` |
| `fsx-myth-01` | FSX-05 Myth vs Fact Filler Migration | `PLACEHOLDER_CANVA_URL` |
| `fsx-myth-02` | FSX-06 Myth vs Fact Filler Looks Fake | `PLACEHOLDER_CANVA_URL` |
| `fsx-consult-01` | FSX-07 Filler Consultation Prep | `PLACEHOLDER_CANVA_URL` |
| `fsx-promo-01` | FSX-08 Signature Lip Day Promo | `PLACEHOLDER_CANVA_URL` |
| `fsx-promo-02` | FSX-09 Bundle and Save Filler Packages | `PLACEHOLDER_CANVA_URL` |
| `fsx-cta-01` | FSX-10 Book Your Filler Consultation | `PLACEHOLDER_CANVA_URL` |

## QA Checklist

- [ ] All 10 designs are created in Canva.
- [ ] Titles match the naming convention exactly (`FSX-## ...`).
- [ ] All links in manifest are real Canva template links (no placeholders).
- [ ] Manifest validates in `/admin/import` with 10/10 links filled.
- [ ] Test delivery link opens and all templates load as editable copies.
