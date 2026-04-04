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
  /** Optional lead copy directly under H1 */
  introParagraphs?: string[];
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
  "botox-instagram-templates",
  "med-spa-consent-forms",
  "weight-loss-intake-forms",
  "iv-therapy-intake-form",
  "med-spa-marketing-ideas",
  "how-to-get-more-med-spa-clients",
  "glp1-marketing-strategy",
  "aesthetic-clinic-marketing",
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

export const BOTOX_INSTAGRAM_TEMPLATES: SeoLandingPageDef = {
  path: "botox-instagram-templates",
  h1: "Botox Instagram Templates That Bring in Clients",
  metaTitle: "Botox Instagram Templates | Social Posts for Med Spas | NPA",
  metaDescription:
    "Botox and filler Instagram templates for med spas: educational graphics, promos, and story-ready layouts. Edit fast, post consistently, book more consults — instant download.",
  introParagraphs: [
    "Struggling to stay consistent on Instagram? Most med spas lose potential clients simply because they do not post regularly or their content does not convert. These Botox Instagram templates are designed to fix that instantly.",
  ],
  sections: [
    {
      heading: "What you get",
      paragraphs: [
        "Ready-to-post Canva templates for Botox, filler, and injectable marketing, including educational graphics, promotional posts, and before-and-after style layouts that respect platform policies and your clinical voice.",
        "Pair social volume with consent bundles and journey kits from the same shop so what patients see in the feed matches what they sign in the office — no more disconnected messaging between marketing and operations.",
      ],
    },
    {
      heading: "Why most Botox marketing fails",
      paragraphs: [
        "Most med spas post inconsistently or use generic content that does not build trust. Botox clients want education, professionalism, and visual consistency before they ever book.",
        "When every post is a last-minute screenshot or a stock graphic, your feed stops looking like a medical aesthetic practice and starts looking like noise. Templates give you a repeatable structure so providers and front desk can approve creative faster.",
      ],
    },
    {
      heading: "The better approach",
      paragraphs: [
        "A done-for-you template system helps your clinic stay visible, look polished, and post faster without guessing what to say or design.",
        "Start from NPA layouts built for injectors and med spa owners, customize with your offers and photos, and keep a backlog of posts ready for busy weeks — the same workflow high-performing practices use to stay top-of-mind.",
      ],
    },
    {
      heading: "Your next step",
      paragraphs: [
        "Open the Botox and injectables family for consents and journeys, browse the full shop for every SKU, or upgrade to the Growth System when you want the entire template library in one checkout.",
      ],
    },
  ],
  familyLinks: [
    { familySlug: "botox-filler-injectables", label: "Botox, filler & injectables collection" },
    { familySlug: "social-content", label: "Social & content systems" },
  ],
  productLinks: [
    { href: "/shop/botox-social-bundle", label: "Botox social bundle" },
    { href: "/shop/filler-social-bundle", label: "Filler social bundle" },
    { href: "/shop/complete-injector-bundle", label: "Complete injector bundle" },
  ],
};

