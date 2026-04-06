import type { Metadata } from "next";
import Link from "next/link";
import {
  MEMBERSHIP_CONFIG,
  formatMembershipAnnualUsd,
  formatMembershipMonthlyUsd,
  membershipAnnualSavingsVsMonthlyUsd,
} from "@/config/growth-funnel.config";
import {
  MEMBERSHIP_EVERYTHING_INCLUDED,
  MEMBERSHIP_FREE_VS_PRO,
  MEMBERSHIP_PAGE_FAQ,
  MEMBERSHIP_TESTIMONIALS,
  MEMBERSHIP_VALUE_STATS,
} from "@/config/membership-page-content.config";
import { DELIVERY_MASTER_FAQ_ANSWER } from "@/config/delivery-language.config";
import { NPA_PRIMARY_MESSAGE, NPA_SITE_URL } from "@/config/npa-brand.config";
import { FunnelLink } from "@/components/shop/FunnelLink";

export const metadata: Metadata = {
  title: MEMBERSHIP_CONFIG.metaTitle,
  description: MEMBERSHIP_CONFIG.metaDescription,
  openGraph: {
    title: MEMBERSHIP_CONFIG.metaTitle,
    description: MEMBERSHIP_CONFIG.metaDescription,
    url: `${NPA_SITE_URL}/membership`,
  },
  alternates: { canonical: `${NPA_SITE_URL}/membership` },
};

function CtaButton({ className }: { className?: string }) {
  return (
    <FunnelLink
      href={MEMBERSHIP_CONFIG.checkoutUrl}
      event="funnel_membership_click"
      eventParams={{ source: "membership_page_cta" }}
      className={
        className ??
        "inline-flex min-h-[52px] items-center justify-center rounded-xl bg-[#D4537E] px-10 py-3.5 text-sm font-bold text-white transition hover:bg-[#D4537E]/85"
      }
    >
      {MEMBERSHIP_CONFIG.ctaLabel} — {formatMembershipMonthlyUsd()}/mo
    </FunnelLink>
  );
}

export default function MembershipPage() {
  const annual = MEMBERSHIP_CONFIG.annualPriceCents;
  const savings = membershipAnnualSavingsVsMonthlyUsd();

  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: MEMBERSHIP_CONFIG.displayName,
    description: MEMBERSHIP_CONFIG.metaDescription,
    price: MEMBERSHIP_CONFIG.monthlyPriceCents / 100,
    priceCurrency: "USD",
    priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().slice(0, 10),
    url: `${NPA_SITE_URL}${MEMBERSHIP_CONFIG.checkoutUrl}`,
    availability: "https://schema.org/InStock",
    category: "Subscription",
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4537E]">
          {MEMBERSHIP_CONFIG.displayName}
        </p>
        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {MEMBERSHIP_CONFIG.hero}
        </h1>
        <p className="mt-5 text-lg text-gray-400">{MEMBERSHIP_CONFIG.heroSubline}</p>
        <p className="mt-4 text-sm leading-relaxed text-gray-500">{NPA_PRIMARY_MESSAGE}</p>

        <div className="mt-10 rounded-2xl border border-[#D4537E]/35 bg-[#D4537E]/[0.07] p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#D4537E]">Pricing — same as checkout form</p>
          <div className="mt-4 flex flex-wrap items-baseline gap-4">
            <div>
              <p className="font-serif text-4xl font-bold text-white">{formatMembershipMonthlyUsd()}</p>
              <p className="text-sm text-gray-400">per month · cancel anytime</p>
            </div>
            {annual != null ? (
              <div className="border-l border-white/15 pl-4">
                <p className="font-serif text-3xl font-bold text-white">{formatMembershipAnnualUsd()}</p>
                <p className="text-sm text-gray-400">
                  per year ({MEMBERSHIP_CONFIG.annualEffectiveMonthlyDisplay}/mo effective)
                  {savings > 0 ? ` · save $${savings.toFixed(0)} vs paying monthly` : ""}
                </p>
              </div>
            ) : null}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CtaButton />
            <Link href="/faq" className="text-center text-sm text-[#D4537E] hover:underline sm:text-left">
              Membership &amp; delivery FAQ →
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {MEMBERSHIP_VALUE_STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4">
              <p className="font-serif text-xl font-bold text-[#D4537E]">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="font-serif text-2xl font-bold">Everything included</h2>
          <p className="mt-2 text-sm text-gray-400">
            Full access to the NPA catalog while subscribed — details and full grid on the secure checkout form.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-gray-300">
            {MEMBERSHIP_EVERYTHING_INCLUDED.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-[#D4537E]">&#10003;</span>
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-400">
            <strong className="text-gray-200">How delivery works:</strong> {DELIVERY_MASTER_FAQ_ANSWER}
          </p>
        </section>

        <section className="mt-14">
          <h2 className="font-serif text-2xl font-bold">Free vs Pro</h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.05]">
                  <th className="p-3 font-bold text-gray-300">Feature</th>
                  <th className="p-3 font-bold text-gray-500">Free / one-time</th>
                  <th className="p-3 font-bold text-[#D4537E]">Pro</th>
                </tr>
              </thead>
              <tbody>
                {MEMBERSHIP_FREE_VS_PRO.map((row) => (
                  <tr key={row.feature} className="border-b border-white/10">
                    <td className="p-3 text-gray-200">{row.feature}</td>
                    <td className="p-3 text-gray-500">{row.free}</td>
                    <td className="p-3 text-gray-300">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-serif text-2xl font-bold">What members say</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-1">
            {MEMBERSHIP_TESTIMONIALS.map((t) => (
              <blockquote
                key={t.quote}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-relaxed text-gray-400"
              >
                <p className="text-[#D4537E]">★★★★★</p>
                <p className="mt-2 italic text-gray-300">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-3 text-xs font-bold text-gray-500">
                  — {t.author}, {t.location}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-serif text-2xl font-bold">Membership FAQ</h2>
          <div className="mt-6 space-y-3">
            {MEMBERSHIP_PAGE_FAQ.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-sm font-bold text-white">{faq.q}</h3>
                <p className="mt-2 text-sm text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-[#D4537E]/30 bg-[#D4537E]/10 p-8 text-center">
          <h2 className="font-serif text-2xl font-bold">Ready for the full library?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-300">
            {formatMembershipMonthlyUsd()}/mo or {formatMembershipAnnualUsd()}/yr — same numbers as our Pro checkout
            form.
          </p>
          <div className="mt-6 flex justify-center">
            <CtaButton />
          </div>
        </section>

        <ul className="mt-10 space-y-2 text-sm text-gray-400">
          {MEMBERSHIP_CONFIG.bullets.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="text-[#D4537E]">&#10003;</span>
              {line}
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-xs text-gray-600">
          Prefer one product at a time?{" "}
          <Link href="/shop" className="text-[#D4537E] hover:underline">
            Browse the shop
          </Link>{" "}
          ·{" "}
          <Link href="/free-templates" className="text-[#D4537E] hover:underline">
            Free resources
          </Link>
        </p>
      </div>
    </div>
  );
}
