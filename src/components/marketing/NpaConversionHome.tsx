import Image from "next/image";
import Link from "next/link";
import {
  formatMembershipAnnualUsd,
  formatMembershipMonthlyUsd,
  membershipAnnualSavingsVsMonthlyUsd,
} from "@/config/growth-funnel.config";
import { NPA_PRIMARY_MESSAGE, NPA_SITE_URL } from "@/config/npa-brand.config";

const savings = membershipAnnualSavingsVsMonthlyUsd();

export function NpaConversionHome() {
  return (
    <div className="relative overflow-hidden bg-[#0d0d0f] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,83,126,0.45), transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6 sm:pb-28 sm:pt-14">
        <p className="text-center text-xs font-bold uppercase tracking-[0.28em] text-[#D4537E]">
          No Prior Authorization
        </p>
        <h1 className="mt-5 text-center font-serif text-[1.65rem] font-bold leading-[1.12] sm:text-4xl md:text-[2.65rem]">
          The digital operating system for med spas, injectors &amp; aesthetic practices
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-gray-400 sm:text-lg">
          {NPA_PRIMARY_MESSAGE} Shop print-ready templates and playbooks, or join{" "}
          <strong className="text-gray-200">Pro Membership</strong> for the full library — built from a real med spa
          practice, not generic agency templates.
        </p>

        <Link
          href="/informed-beauty-guide"
          className="group relative mx-auto mt-10 block max-w-3xl overflow-hidden rounded-2xl border-2 border-[#D4537E]/45 shadow-lg shadow-[#D4537E]/15 ring-1 ring-white/5 transition hover:border-[#D4537E]/80 hover:shadow-[#D4537E]/25"
        >
          <Image
            src="/images/informed-beauty-guide-promo.png"
            alt="The Informed Beauty Guide — skincare, lasers, injectables, hormones; $49 instant access"
            width={1024}
            height={682}
            className="h-auto w-full"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </Link>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-gray-400">
          Featured:{" "}
          <Link href="/informed-beauty-guide" className="font-medium text-[#D4537E] hover:underline">
            The Informed Beauty Guide
          </Link>
          {" "}
          — patient education before your next treatment.{" "}
          <span className="text-gray-500">$49 · instant access</span>
        </p>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <Link
            href="/shop"
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-[#D4537E] px-8 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-[#D4537E]/20 transition hover:bg-[#D4537E]/88"
          >
            Shop templates
          </Link>
          <Link
            href="/membership"
            className="inline-flex min-h-[52px] flex-col items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] px-8 py-3 text-center text-sm font-bold text-white transition hover:border-[#D4537E]/50 hover:bg-white/[0.09]"
          >
            <span>Join Pro Membership</span>
            <span className="mt-0.5 text-xs font-normal text-gray-400">
              {formatMembershipMonthlyUsd()}/mo or {formatMembershipAnnualUsd()}/yr
              {savings > 0 ? ` · save $${savings.toFixed(0)} vs monthly` : ""}
            </span>
          </Link>
          <Link
            href="/free-templates"
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-white/15 px-8 py-3.5 text-center text-sm font-semibold text-gray-200 transition hover:border-white/30 hover:text-white"
          >
            Get free resources
          </Link>
        </div>

        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="font-serif text-lg font-semibold text-white sm:text-xl">What NPA is</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            A resource library of clinical, operations, and marketing templates you open in your browser — print or
            save as PDF. Optional Canva links on select social packs. Instant delivery after checkout.
          </p>
          <h2 className="mt-8 font-serif text-lg font-semibold text-white sm:text-xl">Who it&apos;s for</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Med spa owners, nurse injectors, PAs, estheticians, and practice managers building or scaling an aesthetic
            business.
          </p>
          <h2 className="mt-8 font-serif text-lg font-semibold text-white sm:text-xl">Why it&apos;s different</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Created by Danielle Alcala-Glazier and the clinical team behind Hello Gorgeous Med Spa (Oswego, IL) — the
            same systems used in a working practice, reviewed with a board-certified FNP-BC injector.
          </p>
        </div>

        <nav
          className="mx-auto mt-12 flex max-w-xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-500"
          aria-label="Popular destinations"
        >
          <Link href="/faq" className="text-[#D4537E] hover:underline">
            FAQ
          </Link>
          <span className="text-gray-700">·</span>
          <Link href="/about" className="text-[#D4537E] hover:underline">
            About &amp; founder
          </Link>
          <span className="text-gray-700">·</span>
          <Link href="/shop/resources" className="text-[#D4537E] hover:underline">
            Shop resources
          </Link>
          <span className="text-gray-700">·</span>
          <Link href="/storefront" className="text-[#D4537E] hover:underline">
            Campaign landing
          </Link>
          <span className="text-gray-700">·</span>
          <Link href="/contact" className="text-[#D4537E] hover:underline">
            Contact
          </Link>
        </nav>

        <p className="mt-10 text-center text-xs text-gray-600">
          <a href={NPA_SITE_URL} className="text-gray-500 hover:text-gray-400">
            {NPA_SITE_URL.replace("https://", "")}
          </a>
        </p>
      </div>
    </div>
  );
}
