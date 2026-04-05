import Link from "next/link";
import type { Metadata } from "next";
import { NclexPurchasePanel } from "@/components/study-guides/NclexPurchasePanel";
import { STUDY_GUIDE_NCLEX } from "@/config/study-guides.config";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "NCLEX Complete Study Bundle — 8 Cheat Sheets ($25) | No Prior Authorization",
  description:
    "Print-ready NCLEX reference: lab values, pharmacology, clinical judgment, and more — one HTML bundle. Built by Danielle Alcala-Glazier, RN student & licensed esthetician. $25. Secure checkout, instant email delivery.",
  keywords: [
    "NCLEX cheat sheet",
    "NCLEX lab values",
    "nursing exam reference",
    "NCLEX pharmacology quick reference",
    "printable NCLEX study guide",
  ],
  openGraph: {
    title: "NCLEX Complete Study Bundle — $25 | No Prior Authorization",
    description:
      "8 print-ready cheat sheets in one bundle. Preview the layout, then unlock the full HTML by email after checkout.",
    url: `${SITE}/nclex-bundle`,
    type: "website",
    images: [{ url: `${SITE}${STUDY_GUIDE_NCLEX.previewImageSrc}`, width: 1200, height: 630, alt: "NCLEX bundle preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NCLEX Complete Study Bundle — $25",
    description: "Lab values, pharm, clinical judgment — print from any browser.",
  },
  alternates: {
    canonical: `${SITE}/nclex-bundle`,
  },
};

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
    a: "Square sends a receipt; our system emails a secure link to open the full HTML bundle (same delivery tech as our digital shop). You can print or save as PDF.",
  },
  {
    q: "Is this medical or legal advice?",
    a: "No — it’s an educational reference. Always follow your program, facility policies, and scope of practice. Licensing exams change; verify current test plans.",
  },
  {
    q: "Can I share the file?",
    a: "Your purchase is a single-use license for you and your own study. Please don’t redistribute — it supports building more nursing resources.",
  },
];

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
            <span className="block text-[#D4537E]">One bundle. Eight cheat sheets.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Everything is laid out like a <strong className="text-gray-200">clinical quick reference</strong> —
            lab grids, drug patterns, priority rules, and exam-ready summaries. Open in your browser, print, or
            save as PDF.
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
              See the preview &amp; buy — $25
            </a>
            <p className="text-sm text-gray-500 sm:pl-2">One-time payment · not on the main template shop</p>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">What’s in the bundle</h2>
        <p className="mt-3 max-w-2xl text-gray-400">
          Eight coordinated sheets designed to be <strong className="text-gray-300">scanned</strong>, not read like
          a textbook. Pair with your program’s materials — this is your at-a-glance layer.
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
            Below is a high-resolution snapshot of the bundle. After checkout, you get the{" "}
            <strong className="text-gray-300">interactive HTML</strong> (print-friendly, same design).
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
