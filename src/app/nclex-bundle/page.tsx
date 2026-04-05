import Link from "next/link";
import type { Metadata } from "next";
import { NclexPreviewSlideshow } from "@/components/study-guides/NclexPreviewSlideshow";
import { NclexPurchasePanel } from "@/components/study-guides/NclexPurchasePanel";
import { STUDY_GUIDE_NCLEX, formatStudyGuideUsd } from "@/config/study-guides.config";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "NCLEX Complete Study Bundle — Cheat Sheets + Full Guides ($49) | No Prior Authorization",
  description:
    "Eight print-ready NCLEX HTML files: at-a-glance reference tables plus full structured study guides with sections, callouts, and NCLEX-style Q&As. Lab values, pharmacology, EKG, and more. $49. Instant email delivery.",
  keywords: [
    "NCLEX cheat sheet",
    "NCLEX lab values",
    "nursing exam reference",
    "NCLEX pharmacology quick reference",
    "printable NCLEX study guide",
  ],
  openGraph: {
    title: "NCLEX Complete Study Bundle — $49 | No Prior Authorization",
    description:
      "Quick-scan tables plus full-topic study guides in one bundle. Preview below, then unlock all eight HTML files after checkout.",
    url: `${SITE}/nclex-bundle`,
    type: "website",
    images: [{ url: `${SITE}${STUDY_GUIDE_NCLEX.previewImageSrc}`, width: 1200, height: 630, alt: "NCLEX bundle preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NCLEX Complete Study Bundle — $49",
    description: "Lab values, pharm, clinical judgment — print from any browser.",
  },
  alternates: {
    canonical: `${SITE}/nclex-bundle`,
  },
};

const NCLEX_SLIDESHOW_SLIDES = [
  {
    src: "/study-guides/nclex-slide-at-a-glance.png",
    alt: "NCLEX lab values reference table excerpt showing normals and critical ranges",
    badge: "At-a-glance cheat sheet",
    title: "Scan it like a reference card",
    description:
      "Dense tables for normals vs. criticals, panels, and side-by-side comparisons — built to highlight, print, and flip through when you only have minutes.",
  },
  {
    src: "/study-guides/nclex-slide-study-guide-depth.png",
    alt: "NCLEX pharmacology study guide showing hero title and jump-to section navigation",
    badge: "Full study guide depth",
    title: "Study it like a structured lesson",
    description:
      "Each guide includes jump links, section intros, clinical callouts, NCLEX-style Q&As, and checklists — so you can go deep when you have a full study block.",
  },
] as const;

const WHATS_INSIDE = [
  "NCLEX Lab Values — Complete Reference (BMP, CBC, coags, ABGs, and more)",
  "NCLEX Pharmacology — Quick Reference Guide",
  "NCLEX Cardiac Rhythms & EKG Interpretation Guide",
  "NCLEX Acid-Base Balance — Made Simple",
  "NCLEX Priority Setting & Delegation Rules",
  "NCLEX Infection Control & Isolation Precautions",
  "NCLEX OB & Maternity Nursing — High Yield Reference",
  "NCLEX Mental Health & Therapeutic Communication",
];

const FAQ = [
  {
    q: "Is this the same as your med spa template shop?",
    a: "No. The NCLEX bundle is sold only on this page and /study-guides — separate checkout, built for nursing students and clinicians reviewing for boards.",
  },
  {
    q: "What do I get after I pay?",
    a: "Square sends a receipt; our system emails a secure link to a delivery page with all eight HTML files — open each in your browser to print or save as PDF (same delivery tech as our digital shop).",
  },
  {
    q: "Is this medical or legal advice?",
    a: "No — it’s an educational reference. Always follow your program, facility policies, and scope of practice. Licensing exams change; verify current test plans.",
  },
  {
    q: "Can I share the files?",
    a: "Your purchase is a single-use license for you and your own study. Please don’t redistribute the bundle — it supports building more nursing resources.",
  },
];

const PRICE_LABEL = formatStudyGuideUsd(STUDY_GUIDE_NCLEX.priceCents);

export default function NclexBundleLandingPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Top bar */}
      <header className="border-b border-white/10 bg-[#0d1117]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4537E]">
            No Prior Authorization
          </Link>
          <Link
            href="/study-guides"
            className="text-xs font-semibold text-gray-400 transition hover:text-white"
          >
            All study guides →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#141922] to-[#0d1117]">
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">
            Nursing · Boards prep · Print-ready
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-[2rem] font-bold leading-[1.1] sm:text-5xl sm:leading-[1.05] md:text-[3.25rem]">
            Stop tab-hunting the night before NCLEX.
            <span className="block text-[#D4537E]">One bundle. Cheat sheets + full guides.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            You get <strong className="text-gray-200">two study modes in one purchase</strong>: tight reference
            tables for cramming and print-and-go, plus multi-section guides with explanations, callouts, and
            practice-style questions. Open in your browser, print, or save as PDF.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Built by <strong className="text-gray-400">Danielle Alcala-Glazier</strong> — RN student, licensed
            esthetician, 10+ years in clinical-adjacent practice. Same obsessive clarity we use for med spa
            providers — now for <em>your</em> boards run.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#preview-buy"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#D4537E] px-8 py-3 text-center text-base font-bold text-white shadow-lg shadow-[#D4537E]/20 transition hover:bg-[#D4537E]/90"
            >
              See the preview &amp; buy — {PRICE_LABEL}
            </a>
            <p className="text-sm text-gray-500 sm:pl-2">One-time payment · not on the main template shop</p>
          </div>
        </div>
      </section>

      {/* Cheat sheet vs full guide + slideshow */}
      <section className="border-b border-white/10 bg-[#11161f] py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            Cheat sheets <span className="text-gray-500">and</span> full study guides — same bundle
          </h2>
          <p className="mt-3 max-w-3xl text-gray-400">
            A lot of products make you pick: a one-page PDF <em>or</em> a long e-book. These eight HTML files are
            built so you can use them <strong className="text-gray-300">both ways</strong> — lightning-fast lookup
            when you need a number, and guided depth when you need to understand the &ldquo;why.&rdquo;
          </p>
          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4537E]">Cheat-sheet mode</p>
              <h3 className="mt-2 font-serif text-xl font-bold text-white">For the night before &amp; test day</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-400">
                <li className="flex gap-2">
                  <span className="text-[#D4537E]" aria-hidden>
                    ·
                  </span>
                  <span>Normals, criticals, and comparison grids you can scan in seconds</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#D4537E]" aria-hidden>
                    ·
                  </span>
                  <span>Print-friendly layout — tape to your desk or keep in a binder</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#D4537E]" aria-hidden>
                    ·
                  </span>
                  <span>Pairs with your program; this is your high-yield reference layer</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400/90">Full study guide</p>
              <h3 className="mt-2 font-serif text-xl font-bold text-white">For real study blocks</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-400">
                <li className="flex gap-2">
                  <span className="text-teal-400/90" aria-hidden>
                    ·
                  </span>
                  <span>Jump-to navigation and section intros so you’re not lost in one endless wall of text</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal-400/90" aria-hidden>
                    ·
                  </span>
                  <span>Clinical callouts, frameworks, and NCLEX-style Q&amp;As on many topics</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal-400/90" aria-hidden>
                    ·
                  </span>
                  <span>End-of-topic checklists to close the loop before you move on</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-4xl">
            <p className="mb-4 text-center text-sm font-medium text-gray-500">
              Swipe through real excerpts — same design system you get after checkout
            </p>
            <NclexPreviewSlideshow slides={[...NCLEX_SLIDESHOW_SLIDES]} />
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">What’s in the bundle</h2>
        <p className="mt-3 max-w-2xl text-gray-400">
          Eight coordinated files — each one works as a <strong className="text-gray-300">quick reference</strong>{" "}
          and as a <strong className="text-gray-300">structured lesson</strong> when you scroll the full guide.
          Pair with your program’s materials; this is your boards-ready layer.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {WHATS_INSIDE.map((line) => (
            <li
              key={line}
              className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-gray-300"
            >
              <span className="mt-0.5 text-[#D4537E]" aria-hidden>
                ✓
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Preview + purchase */}
      <section
        id="preview-buy"
        className="scroll-mt-24 border-y border-white/10 bg-[#11161f] py-14 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center font-serif text-2xl font-bold text-white sm:text-3xl">
            Preview the real layout — then unlock the full file
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-400">
            Below is a high-resolution snapshot of the first sheet (lab values). After checkout, you get a link to{" "}
            <strong className="text-gray-300">all eight HTML files</strong> — same cheat-sheet + full-guide format
            across every topic.
          </p>
          <div className="mx-auto mt-10 max-w-4xl">
            <NclexPurchasePanel variant="hero" />
          </div>
        </div>
      </section>

      {/* Trust / process */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Why buy from NPA?</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Most “NCLEX PDFs” are anonymous dropship noise. This bundle comes from someone who’s{' '}
              <strong className="text-gray-300">in the nursing pipeline</strong> and has spent a decade translating
              complex clinical ideas for real people — patients and providers. The design is intentional: high
              contrast, tight grids, minimal fluff.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-white">How delivery works</h3>
            <ol className="mt-3 space-y-3 text-sm text-gray-400">
              <li className="flex gap-3">
                <span className="font-bold text-[#D4537E]">1.</span>
                Click buy — Square opens in a secure tab.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#D4537E]">2.</span>
                Pay with card; use an email you check (that’s where the link goes).
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#D4537E]">3.</span>
                Open the email, tap your personal delivery link, hit “View &amp; Print” for the full HTML.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10 bg-[#11161f] py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center font-serif text-2xl font-bold text-white">Questions</h2>
          <dl className="mt-8 space-y-6">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <dt className="font-semibold text-white">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-400">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-sm text-gray-500">
            <Link href="/study-guides" className="text-[#D4537E] hover:underline">
              Study guides hub
            </Link>
            <span className="mx-2 text-gray-600">·</span>
            <Link href="/shop" className="text-gray-400 hover:text-white">
              Med spa template shop
            </Link>
            <span className="mx-2 text-gray-600">·</span>
            <Link href="/contact" className="text-gray-400 hover:text-white">
              Contact
            </Link>
          </p>
          <p className="mt-4 text-xs text-gray-600">
            © No Prior Authorization · Educational reference only · {STUDY_GUIDE_NCLEX.title}
          </p>
        </div>
      </footer>
    </div>
  );
}