export const MED_SPA_CONSENT_FORMS: SeoLandingPageDef = {
  path: "med-spa-consent-forms",
  h1: "Med Spa Consent Forms That Protect Your Practice",
  metaTitle: "Med Spa Consent Forms | Botox, Filler & Treatment Docs | NPA",
  metaDescription:
    "Med spa consent forms and clinical documentation: Botox, filler, treatment consent, acknowledgements, and aftercare. Editable HTML, print-ready, instant download.",
  introParagraphs: [
    "Consent forms are one of the most important systems inside a med spa. Clear documentation protects your practice, improves professionalism, and helps clients understand the treatment they are receiving.",
  ],
  sections: [
    {
      heading: "What you need",
      paragraphs: [
        "Cover Botox, filler, treatment consent, client acknowledgement, and aftercare documentation — the full paper trail patients expect from a medical-grade aesthetic practice.",
        "NPA bundles group related consents so you are not stitching PDFs from five different vendors; everything is designed to read consistently with your brand once you add practice details.",
      ],
    },
    {
      heading: "Why documentation matters",
      paragraphs: [
        "Poor paperwork increases confusion, weakens your workflow, and creates unnecessary liability.",
        "When staff cannot find the right form or patients see conflicting language between the website and the clipboard, trust erodes before the first syringe. Structured consent assets reduce that friction.",
      ],
    },
    {
      heading: "Real-world workflow",
      paragraphs: [
        "These assets should feel like real practice documents built from med spa operations, not generic downloadable forms.",
        "Open in a browser, customize for your state and protocols, print or save as PDF, and train new hires on one standard set — the same pattern owners use when scaling to multiple providers or locations.",
      ],
    },
    {
      heading: "Your next step",
      paragraphs: [
        "Shop standalone consents and bundles in clinical and legal families, browse every form in the main shop, or choose the Growth System when you want clinical, social, and ops templates together.",
      ],
    },
  ],
  familyLinks: [
    { familySlug: "botox-filler-injectables", label: "Botox, filler & injectables collection" },
    { familySlug: "legal-compliance", label: "Legal & compliance collection" },
  ],
  productLinks: [
    { href: "/shop/consent-botox-neurotoxins", label: "Botox & neurotoxin consent" },
    { href: "/shop/botox-consent-bundle", label: "Botox consent bundle" },
    { href: "/shop/hipaa-compliance-kit", label: "HIPAA compliance kit" },
  ],
};

export const WEIGHT_LOSS_INTAKE_FORMS: SeoLandingPageDef = {
  path: "weight-loss-intake-forms",
  h1: "Weight Loss Intake Forms for GLP-1 Clinics",
  metaTitle: "Weight Loss Intake Forms | GLP-1 Clinic Documentation | NPA",
  metaDescription:
    "Weight loss and GLP-1 intake forms: health history, onboarding, program support docs. Organize your clinic, polish patient experience — editable templates, instant download.",
  introParagraphs: [
    "A strong intake process helps weight loss clinics stay organized, gather the right information, and make patients feel guided from day one.",
  ],
  sections: [
    {
      heading: "What is included",
      paragraphs: [
        "Intake questionnaires, health history forms, onboarding forms, and GLP-1 program support documentation aligned with how busy clinics actually move patients from consult to first dose.",
        "Combine intake language with consent and journey assets so marketing, front desk, and clinical staff share one narrative about safety, expectations, and follow-up.",
      ],
    },
    {
      heading: "Why clinics struggle",
      paragraphs: [
        "Without structured intake systems, weight loss programs feel scattered and harder to scale.",
        "Ad-hoc Google Docs and printable PDFs from five sources create version chaos. Templates give you a single baseline you can update once and roll out everywhere.",
      ],
    },
    {
      heading: "Why templates help",
      paragraphs: [
        "Templates save time, improve consistency, and create a more polished patient experience.",
        "They also make training easier: new coordinators learn one intake flow instead of inheriting a folder of mismatched files from the last marketer.",
      ],
    },
    {
      heading: "Your next step",
      paragraphs: [
        "Explore the weight loss and GLP-1 family for kits and story templates, open the full shop for every asset, or add the Growth System when you want the mega bundle in one cart.",
      ],
    },
  ],
  familyLinks: [{ familySlug: "weight-loss-glp1", label: "Weight loss & GLP-1 collection" }],
  productLinks: [
    { href: "/shop/weight-loss-kit", label: "Weight loss kit" },
    { href: "/shop/glp1-patient-journey-kit", label: "GLP-1 patient journey kit" },
    { href: "/shop/consent-glp1-weight-loss", label: "GLP-1 weight loss consent" },
  ],
};

