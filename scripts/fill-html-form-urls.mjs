import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const MANIFEST_DIR = path.join(ROOT, "imports", "npa-manifests-and-spec");
const STRICT_DIR = path.join(ROOT, "imports", "npa-manifests-and-spec-prefilled-strict");
const FORMS_DIR = path.join(ROOT, "public", "forms");

const HTML_MAP = {
  "btx-consultation-form": "BTX-01-Consultation-Form.html",
  "btx-consent-form": "BTX-02-Informed-Consent.html",
  "btx-precare": "BTX-03-Pre-Treatment-Neurotoxin.html",
  "btx-postcare": "BTX-04-Post-Treatment-Neurotoxin.html",
  "btx-treatment-record": "BTX-05-Treatment-Record.html",
  "btx-photo-release": "BTX-06-Photo-Release.html",

  "flr-consultation-form": "FLR-01-Consultation-Form.html",
  "flr-consent-form": "FLR-02-Informed-Consent.html",
  "flr-precare": "FLR-03-Pre-Treatment.html",
  "flr-postcare": "FLR-04-Post-Treatment.html",
  "flr-treatment-record": "FLR-05-Treatment-Record.html",
  "flr-dissolving-consent": "FLR-06-Dissolution-Consent.html",
  "flr-photo-release": "BTX-06-Photo-Release.html",

  "wl-intake-form": "WL-01-Intake-Form.html",
  "wl-consent-form": "WL-02-Consent-Form.html",
  "wl-expectation-guide": "WL-03-GLP1-Journey-Guide.html",
  "wl-nutrition-tracker": "WL-04-Nutrition-Tracker.html",
  "wl-side-effect-log": "WL-05-Side-Effect-Log.html",
  "wl-aftercare-card": "WL-06-Injection-Card.html",
  "wl-progress-photo-release": "WL-07-Photo-Release.html",

  "lsh-intake-form": "LSH-01-Intake-Form.html",
  "lsh-allergy-waiver": "LSH-02-Allergy-Waiver.html",
  "lsh-extension-consent": "LSH-03-Extension-Consent.html",
  "lsh-lift-consent": "LSH-05-Lift-Consent.html",
  "lsh-rebook-card": "LSH-07-Rebook-Card.html",

  "pep-what-are-peptides": "PEP-01-What-Are-Peptides.html",
  "pep-intake-form": "PEP-03-Intake-Form.html",
  "pep-consent-form": "PEP-04-Consent-Form.html",
  "pep-self-injection-guide": "PEP-05-Self-Injection-Guide.html",
  "pep-symptom-tracker": "PEP-06-Monthly-Tracker.html",
  "pep-faq-card": "PEP-07-FAQ-Card.html",

  "cb-iv-intake": "WL-01-Intake-Form.html",
  "cb-iv-menu": null,
  "cb-iv-aftercare": null,
  "cb-wl-intake": "WL-01-Intake-Form.html",
  "cb-wl-consent": "WL-02-Consent-Form.html",
  "cb-wl-guide": "WL-03-GLP1-Journey-Guide.html",
  "cb-social-ig-square": null,
  "cb-social-story": null,
  "cb-hipaa-release": "WL-07-Photo-Release.html",
  "cb-cancellation-policy": null,
};

const PRODUCTS_TO_FILL = [
  "botox-consent-bundle",
  "filler-consent-bundle",
  "weight-loss-kit",
  "lash-aftercare-kit",
  "peptide-patient-guide",
  "combo-bundle",
];

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function writeJson(p, d) {
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
}

function main() {
  let filled = 0;
  let skipped = 0;

  for (const productFile of PRODUCTS_TO_FILL) {
    const manifestPath = path.join(MANIFEST_DIR, `${productFile}.json`);
    if (!fs.existsSync(manifestPath)) {
      console.log(`SKIP missing manifest: ${productFile}`);
      continue;
    }

    const manifest = readJson(manifestPath);
    let changed = false;

    for (const template of manifest.templates) {
      const htmlFile = HTML_MAP[template.id];
      if (!htmlFile) {
        skipped += 1;
        continue;
      }

      const htmlPath = path.join(FORMS_DIR, htmlFile);
      if (!fs.existsSync(htmlPath)) {
        console.log(`WARN: missing HTML file ${htmlFile} for ${template.id}`);
        skipped += 1;
        continue;
      }

      template.canvaTemplateUrl = `/forms/${htmlFile}`;
      template._deliveryType = "html";
      filled += 1;
      changed = true;
    }

    if (changed) {
      writeJson(manifestPath, manifest);
      const strictPath = path.join(STRICT_DIR, `${productFile}.json`);
      if (fs.existsSync(STRICT_DIR)) {
        writeJson(strictPath, manifest);
      }
      console.log(`UPDATED ${productFile}`);
    }
  }

  console.log(`\nFilled ${filled} templates, skipped ${skipped}`);
}

main();
