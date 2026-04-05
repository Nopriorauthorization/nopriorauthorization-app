import Link from "next/link";
import type { Metadata } from "next";
import { SkinAnalysisLeadCapture } from "./SkinAnalysisLeadCapture";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "Free Skin Analysis Cheat Sheet | No Prior Authorization",
  description:
    "Free one-page reference: skin types, Fitzpatrick, Glogau scale, facial zones, consult questions, and contraindications. Email unlock. Then grab the full Facial Training Manual for $10.",
  openGraph: {
    title: "Free Skin Analysis Cheat Sheet | NPA",
    description:
      "Lead magnet for estheticians and injectors — instant unlock after email. Full manual available in the shop.",
    url: `${SITE}/shop/free/skin-analysis-cheat-sheet`,
    type: "website",
  },
  alternates: {
    canonical: `${SITE}/shop/free/skin-analysis-cheat-sheet`,
  },
};

export default function SkinAnalysisLeadPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">Free lead magnet</p>
        <h1 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Skin Analysis Quick Reference
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-400">
          Built for consult rooms and training new staff. Unlock the printable HTML after email — then
          continue into the{" "}
          <Link href="/shop/facial-training-manual" className="font-semibold text-[#D4537E] hover:underline">
            Complete Facial Training Manual ($10)
          </Link>{" "}
          for the full seven-section system.
        </p>

        <section className="mt-10">
          <SkinAnalysisLeadCapture />
        </section>

        <ul className="mt-10 space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-6 text-sm text-gray-400">
          <li className="font-semibold text-gray-300">What&apos;s on the one-pager</li>
          <li>Skin types &amp; Fitzpatrick classification</li>
          <li>Glogau photoaging scale</li>
          <li>Five facial analysis zones</li>
          <li>Concern mapping for six common conditions</li>
          <li>Eight consultation questions</li>
          <li>Universal contraindications</li>
          <li className="pt-2 text-[#D4537E]">Bold CTA inside the file → $10 full manual</li>
        </ul>

        <p className="mt-10 text-center text-sm text-gray-500">
          <Link href="/shop" className="font-semibold text-[#D4537E] hover:underline">
            ← Back to shop
          </Link>
          <span className="mx-2 text-gray-600">·</span>
          <Link href="/shop/resources" className="text-gray-400 hover:text-white hover:underline">
            More free resources
          </Link>
        </p>
      </div>
    </div>
  );
}
