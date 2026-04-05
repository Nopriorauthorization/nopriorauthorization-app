import Link from "next/link";
import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, DM_Serif_Display } from "next/font/google";
import { GROWTH_SYSTEM_PRODUCT, GROWTH_SYSTEM_SLUG } from "@/config/growth-funnel.config";
import { STUDY_GUIDE_NCLEX, formatStudyGuideUsd } from "@/config/study-guides.config";
import { getShopProducts, type ShopProduct } from "@/lib/shop/products";

const SITE = "https://nopriorauthorization.com";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--sf-dm-sans",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--sf-dm-serif",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--sf-bebas",
});

export const metadata: Metadata = {
  title: "Clinical resources for med spa & esthetic providers — campaign storefront",
  description:
    "Cheat sheets, business systems, NCLEX study guides, consent forms, and bundles — built by Danielle Alcala-Glazier inside Hello Gorgeous Med Spa. Instant download.",
  keywords: [
    "med spa templates",
    "injector cheat sheet",
    "NCLEX study bundle",
    "esthetician resources",
    "No Prior Authorization shop",
  ],
  openGraph: {
    title: "No Prior Authorization — Built by a real provider",
    description:
      "Stop Googling at midnight. Clinical references, business systems, and boards prep — instant download.",
    url: `${SITE}/storefront`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "No Prior Authorization — Campaign storefront",
    description: "Clinical cheat sheets, business tools & NCLEX guides. Instant download.",
  },
  alternates: {
    canonical: `${SITE}/storefront`,
  },
};

const BLACK = "#1A1A1A";
const BG = "#faf8fb";

function bySlug(products: ShopProduct[], slug: string): ShopProduct | undefined {
  return products.find((p) => p.slug === slug);
}

