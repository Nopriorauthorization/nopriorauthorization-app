export type IntroPart = {
  text: string;
  emphasis?: boolean;
};

export type AvatarIntro = {
  id: string;
  displayName: string;
  introParts: IntroPart[];
  cta: string;
  ctaHref: string;
  ctaNote: string;
  domain: string;
  credentials?: string;
  microcopy?: string;
  poster: string;
  objectPosition?: string;
};

export const AVATAR_MEDIA_BASE = "/hero/avatars";

export const AVATAR_INTROS: AvatarIntro[] = [
  {
    id: "founder",
    displayName: "Founder",
    introParts: [
      { text: "I built No Prior Authorization because patients deserve " },
      { text: "clarity - not confusion.", emphasis: true },
    ],
    cta: "Ask the Founder",
    ctaNote: "Trust anchor",
    ctaHref: "/chat?mascot=founder",
    domain: "Provider Translator",
    credentials: "OWNER | RN-S | CMAA",
    microcopy: "Explains how providers think - without defending bad medicine.",
    poster: "/characters/founder.png",
    objectPosition: "50% 15%",
  },
  {
    id: "beau-tox",
    displayName: "Beau-Tox",
    introParts: [
      { text: "Hey - I'm Beau-Tox. I say what injectors think - but " },
      { text: "won't say to your face.", emphasis: true },
    ],
    cta: "Ask Beau-Tox",
    ctaNote: "No sugar-coating",
    ctaHref: "/chat?mascot=beau-tox",
    domain: "aesthetics",
    microcopy: "Part of your Circle",
    poster: "/characters/Beau sitting.png",
    objectPosition: "50% 20%",
  },
  {
    id: "peppi",
    displayName: "Peppi",
    introParts: [
      { text: "I'm Peppi. If TikTok sold it as a miracle, " },
      { text: "I'm here to ruin it with facts.", emphasis: true },
    ],
    cta: "Ask Peppi",
    ctaNote: "Facts only",
    ctaHref: "/chat?mascot=peppi",
    domain: "peptides",
    microcopy: "Part of your Circle",
    poster: "/characters/peppi.png",
    objectPosition: "50% 20%",
  },
  {
    id: "f-ill",
    displayName: "F-Ill",
    introParts: [
      { text: "I explain fillers, facial anatomy, and why " },
      { text: "'natural' is usually just good marketing.", emphasis: true },
    ],
    cta: "Ask F-Ill",
    ctaNote: "Reality check",
    ctaHref: "/chat?mascot=f-ill",
    domain: "fillers",
    microcopy: "Part of your Circle",
    poster: "/characters/filla-grace.png",
    objectPosition: "50% 20%",
  },
  {
    id: "rn-lisa-grace",
    displayName: "R.N. Lisa Grace",
    introParts: [
      { text: "I'm here for safety, ethics, and " },
      { text: "stopping bad medicine before it hurts someone.", emphasis: true },
    ],
    cta: "Ask R.N. Lisa Grace",
    ctaNote: "Safety first",
    ctaHref: "/chat?mascot=rn-lisa-grace",
    domain: "safety",
    microcopy: "Part of your Circle",
    poster: "/characters/harmony.png",
    objectPosition: "50% 20%",
  },
  {
    id: "slim-t",
    displayName: "Slim-T",
    introParts: [
      { text: "Hormones and weight loss aren't magic. " },
      { text: "I'll tell you what actually moves the needle.", emphasis: true },
    ],
    cta: "Ask Slim-T",
    ctaNote: "No BS",
    ctaHref: "/chat?mascot=slim-t",
    domain: "metabolism",
    microcopy: "Part of your Circle",
    poster: "/characters/slim-t.png",
    objectPosition: "50% 20%",
  },
  {
    id: "ryan",
    displayName: "Ryan",
    introParts: [
      { text: "I explain what providers really mean - and why " },
      { text: "'it depends' isn't always a cop-out.", emphasis: true },
    ],
    cta: "Ask Ryan",
    ctaNote: "Provider translator",
    ctaHref: "/chat?mascot=ryan",
    domain: "Provider Translator",
    credentials: "FNP-BC | Full Authority Nurse Practitioner",
    microcopy: "Explains how providers think - without defending bad medicine.",
    poster: "/characters/ryan.png",
    objectPosition: "50% 15%",
  },
];
