/** Long-form /membership page — pricing comes from MEMBERSHIP_CONFIG (must match NPA-Pro-Membership.html). */

export const MEMBERSHIP_VALUE_STATS = [
  { value: "$2,900+", label: "catalog value if purchased separately" },
  { value: "7+", label: "clinical & ops playbooks" },
  { value: "Monthly", label: "new drops & member updates" },
  { value: "Unlimited", label: "digital audit runs (Pro)" },
] as const;

export const MEMBERSHIP_EVERYTHING_INCLUDED = [
  "All med-spa playbooks (Botox & filler, GLP-1, IV, skincare, PMU, advanced aesthetics, onboarding)",
  "Google Domination Playbook & related growth systems included in the library",
  "Patient communication kits, aftercare cards, welcome packet, signage kits",
  "Every new template, playbook, or kit we release while you’re an active member",
] as const;

export const MEMBERSHIP_FREE_VS_PRO = [
  { feature: "Buy individual templates", free: "Pay per product", pro: "Full library included" },
  { feature: "New releases", free: "Purchase separately", pro: "Auto-unlocked while subscribed" },
  { feature: "Digital audit", free: "Limited", pro: "Unlimited runs" },
  { feature: "Member pricing / first access", free: "—", pro: "Before public launch" },
] as const;

export const MEMBERSHIP_TESTIMONIALS = [
  {
    quote:
      "I joined for the injectable playbook and stayed for everything else. Something new drops every month and it’s always what I needed next.",
    author: "NP injector",
    location: "Nashville, TN",
  },
  {
    quote:
      "The Google playbook alone did more for local search in 30 days than months of generic marketing advice. Having it inside membership is a steal.",
    author: "Med spa owner",
    location: "Denver, CO",
  },
  {
    quote:
      "Patient communication templates changed how my team operates — we finally have a system instead of texting from memory.",
    author: "Injector & owner",
    location: "Miami, FL",
  },
] as const;

export const MEMBERSHIP_PAGE_FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime with no cancellation fees. You keep access through the end of your paid billing period.",
  },
  {
    q: "What happens when new products are added?",
    a: "Active members get new playbooks, kits, and templates automatically — no extra checkout for each release.",
  },
  {
    q: "I already bought products individually — can I get credit?",
    a: "Email hello@nopriorauthorization.com with your receipts. We’ll help with a fair path into Pro Membership.",
  },
  {
    q: "What format is everything in?",
    a: "Same as the shop: print-ready HTML in the browser, plus optional Canva links on select social packs. See our FAQ for the full delivery model.",
  },
] as const;
