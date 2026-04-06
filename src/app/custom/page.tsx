import Link from "next/link";
import type { Metadata } from "next";
import {
  baseOpenGraphSiteFields,
  defaultBrandOpenGraphImages,
  defaultBrandTwitterImages,
} from "@/lib/seo/brand-social-meta";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "Custom Med Spa Templates & Handouts | Built for Your Practice | NPA",
  description:
    "Don't see exactly what you need? Danielle Alcala builds patient handouts, consent flows, SOPs, and clinical assets tailored to your state, menu, and brand — not a generic download.",
  openGraph: {
    ...baseOpenGraphSiteFields(),
    title: "Custom builds for your med spa | No Prior Authorization",
    description:
      "Request a bespoke handout, kit, or ops asset. Built by a med spa owner, for med spa owners.",
    url: `${SITE}/custom`,
    images: [...defaultBrandOpenGraphImages()],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom med spa templates | No Prior Authorization",
    description:
      "Bespoke handouts, consent flows, and ops assets — built for your practice.",
    images: [...defaultBrandTwitterImages()],
  },
  alternates: {
    canonical: `${SITE}/custom`,
  },
  robots: { index: true, follow: true },
};

const EXAMPLES = [
  "A patient handout for a service or compound you offer that isn’t in the catalog",
  "A consent + aftercare packet that matches your medical director’s wording and your state",
  "Staff SOPs or room checklists for a protocol you’re rolling out (peptides, GLP-1, IV, etc.)",
  "Branded HTML you can drop into your site or print — your logo, colors, and photo zones",
  "A bundle that ties together intake, education, and follow-up for one revenue line",
];

const STEPS = [
  {
    title: "Tell me what you need",
    body: "What’s missing? Who’s it for (patients, injectors, front desk)? Any deadlines or launches?",
  },
  {
    title: "I scope it honestly",
    body: "If it’s a quick customization, I’ll say so. If it’s a real build, you’ll get a clear picture of deliverables and timeline — no mystery box.",
  },
  {
    title: "You get files you can use tomorrow",
    body: "Usually print-ready or browser HTML (same style as the shop). Your legal and medical reviewers still sign off — I build the structure and clarity.",
  },
];

export default function CustomBuildPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="border-b border-white/10 bg-gradient-to-b from-[#1A1A1A] to-[#141414]">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">
            No Prior Authorization
          </p>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-[2.5rem]">
            Need something built{" "}
            <span className="text-[#D4537E]">just for your practice?</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-400">
            The shop is full of proven templates — but your menu, your state, and your brand aren’t generic.
            If you want an asset that fits{" "}
            <strong className="font-semibold text-gray-200">exactly</strong> what you do and how you say it,
            that’s what custom builds are for.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/contact"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#D4537E] px-8 py-3 text-center text-base font-bold text-white transition hover:bg-[#D4537E]/85"
            >
              Request a custom build
            </Link>
            <Link
              href="/shop"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-3 text-center text-base font-bold text-white transition hover:bg-white/10"
            >
              Browse the catalog first
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            On the contact page, start your message with{" "}
            <span className="font-mono text-gray-400">Custom build:</span> so it hits my inbox with context.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
          Why this isn’t “just another template site”
        </h2>
        <p className="mt-4 leading-relaxed text-gray-400">
          Most marketplaces sell the same PDF ten thousand times. I run a real med spa —{" "}
          <strong className="text-gray-300">Hello Gorgeous</strong> in Oswego, IL — and I built No Prior
          Authorization because I got tired of guessing and reinventing the wheel. Custom work is for when the
          wheel you need doesn’t exist yet, or your compliance and brand voice don’t fit a one-size file.
        </p>

        <h3 className="mt-12 font-serif text-xl font-semibold text-white">Examples of what people ask for</h3>
        <ul className="mt-4 space-y-3 text-gray-400">
          {EXAMPLES.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4537E]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h3 className="mt-12 font-serif text-xl font-semibold text-white">How it works</h3>
        <ol className="mt-6 space-y-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4537E]/20 text-sm font-bold text-[#D4537E]"
                aria-hidden
              >
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-white">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-400">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 rounded-2xl border border-[#D4537E]/30 bg-[#D4537E]/10 p-6 sm:p-8">
          <p className="font-serif text-lg font-bold text-white">Ready when you are</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-400">
            No pressure to “pick the right product.” Describe the gap — I’ll tell you if something in the shop
            already covers it, or if a custom build is the smarter move.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-white px-8 py-3 text-base font-bold text-[#1A1A1A] transition hover:bg-gray-100"
          >
            Contact Danielle — custom build
          </Link>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          <Link href="/free-templates" className="font-semibold text-[#D4537E] hover:underline">
            10 free templates
          </Link>
          <span className="mx-2 text-gray-600">·</span>
          <Link href="/shop" className="text-gray-400 hover:text-white hover:underline">
            Full shop
          </Link>
        </p>
      </div>
    </div>
  );
}
