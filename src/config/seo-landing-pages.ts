/**
 * SEO landing pages — copy, metadata, and internal link targets.
 * No blog; static buyer-intent pages only.
 */

import type { Metadata } from "next";

const SITE = "https://nopriorauthorization.com";

export type SeoLandingFamilyLink = {
  familySlug: string;
  label: string;
};

export type SeoLandingSection = {
  heading: string;
  paragraphs: string[];
};

export type SeoLandingPageDef = {
  /** URL path without leading slash */
  path: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  sections: SeoLandingSection[];
  familyLinks: SeoLandingFamilyLink[];
  /** Optional deep links to high-intent products */
  productLinks?: { href: string; label: string }[];
};

export const SEO_LANDING_PATHS = [
  "botox-marketing-templates",
  "med-spa-marketing-templates",
  "weight-loss-marketing-templates",
  "iv-therapy-marketing-templates",
] as const;

export type SeoLandingPath = (typeof SEO_LANDING_PATHS)[number];

export const BOTOX_MARKETING_TEMPLATES: SeoLandingPageDef = {
  path: "botox-marketing-templates",
  h1: "Botox marketing templates for med spas and injectors",
  metaTitle: "Botox Marketing Templates | Consent, Social & Patient Education | NPA",
  metaDescription:
    "Download-ready Botox and neurotoxin marketing templates: consents, social posts, journey kits, and chair-side references. Built by a working med spa — instant digital delivery.",
  sections: [
    {
      heading: "What you actually need on the Botox and filler line",
      paragraphs: [
        "Neurotoxin and filler patients decide in two places: what they see online before they book, and what they feel in the chair when paperwork and education match the premium experience you sell. Scattered Canva files and one-off PDFs break that story.",
        "Strong Botox marketing templates tie together Instagram and TikTok posts, in-office consent language, aftercare expectations, and the micro-copy on your website so your team does not improvise compliance or brand voice under pressure.",
      ],
    },
    {
      heading: "Consent, clinical touchpoints, and social in one shop",
      paragraphs: [
        "Our injectables collection includes standalone consent templates, full consent bundles, clinical cheat sheets you can keep at the desk, and social bundles sized for real posting volume — not three generic squares.",
        "Everything ships as editable HTML you open in a browser, brand, and save as PDF. No design degree required; your logo, colors, and practice name go where patients expect them.",
      ],
    },
    {
      heading: "Who these templates are built for",
      paragraphs: [
        "Independent injectors, multi-provider med spas, and growing aesthetic practices that need consistency across front desk, providers, and marketing without hiring a full creative department.",
        "If you are launching a new neurotoxin line, refreshing filler messaging after a formulary change, or training new staff on the same script the owner uses, starting from a proven structure saves weeks.",
      ],
    },
    {
      heading: "Go deeper than a single PDF",
      paragraphs: [
        "Pair category picks with the NPA Growth System when you want the full library — clinical, social, ops, and reputation assets in one checkout. Use individual templates when you only need to plug a specific gap today.",
        "Browse the Botox, filler, and injectables family for SKUs mapped to consents, journeys, and social, then upgrade when you are ready for the full stack.",
      ],
    },
  ],
  familyLinks: [
    { familySlug: "botox-filler-injectables", label: "Botox, filler & injectables collection" },
    { familySlug: "social-content", label: "Social & content systems" },
  ],
  productLinks: [
    { href: "/shop/botox-social-bundle", label: "Botox social bundle" },
    { href: "/shop/botox-consent-bundle", label: "Botox consent bundle" },
  ],
};