export const IV_THERAPY_INTAKE_FORM: SeoLandingPageDef = {
  path: "iv-therapy-intake-form",
  h1: "IV Therapy Intake Forms That Streamline Your Workflow",
  metaTitle: "IV Therapy Intake Forms | Consent & Screening Templates | NPA",
  metaDescription:
    "IV therapy intake and consent templates: hydration screening, vitamin drip paperwork, professional workflow support. Fast, editable, instant digital delivery for med spas.",
  introParagraphs: [
    "IV therapy clinics move quickly, and your documentation process should support that speed without sacrificing professionalism.",
  ],
  sections: [
    {
      heading: "What these forms cover",
      paragraphs: [
        "Hydration intake, screening, vitamin injection paperwork, consent, and basic workflow support so the lounge stays busy without bottlenecks at the clipboard.",
        "Match intake with IV social kits and journey assets when you want the same tone in ads, DMs, and the treatment room.",
      ],
    },
    {
      heading: "The problem with poor documentation",
      paragraphs: [
        "Disorganized intake slows down operations and makes the client experience feel less professional.",
        "Patients notice when forms look thrown together or contradict what they read online — especially for premium drip menus and memberships.",
      ],
    },
    {
      heading: "A better system",
      paragraphs: [
        "A clean, editable intake form system helps clinics move faster and look more established.",
        "Standardize once, customize per location or provider, and keep legal review focused on real risk instead of fixing formatting every quarter.",
      ],
    },
    {
      heading: "Your next step",
      paragraphs: [
        "Browse the IV therapy family for consents, journeys, and social volume, explore the full shop, or choose the Growth System for the complete NPA library.",
      ],
    },
  ],
  familyLinks: [
    { familySlug: "iv-therapy", label: "IV therapy collection" },
    { familySlug: "social-content", label: "Social & content systems" },
  ],
  productLinks: [
    { href: "/shop/consent-iv-im-therapy", label: "IV & IM therapy consent" },
    { href: "/shop/iv-therapy-patient-journey-kit", label: "IV therapy patient journey kit" },
    { href: "/shop/iv-story-templates", label: "IV story templates" },
  ],
};

export const MED_SPA_MARKETING_IDEAS: SeoLandingPageDef = {
  path: "med-spa-marketing-ideas",
  h1: "Med Spa Marketing Ideas That Actually Work",
  metaTitle: "Med Spa Marketing Ideas | Templates & Systems That Convert | NPA",
  metaDescription:
    "Practical med spa marketing ideas: education, promos, social proof, and consistency — backed by done-for-you templates. Instant download from NPA.",
  introParagraphs: [
    "Most med spa marketing advice is too generic to be useful. The strategies that work best are the ones that build trust, show results, and keep your brand consistent.",
  ],
  sections: [
    {
      heading: "What works",
      paragraphs: [
        "Educational content, promotional content, before-and-after style marketing, social proof, and consistency beat one viral post every six months.",
        "Patients buy from practices that look organized across Instagram, Google, email, and the front desk — not from whoever shouted the loudest this week.",
      ],
    },
    {
      heading: "What does not work",
      paragraphs: [
        "Random posting, weak branding, and inconsistent messaging erode trust even when you have great injectors.",
        "If your offers change every week and your graphics look like five different brands, prospects assume the experience inside the suite will feel the same way.",
      ],
    },
    {
      heading: "Systemized marketing",
      paragraphs: [
        "Templates and systems make it easier to stay visible and book clients without constantly creating from scratch.",
        "Calendars, promo packs, and mega bundles give you a runway of ideas; you customize and ship instead of staring at a blank Canva file after a ten-hour clinic day.",
      ],
    },
    {
      heading: "Your next step",
      paragraphs: [
        "Grab high-volume bundles from the social and content family, browse the full shop by category, or lock in the Growth System when you want every major line in one purchase.",
      ],
    },
  ],
  familyLinks: [
    { familySlug: "social-content", label: "Social & content systems" },
    { familySlug: "business-reputation", label: "Business, Google & reputation" },
  ],
  productLinks: [
    { href: "/shop/combo-bundle", label: "Combo bundle (mega template stack)" },
    { href: "/shop/medspa-social-media-system", label: "Med spa social media system" },
    { href: "/shop/seasonal-marketing-pack", label: "Seasonal marketing pack" },
  ],
};

