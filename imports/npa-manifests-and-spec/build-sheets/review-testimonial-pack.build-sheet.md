# Canva Build Sheet — Review and Testimonial Template Pack

Product manifest: `imports/npa-manifests-and-spec/review-testimonial-pack.json`  
Product ID: `review-testimonial-pack`  
SKU: `NPA-RVW-001`  
Target format: `1080x1080` (all templates)

## Build Rules

1. Keep design titles exactly as listed in **Canva Design Title**.
2. Build in this order (quotes -> review highlights -> experience -> provider credibility -> CTA).
3. Keep testimonial content consent-safe and de-identified by default.
4. Maintain premium trust-first visual tone.
5. Paste Canva template links into manifest as each design is completed.

## Production Queue

| Order | Template ID | Manifest Template Name | Canva Design Title | Category |
|---|---|---|---|---|
| 1 | `rvw-quote-01` | Patient Quote Card #1 | `RVW-01 Patient Quote Card 01` | social |
| 2 | `rvw-quote-02` | Patient Quote Card #2 | `RVW-02 Patient Quote Card 02` | social |
| 3 | `rvw-review-01` | 5-Star Review Highlight | `RVW-03 5-Star Review Highlight` | social |
| 4 | `rvw-review-02` | What Patients Say About Us | `RVW-04 What Patients Say About Us` | social |
| 5 | `rvw-experience-01` | Patient Experience Timeline | `RVW-05 Patient Experience Timeline` | social |
| 6 | `rvw-experience-02` | Why Clients Keep Coming Back | `RVW-06 Why Clients Keep Coming Back` | social |
| 7 | `rvw-provider-01` | Meet Your Provider Credibility Post | `RVW-07 Meet Your Provider Credibility Post` | social |
| 8 | `rvw-provider-02` | Training and Certification Spotlight | `RVW-08 Training and Certification Spotlight` | social |
| 9 | `rvw-beforeafter-01` | Results Story Framework | `RVW-09 Results Story Framework` | social |
| 10 | `rvw-cta-01` | Book Your Consultation CTA | `RVW-10 Book Your Consultation CTA` | marketing |

## Paste-Back Map (Fill During Build)

| Template ID | Canva Design Title | Canva Template URL |
|---|---|---|
| `rvw-quote-01` | RVW-01 Patient Quote Card 01 | `PLACEHOLDER_CANVA_URL` |
| `rvw-quote-02` | RVW-02 Patient Quote Card 02 | `PLACEHOLDER_CANVA_URL` |
| `rvw-review-01` | RVW-03 5-Star Review Highlight | `PLACEHOLDER_CANVA_URL` |
| `rvw-review-02` | RVW-04 What Patients Say About Us | `PLACEHOLDER_CANVA_URL` |
| `rvw-experience-01` | RVW-05 Patient Experience Timeline | `PLACEHOLDER_CANVA_URL` |
| `rvw-experience-02` | RVW-06 Why Clients Keep Coming Back | `PLACEHOLDER_CANVA_URL` |
| `rvw-provider-01` | RVW-07 Meet Your Provider Credibility Post | `PLACEHOLDER_CANVA_URL` |
| `rvw-provider-02` | RVW-08 Training and Certification Spotlight | `PLACEHOLDER_CANVA_URL` |
| `rvw-beforeafter-01` | RVW-09 Results Story Framework | `PLACEHOLDER_CANVA_URL` |
| `rvw-cta-01` | RVW-10 Book Your Consultation CTA | `PLACEHOLDER_CANVA_URL` |

## QA Checklist

- [ ] All 10 designs are created in Canva.
- [ ] Titles match the naming convention exactly (`RVW-## ...`).
- [ ] All links in manifest are real Canva template links (no placeholders).
- [ ] Manifest validates in `/admin/import` with 10/10 links filled.
- [ ] Test delivery link opens and all templates load as editable copies.
