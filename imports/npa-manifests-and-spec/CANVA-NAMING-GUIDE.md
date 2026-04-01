# NPA — Exact Canva Template Naming Guide
# Use these EXACT names when creating each design in Canva
# Anthony's fuzzy matcher reads these names — close enough works, but exact is best

---

## CANVA FOLDER STRUCTURE

Save each design into its matching folder in Canva:

| Canva Folder | Products |
|---|---|
| **NPA — No Prior Authorization** | Parent folder |
| **Botox Consent Bundle** | btx-01 through btx-06 |
| **Dermal Filler Consent Bundle** | flr-01 through flr-06 |
| **GLP-1 Weight Loss Kit** | wl-01 through wl-07 |
| **Lash Aftercare Kit** | lsh-01 through lsh-07 |
| **Peptide and BHRT Patient Guide** | pep-01 through pep-07 |
| **Complete Med Spa Bundle** | cb shared templates |

---

## HOW TO CREATE EACH TEMPLATE IN CANVA

1. Go to canva.com → Create a design
2. Choose "Document" (8.5×11) or custom size as noted
3. Build the design using content from NPA-all-canva-content.zip
4. Rename the design using the EXACT name in the "Canva Design Name" column below
5. Save into the matching Canva folder listed above
6. Repeat for all 26 designs

---

## BOTOX CONSENT BUNDLE — 6 designs

| # | Canva Design Name (EXACT) | Size | File in ZIP |
|---|---|---|---|
| 1 | Neurotoxin Consultation Medical History Form | 8.5×11 | BTX-01 |
| 2 | Botox Neurotoxin Informed Consent Form | 8.5×11 | BTX-02 |
| 3 | Pre-Treatment Instructions Neurotoxin | 8.5×11 | BTX-03 |
| 4 | Post-Treatment Aftercare Neurotoxin | 8.5×11 | BTX-04 |
| 5 | Neurotoxin Treatment Record Dosing Log | 8.5×11 | BTX-05 |
| 6 | Before After Photography Consent | 8.5×11 | BTX-06 |

---

## DERMAL FILLER CONSENT BUNDLE — 6 designs
## (Photo Consent = same design as BTX-06 — reuse that Canva link)

| # | Canva Design Name (EXACT) | Size | File in ZIP |
|---|---|---|---|
| 7 | Dermal Filler Consultation Medical History Form | 8.5×11 | FLR-01 |
| 8 | Dermal Filler Informed Consent Form | 8.5×11 | FLR-02 |
| 9 | Pre-Treatment Instructions Dermal Filler | 8.5×11 | FLR-03 |
| 10 | Post-Treatment Aftercare Dermal Filler | 8.5×11 | FLR-04 |
| 11 | Filler Treatment Record Product Log | 8.5×11 | FLR-05 |
| 12 | Hyaluronidase Dissolution Consent Form | 8.5×11 | FLR-06 |
| — | Before After Photography Consent | — | REUSE BTX-06 |

---

## GLP-1 WEIGHT LOSS KIT — 7 designs

| # | Canva Design Name (EXACT) | Size | File in ZIP |
|---|---|---|---|
| 13 | GLP-1 Patient Intake Form | 8.5×11 | WL-01 |
| 14 | GLP-1 Treatment Consent Form | 8.5×11 | WL-02 |
| 15 | What to Expect Your GLP-1 Journey | 8.5×11 | WL-03 |
| 16 | Weekly Nutrition Symptom Tracker | 8.5×11 | WL-04 |
| 17 | Side Effect Log Action Guide | 8.5×11 | WL-05 |
| 18 | Injection Day Aftercare Card | 3.5×2 | WL-06 |
| 19 | Progress Photo Video Release Form | 8.5×11 | WL-07 |

---

## LASH AFTERCARE KIT — 5 new designs
## (Lash Extension Aftercare + Lash Lift Aftercare already exist in your Canva)

| # | Canva Design Name (EXACT) | Size | File in ZIP |
|---|---|---|---|
| 20 | Lash Client Intake Health History Form | 8.5×11 | LSH-01 |
| 21 | Patch Test Waiver Allergy Release | 8.5×11 | LSH-02 |
| 22 | Lash Extension Consent Form | 8.5×11 | LSH-03 |
| 23 | Lash Lift Tint Consent Form | 8.5×11 | LSH-05 |
| 24 | Rebooking Reminder Card | 3.5×2 | LSH-07 |

---

## PEPTIDE & BHRT GUIDE — 6 new designs
## (Understanding BHRT Patient Guide already exists in your Canva)

| # | Canva Design Name (EXACT) | Size | File in ZIP |
|---|---|---|---|
| 25 | What Are Peptides Patient Education Guide | 8.5×11 | PEP-01 |
| 26 | Peptide Hormone Therapy Intake Form | 8.5×11 | PEP-03 |
| 27 | Peptide Therapy Informed Consent Form | 8.5×11 | PEP-04 |
| 28 | Self-Injection Training Guide | 8.5×11 | PEP-05 |
| 29 | Monthly Symptom Progress Tracker | 8.5×11 | PEP-06 |
| 30 | Peptide Therapy FAQ Card | 5×7 | PEP-07 |

---

## AFTER BUILDING ALL DESIGNS — Anthony's 4-command sequence

Once you've created and named all designs in Canva, tell Anthony to run:

1. Re-authenticate Canva OAuth in browser → hit /api/canva/list-designs → save new JSON
2. npm run store:fill      ← auto-matches your new designs to manifests
3. npm run store:sync      ← writes links into all manifest JSON files  
4. npm run store:build     ← verifies everything is connected
5. Upload via /admin/import ← all 6 products go live

---

## REUSE SHORTCUTS (saves you 3 designs)

These templates can share a single Canva design across multiple products:

| Single Canva design | Used in these products |
|---|---|
| Before After Photography Consent | Botox bundle + Filler bundle |
| Progress Photo Video Release Form | Weight loss kit + Combo bundle |
| GLP-1 Patient Intake Form | Weight loss kit + Combo bundle |
| GLP-1 Treatment Consent Form | Weight loss kit + Combo bundle |
| What to Expect Your GLP-1 Journey | Weight loss kit + Combo bundle |

Same Canva template link works in both manifests — Anthony's system handles it.

---

## TOTAL UNIQUE DESIGNS TO BUILD: 26
## ESTIMATED TIME: 2-4 hours in Canva (content already written — just layout)
