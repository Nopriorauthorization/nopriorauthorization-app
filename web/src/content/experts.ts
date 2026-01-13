export type ExpertProfile = {
  id: string;
  name: string;
  role: string;
  credentials?: string;
  description: string;
  cta: string;
  ctaHref: string;
  image: string;
};

export const EXPERTS: ExpertProfile[] = [
  {
    id: "founder",
    name: "Founder",
    role: "Provider Translator",
    credentials: "OWNER | RN-S | CMAA",
    description:
      "Built to give patients clarity without confusion, hype, or pressure.",
    cta: "Ask the Founder",
    ctaHref: "https://app.nopriorauthorization.com/chat?mascot=founder",
    image: "/experts/founder.png",
  },
  {
    id: "beau-tox",
    name: "Beau-Tox",
    role: "Aesthetics truth teller",
    description:
      "Says what injectors think but will not say out loud. No myths, no fluff.",
    cta: "Ask Beau-Tox",
    ctaHref: "https://app.nopriorauthorization.com/chat?mascot=beau-tox",
    image: "/experts/beau.png",
  },
  {
    id: "peppi",
    name: "Peppi",
    role: "Peptide science & myth-busting",
    description:
      "If TikTok sold it as a miracle, Peppi is here to ruin it with facts.",
    cta: "Ask Peppi",
    ctaHref: "https://app.nopriorauthorization.com/chat?mascot=peppi",
    image: "/experts/peppi.png",
  },
  {
    id: "f-ill",
    name: "F-Ill",
    role: "Fillers & facial anatomy",
    description:
      "Explains fillers, anatomy, and why “natural” is usually just marketing.",
    cta: "Ask F-Ill",
    ctaHref: "https://app.nopriorauthorization.com/chat?mascot=f-ill",
    image: "/experts/f-ill.png",
  },
  {
    id: "rn-lisa-grace",
    name: "R.N. Lisa Grace",
    role: "Safety & ethics",
    description:
      "Advocates for safety, consent, and knowing when to walk away.",
    cta: "Ask R.N. Lisa Grace",
    ctaHref: "https://app.nopriorauthorization.com/chat?mascot=rn-lisa-grace",
    image: "/experts/rn-lisa-grace.png",
  },
  {
    id: "slim-t",
    name: "Slim-T",
    role: "Hormones & metabolism",
    description:
      "Explains what really moves the needle on weight, hormones, and health.",
    cta: "Ask Slim-T",
    ctaHref: "https://app.nopriorauthorization.com/chat?mascot=slim-t",
    image: "/experts/slim-t.png",
  },
  {
    id: "ryan",
    name: "Ryan",
    role: "Provider reality translator",
    credentials: "FNP-BC | Full Authority Nurse Practitioner",
    description:
      "Explains how providers think and why answers are not always simple.",
    cta: "Ask Ryan",
    ctaHref: "https://app.nopriorauthorization.com/chat?mascot=ryan",
    image: "/experts/ryan.png",
  },
];