export const HOW_TO_GET_MORE_MED_SPA_CLIENTS: SeoLandingPageDef = {
  path: "how-to-get-more-med-spa-clients",
  h1: "How to Get More Clients for Your Med Spa",
  metaTitle: "How to Get More Med Spa Clients | Marketing Systems & Templates | NPA",
  metaDescription:
    "Grow med spa bookings with consistent content, stronger branding, education-led marketing, and offers that convert — plus done-for-you templates from NPA.",
  introParagraphs: [
    "Getting more med spa clients requires more than occasional posting. It takes a consistent system for trust, visibility, and offers.",
  ],
  sections: [
    {
      heading: "Core drivers",
      paragraphs: [
        "Consistent content, better branding, educational marketing, and strong offers move the needle more than chasing every new platform feature.",
        "Local visibility still matters: reviews, Google Business Profile hygiene, and clear service pages turn curiosity into booked consults.",
      ],
    },
    {
      heading: "Common mistakes",
      paragraphs: [
        "Posting without a plan, inconsistent visuals, and poor follow-through waste ad spend and staff time.",
        "When leads hit your inbox or DMs and nobody has a script, even good traffic dies on the vine.",
      ],
    },
    {
      heading: "Why systems matter",
      paragraphs: [
        "Done-for-you templates and workflow tools help business owners market faster and more professionally.",
        "You still run the practice — the system carries creative load so you are not rebuilding the wheel every Monday.",
      ],
    },
    {
      heading: "Your next step",
      paragraphs: [
        "Explore best-selling playbooks and reputation tools, open the full shop for every category, or choose the Growth System for maximum coverage in one checkout.",
      ],
    },
  ],
  familyLinks: [
    { familySlug: "business-reputation", label: "Business, Google & reputation" },
    { familySlug: "social-content", label: "Social & content systems" },
  ],
  productLinks: [
    { href: "/shop/google-domination-playbook", label: "Google domination playbook" },
    { href: "/shop/npa-49-star-system", label: "NPA 4.9 star reputation system" },
    { href: "/shop/combo-bundle", label: "Combo bundle" },
  ],
};

export const GLP1_MARKETING_STRATEGY: SeoLandingPageDef = {
  path: "glp1-marketing-strategy",
  h1: "GLP-1 Marketing Strategy for Weight Loss Clinics",
  metaTitle: "GLP-1 Marketing Strategy | Templates for Weight Loss Clinics | NPA",
  metaDescription:
    "GLP-1 and weight loss clinic marketing strategy: education-first messaging, polished creative, and scalable templates. Build trust and bookings — instant download.",
  introParagraphs: [
    "GLP-1 and weight loss programs are growing fast, but clinics still need clear marketing systems to educate prospects and turn interest into bookings.",
  ],
  sections: [
    {
      heading: "Education first",
      paragraphs: [
        "Patients want clarity, trust, and professional presentation before they commit to a medical weight program.",
        "Lead with expectations, eligibility framing, and how you monitor safety — not just before-and-after hype that platforms and medical boards scrutinize.",
      ],
    },
    {
      heading: "Messaging matters",
      paragraphs: [
        "A weight loss clinic needs content that feels polished, helpful, and consistent.",
        "When your ads, Instagram highlights, and intake packet disagree, prospects assume the clinical experience will feel disjointed too.",
      ],
    },
    {
      heading: "Scale with templates",
      paragraphs: [
        "Using ready-made marketing assets makes it easier to promote your program without reinventing the wheel.",
        "Story templates, journey kits, and consent bundles stack together so you can launch faster and refresh creative on a schedule instead of in a panic.",
      ],
    },
    {
      heading: "Your next step",
      paragraphs: [
        "Shop the weight loss and GLP-1 family for kits and social packs, browse the full template shop, or upgrade to the Growth System for the entire NPA library.",
      ],
    },
  ],
  familyLinks: [{ familySlug: "weight-loss-glp1", label: "Weight loss & GLP-1 collection" }],
  productLinks: [
    { href: "/shop/glp1-story-templates", label: "GLP-1 story templates" },
    { href: "/shop/weight-loss-kit", label: "Weight loss kit" },
    { href: "/shop/glp1-patient-journey-kit", label: "GLP-1 patient journey kit" },
  ],
};

