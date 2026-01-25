export type MascotId =
  | "beau-tox"
  | "peppi"
  | "filla-grace"
  | "f-ill"
  | "rn-lisa-grace"
  | "slim-t"
  | "harmony"
  | "founder"
  | "ryan"
  | "lab-decoder"
  | "root";

type MascotMeta = {
  id: MascotId;
  name: string;
  header: string;
  subheader: string;
  role: string;
  offer: string;
  image: string;
  imageAlt: string;
  credentials?: string;
  suggestions: string[];
};

const MASCOT_META: Record<MascotId, MascotMeta> = {
  "beau-tox": {
    id: "beau-tox",
    name: "Beau-Tox™",
    header: "Chat with Beau-Tox™",
    subheader: "Ask me anything about Botox and injectables",
    role: "Botox & injectables educator",
    offer: "Myth-busting, safety basics, and consult prep",
    image: "/characters/beau.png",
    imageAlt: "Beau-Tox mascot",
    suggestions: [
      "What exactly is Botox and how does it work?",
      "What should I ask during a consultation?",
      "What's the difference between Botox and fillers?",
    ],
  },
  founder: {
    id: "founder",
    name: "Founder",
    header: "Chat with the Founder",
    subheader: "Ask me how providers think and how to navigate care",
    role: "Provider Translator",
    offer: "Clarity without confusion",
    image: "/characters/founder.png",
    imageAlt: "Founder avatar",
    credentials: "Owner | RN-S | CMAA",
    suggestions: [
      "Why do providers seem vague sometimes?",
      "What should I ask to get a clear plan?",
      "How do I avoid feeling upsold?",
    ],
  },
  peppi: {
    id: "peppi",
    name: "Peppi™",
    header: "Chat with Peppi™",
    subheader: "Ask me about peptides, longevity, and wellness",
    role: "Peptide scientist",
    offer: "Simple explanations of mechanisms and research",
    image: "/characters/peppi.png",
    imageAlt: "Peppi mascot",
    suggestions: [
      "What are peptides in simple terms?",
      "How do people use peptides in wellness routines?",
      "What's hype vs. what's real in peptide science?",
    ],
  },
  "filla-grace": {
    id: "filla-grace",
    name: "Filla Grace™",
    header: "Chat with Filla Grace™",
    subheader: "Ask me about fillers, volume, and facial balance",
    role: "Filler & facial balance guide",
    offer: "Natural-looking outcomes and consult questions",
    image: "/characters/filla-grace.png",
    imageAlt: "Filla Grace mascot",
    suggestions: [
      "What's the difference between filler types?",
      "How do providers think about facial balance?",
      "What should I expect at a filler consult?",
    ],
  },
  "f-ill": {
    id: "f-ill",
    name: "F-Ill™",
    header: "Chat with F-Ill™",
    subheader: "Ask me about filler realities and facial anatomy",
    role: "Filler anatomy & reality check",
    offer: "Migration myths, overfilling, and dissolving realities",
    image: "/characters/filla-grace.png",
    imageAlt: "F-Ill mascot",
    suggestions: [
      "What causes filler migration?",
      "What does overfilling look like over time?",
      "What should I know about dissolving?",
    ],
  },
  "rn-lisa-grace": {
    id: "rn-lisa-grace",
    name: "R.N. Lisa Grace™",
    header: "Chat with R.N. Lisa Grace™",
    subheader: "Ask me about safety, consent, and patient rights",
    role: "Clinical ethics & safety advocate",
    offer: "Red flags, informed consent, and safety standards",
    image: "/characters/harmony.png",
    imageAlt: "R.N. Lisa Grace mascot",
    suggestions: [
      "What are red flags at a med spa?",
      "What should informed consent include?",
      "When should I walk away from a provider?",
    ],
  },
  "slim-t": {
    id: "slim-t",
    name: "Slim-T™",
    header: "Chat with Slim-T™",
    subheader: "Ask me about metabolism and sustainable weight loss",
    role: "Metabolic coach",
    offer: "Realistic habits, mindset, and consistency",
    image: "/characters/slim-t.png",
    imageAlt: "Slim-T mascot",
    suggestions: [
      "What actually impacts metabolism?",
      "How do I build sustainable weight-loss habits?",
      "What mindset shifts help people stay consistent?",
    ],
  },
  harmony: {
    id: "harmony",
    name: "Harmony™",
    header: "Chat with Harmony™",
    subheader: "Ask me about hormone balance and wellness basics",
    role: "Hormone balance educator",
    offer: "Foundational education and consult prep",
    image: "/characters/harmony.png",
    imageAlt: "Harmony mascot",
    suggestions: [
      "What does hormone balance really mean?",
      "What are common signs people ask about?",
      "How do I prepare for a hormone consult?",
    ],
  },
  ryan: {
    id: "ryan",
    name: "Ryan™",
    header: "Chat with Ryan™",
    subheader: "Ask me how providers think and why answers can be nuanced",
    role: "Provider reality translator",
    offer: "Consult expectations and real-world constraints",
    image: "/characters/ryan.png",
    imageAlt: "Ryan mascot",
    credentials: "FNP-BC | Full Authority Nurse Practitioner",
    suggestions: [
      "Why do providers say 'it depends' so much?",
      "What should I ask in a consult to get clarity?",
      "How do insurance and cash-pay realities affect care?",
    ],
  },
  "lab-decoder": {
    id: "lab-decoder",
    name: "Lab Decoder™",
    header: "Chat with Lab Decoder™",
    subheader: "Ask me about lab results, biomarkers, and medical data interpretation",
    role: "Medical data analyst & lab result interpreter",
    offer: "Plain-language explanations of blood work, trends, and clinical insights",
    image: "/characters/lab-decoder.png",
    imageAlt: "Lab Decoder mascot",
    credentials: "Medical Data Specialist",
    suggestions: [
      "What does this lab value mean?",
      "Are my results normal or concerning?",
      "How do my labs compare to optimal ranges?",
    ],
  },
  "root": {
    id: "root",
    name: "Root™",
    header: "Chat with Root™",
    subheader: "Ask me about family health patterns and inherited risks",
    role: "Family health pattern analyst",
    offer: "Understanding generational health connections and prevention awareness",
    image: "/characters/root.png",
    imageAlt: "Root mascot",
    credentials: "Family Health Pattern Specialist",
    suggestions: [
      "How do family health patterns work?",
      "What should I know about inherited risks?",
      "How can I understand my family's health history?",
    ],
  },
};

export const MASCOT_IDS: MascotId[] = [
  "founder",
  "beau-tox",
  "peppi",
  "filla-grace",
  "f-ill",
  "rn-lisa-grace",
  "slim-t",
  "harmony",
  "ryan",
];

export const MASCOT_LIST: MascotMeta[] = MASCOT_IDS.map(
  (id) => MASCOT_META[id]
);

export function getMascotList(): MascotMeta[] {
  return MASCOT_LIST;
}

export function getMascotMeta(mascotId?: string): MascotMeta {
  if (!mascotId) return MASCOT_META["beau-tox"];
  if (mascotId in MASCOT_META) {
    return MASCOT_META[mascotId as MascotId];
  }
  return MASCOT_META["beau-tox"];
}
