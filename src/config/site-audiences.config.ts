/**
 * Two-path IA: students (nursing / science) vs providers (med spa injectors & owners).
 * Art lives in /public/images/audience/
 */

export type AudienceCta = {
  label: string;
  href: string;
  description: string;
  badge?: string;
};

export const AUDIENCE_IMAGES = {
  micro250Cover: "/images/audience/micro250-exam-prep-cover.png",
  providerEmpowered: "/images/audience/provider-everything-npa.png",
  studentCramming: "/images/audience/student-cramming-nursing.png",
  providerStressed: "/images/audience/provider-stressed-overwhelmed.png",
} as const;

/** Optional loop for student hero — pre-rendered Remotion; replace path if you re-export. */
export const STUDENT_HERO_VIDEO = "/videos/micro270/micro270-ad-square.mp4" as const;

/** Shared CTA wording — same destinations, same expectations site-wide */
export const AUDIENCE_CTA_LABELS = {
  micro270HubButton: "Open Micro 270 Hub — free preview",
  growthSystemButton: "Get the NPA Growth System",
  fullTemplateShop: "Browse the full template shop",
  studentPathLink: "Go to student path",
  providerPathLink: "Go to provider path",
  shopLaneStudent: "Nursing & science — student path",
  shopLaneProvider: "Med spa & injectors — provider path",
} as const;

export const FOR_STUDENTS_META = {
  path: "/for-students",
  title: "Walk into exams with a plan—not a pile of tabs",
  subtitle:
    "Micro 270 Hub first: real exam-style questions and structure. Add bundles, printables, or A&P only when you need the extra edge.",
};

export const FOR_PROVIDERS_META = {
  path: "/for-providers",
  title: "Run the room and the business—not another late-night Canva session",
  subtitle:
    "Start with the NPA Growth System: templates and assets built for injectors and owners. Add patient education and collections when you are ready to scale.",
};

/** Line under “Recommended first step” in the hub block */
export const STUDENT_HUB_STEP_DECK =
  "Micro 270 Hub · free preview · 20 chapters · 1,000+ questions";

export const STUDENT_REASSURANCE =
  "In nursing or science coursework? You are in the right lane—we keep med spa SKUs off this path.";

export const PROVIDER_REASSURANCE =
  "Inject, own, or run an aesthetic practice? You are in the right lane—study tools stay on the student side.";

export const STUDENT_TRUST_LINE =
  "Built from exam-style questions so you know what shows up—before it shows up.";

export const PROVIDER_TRUST_LINE =
  "Built from a real med spa system—used daily to cut admin and increase revenue.";

/** Homepage strip headline + card CTAs — A/B (destinations unchanged) */
export const HOME_STRIP_AB = {
  headline: {
    a: "What are you here to fix first?",
    b: "Start where you’ll get results fastest.",
  },
  studentCta: {
    a: "Go to student tools",
    b: "Start with Micro 270",
  },
  providerCta: {
    a: "Go to provider tools",
    b: "Start with the Growth System",
  },
} as const;

/** Friction-killers directly under home strip primary CTAs */
export const HOME_STRIP_FRICTION = {
  student: "Free preview inside.",
  provider: "Templates + systems. Start in minutes.",
} as const;

export const HOME_STRIP_RECOMMENDED_BADGE = "Recommended first step";

/** Homepage strip — premium “decision” panel */
export const HOME_AUDIENCE_STRIP = {
  kicker: "Choose your path",
  brandLine: "Two paths. One system.",
  subhead:
    "Pass the next exam and clinical week—or ship marketing, consent, and ops that hold up in a real practice. Same brand, two front doors, zero mixed signals.",
  reassurance:
    "Know where you belong? Jump in below—the full site is still one scroll away.",
  student: {
    eyebrow: "Nursing & science",
    title: "Student track",
    body: "Microbiology, A&P, and boards: start in Micro 270 Hub, then add depth only if you need it.",
    href: "/for-students",
    cardReassurance:
      "Start with Micro 270—built for fast, confident exam prep.",
    image: AUDIENCE_IMAGES.micro250Cover,
    imageAlt:
      "Microbiology exam prep artwork — high-yield study visual for nursing and science students",
  },
  provider: {
    eyebrow: "Med spa & injectors",
    title: "Provider track",
    body: "Templates, playbooks, and patient education that plug into real workflows—not a junk drawer of PDFs.",
    href: "/for-providers",
    cardReassurance:
      "Systems, playbooks, and patient education that actually scale.",
    image: AUDIENCE_IMAGES.providerEmpowered,
    imageAlt:
      "Provider-focused NPA visual — empowered clinician at the desk, neon accent brand style",
  },
} as const;