export const MED_SPA_MARKETING_TEMPLATES: SeoLandingPageDef = {
  path: "med-spa-marketing-templates",
  h1: "Med spa marketing templates for owners who need systems, not noise",
  metaTitle: "Med Spa Marketing Templates | Social, Ops & Clinical Assets | NPA",
  metaDescription:
    "Med spa marketing templates for social, promos, consents, and operations — editable, print-ready, instant download. Scale content without a full in-house marketing team.",
  sections: [
    {
      heading: "Why med spas outgrow generic marketing templates",
      paragraphs: [
        "Aesthetic practices juggle regulated clinical language, high-ticket services, and platforms that reward consistency. Stock templates rarely reflect how you talk about neurotoxin units, body contouring packages, or membership programs.",
        "Purpose-built med spa marketing templates encode how successful practices explain risk, results, and care standards — so your posts, handouts, and intake flows feel intentional instead of copied from unrelated industries.",
      ],
    },
    {
      heading: "From daily posts to launch campaigns",
      paragraphs: [
        "Use calendar systems and promo packs when you need rhythm: planned weeks of content, seasonal pushes, and myth-busting angles that educate without sounding clinical in the feed.",
        "When you open a new service line or hire marketers who do not know your voice yet, starting from structured HTML and Canva-linked kits keeps quality high while you move fast.",
      ],
    },
    {
      heading: "Clinical and business layers, not just pretty graphics",
      paragraphs: [
        "Med spas also need consent-adjacent language, HIPAA-aware patterns where relevant, pricing menus, and reputation workflows. Our shop separates clinical forms, legal and compliance kits, and business systems so you buy what matches the problem in front of you.",
        "That mix is what makes buyer-intent traffic useful: visitors find the exact asset class they were searching for, then discover adjacent templates in the same checkout experience.",
      ],
    },
    {
      heading: "When to buy a bundle versus the full Growth System",
      paragraphs: [
        "Single products and family collections are ideal when you have a sharp need — a consent refresh, a quarter of social, a promo sprint. The Growth System is the everything-in-one path when you want the largest template library and one cart instead of stacking SKUs.",
        "Jump into the shop to filter by category, or open the social and content family to see high-volume systems side by side.",
      ],
    },
  ],
  familyLinks: [
    { familySlug: "social-content", label: "Social & content systems" },
    { familySlug: "business-reputation", label: "Business, Google & reputation" },
    { familySlug: "clinical-playbooks", label: "Clinical playbooks" },
  ],
  productLinks: [
    { href: "/shop/medspa-social-media-system", label: "Med spa social media system" },
    { href: "/shop/seasonal-marketing-pack", label: "Seasonal marketing pack" },
  ],
};

export const WEIGHT_LOSS_MARKETING_TEMPLATES: SeoLandingPageDef = {
  path: "weight-loss-marketing-templates",
  h1: "Weight loss marketing templates for GLP-1 and body programs",
  metaTitle: "Weight Loss Marketing Templates | GLP-1 & Clinic Programs | NPA",
  metaDescription:
    "Weight loss and GLP-1 marketing templates: consents, story packs, journey kits, and clinical references for med spas. Editable files, instant download.",
  sections: [
    {
      heading: "Marketing weight loss in a regulated, skeptical market",
      paragraphs: [
        "Patients compare semaglutide offers across dozens of clinics. Your creative has to be clear, compliant with platform and state expectations, and specific enough that someone recognizes your program as medical-grade, not a meme drop-ship funnel.",
        "Weight loss marketing templates should cover the full arc: awareness posts, objection handling, consent and education, and what happens after the first injection so retention does not fall apart.",
      ],
    },
    {
      heading: "Templates mapped to real clinic workflows",
      paragraphs: [
        "The weight loss and GLP-1 family includes cheat sheets for quick chair reference, consent templates, patient journey kits, and high-volume story templates sized for Instagram and similar channels.",
        "Use them when you are standing up a new program, refreshing creative after a formulary change, or giving your front desk language that matches what marketing runs in ads.",
      ],
    },
    {
      heading: "Education-first content that still converts",
      paragraphs: [
        "The best-performing weight loss creative educates: expectations, timelines, who is not a candidate, and how your practice monitors safety. Templates in this shop bias toward that tone so you are not guessing copy under deadline.",
        "When you need more than social — intake language, aftercare, and internal training cues — combine journey kits with consent assets from the same category page.",
      ],
    },
    {
      heading: "Scale with bundles or the Growth System",
      paragraphs: [
        "Start with the SKUs that match your immediate launch, then add the Growth System when you want every major template line in one purchase. Either path uses the same checkout and instant email delivery.",
      ],
    },
  ],
  familyLinks: [{ familySlug: "weight-loss-glp1", label: "Weight loss & GLP-1 collection" }],
  productLinks: [
    { href: "/shop/glp1-story-templates", label: "GLP-1 story templates" },
    { href: "/shop/weight-loss-kit", label: "Weight loss kit" },
  ],
};

