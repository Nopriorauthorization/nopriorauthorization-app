import Link from "next/link";
import type { Metadata } from "next";
import { VitaminInjectionLeadCapture } from "./VitaminInjectionLeadCapture";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "Free Vitamin Injection Manual | No Prior Authorization",
  description:
    "Free reference: IM vitamin doses, routes, procedure steps, and popular injections (B12, biotin, MIC, glutathione). Email unlock. Upgrade to the $10 Injection Techniques Cheat Sheet for full route comparison and technique.",
  openGraph: {
    title: "Free Vitamin Injection Manual | NPA",
    description:
      "Lead magnet for IV suites and injectors — instant unlock after email. Full technique cheat sheet in the shop.",
    url: `${SITE}/shop/free/vitamin-injection-manual`,
    type: "website",
  },
  alternates: {
    canonical: `${SITE}/shop/free/vitamin-injection-manual`,
  },
};

export default function VitaminInjectionLeadPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">Free lead magnet</p>
        <h1 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Vitamin Injection Manual
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-400">
          Built for infusion suites and anyone giving IM vitamins. Unlock the printable HTML after email —
          then continue into the{" "}
          <Link
            href="/shop/injection-techniques-cheat-sheet"
            className="font-semibold text-[#D4537E] hover:underline"
          >
            Injection Techniques Cheat Sheet ($10)
          </Link>{" "}
          for five-route comparison, needle selection, landmarks, and complication cues.
        </p>

        <section className="mt-10">
          <VitaminInjectionLeadCapture />
        </section>

        <ul className="mt-10 space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-6 text-sm text-gray-400">
          <li className="font-semibold text-gray-300">What&apos;s inside</li>
          <li>Master vitamin / IM dose table with frequency and indications</li>
          <li>Per-compound cards (B12, biotin, MIC, glutathione, and more)</li>
          <li>Step-by-step IM procedure framework</li>
          <li className="pt-2 text-[#D4537E]">CTA in the file → $10 Injection Techniques Cheat Sheet</li>
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
