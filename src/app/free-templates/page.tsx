import Link from "next/link";
import type { Metadata } from "next";
import { FreeTemplatesOptInForm, FreeTemplatesPackList } from "./FreeTemplatesOptInForm";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "10 Free Med Spa Templates | No Prior Authorization",
  description:
    "Clinical cheat sheets, patient handouts, and business tools — free from Danielle Alcala at No Prior Authorization. Instant email delivery.",
  openGraph: {
    title: "10 free med spa templates | NPA",
    description: "Yours instantly — email opt-in, Resend delivery, 3-email nurture.",
    url: `${SITE}/free-templates`,
    type: "website",
  },
  alternates: {
    canonical: `${SITE}/free-templates`,
  },
};

export default function FreeTemplatesLandingPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">
          No Prior Authorization
        </p>
        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-[2.35rem]">
          10 Free Med Spa Templates — Yours Instantly
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-gray-400">
          Clinical cheat sheets, patient handouts, and business tools — free from Danielle Alcala at No Prior
          Authorization.
        </p>

        <section className="mt-10">
          <FreeTemplatesOptInForm />
        </section>

        <div className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-white sm:text-2xl">
            Here&apos;s exactly what you&apos;re getting
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            All files are HTML — open in any browser, print, or save as PDF. Links arrive in your inbox the
            second you submit.
          </p>
          <FreeTemplatesPackList />
        </div>

        <p className="mt-12 text-center text-sm text-gray-500">
          <Link href="/shop" className="font-semibold text-[#D4537E] hover:underline">
            Browse the full NPA catalog
          </Link>
          <span className="mx-2 text-gray-600">·</span>
          <Link href="/shop/resources" className="text-gray-400 hover:text-white hover:underline">
            More free resources
          </Link>
          <span className="mx-2 text-gray-600">·</span>
          <Link href="/custom" className="text-rose-300 hover:text-rose-200 hover:underline">
            Need a custom build?
          </Link>
        </p>
      </div>
    </div>
  );
}
