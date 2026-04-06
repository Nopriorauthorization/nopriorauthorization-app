import {
  CANVA_REQUIRED_FAQ_ANSWER,
  DELIVERY_MASTER_FAQ_ANSWER,
  EDITING_FAQ_ANSWER,
  LICENSE_SHOP_STANDARD,
} from "@/config/delivery-language.config";
import {
  formatMembershipAnnualUsd,
  formatMembershipMonthlyUsd,
  membershipAnnualSavingsVsMonthlyUsd,
} from "@/config/growth-funnel.config";
import { NPA_PRIMARY_MESSAGE } from "@/config/npa-brand.config";

export type FaqEntry = { q: string; a: string };

export type FaqSection = { category: string; items: FaqEntry[] };

const savingsAnnual = membershipAnnualSavingsVsMonthlyUsd();

export const FAQ_PAGE_SECTIONS: FaqSection[] = [
  {
    category: "About NPA",
    items: [
      {
        q: "What is No Prior Authorization?",
        a: `${NPA_PRIMARY_MESSAGE} NPA is built by Danielle Alcala-Glazier and the clinical team behind Hello Gorgeous Med Spa in Oswego, Illinois.`,
      },
      {
        q: "Who created these products?",
        a: "Templates and systems are developed by Danielle Alcala-Glazier (licensed esthetician, med spa founder) and reviewed with Ryan Kent, FNP-BC — content grounded in a working aesthetic practice, not generic agency downloads.",
      },
      {
        q: "Who is NPA for?",
        a: "Med spa owners, nurse injectors, NPs and PAs in aesthetics, estheticians, practice managers, and anyone building or scaling an aesthetic practice.",
      },
      {
        q: "Do I need to be an NP or physician to use clinical products?",
        a: "No. Clinical playbooks are educational resources for licensed providers to adapt within scope of practice. Business, marketing, and operations templates are for anyone running or marketing an aesthetic practice.",
      },
    ],
  },
  {
    category: "Products & format",
    items: [
      {
        q: "What format are the products?",
        a: DELIVERY_MASTER_FAQ_ANSWER,
      },
      {
        q: "Can I edit and customize the templates?",
        a: EDITING_FAQ_ANSWER,
      },
      {
        q: "Do I need Canva Pro?",
        a: CANVA_REQUIRED_FAQ_ANSWER,
      },
      {
        q: "Are these HIPAA compliant?",
        a: "Templates are designed with HIPAA awareness. Requirements vary by state and entity type — have a qualified attorney review clinical and legal documents before use. Our HIPAA Compliance Kit and Medical Disclaimer System help you build the right foundation.",
      },
      {
        q: "Can I use these for multiple locations?",
        a: LICENSE_SHOP_STANDARD,
      },
    ],
  },
  {
    category: "Purchasing & delivery",
    items: [
      {
        q: "How does delivery work?",
        a: "After purchase you receive an email with a secure link. Open your files in the browser — print or save as PDF. Links are valid for 365 days unless stated otherwise on the product page.",
      },
      {
        q: "What payment methods do you accept?",
        a: "Major credit and debit cards through Square secure checkout. Payment card data is handled by Square, not stored on our servers.",
      },
      {
        q: "Can I get a refund?",
        a: "Digital products: all sales are final once the download link is accessed. For technical issues, email hello@nopriorauthorization.com — we respond within 24 hours.",
      },
      {
        q: "I didn't receive my email — what do I do?",
        a: "Check spam first. Then email hello@nopriorauthorization.com with your order details; we resend delivery links within 24 hours.",
      },
    ],
  },
  {
    category: "NPA Pro Membership",
    items: [
      {
        q: "What is NPA Pro Membership?",
        a: `Pro Membership is full access to the NPA template and playbook library while your subscription is active, plus new releases as they ship. Pricing matches our checkout form: ${formatMembershipMonthlyUsd()}/month or ${formatMembershipAnnualUsd()}/year${savingsAnnual > 0 ? ` (save about $${savingsAnnual.toFixed(0)} per year vs twelve monthly payments)` : ""}.`,
      },
      {
        q: "What's included?",
        a: "All catalog playbooks, kits, and systems included in the membership offering — see the full grid and math on the Pro Membership checkout form. New products unlock automatically while you remain a member.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. Cancel anytime; you retain access through the end of your billing period. No cancellation fees.",
      },
      {
        q: "Is annual billing worth it?",
        a: `If you plan to stay on Pro, annual billing is ${formatMembershipAnnualUsd()}/year versus ${formatMembershipMonthlyUsd()}/month × 12 — ${savingsAnnual > 0 ? `you save about $${savingsAnnual.toFixed(0)} per year` : "compare on the membership form"}.`,
      },
    ],
  },
  {
    category: "Clinical disclaimer",
    items: [
      {
        q: "Is this medical advice?",
        a: "No. NPA materials are educational and operational templates, not a substitute for professional medical advice. Licensed providers should adapt content within scope of practice.",
      },
      {
        q: "Should an attorney review legal templates?",
        a: "Yes. Legal and consent documents are starting points. Have a licensed attorney in your jurisdiction review before use.",
      },
    ],
  },
];

export function buildFaqPageJsonLd() {
  const items = FAQ_PAGE_SECTIONS.flatMap((s) => s.items).map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  }));
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items,
  };
}
