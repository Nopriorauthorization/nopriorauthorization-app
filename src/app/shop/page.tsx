import Link from "next/link";
import { getShopProducts, getShopCategories } from "@/lib/shop/products";
import { ShopCategoryFilter } from "./ShopCategoryFilter";
import { EmailCapture } from "./EmailCapture";
import { PlaybookShowcase } from "./PlaybookShowcase";

export const metadata = {
  title: "Digital Templates for Aesthetic Professionals | No Prior Authorization",
  description:
    "Done-for-you templates for med spas, injectors, and aesthetic entrepreneurs. Consent forms, social media kits, legal bundles, and more — instant download.",
};

const BADGE_MAP: Record<string, { label: string; color: string }> = {
  "med-spa-mega-bundle": { label: "Best Seller", color: "bg-emerald-500/20 text-emerald-300" },
  "combo-bundle": { label: "Best Value", color: "bg-amber-500/20 text-amber-300" },
  "complete-injector-bundle": { label: "Popular", color: "bg-sky-500/20 text-sky-300" },
  "weight-loss-mega-bundle": { label: "Trending", color: "bg-orange-500/20 text-orange-300" },
  "iv-therapy-mega-bundle": { label: "Trending", color: "bg-purple-500/20 text-purple-300" },
  "med-spa-legal-startup-bundle": { label: "Essential", color: "bg-rose-500/20 text-rose-300" },
  "botox-consent-bundle": { label: "Top Rated", color: "bg-emerald-500/20 text-emerald-300" },
  "hipaa-compliance-kit": { label: "Required", color: "bg-red-500/20 text-red-300" },
  "injectors-playbook": { label: "Premium", color: "bg-amber-500/20 text-amber-300" },
  "new-injector-onboarding-kit": { label: "New", color: "bg-sky-500/20 text-sky-300" },
  "guidebook-category-strategy": { label: "Strategy", color: "bg-violet-500/20 text-violet-300" },
  "microblading-pmu-playbook": { label: "Premium", color: "bg-amber-500/20 text-amber-300" },
  "treatment-menu-signage-kit": { label: "New", color: "bg-sky-500/20 text-sky-300" },
  "aftercare-card-kit": { label: "Must Have", color: "bg-emerald-500/20 text-emerald-300" },
  "patient-communication-kit": { label: "New", color: "bg-sky-500/20 text-sky-300" },
  "medspa-social-media-system": { label: "Best Seller", color: "bg-emerald-500/20 text-emerald-300" },
  "medspa-content-strategy-system": { label: "New", color: "bg-sky-500/20 text-sky-300" },
  "hormone-therapy-playbook": { label: "New", color: "bg-violet-500/20 text-violet-300" },
  "peptide-therapy-playbook": { label: "Hot", color: "bg-orange-500/20 text-orange-300" },
  "google-domination-playbook": { label: "Hot", color: "bg-orange-500/20 text-orange-300" },
  "diy-google-setup-kit": { label: "Best Value", color: "bg-emerald-500/20 text-emerald-300" },
};

const OUTCOME_MAP: Record<string, string> = {
  "med-spa-mega-bundle": "Everything you need to market your med spa — one download, done.",
  "combo-bundle": "Save 40% vs buying separately. Your complete marketing toolkit.",
  "complete-injector-bundle": "Post consistently for 3+ months without creating a single graphic.",
  "weight-loss-mega-bundle": "Dominate weight loss marketing with a full content library.",
  "iv-therapy-mega-bundle": "Fill your IV therapy schedule with scroll-stopping content.",
  "med-spa-legal-startup-bundle": "Open your doors legally. 34 templates your attorney will thank you for.",
  "botox-consent-bundle": "Protect your practice and look professional from day one.",
  "hipaa-compliance-kit": "Be audit-ready tomorrow. Not next month.",
  "injectors-playbook": "Ryan's exact consultation scripts, dosing protocols, and clinical systems — in your hands.",
  "new-injector-onboarding-kit": "Train your next injector in 30 days. Not 6 months of trial and error.",
  "guidebook-category-strategy": "Build a digital product business that earns while you sleep.",
  "microblading-pmu-playbook": "Run your PMU business like a clinic, not a side hustle.",
  "treatment-menu-signage-kit": "Your lobby looks professional in 10 minutes. Print and display.",
  "aftercare-card-kit": "Hand patients a card after every treatment. Fewer callbacks, better outcomes.",
  "patient-communication-kit": "Copy, paste, send. Every patient message you'll ever need.",
  "medspa-social-media-system": "90 days of content — done. Stop staring at a blank screen every Monday morning.",
  "medspa-content-strategy-system": "For established spas who post inconsistently. Every decision already made.",
  "hormone-therapy-playbook": "Add BHRT to your practice. Screening, protocols, vendors, consent — the complete system.",
  "peptide-therapy-playbook": "The hottest niche in wellness. BPC-157, semaglutide, NAD+ — protocols your patients are already asking about.",
  "google-domination-playbook": "87% of patients Google you before booking. This playbook makes sure they find YOU.",
  "diy-google-setup-kit": "Everything an agency charges $797 for — in one $297 download. Set up your own Google presence.",
};

const QUICK_CATEGORIES = [
  { label: "Botox & Injectables", filter: "Clinical Forms" },
  { label: "Weight Loss", filter: "weight-loss" },
  { label: "IV Therapy", filter: "iv-therapy" },
  { label: "Clinical Forms", filter: "Clinical Forms" },
  { label: "Social Media Kits", filter: "Social Media" },
  { label: "Legal & Compliance", filter: "Legal" },
  { label: "Mega Bundles", filter: "mega-bundle" },
  { label: "Playbooks", filter: "Playbooks" },
];