export const AESTHETIC_CLINIC_MARKETING: SeoLandingPageDef = {
  path: "aesthetic-clinic-marketing",
  h1: "Aesthetic Clinic Marketing That Drives Bookings",
  metaTitle: "Aesthetic Clinic Marketing | Templates & Growth Systems | NPA",
  metaDescription:
    "Aesthetic clinic marketing that builds trust, visibility, and bookings: branding, content systems, and conversion-focused templates. Instant download from NPA.",
  introParagraphs: [
    "Aesthetic clinics need more than pretty graphics. They need marketing systems that build trust, attract attention, and support consistent growth.",
  ],
  sections: [
    {
      heading: "Branding",
      paragraphs: [
        "Professional branding changes how clients perceive your clinic.",
        "Consistent typography, color, and tone across social, email, and in-office handouts signal that your standards match your pricing — especially in competitive injectable and energy-device markets.",
      ],
    },
    {
      heading: "Content system",
      paragraphs: [
        "A steady flow of high-quality content helps clinics stay visible and credible.",
        "Calendars, strategy systems, and promo packs turn sporadic posting into a pipeline your team can actually maintain.",
      ],
    },
    {
      heading: "Conversion",
      paragraphs: [
        "Marketing should lead to consultations, bookings, and stronger retention.",
        "Templates for offers, membership messaging, reviews, and follow-up reduce the gap between attention and revenue — without sounding desperate in the feed.",
      ],
    },
    {
      heading: "Your next step",
      paragraphs: [
        "Explore social and content families for high-volume systems, browse the full shop, or choose the Growth System when you want every major template line in one checkout.",
      ],
    },
  ],
  familyLinks: [
    { familySlug: "social-content", label: "Social & content systems" },
    { familySlug: "botox-filler-injectables", label: "Botox, filler & injectables collection" },
  ],
  productLinks: [
    { href: "/shop/medspa-content-strategy-system", label: "Med spa content strategy system" },
    { href: "/shop/google-domination-playbook", label: "Google domination playbook" },
    { href: "/shop/patient-loyalty-system", label: "Patient loyalty system" },
  ],
};

export const SEO_LANDING_BY_PATH: Record<SeoLandingPath, SeoLandingPageDef> = {
  "botox-marketing-templates": BOTOX_MARKETING_TEMPLATES,
  "med-spa-marketing-templates": MED_SPA_MARKETING_TEMPLATES,
  "weight-loss-marketing-templates": WEIGHT_LOSS_MARKETING_TEMPLATES,
  "iv-therapy-marketing-templates": IV_THERAPY_MARKETING_TEMPLATES,
  "botox-instagram-templates": BOTOX_INSTAGRAM_TEMPLATES,
  "med-spa-consent-forms": MED_SPA_CONSENT_FORMS,
  "weight-loss-intake-forms": WEIGHT_LOSS_INTAKE_FORMS,
  "iv-therapy-intake-form": IV_THERAPY_INTAKE_FORM,
  "med-spa-marketing-ideas": MED_SPA_MARKETING_IDEAS,
  "how-to-get-more-med-spa-clients": HOW_TO_GET_MORE_MED_SPA_CLIENTS,
  "glp1-marketing-strategy": GLP1_MARKETING_STRATEGY,
  "aesthetic-clinic-marketing": AESTHETIC_CLINIC_MARKETING,
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