function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default function StorefrontCampaignPage() {
  const products = getShopProducts();
  const productCount = products.length;
  const minCents = Math.min(...products.map((p) => p.priceCents));
  const nclexPrice = formatStudyGuideUsd(STUDY_GUIDE_NCLEX.priceCents);
  const growth = {
    price: formatUsd(GROWTH_SYSTEM_PRODUCT.priceCents),
    compare: formatUsd(GROWTH_SYSTEM_PRODUCT.compareAtCents),
    title: GROWTH_SYSTEM_PRODUCT.title,
  };

  const clinicalSlugs = [
    "botox-clinical-cheat-sheet",
    "dermal-filler-clinical-cheat-sheet",
    "glp1-clinical-cheat-sheet",
    "hormone-therapy-clinical-cheat-sheet",
    "olympia-iv-dosing-guide-cheat-sheet",
    "pharmaceutical-reference-cheat-sheet",
    "skincare-ingredient-interactions-cheat-sheet",
    "peptide-therapy-clinical-cheat-sheet",
  ] as const;

  const flagshipSlugs = ["facial-anatomy-nurse-injector", "injectors-playbook", "hormone-therapy-playbook"] as const;

  const businessSlugs = [
    "phase-2-business-bundle",
    "31-day-social-media-content-calendar",
    "patient-loyalty-system",
    "npa-49-star-system",
  ] as const;

  const journeySlugs = [
    "botox-patient-journey-kit",
    "filler-patient-journey-kit",
    "glp1-patient-journey-kit",
    "microneedling-patient-journey-kit",
  ] as const;

  const consentSlugs = ["botox-consent-bundle", "weight-loss-kit", "consent-iv-im-therapy"] as const;

  return (
    <div
      className={`${dmSans.variable} ${dmSerif.variable} ${bebas.variable} min-h-screen text-[#1A1A1A]`}
      style={{ backgroundColor: BG, fontFamily: "var(--sf-dm-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="bg-[#D4537E] py-2.5 text-center text-xs font-semibold tracking-wide text-white">
        New: NCLEX complete bundle — cheat sheets + full study guides.{" "}
        <Link href="/nclex-bundle" className="underline underline-offset-2">
          Shop NCLEX →
        </Link>
      </div>

      <nav
        className="sticky top-0 z-[100] flex h-[60px] items-center justify-between px-5 sm:px-10"
        style={{ backgroundColor: BLACK }}
      >
        <Link href="/" className="text-white no-underline">
          <div className="font-[family-name:var(--sf-bebas)] text-xl tracking-[0.2em]">No Prior Authorization</div>
          <div className="-mt-0.5 text-[10px] uppercase tracking-wider text-[#888]">nopriorauthorization.com</div>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#clinical" className="text-sm text-[#94a3b8] transition hover:text-white">
            Clinical
          </a>
          <a href="#business" className="text-sm text-[#94a3b8] transition hover:text-white">
            Business
          </a>
          <a href="#nclex" className="text-sm text-[#94a3b8] transition hover:text-white">
            NCLEX
          </a>
          <a href="#bundles" className="text-sm text-[#94a3b8] transition hover:text-white">
            Bundles
          </a>
          <Link
            href="/shop"
            className="rounded-full bg-[#D4537E] px-5 py-2 text-xs font-semibold text-white no-underline"
          >
            Shop all →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header
        className="relative overflow-hidden px-6 pb-16 pt-20 text-center sm:px-10 sm:pb-[70px] sm:pt-[80px]"
        style={{ backgroundColor: BLACK }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,83,126,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-[1] mx-auto max-w-[800px]">
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D4537E]/30 bg-[#D4537E]/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4537E]">
            <span>✦</span> Built by a real provider. For real providers.
          </p>
          <h1
            className="font-[family-name:var(--sf-dm-serif)] text-[clamp(2rem,6vw,4.5rem)] font-normal leading-[1.08] text-white"
          >
            Stop Googling at
            <br />
            <em className="text-[#D4537E] not-italic">Midnight.</em>
            <br />
            Start Practicing with Confidence.
          </h1>
          <p className="mx-auto mt-5 max-w-[580px] text-[17px] leading-relaxed text-[#94a3b8]">
            Clinical cheat sheets, business systems, and study tools built from{" "}
            <strong className="text-[#cbd5e1]">10+ years inside a real med spa</strong> — written by a nurse, for
            nurses. Instant download. Print and use tomorrow.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3.5">
            <Link
              href="/shop"
              className="rounded-full bg-[#D4537E] px-9 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-[#D4537E]/40 no-underline transition hover:-translate-y-0.5"
            >
              Shop the full catalog →
            </Link>
            <a
              href="#about"
              className="rounded-full border border-white/20 px-8 py-3.5 text-[15px] font-medium text-white no-underline transition hover:bg-white/10"
            >
              Who made this?
            </a>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 border-t border-white/[0.08] pt-9 md:flex md:flex-wrap md:justify-center md:gap-0">
            {[
              { n: `${productCount}+`, l: "Products" },
              { n: formatUsd(minCents), l: "Starting price" },
              { n: "10+", l: "Years clinical" },
              { n: "100%", l: "Instant download" },
            ].map((s, i) => (
              <div
                key={s.l}
                className={`px-4 py-2 text-center md:border-r md:border-white/[0.08] md:px-6 ${i === 3 ? "md:border-r-0" : ""}`}
              >
                <div className="font-[family-name:var(--sf-bebas)] text-[2.2rem] leading-none tracking-wide text-white">
                  {s.n}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-[#64748b]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Trust */}
      <div className="border-y border-[#f0d8e0] bg-[#FBEAF0] px-6 py-4 sm:px-10">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-x-10 gap-y-2 text-[13px] font-medium text-[#1A1A1A]">
          {[
            "Written by Danielle Alcala-Glazier, RN student",
            "Medical Director: Ryan Kent, FNP-BC",
            "Hello Gorgeous Med Spa · Oswego, IL",
            "Print-ready · Instant access · No subscription",
          ].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <span className="text-[#D4537E]" aria-hidden>
                ✓
              </span>
              {t}
            </div>
          ))}
        </div>
      </div>

      <div id="catalog" className="mx-auto max-w-[1100px] px-6 py-16 sm:px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4537E]">The full catalog</p>
          <h2 className="font-[family-name:var(--sf-dm-serif)] text-[clamp(1.75rem,4vw,2.6rem)] leading-tight text-[#1A1A1A]">
            Everything you need to practice,
            <br />
            teach, and grow.
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-base text-[#7a6b7a]">
            Every resource below was built from real clinical situations, real patient questions, and real business
            problems — not textbooks.
          </p>
        </div>

        <CategorySection
          id="clinical"
          icon="📋"
          title="Clinical cheat sheets"
          badge="Bestsellers"
          badgeClass="bg-[#D4537E]"
          desc="One page. Every key fact. Print it, laminate it, live by it. Built for med spa nurses and esthetic providers."
          accent="pink"
          products={clinicalSlugs.map((s) => bySlug(products, s)).filter(Boolean) as ShopProduct[]}
        />

        <CategorySection
          id="flagship"
          icon="🏆"
          title="Flagship clinical guides"
          badge="Deep references"
          badgeClass="bg-[#0a1628]"
          desc="Long-form, deeply researched clinical references you will return to again and again."
          accent="navy"
          products={flagshipSlugs.map((s) => bySlug(products, s)).filter(Boolean) as ShopProduct[]}
        />

        <CategorySection
          id="business"
          icon="💼"
          title="Business systems & growth tools"
          badge="Practice builders"
          badgeClass="bg-[#c77b2a]"
          desc="Scripts, systems, and strategies from 10 years in practice."
          accent="gold"
          products={businessSlugs.map((s) => bySlug(products, s)).filter(Boolean) as ShopProduct[]}
        />

        <CategorySection
          id="journey"
          icon="🤝"
          title="Patient journey kits"
          badge="Patient-facing"
          badgeClass="bg-[#2a9d8f]"
          desc="Patient education and communication tools — ready for your front desk or automations."
          accent="teal"
          products={journeySlugs.map((s) => bySlug(products, s)).filter(Boolean) as ShopProduct[]}
        />

        <NclexSection priceLabel={nclexPrice} />

        <CategorySection
          id="consent"
          icon="📝"
          title="Consent forms & intake"
          badge="Practice ready"
          badgeClass="bg-[#2d7a55]"
          desc="HIPAA-aware, clinically complete documents — not a midnight Google grab."
          accent="green"
          products={consentSlugs.map((s) => bySlug(products, s)).filter(Boolean) as ShopProduct[]}
        />
      </div>

      {/* Bundle */}
      <div id="bundles" className="bg-[#1A1A1A] px-6 pb-16 pt-4 sm:px-6">
        <div className="mx-auto max-w-[1100px]">
          <div className="py-12 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4537E]">Best value</p>
            <h2 className="font-[family-name:var(--sf-dm-serif)] text-[clamp(1.75rem,4vw,2.6rem)] leading-tight text-white">
              Get everything.
              <br />
              Pay once.
            </h2>
            <p className="mt-3 text-base text-[#64748b]">Full template stack — one checkout, instant delivery.</p>
          </div>

          <div className="relative grid overflow-hidden rounded-[20px] bg-[#1A1A1A] md:grid-cols-2">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(212,83,126,0.2) 0%, transparent 60%)",
              }}
            />
            <div className="relative z-[1] border-white/[0.08] p-10 md:border-r">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4537E]">Signature stack</p>
              <h3 className="font-[family-name:var(--sf-dm-serif)] text-2xl leading-snug text-white sm:text-3xl">
                {growth.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-[#94a3b8]">
                {GROWTH_SYSTEM_PRODUCT.shortDescription} Includes 300+ templates and assets — consents, social lines,
                promos, and ops.
              </p>
              <div className="mt-6 flex flex-wrap items-end gap-3">
                <div>
                  <span className="inline-block rounded-full bg-[#D4537E] px-3 py-1 text-[11px] font-bold text-white">
                    Save vs à la carte
                  </span>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="font-[family-name:var(--sf-bebas)] text-5xl text-white">{growth.price}</span>
                    <span className="text-base text-[#64748b] line-through">{growth.compare}</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/shop/${GROWTH_SYSTEM_SLUG}`}
                className="mt-8 inline-block rounded-full bg-[#D4537E] px-8 py-3.5 text-[15px] font-semibold text-white no-underline shadow-lg shadow-[#D4537E]/30"
              >
                Get the Growth System →
              </Link>
            </div>
            <div className="relative z-[1] border-t border-white/[0.08] p-10 md:border-t-0">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748b]">What&apos;s included</p>
              <ul className="space-y-3.5 text-sm leading-snug text-[#cbd5e1]">
                {[
                  "Full NPA template library — consents, marketing, clinical references",
                  "Bundle-tier pricing vs buying piece by piece",
                  "Instant secure checkout & email delivery",
                  "Customize in browser or Canva where noted",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="shrink-0 text-[#D4537E]">✦</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <section id="about" className="relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#1a0a14] px-6 py-20 text-center sm:px-10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 50% 70% at 50% 100%, rgba(212,83,126,0.15) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-[1] mx-auto max-w-[700px]">
          <h2 className="font-[family-name:var(--sf-dm-serif)] text-[clamp(1.6rem,4vw,2.5rem)] leading-tight text-white">
            These aren&apos;t textbook resources.
            <br />
            They&apos;re from the room where it happens.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#94a3b8]">
            My name is Danielle Alcala-Glazier. I&apos;ve been inside Hello Gorgeous Med Spa in Oswego, Illinois for over
            10 years — as a licensed esthetician, phlebotomist, CMAA, CNA, and now an RN student.
          </p>
          <p className="mt-3 text-base leading-relaxed text-[#94a3b8]">
            Every resource on this site came from a real situation in my real practice. Our Medical Director Ryan Kent,
            FNP-BC, is on-site 7 days a week. He reviewed the clinical content. I wrote it in the language a nurse
            actually uses.
          </p>
          <p className="mt-6 font-[family-name:var(--sf-dm-serif)] text-lg italic text-[#D4537E]">
            — Danielle, Hello Gorgeous Med Spa
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              "Licensed esthetician",
              "Phlebotomist",
              "CMAA · CNA",
              "RN student",
              "Medical Director: Ryan Kent, FNP-BC",
              "Hello Gorgeous · Oswego, IL",
            ].map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-[11px] font-semibold text-[#94a3b8]"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="border-y border-[#e8e0e8] bg-white px-6 py-14 sm:px-10">
        <div className="mx-auto mb-10 max-w-[1000px] text-center">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4537E]">From the community</p>
          <h2 className="font-[family-name:var(--sf-dm-serif)] text-3xl text-[#1A1A1A]">What providers are saying</h2>
        </div>
        <div className="mx-auto grid max-w-[1000px] gap-7 md:grid-cols-3">
          {[
            {
              q: "I laminated the Botox cheat sheet and it's been on my treatment room wall for three months. Every unit range is exactly what I needed.",
              who: "Injector, private practice · Chicago, IL",
            },
            {
              q: "The Facial Anatomy guide is the most organized clinical reference I've ever seen. Worth every dollar and then some.",
              who: "RN, med spa owner · Nashville, TN",
            },
            {
              q: "I used the NCLEX study guides for my boards and passed on the first try. The Q&As at the end of each guide are exactly what showed up on the exam.",
              who: "New grad RN · Oswego, IL",
            },
          ].map((x) => (
            <div key={x.who} className="rounded-2xl border border-[#e8e0e8] bg-[#faf8fb] p-6">
              <div className="mb-3 text-sm text-[#c77b2a]">★★★★★</div>
              <p className="text-sm italic leading-relaxed text-[#1A1A1A]">&ldquo;{x.q}&rdquo;</p>
              <p className="mt-3 text-xs font-semibold text-[#7a6b7a]">{x.who}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#D4537E] px-6 py-20 text-center sm:px-10">
        <h2 className="font-[family-name:var(--sf-dm-serif)] text-[clamp(1.75rem,4vw,2.75rem)] leading-tight text-white">
          You already know what
          <br />
          you&apos;re missing.
        </h2>
        <p className="mx-auto mt-4 max-w-[540px] text-base text-white/85">
          The resources are built. The price is fair. Tap through and have files in your inbox in minutes.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-white px-11 py-4 text-base font-bold text-[#D4537E] no-underline shadow-lg"
        >
          Shop the full catalog →
        </Link>
        <p className="mt-6 text-sm text-white/80">
          Share this page: <span className="font-semibold text-white">{SITE.replace("https://", "")}/storefront</span>
        </p>
        <p className="mt-3 text-sm text-white/70">
          <Link href="/campaign-videos" className="font-semibold text-white underline-offset-2 hover:underline">
            Download Reels-ready MP4s →
          </Link>
        </p>
      </section>

      <footer className="bg-[#1A1A1A] px-6 py-10 text-center text-[13px] text-[#475569] sm:px-10">
        <strong className="text-[#94a3b8]">No Prior Authorization</strong>
        <div className="mx-auto my-3.5 h-0.5 w-9 bg-[#D4537E]" />
        <div>Created by Danielle Alcala-Glazier · nopriorauthorization.com</div>
        <div className="mt-1.5">Hello Gorgeous Med Spa · 74 W Washington St, Oswego, IL · 630-636-6193</div>
        <div className="mt-2.5 text-[11px] text-[#334155]">
          Resources are for educational purposes. Clinical protocols should be reviewed by your supervising provider.
          © {new Date().getFullYear()} No Prior Authorization.
        </div>
      </footer>
    </div>
  );
}

const accentBar: Record<string, string> = {
  pink: "linear-gradient(90deg,#D4537E,#e87ea0)",
  navy: "linear-gradient(90deg,#0a1628,#1a3a6b)",
  gold: "linear-gradient(90deg,#c77b2a,#e09040)",
  teal: "linear-gradient(90deg,#2a9d8f,#3dbdad)",
  green: "linear-gradient(90deg,#2d7a55,#3a9a6a)",
  purple: "linear-gradient(90deg,#7b2d8b,#9b40ac)",
};

const tagColor: Record<string, string> = {
  pink: "text-[#D4537E]",
  navy: "text-[#0a1628]",
  gold: "text-[#c77b2a]",
  teal: "text-[#2a9d8f]",
  green: "text-[#2d7a55]",
  purple: "text-[#7b2d8b]",
};

function CategorySection({
  id,
  icon,
  title,
  badge,
  badgeClass,
  desc,
  accent,
  products,
}: {
  id: string;
  icon: string;
  title: string;
  badge: string;
  badgeClass: string;
  desc: string;
  accent: keyof typeof accentBar;
  products: ShopProduct[];
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <div className="mb-7 flex flex-wrap items-center gap-3 border-b-2 border-[#e8e0e8] pb-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[22px]"
          style={{
            backgroundColor:
              accent === "pink"
                ? "#FBEAF0"
                : accent === "navy"
                  ? "#eef2f8"
                  : accent === "gold"
                    ? "#fdf5e8"
                    : accent === "teal"
                      ? "#e8f7f5"
                      : "#edf7f1",
          }}
        >
          {icon}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-[family-name:var(--sf-dm-serif)] text-2xl text-[#1A1A1A]">{title}</h3>
            <span className={`rounded-xl px-2.5 py-0.5 font-[family-name:var(--sf-bebas)] text-[11px] tracking-wider text-white ${badgeClass}`}>
              {badge}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-[#7a6b7a]">{desc}</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {products.map((p) => (
          <article
            key={p.slug}
            className="relative flex flex-col overflow-hidden rounded-2xl border-[1.5px] border-[#e8e0e8] bg-white transition hover:-translate-y-1 hover:border-[#d4b0c0] hover:shadow-lg"
          >
            <div className="h-1 w-full" style={{ background: accentBar[accent] }} />
            <div className="flex flex-1 flex-col p-5">
              <p className={`mb-2 text-[10px] font-bold uppercase tracking-wider ${tagColor[accent]}`}>
                {p.category}
              </p>
              <h4 className="font-[family-name:var(--sf-dm-serif)] text-lg leading-tight text-[#1A1A1A]">{p.title}</h4>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[#7a6b7a]">{p.shortDescription}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[#e8e0e8] pt-3.5">
                <div>
                  <div className="font-[family-name:var(--sf-bebas)] text-2xl tracking-wide text-[#1A1A1A]">
                    {p.priceDisplay}
                  </div>
                  <div className="-mt-0.5 text-[10px] text-[#7a6b7a]">Instant download</div>
                </div>
                <Link
                  href={`/shop/${p.slug}`}
                  className="rounded-full bg-[#1A1A1A] px-5 py-2 text-xs font-semibold text-white no-underline hover:bg-[#D4537E]"
                >
                  Get it →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link href="/shop" className="text-sm font-semibold text-[#D4537E] underline-offset-2 hover:underline">
          Browse all in shop →
        </Link>
      </div>
    </section>
  );
}

function NclexSection({ priceLabel }: { priceLabel: string }) {
  return (
    <section id="nclex" className="mb-16 scroll-mt-24">
      <div className="mb-7 flex flex-wrap items-center gap-3 border-b-2 border-[#e8e0e8] pb-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5eef8] text-[22px]">
          📚
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-[family-name:var(--sf-dm-serif)] text-2xl text-[#1A1A1A]">NCLEX study resources</h3>
            <span className="rounded-xl bg-[#7b2d8b] px-2.5 py-0.5 font-[family-name:var(--sf-bebas)] text-[11px] tracking-wider text-white">
              For nursing students
            </span>
          </div>
          <p className="mt-0.5 text-sm text-[#7a6b7a]">
            At-a-glance tables plus full structured HTML guides — print-ready after purchase.
          </p>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <article className="relative flex flex-col overflow-hidden rounded-2xl border-[1.5px] border-[#e8e0e8] bg-white">
          <span className="absolute right-4 top-4 rounded-lg bg-[#D4537E] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
            Bundle
          </span>
          <div className="h-1 w-full" style={{ background: accentBar.purple }} />
          <div className="flex flex-1 flex-col p-5">
            <p className={`mb-2 text-[10px] font-bold uppercase tracking-wider ${tagColor.purple}`}>NCLEX bundle</p>
            <h4 className="font-[family-name:var(--sf-dm-serif)] text-lg text-[#1A1A1A]">{STUDY_GUIDE_NCLEX.title}</h4>
            <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[#7a6b7a]">{STUDY_GUIDE_NCLEX.shortDescription}</p>
            <div className="mt-4 flex items-center justify-between border-t border-[#e8e0e8] pt-3.5">
              <div>
                <div className="font-[family-name:var(--sf-bebas)] text-2xl text-[#1A1A1A]">{priceLabel}</div>
                <div className="-mt-0.5 text-[10px] text-[#7a6b7a]">8 HTML files · email delivery</div>
              </div>
              <Link
                href="/nclex-bundle"
                className="rounded-full bg-[#1A1A1A] px-5 py-2 text-xs font-semibold text-white no-underline hover:bg-[#D4537E]"
              >
                Get it →
              </Link>
            </div>
          </div>
        </article>
        <div className="flex flex-col justify-center rounded-2xl border border-[#e8e0e8] bg-[#faf8fb] p-6">
          <p className="text-sm font-semibold text-[#1A1A1A]">Also on the study guides hub</p>
          <p className="mt-2 text-sm text-[#7a6b7a]">Preview the layout and checkout flow before you buy.</p>
          <Link
            href="/study-guides"
            className="mt-4 inline-flex w-fit rounded-full border border-[#7b2d8b]/30 bg-white px-5 py-2 text-sm font-semibold text-[#7b2d8b] no-underline hover:bg-[#f5eef8]"
          >
            Study guides hub →
          </Link>
        </div>
      </div>
    </section>
  );
}
