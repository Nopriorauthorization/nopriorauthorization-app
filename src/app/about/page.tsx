import Link from "next/link";
import type { Metadata } from "next";
import { NPA_PRIMARY_MESSAGE, NPA_SITE_URL } from "@/config/npa-brand.config";
import {
  formatMembershipAnnualUsd,
  formatMembershipMonthlyUsd,
} from "@/config/growth-funnel.config";
import { MEMBERSHIP_CONFIG } from "@/config/growth-funnel.config";

export const metadata: Metadata = {
  title: "About Danielle Alcala-Glazier & No Prior Authorization",
  description: `${NPA_PRIMARY_MESSAGE} Founder story, credentials, and why buyers trust NPA.`,
  alternates: { canonical: `${NPA_SITE_URL}/about` },
};

export default function AboutPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Danielle Alcala-Glazier",
    jobTitle: "Founder, No Prior Authorization · Licensed Esthetician",
    url: `${NPA_SITE_URL}/about`,
    description:
      "Founder of Hello Gorgeous Med Spa and creator of No Prior Authorization — digital templates and systems for aesthetic practices.",
    worksFor: {
      "@type": "Organization",
      name: "Hello Gorgeous Med Spa",
      address: {
        "@type": "PostalAddress",
        streetAddress: "74 W Washington St",
        addressLocality: "Oswego",
        addressRegion: "IL",
        addressCountry: "US",
      },
    },
    knowsAbout: [
      "Medical aesthetics",
      "Med spa operations",
      "Aesthetic injector education",
      "Practice management templates",
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#1A1A1A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D4537E]">About</p>
        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Built inside a real med spa — not a template factory
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[#5c5c5c]">{NPA_PRIMARY_MESSAGE}</p>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Founder story</h2>
          <p className="mt-4 text-base leading-relaxed text-[#444]">
            No Prior Authorization is led by <strong>Danielle Alcala-Glazier</strong>, licensed esthetician and founder
            of <strong>Hello Gorgeous Med Spa</strong> in Oswego, Illinois. NPA exists because running an aesthetic
            practice means constantly needing consent flows, patient education, ops checklists, and marketing assets —
            usually with no single place to get them done right.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#444]">
            What you see on NPA is the same type of material we refine in-house: practical, print-ready, and honest
            about what a busy injector or owner actually needs on a Tuesday afternoon.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Credentials &amp; clinical voice</h2>
          <p className="mt-4 text-base leading-relaxed text-[#444]">
            Clinical and advanced practice content is developed with <strong>Ryan Kent, FNP-BC</strong> — board-certified
            family nurse practitioner and aesthetic injector — so playbooks and patient-facing language reflect
            real-world practice, not generic chatbot copy.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#444]">
            <strong>Medical Director:</strong> Ryan Kent, FNP-BC · <strong>Practice:</strong> Hello Gorgeous Med Spa ·
            74 W Washington St, Oswego, IL · 630-636-6193
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Who creates the content</h2>
          <p className="mt-4 text-base leading-relaxed text-[#444]">
            Templates, playbooks, and systems are authored and curated by the NPA team with direct input from clinical
            and operations leadership at Hello Gorgeous. We ship print-ready HTML (and optional Canva links where
            noted) so you can customize fast — the same delivery model described in our{" "}
            <Link href="/faq" className="font-semibold text-[#D4537E] hover:underline">
              FAQ
            </Link>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Why buyers trust NPA</h2>
          <ul className="mt-4 list-none space-y-3 text-base leading-relaxed text-[#444]">
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-[#D4537E]">&#10003;</span>
              Grounded in an active med spa — not distant “guru” coursework.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-[#D4537E]">&#10003;</span>
              Clear delivery model: browser-ready HTML, print or PDF, optional Canva on select packs.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-[#D4537E]">&#10003;</span>
              Honest licensing: use inside your practice; no resale or redistribution of source files.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-[#D4537E]">&#10003;</span>
              {MEMBERSHIP_CONFIG.displayName} ({formatMembershipMonthlyUsd()}/mo or {formatMembershipAnnualUsd()}
              /yr) for the full library — same pricing as our{" "}
              <a href={MEMBERSHIP_CONFIG.checkoutUrl} className="font-semibold text-[#D4537E] hover:underline">
                Pro checkout form
              </a>
              .
            </li>
          </ul>
        </section>

        <div className="mt-14 flex flex-wrap gap-4 border-t border-[#e8d5de] pt-10">
          <Link
            href="/shop"
            className="inline-flex rounded-lg bg-[#D4537E] px-6 py-3 text-sm font-bold text-white hover:bg-[#D4537E]/90"
          >
            Shop templates
          </Link>
          <Link
            href="/membership"
            className="inline-flex rounded-lg border border-[#1A1A1A]/20 px-6 py-3 text-sm font-bold text-[#1A1A1A] hover:bg-black/[0.04]"
          >
            Pro Membership
          </Link>
          <Link
            href="/contact"
            className="inline-flex rounded-lg border border-transparent px-6 py-3 text-sm font-semibold text-[#D4537E] hover:underline"
          >
            Contact
          </Link>
        </div>
      </article>
    </div>
  );
}