const START_HERE_SLUGS = [
  "med-spa-mega-bundle",
  "botox-consent-bundle",
  "weight-loss-mega-bundle",
];

const TESTIMONIALS = [
  {
    text: "I spent weeks trying to make my own consent forms. This bundle saved me at least 40 hours and looks way more professional than anything I could have designed.",
    author: "Sarah M.",
    role: "Nurse Practitioner, TX",
  },
  {
    text: "The social media templates are a game changer. I went from posting once a week to daily — and my bookings went up 30% in the first month.",
    author: "Jessica L.",
    role: "Med Spa Owner, FL",
  },
  {
    text: "Finally, HIPAA forms that don't look like they were made in Word 2003. My patients actually read these.",
    author: "Dr. Amanda K.",
    role: "Medical Director, CA",
  },
];

export default function ShopPage() {
  const products = getShopProducts();
  const categories = getShopCategories();
  const startHereProducts = START_HERE_SLUGS.map((s) =>
    products.find((p) => p.slug === s),
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* HERO */}
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1A1A] to-[#111]">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#D4537E]">
            No Prior Authorization
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-6xl">
            Stop designing.<br />
            <span className="text-[#D4537E]">Start posting.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Professional templates for med spas, injectors, and aesthetic
            entrepreneurs. Consent forms, social media kits, legal bundles,
            and marketing materials &mdash; download instantly, customize in minutes.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#start-here"
              className="rounded-xl bg-[#D4537E] px-8 py-4 text-base font-bold text-white transition hover:bg-[#D4537E]/80"
            >
              Shop Best Sellers
            </a>
            <a
              href="#all-products"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white transition hover:bg-white/10"
            >
              Browse All Templates
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Trusted by 500+ aesthetic providers &middot; Instant digital delivery
          </p>
        </div>
      </section>

      {/* CATEGORY NAV */}
      <section className="sticky top-0 z-40 border-b border-white/10 bg-[#1A1A1A]/95 backdrop-blur">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6">
          <div className="flex gap-1 py-3">
            {QUICK_CATEGORIES.map((cat) => (
              <a
                key={cat.label}
                href={`#all-products`}
                className="shrink-0 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-gray-400 transition hover:border-[#D4537E]/40 hover:text-[#D4537E]"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* PLAYBOOKS SHOWCASE */}
        <PlaybookShowcase />

        {/* START HERE */}
        <section id="start-here" className="py-16">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4537E]">
              Start here
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">
              Most popular bundles
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {startHereProducts.map((p) =>
              p ? (
                <Link
                  key={p.slug}
                  href={`/shop/${p.slug}`}
                  className="group relative flex flex-col rounded-2xl border-2 border-[#D4537E]/30 bg-[#D4537E]/5 p-6 transition hover:border-[#D4537E]/60"
                >
                  <span className="mb-3 inline-block self-start rounded-full bg-[#D4537E] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {BADGE_MAP[p.slug]?.label || "Featured"}
                  </span>
                  <h3 className="mb-2 font-serif text-xl font-bold text-white">
                    {p.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm text-gray-400">
                    {OUTCOME_MAP[p.slug] || p.shortDescription}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-3xl font-bold">{p.priceDisplay}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        {p.templateCount} templates
                      </span>
                    </div>
                    <span className="rounded-lg bg-[#D4537E] px-5 py-2.5 text-sm font-bold text-white transition group-hover:bg-white group-hover:text-[#1A1A1A]">
                      Get it now
                    </span>
                  </div>
                </Link>
              ) : null,
            )}
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="border-y border-white/10 py-16">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4537E]">
              What providers are saying
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">
              Real results from real clinics
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="mb-4 flex gap-1 text-[#D4537E]">
                  {"★★★★★".split("").map((s, j) => (
                    <span key={j}>{s}</span>
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-gray-300">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-bold text-white">{t.author}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EMAIL CAPTURE */}
        <section className="py-16">
          <EmailCapture />
        </section>

        {/* ALL PRODUCTS */}
        <section id="all-products" className="pb-20">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-3xl font-semibold">
              All templates
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {products.length} products &middot; instant download &middot; fully customizable
            </p>
          </div>

          <ShopCategoryFilter categories={categories} />

          <div
            id="product-grid"
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.map((p) => {
              const badge = BADGE_MAP[p.slug];
              const outcome = OUTCOME_MAP[p.slug];
              return (
                <Link
                  key={p.slug}
                  href={`/shop/${p.slug}`}
                  data-category={p.category}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#D4537E]/40 hover:bg-white/[0.06]"
                >
                  {p.previewImages[0] && (
                    <div className="mb-3 overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.previewImages[0]}
                        alt={p.title}
                        loading="lazy"
                        className="h-40 w-full object-cover object-top"
                      />
                    </div>
                  )}

                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {p.category}
                    </span>
                    {badge && (
                      <span
                        className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    )}
                    {!badge && p.featured && (
                      <span className="rounded-md bg-[#D4537E]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D4537E]">
                        Featured
                      </span>
                    )}
                  </div>

                  <h2 className="mb-1 font-serif text-lg font-semibold leading-snug text-white group-hover:text-[#D4537E]">
                    {p.title}
                  </h2>

                  {outcome ? (
                    <p className="mb-3 text-xs font-medium text-[#D4537E]/80">
                      {outcome}
                    </p>
                  ) : null}

                  <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-2">
                    {p.shortDescription}
                  </p>

                  <div className="flex items-end justify-between border-t border-white/10 pt-4">
                    <div>
                      <span className="text-2xl font-bold text-white">
                        {p.priceDisplay}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {p.templateCount} templates
                      </span>
                    </div>
                    <span className="rounded-lg bg-[#D4537E] px-4 py-2 text-sm font-bold text-white transition group-hover:bg-[#D4537E]/80">
                      View
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
