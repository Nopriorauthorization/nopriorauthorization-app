import Link from "next/link";
import type { Metadata } from "next";
import { NclexStudyGuidePurchase } from "@/components/study-guides/NclexStudyGuidePurchase";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "Study Guides — NCLEX ($25) | No Prior Authorization",
  description:
    "NCLEX complete study bundle — large preview here; full HTML after secure checkout (separate from the med spa shop). Microbiology and A&P coming soon.",
  openGraph: {
    title: "Study guides | NCLEX bundle | No Prior Authorization",
    description: "Preview the NCLEX pack — purchase for $25. Delivery by email.",
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
  {
    title: "Anatomy & physiology",
    subtitle: "Body systems, pathways, and exam-ready summaries — launching soon.",
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
            Nursing boards and science foundations — sold <strong className="text-gray-300">only on this page</strong>
            , not mixed into the med spa template shop. You always see a large preview first; the full files arrive
            after checkout.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <NclexStudyGuidePurchase />

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
