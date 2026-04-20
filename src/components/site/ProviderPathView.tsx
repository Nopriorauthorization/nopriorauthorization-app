"use client";

import Image from "next/image";
import {
  AUDIENCE_CTA_LABELS,
  AUDIENCE_IMAGES,
  FOR_PROVIDERS_META,
  PROVIDER_BUSINESS_ROW,
  PROVIDER_CLINICAL_ROW,
  PROVIDER_COLLECTIONS,
  PROVIDER_LEAD,
  PROVIDER_PATIENT_ED_FLAGSHIP,
  PROVIDER_REASSURANCE,
  PROVIDER_TRUST_LINE,
} from "@/config/site-audiences.config";
import type { PathEntrySource } from "@/lib/analytics/path-entry-source";
import { usePathEntryAnalytics } from "@/lib/analytics/use-path-entry-analytics";
import { useFirstPathEngagement } from "@/lib/analytics/use-first-path-engagement";
import { NpaTrackedLink } from "@/components/site/NpaTrackedLink";

type Props = {
  entrySource: PathEntrySource;
};

export function ProviderPathView({ entrySource }: Props) {
  usePathEntryAnalytics("provider", entrySource);
  const reportEngagement = useFirstPathEngagement("provider");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a] text-white">
      {/* Hero — Growth System only as primary CTA */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_80%_0%,rgba(212,83,126,0.14),transparent)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:gap-12 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="order-2 lg:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">
              No Prior Authorization
            </p>
            <h1 className="mt-5 text-balance font-serif text-3xl font-bold leading-[1.12] sm:text-4xl md:text-[2.75rem] md:leading-tight">
              {FOR_PROVIDERS_META.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-gray-400 sm:text-lg">
              {FOR_PROVIDERS_META.subtitle}
            </p>
            <p className="mt-6 max-w-md rounded-2xl border border-[#D4537E]/20 bg-[#D4537E]/5 px-4 py-3 text-sm leading-relaxed text-pink-100/90">
              {PROVIDER_REASSURANCE}
            </p>

            <div className="mt-8">
              <NpaTrackedLink
                href={PROVIDER_LEAD.href}
                trackEvent="npa_shop_click"
                trackParams={{
                  source: "for-providers-hero-primary",
                  path: PROVIDER_LEAD.href,
                }}
                onClick={() => reportEngagement("growth_system")}
                className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-[#D4537E] px-8 py-3.5 text-center text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(212,83,126,0.55)] transition hover:bg-[#c7436f] sm:w-auto sm:inline-flex"
              >
                {PROVIDER_LEAD.label}
              </NpaTrackedLink>
              <p className="mt-3 max-w-lg text-sm font-medium leading-relaxed text-amber-200/90">
                {PROVIDER_LEAD.oneLiner}
              </p>
              <NpaTrackedLink
                href="#whats-inside-growth"
                onClick={() => reportEngagement("peek_inside")}
                className="mt-2 inline-flex min-h-[40px] items-center text-xs font-semibold text-amber-100/85 underline-offset-4 transition hover:text-amber-50 hover:underline sm:text-sm"
              >
                See what&apos;s inside →
              </NpaTrackedLink>
              <NpaTrackedLink
                href="/shop"
                trackEvent="npa_shop_click"
                trackParams={{ source: "for-providers-hero-shop-text", path: "/shop" }}
                onClick={() => reportEngagement("shop_home")}
                className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-gray-500 underline-offset-4 transition hover:text-gray-300 hover:underline"
              >
                {AUDIENCE_CTA_LABELS.fullTemplateShop} →
              </NpaTrackedLink>
            </div>

            <p className="mt-7 text-center text-sm font-medium leading-snug text-pink-200/85 sm:text-left">
              {PROVIDER_TRUST_LINE}
            </p>

            <NpaTrackedLink
              href="/for-students?source=nav"
              onClick={() => reportEngagement("cross_student_lane")}
              className="mt-7 inline-flex min-h-[44px] items-center text-sm font-semibold text-gray-500 underline-offset-4 transition hover:text-gray-300 hover:underline"
            >
              Need student study tools? {AUDIENCE_CTA_LABELS.studentPathLink} →
            </NpaTrackedLink>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1a] shadow-[0_32px_120px_-40px_rgba(0,0,0,0.9)] sm:aspect-[5/6]">
              <Image
                src={AUDIENCE_IMAGES.providerEmpowered}
                alt="Provider at the desk — clinical and business support visual, neon brand accent"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            </div>
            <div className="mt-4 flex gap-3 sm:mt-6">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 opacity-90 sm:h-28 sm:w-24">
                <Image
                  src={AUDIENCE_IMAGES.providerStressed}
                  alt="Recognizing provider overwhelm — you are not alone"
                  fill
                  className="object-cover object-center"
                  sizes="96px"
                />
              </div>
              <p className="max-w-xs self-center text-xs leading-relaxed text-gray-500 sm:text-sm">
                If the desk looks like this some nights—you are not alone. The Growth System
                is the first structured step back to clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Patient ed flagship */}
      <section
        id="whats-inside-growth"
        className="scroll-mt-28 py-14 sm:scroll-mt-32 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-balance font-serif text-xl font-bold text-gray-300 sm:text-2xl">
            Patient education flagship
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Pair systems with a premium book experience clients actually read.
          </p>
          <NpaTrackedLink
            href={PROVIDER_PATIENT_ED_FLAGSHIP.href}
            trackEvent="npa_book_click"
            trackParams={{ source: "for-providers-patient-ed-card" }}
            onClick={() => reportEngagement("book")}
            className="mt-6 flex min-h-[56px] flex-col gap-6 rounded-2xl border border-white/10 bg-[#141414] p-6 transition hover:border-[#D4537E]/35 sm:flex-row sm:items-center sm:p-8"
          >
            <div className="flex-1">
              <span className="rounded-full bg-[#D4537E]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-pink-200">
                {PROVIDER_PATIENT_ED_FLAGSHIP.badge}
              </span>
              <h3 className="mt-3 text-xl font-bold sm:text-2xl">
                {PROVIDER_PATIENT_ED_FLAGSHIP.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400 sm:text-base">
                {PROVIDER_PATIENT_ED_FLAGSHIP.description}
              </p>
            </div>
            <span className="text-sm font-bold text-[#D4537E]">View the book →</span>
          </NpaTrackedLink>
        </div>
      </section>

      {/* Collections — lighter visual weight */}
      <section className="border-y border-white/5 bg-[#0d0d0d]/90 py-12 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-5 rounded-2xl border border-white/5 bg-[#121212]/90 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="max-w-2xl">
              <h2 className="text-balance font-serif text-lg font-bold text-gray-200 sm:text-xl">
                {PROVIDER_COLLECTIONS.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {PROVIDER_COLLECTIONS.description}
              </p>
            </div>
            <NpaTrackedLink
              href={PROVIDER_COLLECTIONS.href}
              trackEvent="npa_shop_click"
              trackParams={{
                source: "for-providers-collections",
                path: PROVIDER_COLLECTIONS.href,
              }}
              onClick={() => reportEngagement("shop_families")}
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/[0.07]"
            >
              {PROVIDER_COLLECTIONS.ctaLabel}
            </NpaTrackedLink>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Clinical &amp; chair-side
              </h3>
              <ul className="mt-4 space-y-1">
                {PROVIDER_CLINICAL_ROW.map((item) => {
                  const isShop = item.href.startsWith("/shop");
                  return (
                    <li key={item.href}>
                      <NpaTrackedLink
                        href={item.href}
                        trackEvent={isShop ? "npa_shop_click" : undefined}
                        trackParams={
                          isShop
                            ? { source: "for-providers-clinical", path: item.href }
                            : undefined
                        }
                        onClick={() =>
                          reportEngagement(isShop ? "shop_link" : "cheat_sheets")
                        }
                        className="flex min-h-[48px] flex-col rounded-xl px-3 py-3 transition hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="font-medium text-white">{item.label}</span>
                        <span className="text-xs text-gray-500 sm:ml-4 sm:text-right sm:text-sm">
                          {item.description}
                        </span>
                      </NpaTrackedLink>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Business, marketing &amp; compliance
              </h3>
              <ul className="mt-4 space-y-1">
                {PROVIDER_BUSINESS_ROW.map((item) => {
                  const isShop = item.href.startsWith("/shop");
                  const eg =
                    item.href === "/audit" ? "audit" : isShop ? "shop_link" : "other";
                  return (
                    <li key={item.href}>
                      <NpaTrackedLink
                        href={item.href}
                        trackEvent={isShop ? "npa_shop_click" : undefined}
                        trackParams={
                          isShop
                            ? { source: "for-providers-business", path: item.href }
                            : undefined
                        }
                        onClick={() => reportEngagement(eg)}
                        className="flex min-h-[48px] flex-col rounded-xl px-3 py-3 transition hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="font-medium text-white">{item.label}</span>
                        <span className="text-xs text-gray-500 sm:ml-4 sm:text-right sm:text-sm">
                          {item.description}
                        </span>
                      </NpaTrackedLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-sm text-gray-400">Cramming microbiology or A&amp;P instead?</p>
          <NpaTrackedLink
            href="/for-students?source=nav"
            onClick={() => reportEngagement("cross_student_lane")}
            className="mt-3 inline-flex min-h-[44px] items-center justify-center text-base font-bold text-teal-400 transition hover:text-teal-300"
          >
            {AUDIENCE_CTA_LABELS.studentPathLink} →
          </NpaTrackedLink>
        </div>
      </section>
    </div>
  );
}
