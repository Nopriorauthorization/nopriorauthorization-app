import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { NclexStudyGuidePurchase } from "@/components/study-guides/NclexStudyGuidePurchase";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "Study Guides — NCLEX ($49) & A&P Study Hub ($39) | No Prior Authorization",
  description:
    "NCLEX — eight HTML cheat sheets, $49. Anatomy & Physiology — 12 lectures, quizzes & flashcards, $39 (Lecture 1 free). Sold only on this hub, separate from the med spa shop.",
  openGraph: {
    title: "Study guides | NCLEX & A&P | No Prior Authorization",
    description: "NCLEX bundle + Anatomy & Physiology study hub — previews and checkout on dedicated pages.",
    url: `${SITE}/study-guides`,
    type: "website",
  },
  alternates: {
    canonical: `${SITE}/study-guides`,
  },
};

const COMING_SOON = [
  {
    title: "Microbiology",
    subtitle: "Structured review sheets and clinical correlations for nursing and allied health — launching soon.",
  },
];

export default function StudyGuidesPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="border-b border-white/10 bg-gradient-to-b from-[#1A1A1A] to-[#141414]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">
            No Prior Authorization
          </p>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-[2.5rem]">
            Study guides
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-400">
            Nursing boards and science foundations — sold <strong className="text-gray-300">only on this hub</strong>
            , not mixed into the med spa template shop. NCLEX ships as HTML files after checkout; the A&amp;P hub unlocks
            in your browser after purchase.
          </p>
          <p className="mt-6">
            <Link
              href="/nclex-bundle"
              className="inline-flex items-center rounded-xl border border-[#D4537E]/50 bg-[#D4537E]/10 px-5 py-2.5 text-sm font-bold text-[#D4537E] transition hover:bg-[#D4537E]/20"
            >
              Full NCLEX sales page → long-form landing with FAQ &amp; details
            </Link>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <NclexStudyGuidePurchase />

        <section className="mt-16" aria-labelledby="ap-study-hub-heading">
          <h2 id="ap-study-hub-heading" className="font-serif text-lg font-semibold text-gray-400">
            Anatomy &amp; physiology
          </h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:flex">
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-[3/4] sm:w-[min(100%,260px)] sm:min-h-[280px] md:w-[300px] md:min-h-[320px]">
              <Image
                src="/danielle-injection.jpg"
                alt="Danielle Alcala, Nurse Injector & Founder — Hello Gorgeous Med Spa"
                fill
                className="object-cover object-[center_15%]"
                sizes="(max-width: 640px) 100vw, 300px"
                priority
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-white md:text-2xl">A&amp;P Study Hub</h3>
                <span className="rounded-full bg-[#D4537E]/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-[#D4537E]">
                  Live
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-400 md:text-base">
                Twelve lecture modules with cheat sheets, 240 quiz questions, and flashcards.{" "}
                <strong className="text-gray-300">Lecture 1 is free</strong> — unlock the full course for{" "}
                <strong className="text-gray-300">$39</strong> (separate checkout from NCLEX).
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/npa-landing.html"
                  className="inline-flex items-center justify-center rounded-xl bg-[#D4537E] px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-[#D4537E]/20 transition hover:bg-[#D4537E]/88"
                >
                  View landing page
                </Link>
                <Link
                  href="/nursing-study/anatomy"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] px-5 py-3 text-center text-sm font-semibold text-white transition hover:border-[#D4537E]/50 hover:bg-white/[0.09]"
                >
                  Open study hub
                </Link>
                <Link
                  href="/shop/anatomy-physiology-study-complete"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-center text-sm font-semibold text-gray-200 transition hover:border-white/30 hover:text-white"
                >
                  Buy full course — $39
                </Link>
              </div>
            </div>
          </div>
        </section>

        <h2 className="mt-16 font-serif text-lg font-semibold text-gray-400">Coming soon</h2>
        <ul className="mt-4 space-y-4">
          {COMING_SOON.map((g) => (
            <li
              key={g.title}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-white">{g.title}</h3>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-gray-400">
                  Coming soon
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{g.subtitle}</p>
            </li>
          ))}
        </ul>

        <p className="mt-14 text-center text-sm text-gray-500">
          <Link href="/shop" className="font-semibold text-[#D4537E] hover:underline">
            Med spa template shop
          </Link>
          <span className="mx-2 text-gray-600">·</span>
          <Link href="/cheat-sheets" className="text-gray-400 hover:text-white hover:underline">
            Clinical cheat sheets
          </Link>
          <span className="mx-2 text-gray-600">·</span>
          <Link href="/contact" className="text-gray-400 hover:text-white hover:underline">
            Request a topic
          </Link>
        </p>
      </div>
    </div>
  );
}
