import type { DigitalProductConfig } from "./types";

const ETSY_TITLE_MAX = 140;
const TARGET_TAGS = 13;

const FORBIDDEN_PHRASES = [
  "guaranteed results",
  "cure",
  "diagnose",
  "100% compliant",
  "legal advice",
  "replaces an attorney",
  "replaces a lawyer",
  "FDA approved",
  "clinically proven",
  "medical advice",
  "HIPAA certified",
];

export type ListingMetadata = {
  title: string;
  description: string;
  tags: string[];
  materialsLine: string;
  faqMarkdown: string;
  imageHeadlines: string[];
  guardrailWarnings: string[];
};

function applyGuardrails(text: string): { cleaned: string; warnings: string[] } {
  const warnings: string[] = [];
  let cleaned = text;
  for (const phrase of FORBIDDEN_PHRASES) {
    const re = new RegExp(`\\b${phrase}\\b`, "gi");
    if (re.test(cleaned)) {
      warnings.push(`Removed forbidden phrase: "${phrase}"`);
      cleaned = cleaned.replace(re, "[removed]");
    }
  }
  return { cleaned, warnings };
}

function truncateTitle(raw: string): string {
  if (raw.length <= ETSY_TITLE_MAX) return raw;
  const truncated = raw.slice(0, ETSY_TITLE_MAX - 1).replace(/\s+\S*$/, "");
  return truncated + "…";
}

function buildTags(config: DigitalProductConfig): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];

  const push = (t: string) => {
    const norm = t.toLowerCase().trim();
    if (!norm || seen.has(norm)) return;
    seen.add(norm);
    tags.push(norm);
  };

  for (const t of config.tagsSeed) push(t);
  for (const k of config.keywords) push(k);

  push(config.category);
  push("digital download");
  push("instant download");
  push("editable template");

  while (tags.length < TARGET_TAGS) {
    const filler = `${config.brandId} template`;
    if (!seen.has(filler.toLowerCase())) {
      push(filler);
    } else {
      break;
    }
  }

  return tags.slice(0, TARGET_TAGS);
}

function buildDescription(config: DigitalProductConfig): string {
  const sections: string[] = [];

  sections.push(config.descriptionSeed);

  sections.push(
    "\n---\n\n✦ PERFECT FOR\n\n" +
      config.audience.map((a) => `• ${a}`).join("\n"),
  );

  sections.push(
    "\n---\n\n✦ HOW IT WORKS\n\n" +
      "1. Purchase — instant delivery\n" +
      "2. Open your files via the secure download link\n" +
      "3. Edit and customize for your practice\n" +
      "4. Print or save as PDF",
  );

  sections.push(
    "\n---\n\n✦ INSTANT DOWNLOAD\n\n" +
      "Digital files are delivered immediately after purchase.\n\n" +
      `${config.brand} | Oswego, Illinois`,
  );

  return sections.join("\n");
}

function buildFaq(config: DigitalProductConfig): string {
  return [
    `**Q: Can I edit these templates?**`,
    `A: Yes — all templates are fully editable. Customize text, branding, and layout for your practice.`,
    ``,
    `**Q: Is this a physical product?**`,
    `A: No. This is a digital download. No physical item will be shipped.`,
    ``,
    `**Q: Can I use these for multiple locations?**`,
    `A: Templates are licensed for use within your own practice or business. Redistribution or resale is not permitted.`,
    ``,
    `**Q: Do these replace professional legal/medical advice?**`,
    `A: No. These are administrative workflow templates. Consult a licensed professional in your jurisdiction for specific compliance, legal, or clinical guidance.`,
  ].join("\n");
}

export function generateEtsyMetadata(
  config: DigitalProductConfig,
): ListingMetadata {
  const allWarnings: string[] = [];

  const title = truncateTitle(config.listingTitleSeed);

  const rawDesc = buildDescription(config);
  const { cleaned: description, warnings: descWarn } =
    applyGuardrails(rawDesc);
  allWarnings.push(...descWarn);

  const tags = buildTags(config);

  const materialsLine = [
    "Digital download",
    "Editable templates",
    config.deliveryFiles.includeInstructions ? "Instructions included" : null,
  ]
    .filter(Boolean)
    .join(", ");

  const faqMarkdown = buildFaq(config);

  const imageHeadlines = [
    config.internalName,
    `${config.audience[0]} — save hours`,
    "Editable • Print-ready • Instant download",
  ];

  return {
    title,
    description,
    tags,
    materialsLine,
    faqMarkdown,
    imageHeadlines,
    guardrailWarnings: allWarnings,
  };
}