/** Student: after the hub — depth purchases */
export const STUDENT_CORE_TOOLS: AudienceCta[] = [
  {
    label: "Complete Microbiology bundle",
    href: "/shop/micro270-complete-microbiology",
    description: "PDF + full hub + printables + unlimited AI cram — one flagship checkout",
    badge: "Flagship",
  },
  {
    label: "A&P Study Hub",
    href: "/nursing-study/anatomy",
    description: "Cheat sheets, quizzes, flashcards — logged-in anatomy home",
    badge: "Hub",
  },
  {
    label: "Micro 250 exam prep (digital)",
    href: "/shop/micro250-exam-prep-digital",
    description: "17 chapters · 244 questions — PDF download companion",
  },
  {
    label: "Chapter cheat sheets",
    href: "/shop/micro270-chapter-cheat-sheets",
    description: "Printable all-chapter pack — quick memory pass",
  },
];

/** Student: print, alternate tiers, AI */
export const STUDENT_EXTRA_HELP: AudienceCta[] = [
  {
    label: "Physical study books (Printify)",
    href: "/shop/physical-complete-microbiology-spiral",
    description: "Spiral-bound references and NCLEX-style deck — ships to your door",
  },
  {
    label: "NCLEX / study guides bundle",
    href: "/study-guides",
    description: "HTML cheat sheet bundle — broader than Micro alone",
  },
  {
    label: "Question bank only",
    href: "/shop/micro270-question-bank",
    description: "Practice bank without the full PDF bundle",
  },
  {
    label: "AI cram tool",
    href: "/micro270/cram",
    description: "Paste notes → get exam-style questions on demand",
  },
  {
    label: "Micro 270 marketing hub",
    href: "/micro270",
    description: "Overview, pricing, and story — when you want the full tour before the hub",
  },
];

/** Provider: single lead SKU */
export const PROVIDER_LEAD = {
  label: AUDIENCE_CTA_LABELS.growthSystemButton,
  href: "/shop/growth-system",
  oneLiner: "If you only do one thing on this site, do this first.",
  description:
    "One stacked bundle—consent, social, ops, and campaign assets—so you stop rebuilding from scratch every week.",
  badge: "Start here",
} as const;

/** Provider: intentional second — patient education */
export const PROVIDER_PATIENT_ED_FLAGSHIP = {
  label: "Hello Gorgeous — THE BOOK",
  href: "/book",
  description:
    "24 chapters of patient education you can hand to clients — builds trust and cuts consult repetition.",
  badge: "Patient education",
} as const;

/** Provider: collections — one door */
export const PROVIDER_COLLECTIONS = {
  title: "Browse by collection",
  description:
    "When you already know the theme—Botox & filler, GLP-1, IV, legal, social, playbooks—jump in by family instead of scrolling the whole grid.",
  href: "/shop/families",
  ctaLabel: "Shop by collection",
} as const;

/** Clinical / chair-side adjacencies */
export const PROVIDER_CLINICAL_ROW: AudienceCta[] = [
  {
    label: "Playbooks",
    href: "/shop#start-here",
    description: "Clinical education written from real practice",
  },
  {
    label: "Cheat sheets",
    href: "/cheat-sheets",
    description: "Chair-side quick references",
  },
  {
    label: "Facial anatomy (injectors)",
    href: "/shop/facial-anatomy-nurse-injector",
    description: "Depth, danger zones, confidence at the needle",
  },
];

/** Business / growth */
export const PROVIDER_BUSINESS_ROW: AudienceCta[] = [
  {
    label: "Full template shop",
    href: "/shop",
    description: "All SKUs—consent, kits, social, legal—in one grid",
  },
  {
    label: "49-star reputation system",
    href: "/shop/npa-49-star-system",
    description: "Reviews and Google reputation playbook",
  },
  {
    label: "Free practice audit",
    href: "/audit",
    description: "See where documentation and marketing stand",
  },
];