export const IV_THERAPY_MARKETING_TEMPLATES: SeoLandingPageDef = {
  path: "iv-therapy-marketing-templates",
  h1: "IV therapy marketing templates for infusion menus and memberships",
  metaTitle: "IV Therapy Marketing Templates | Drips, Social & Consents | NPA",
  metaDescription:
    "IV therapy marketing templates for med spas: drip menus, social story packs, consents, and patient journeys. Editable HTML, instant digital delivery.",
  sections: [
    {
      heading: "IV lines need clarity, not clutter",
      paragraphs: [
        "Patients scanning IV menus want to understand ingredients, duration, and why your lounge is different — without a wall of unverifiable claims. Good IV therapy marketing templates structure that story so providers and front desk stay aligned.",
        "Whether you run events, memberships, or à la carte drips, you need repeatable creative for feeds, email, and in-room education. One-off posts burn out fast.",
      ],
    },
    {
      heading: "What the IV therapy collection includes",
      paragraphs: [
        "Our IV family combines clinical cheat sheets, consent templates, patient journey assets, and social kits built for volume. Use cheat sheets for quick reference during busy shifts; use story templates when you need weeks of cohesive posts.",
        "Files are editable in the browser and printable for the suite — same delivery model as every other NPA product.",
      ],
    },
    {
      heading: "Operational consistency across locations",
      paragraphs: [
        "Multi-chair and multi-location IV brands break when each site improvises disclaimers or menu descriptions. Centralized templates give you one source of truth you can localize with provider names and hours without rewriting from scratch.",
      ],
    },
    {
      heading: "Next steps for buyers",
      paragraphs: [
        "Open the IV therapy family page to compare SKUs, or browse the full shop if you are also building injectable or weight loss lines in parallel. Add the Growth System when you want the mega library behind a single checkout.",
      ],
    },
  ],
  familyLinks: [
    { familySlug: "iv-therapy", label: "IV therapy collection" },
    { familySlug: "social-content", label: "Social & content systems" },
  ],
  productLinks: [
    { href: "/shop/iv-story-templates", label: "IV story templates" },
    { href: "/shop/iv-therapy-social-kit", label: "IV therapy social kit" },
  ],
};

export const SEO_LANDING_BY_PATH: Record<SeoLandingPath, SeoLandingPageDef> = {
  "botox-marketing-templates": BOTOX_MARKETING_TEMPLATES,
  "med-spa-marketing-templates": MED_SPA_MARKETING_TEMPLATES,
  "weight-loss-marketing-templates": WEIGHT_LOSS_MARKETING_TEMPLATES,
  "iv-therapy-marketing-templates": IV_THERAPY_MARKETING_TEMPLATES,
};

export function buildSeoLandingMetadata(def: SeoLandingPageDef): Metadata {
  const url = `${SITE}/${def.path}`;
  return {
    title: def.metaTitle,
    description: def.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: def.metaTitle,
      description: def.metaDescription,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: def.metaTitle,
      description: def.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export function seoLandingJsonLd(def: SeoLandingPageDef): Record<string, unknown> {
  const url = `${SITE}/${def.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: def.metaTitle,
    description: def.metaDescription,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "No Prior Authorization",
      url: SITE,
    },
    about: {
      "@type": "Thing",
      name: def.h1,
    },
  };
}
