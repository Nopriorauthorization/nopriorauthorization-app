import Link from "next/link";
import { getShopProducts, getShopCategories } from "@/lib/shop/products";
import { ShopCategoryFilter } from "./ShopCategoryFilter";
import { EmailCapture } from "./EmailCapture";
import { PlaybookShowcase } from "./PlaybookShowcase";

export const metadata = {
  title: "Med Spa Templates & Consent Forms | NPA Shop",
  description:
    "Clinical consent forms, patient communication kits, aftercare cards, and social media templates. Instant download. Built for aesthetic providers.",
  openGraph: {
    title: "Med Spa Templates & Consent Forms | NPA Shop",
    description: "Done-for-you templates for med spas, injectors, and aesthetic entrepreneurs. Instant download.",
  },
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
  "patient-loyalty-system": { label: "High ROI", color: "bg-emerald-500/20 text-emerald-300" },
  "botox-patient-journey-kit": { label: "Journey Kit", color: "bg-sky-500/20 text-sky-300" },
  "filler-patient-journey-kit": { label: "Journey Kit", color: "bg-sky-500/20 text-sky-300" },
  "glp1-patient-journey-kit": { label: "Journey Kit", color: "bg-sky-500/20 text-sky-300" },
  "iv-therapy-patient-journey-kit": { label: "Journey Kit", color: "bg-sky-500/20 text-sky-300" },
  "microneedling-patient-journey-kit": { label: "Journey Kit", color: "bg-sky-500/20 text-sky-300" },
  "chemical-peel-patient-journey-kit": { label: "Journey Kit", color: "bg-sky-500/20 text-sky-300" },
  "hormone-patient-journey-kit": { label: "Journey Kit", color: "bg-sky-500/20 text-sky-300" },
  "peptide-patient-journey-kit": { label: "Journey Kit", color: "bg-sky-500/20 text-sky-300" },
  "medical-disclaimer-system": { label: "Essential", color: "bg-red-500/20 text-red-300" },
  "diy-google-setup-kit": { label: "Best Value", color: "bg-emerald-500/20 text-emerald-300" },
  "botox-clinical-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "iv-therapy-clinical-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "peptide-therapy-clinical-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "hormone-therapy-clinical-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "glp1-clinical-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "dermal-filler-clinical-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "pellet-therapy-clinical-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "pharmaceutical-reference-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "olympia-iv-dosing-guide-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "lash-extensions-clinical-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "lash-lift-perm-clinical-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "brow-henna-clinical-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "waxing-clinical-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "ipl-laser-clinical-cheat-sheet": { label: "$10 Quick Ref", color: "bg-cyan-500/20 text-cyan-300" },
  "consent-botox-neurotoxins": { label: "$19 consent", color: "bg-rose-500/20 text-rose-300" },
  "consent-dermal-filler": { label: "$19 consent", color: "bg-rose-500/20 text-rose-300" },
  "consent-glp1-weight-loss": { label: "$19 consent", color: "bg-rose-500/20 text-rose-300" },
  "consent-hormone-therapy": { label: "$19 consent", color: "bg-rose-500/20 text-rose-300" },
  "consent-iv-im-therapy": { label: "$19 consent", color: "bg-rose-500/20 text-rose-300" },
  "consent-laser-ipl": { label: "$19 consent", color: "bg-rose-500/20 text-rose-300" },
  "consent-lash-extensions": { label: "$19 consent", color: "bg-rose-500/20 text-rose-300" },
  "consent-waxing": { label: "$19 consent", color: "bg-rose-500/20 text-rose-300" },
  "consent-microneedling-rf": { label: "$19 consent", color: "bg-rose-500/20 text-rose-300" },
  "consent-photography-hipaa": { label: "$19 consent", color: "bg-rose-500/20 text-rose-300" },
  "insurance-legal-compliance-guide": { label: "$47 · Guide", color: "bg-violet-500/20 text-violet-300" },
  "phase-2-business-bundle": { label: "$47 · Guide", color: "bg-violet-500/20 text-violet-300" },
  "difficult-client-scripts": { label: "$47 · Guide", color: "bg-violet-500/20 text-violet-300" },
  "before-after-photo-system": { label: "$47 · Guide", color: "bg-violet-500/20 text-violet-300" },
  "vendor-supplier-directory": { label: "$47 · Guide", color: "bg-violet-500/20 text-violet-300" },
  "31-day-social-media-content-calendar": { label: "$47 · Calendar", color: "bg-fuchsia-500/20 text-fuchsia-300" },
  "facial-anatomy-nurse-injector": {
    label: "Top pick · Most popular",
    color: "bg-emerald-500/20 text-emerald-300",
  },
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
  "patient-loyalty-system": "One rebooking script pays for this 10x over. Turn one-time patients into lifetime revenue.",
  "botox-patient-journey-kit": "Every touchpoint from first inquiry to rebooking. Hand this to your front desk and never miss a step.",
  "filler-patient-journey-kit": "Swelling timeline, dissolving options, day-by-day recovery — the filler patient's complete guide.",
  "glp1-patient-journey-kit": "Lab requirements to monthly check-ins. Manage nausea, set expectations, keep patients on track.",
  "iv-therapy-patient-journey-kit": "Pre-hydration, during-treatment expectations, NAD+ recovery — the fastest post-care in the series.",
  "microneedling-patient-journey-kit": "Day 1 red, Day 3 sandpaper, Day 7 glowing. Give patients the roadmap so they don't panic.",
  "chemical-peel-patient-journey-kit": "Peeling timeline days 1-7, sun avoidance protocol, Fitzpatrick screening — the complete peel guide.",
  "hormone-patient-journey-kit": "Labs, delivery method consent, symptom tracking, monthly follow-up — the BHRT patient's complete journey.",
  "peptide-patient-journey-kit": "Reconstitution, injection technique, storage, goal-based protocols — everything your peptide patient needs.",
  "medical-disclaimer-system": "Selling clinical content without disclaimers? That's a lawsuit waiting to happen. Fix it in 10 minutes.",
  "diy-google-setup-kit": "Everything an agency charges $797 for — in one $297 download. Set up your own Google presence.",
  "botox-clinical-cheat-sheet": "Landmarks, dosing cues, and complication reminders at a glance — keep it at the chair.",
  "iv-therapy-clinical-cheat-sheet": "Drip math, additives, and red-flag cues without flipping through a full IV manual.",
  "peptide-therapy-clinical-cheat-sheet": "Reconstitution, screening, and documentation prompts — built for busy peptide visits.",
  "hormone-therapy-clinical-cheat-sheet": "BHRT labs, delivery methods, and follow-up rhythm on one sheet at the chair.",
  "glp1-clinical-cheat-sheet": "Titration, side effects, and escalation cues for GLP-1 visits — fast and consistent.",
  "dermal-filler-clinical-cheat-sheet": "Depth, anatomy, reversal, and complication reminders — filler confidence in one glance.",
  "pellet-therapy-clinical-cheat-sheet": "Insertion, dosing rhythm, and follow-up cues for pellet visits — keep it at the chair.",
  "pharmaceutical-reference-cheat-sheet": "High-yield med-class reminders and documentation prompts without digging through references.",
  "olympia-iv-dosing-guide-cheat-sheet": "Olympia-style IV menu dosing, bags, and additives in one glance for the IV suite.",
  "lash-extensions-clinical-cheat-sheet": "Isolation, adhesive, fills, and allergy cues at a glance — keep it at the lash bed.",
  "lash-lift-perm-clinical-cheat-sheet": "Processing, patch tests, and contraindications for lift and perm without flipping through a manual.",
  "brow-henna-clinical-cheat-sheet": "Prep, develop timing, and aftercare prompts for henna and tint services between clients.",
  "waxing-clinical-cheat-sheet": "Temperature, technique, and contraindication checks for consistent wax room flow.",
  "ipl-laser-clinical-cheat-sheet": "Settings, skin-type cues, and post-treatment reminders for IPL and laser visits.",
  "consent-botox-neurotoxins": "Standalone neurotoxin informed consent — risks, alternatives, and signatures without the full bundle.",
  "consent-dermal-filler": "Single filler consent covering vascular risk, dissolution options, and patient acknowledgments.",
  "consent-glp1-weight-loss": "GLP-1 program consent for side effects, monitoring, and patient signatures.",
  "consent-hormone-therapy": "BHRT/TRT consent language for hormone services — ready to brand and print.",
  "consent-iv-im-therapy": "IV and IM therapy consent for your infusion suite documentation.",
  "consent-laser-ipl": "Laser and IPL treatment consent with device-appropriate disclosures.",
  "consent-lash-extensions": "Lash extension consent — adhesive, allergies, fills, and aftercare in one form.",
  "consent-waxing": "Professional waxing consent for contraindications, skin integrity, and post-care.",
  "consent-microneedling-rf": "Microneedling and RF consent — series expectations, risks, and aftercare.",
  "consent-photography-hipaa": "Photo authorization with tiered use options and HIPAA-aligned language.",
  "insurance-legal-compliance-guide":
    "Danielle Alcala's 10-year framework for insurance, legal, and compliance — disclaimers on the cover and every page footer. Not legal advice; consult an attorney.",
  "phase-2-business-bundle": "Next-phase systems for an aesthetic business that has outgrown startup mode — priorities, structure, and momentum.",
  "difficult-client-scripts": "Scripts and framing for tense moments — complaints, refunds, boundaries — so your team sounds calm and consistent.",
  "before-after-photo-system": "Repeatable before/after workflow — consistency, storage, and alignment with your consent and marketing rules.",
  "vendor-supplier-directory": "Track vendors, reps, and reorders in one place — a directory framework you fill with your real suppliers.",
  "31-day-social-media-content-calendar":
    "A full month of med-spa-friendly post themes and prompts — stop staring at a blank grid; follow the calendar and adapt to your brand.",
  "facial-anatomy-nurse-injector":
    "The anatomy guide injectors actually use — danger zones, depth, and vectors with Danielle's clinical voice. Top pick for new and returning injectors.",
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
  { label: "Cheat Sheets", filter: "Cheat Sheets" },
  { label: "Business Systems", filter: "Business Systems" },
];

const START_HERE_SLUGS = [
  "facial-anatomy-nurse-injector",
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
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#D4537E]">
            No Prior Authorization
          </p>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
            Stop designing.<br />
            <span className="text-[#D4537E]">Start posting.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Professional templates for med spas, injectors, and aesthetic
            entrepreneurs. Consent forms, social media kits, legal bundles,
            and marketing materials &mdash; download instantly, customize in minutes.
          </p>
          <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <a
              href="#start-here"
              className="min-h-[48px] rounded-xl bg-[#D4537E] px-8 py-3 text-center text-base font-bold text-white transition hover:bg-[#D4537E]/80 sm:min-h-0 sm:py-4"
            >
              Shop Best Sellers
            </a>
            <a
              href="#all-products"
              className="min-h-[48px] rounded-xl border border-white/20 bg-white/5 px-8 py-3 text-center text-base font-bold text-white transition hover:bg-white/10 sm:min-h-0 sm:py-4"
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
      <section className="sticky top-14 z-30 border-b border-white/10 bg-[#1A1A1A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1A1A1A]/90">
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
              Top picks &amp; best sellers
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
