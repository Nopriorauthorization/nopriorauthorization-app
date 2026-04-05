/** Eric's 10-pack — files under public/forms (absolute paths from site root). */
export type FreeTemplateLeadRow = {
  label: string;
  fileName: string;
};

export const FREE_TEMPLATES_LEAD_MAGNET: FreeTemplateLeadRow[] = [
  { label: "Skin Analysis Quick Reference", fileName: "NPA-Skin-Analysis-Free-Cheat-Sheet.html" },
  { label: "Vitamin Injection Manual", fileName: "NPA-Vitamin-Injection-Manual-Free.html" },
  { label: "NAD+ Patient Handout", fileName: "NPA-Patient-Handout-NAD-v2.html" },
  { label: "Glutathione Patient Handout", fileName: "NPA-Patient-Handout-Glutathione.html" },
  { label: "Semaglutide Patient Handout", fileName: "NPA-Patient-Handout-Semaglutide.html" },
  { label: "BPC-157 Patient Handout", fileName: "NPA-Patient-Handout-BPC157.html" },
  { label: "GHK-Cu Patient Handout", fileName: "NPA-Patient-Handout-GHKCu.html" },
  { label: "Retail Pricing Formula Cheat Sheet", fileName: "NPA-Retail-Pricing-Formula-Cheat-Sheet.html" },
  { label: "New Patient Intake Checklist", fileName: "NPA-New-Patient-Intake-Cheat-Sheet.html" },
  /** Maps free pack → shop upgrades; credibility + conversion (replaces treatment-room in 10-pack). */
  { label: "NPA Vault Roadmap — What's Next Cheat Sheet", fileName: "NPA-Vault-Roadmap-Free-Cheat-Sheet.html" },
];

export const FREE_TEMPLATES_LEAD_SOURCE = "free-templates" as const;

export function freeTemplateDownloadHref(origin: string, fileName: string): string {
  return `${origin.replace(/\/$/, "")}/forms/${fileName}`;
}
