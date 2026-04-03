import Link from "next/link";
import type { Metadata } from "next";
import { getShopProducts } from "@/lib/shop/products";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "Med Spa Cheat Sheets | Clinical Quick References $10 — NPA",
  description:
    "Printable clinical cheat sheets for injectors — Botox and neurotoxin dosing, landmarks, and treatment-room reminders. $10 each. Instant download. More specialties coming.",
  keywords: [
    "botox cheat sheet",
    "neurotoxin quick reference",
    "injector clinical reference",
    "med spa dosing guide",
    "aesthetic injector cheat sheet",
    "Botox landmarks printable",
  ],
  openGraph: {
    title: "Med Spa Clinical Cheat Sheets | No Prior Authorization",
    description:
      "$10 quick-reference sheets for your treatment room. Botox & neurotoxin live now — more coming.",
    url: `${SITE}/cheat-sheets`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Med Spa Clinical Cheat Sheets | NPA",
    description: "Quick-reference clinical sheets for injectors. Instant download.",
  },
  alternates: {
    canonical: `${SITE}/cheat-sheets`,
  },
};

export default function CheatSheetsPage() {
  const cheatSheets = getShopProducts().filter((p) => p.category === "Cheat Sheets");

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "No Prior Authorization — Clinical Cheat Sheets",
    description:
      "Quick-reference digital cheat sheets for aesthetic injectors and med spas.",
    numberOfItems: cheatSheets.length,
    itemListElement: cheatSheets.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${SITE}/shop/${p.slug}`,
      item: {
        "@type": "Product",
        name: p.title,
        description: p.shortDescription,
        url: `${SITE}/shop/${p.slug}`,
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: (p.priceCents / 100).toFixed(2),
          availability: "https://schema.org/InStock",
          url: `${SITE}/shop/${p.slug}`,
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <section className="border-b border-white/10 bg-gradient-to-b from-[#1A1A1A] to-black px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">
            Clinical quick references
          </p>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-5xl">
            Cheat sheets for the treatment room
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            One-page references you can print or keep on a tablet between patients — not a full playbook,
            just the reminders you actually use at the chair. <strong className="text-white">$10 each</strong>
            , instant delivery.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/shop"
              className="w-full rounded-xl border border-white/20 px-8 py-3.5 text-center text-sm font-bold text-white transition hover:bg-white/5 sm:w-auto"
            >
              Full shop
            </Link>
            <Link
              href="/shop#all-products"
              className="w-full rounded-xl bg-[#D4537E] px-8 py-3.5 text-center text-sm font-bold text-white transition hover:bg-[#D4537E]/85 sm:w-auto"
            >
              Browse all products
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Available now</h2>
        <p className="mt-2 text-sm text-gray-500">
          More cheat sheets (filler, toxins, recovery cues, and more) are added as they ship.
        </p>

        <ul className="mt-10 space-y-6">
          {cheatSheets.map((p) => (
            <li key={p.slug}>
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#D4537E]/40 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
                <div className="flex flex-1 gap-5">
                  {p.previewImages[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.previewImages[0]}
                      alt=""
                      className="h-24 w-24 shrink-0 rounded-lg object-cover object-top sm:h-28 sm:w-28"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4537E]">
                      Cheat sheet
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-bold text-white">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">{p.shortDescription}</p>
                  </div>
                </div>
                <div className="mt-6 flex shrink-0 flex-col items-stretch gap-3 sm:mt-0 sm:w-44 sm:items-end">
                  <span className="text-2xl font-bold text-white">{p.priceDisplay}</span>
                  <Link
                    href={`/shop/${p.slug}`}
                    className="rounded-lg bg-[#D4537E] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#D4537E]/80"
                  >
                    View &amp; buy
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>

        {cheatSheets.length === 0 ? (
          <p className="mt-8 text-gray-500">Cheat sheets are loading — check back soon.</p>
        ) : null}
      </section>
    </div>
  );
}
