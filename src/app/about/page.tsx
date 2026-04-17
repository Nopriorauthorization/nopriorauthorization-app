import Image from "next/image";
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

const HELLO_GORGEOUS_GOOGLE_MAPS =
  "https://www.google.com/maps/search/?api=1&query=Hello+Gorgeous+Med+Spa+Oswego+IL";

export default function AboutPage() {
  const patientReviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: "Mona Herrada" },
    reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
    reviewBody:
      "I wanted to share my experience with the Oswego community regarding my visits to Hello Gorgeous Med Spa. Over the years, I have gone to several different places seeking treatment for unwanted hair on my upper lip and chin. Although I was consistently assured of results, I unfortunately never saw any real improvement and felt I had spent money without benefit. That completely changed when I met Danielle Alcala. From my very first treatment, I noticed a significant difference—something I had never experienced before. After just two sessions, the majority of the hair is gone, and I couldn't be more pleased with the results. Danielle's expertise and attention to detail truly set her apart. Encouraged by my results, I decided to explore additional treatment. I had the opportunity to consult with Danielle and Dr. Ryan, Nurse Practitioner, about concerns I've had regarding skin laxity in my arms, as well as my face, neck, and chest. They both took the time to sit down with me, listen to my concerns, and thoroughly explain my options. I appreciated how comfortable and informed they made me feel throughout the process. Based on their recommendation, I proceeded with Morpheus8 treatments on my arms, face, neck, and chest. I am currently in the process of treatment and look forward to sharing my before-and-after photos as my results continue to develop. I am grateful for the professionalism, honesty, and care I've received at Hello Gorgeous Med Spa, and I highly recommend them to anyone seeking effective and personalized aesthetic treatments. I will be forever grateful to Hello Gorgeous Med Spa in Oswego, IL, for their professionalism, kindness, and truly life-changing results.",
    itemReviewed: {
      "@type": "LocalBusiness",
      name: "Hello Gorgeous Med Spa",
      address: {
        "@type": "PostalAddress",
        streetAddress: "74 W Washington St",
        addressLocality: "Oswego",
        addressRegion: "IL",
        addressCountry: "US",
      },
    },
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(patientReviewSchema) }}
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

        <section id="hello-gorgeous-reviews" className="mt-14 scroll-mt-24">
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">What patients say</h2>
          <p className="mt-2 text-sm font-medium text-[#5c5c5c]">
            Hello Gorgeous Med Spa · Oswego, IL ·{" "}
            <a
              href={HELLO_GORGEOUS_GOOGLE_MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4537E] hover:underline"
            >
              Google reviews
            </a>
          </p>

          <figure className="mt-8 overflow-hidden rounded-xl border border-[#e8d5de] bg-white shadow-sm">
            <Image
              src="/images/testimonials/mona-herrada-google-review.png"
              alt="Google review by Mona Herrada — 5 stars for Hello Gorgeous Med Spa"
              width={1024}
              height={764}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 672px"
            />
            <figcaption className="border-t border-[#f0ebe8] px-4 py-3 text-center text-xs text-[#888]">
              Screenshot shared with permission ·{" "}
              <a
                href={HELLO_GORGEOUS_GOOGLE_MAPS}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4537E] hover:underline"
              >
                View on Google Maps
              </a>
            </figcaption>
          </figure>

          <div className="mt-8 rounded-xl border border-[#e8d5de] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg tracking-tight text-amber-500" aria-hidden="true">
                ★★★★★
              </span>
              <span className="text-sm font-bold text-[#1A1A1A]">Great price</span>
              <span className="text-xs font-medium uppercase tracking-wider text-[#D4537E]">Google review</span>
            </div>
            <p className="mt-1 text-sm text-[#666]">Mona Herrada · Local Guide</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-[#444]">
              <p>
                I wanted to share my experience with the Oswego community regarding my visits to Hello Gorgeous Med
                Spa. Over the years, I have gone to several different places seeking treatment for unwanted hair on my
                upper lip and chin. Although I was consistently assured of results, I unfortunately never saw any real
                improvement and felt I had spent money without benefit. That completely changed when I met Danielle
                Alcala. From my very first treatment, I noticed a significant difference—something I had never
                experienced before. After just two sessions, the majority of the hair is gone, and I couldn&apos;t be
                more pleased with the results. Danielle&apos;s expertise and attention to detail truly set her apart.
              </p>
              <p>
                Encouraged by my results, I decided to explore additional treatment. I had the opportunity to consult
                with Danielle and Dr. Ryan, Nurse Practitioner, about concerns I&apos;ve had regarding skin laxity in
                my arms, as well as my face, neck, and chest. They both took the time to sit down with me, listen to
                my concerns, and thoroughly explain my options. I appreciated how comfortable and informed they made me
                feel throughout the process.
              </p>
              <p>
                Based on their recommendation, I proceeded with Morpheus8 treatments on my arms, face, neck, and chest.
                I am currently in the process of treatment and look forward to sharing my before-and-after photos as my
                results continue to develop.
              </p>
              <p>
                I am grateful for the professionalism, honesty, and care I&apos;ve received at Hello Gorgeous Med Spa,
                and I highly recommend them to anyone seeking effective and personalized aesthetic treatments. I will
                be forever grateful to Hello Gorgeous Med Spa in Oswego, IL, for their professionalism, kindness, and
                truly life-changing results.
              </p>
            </div>
          </div>
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
