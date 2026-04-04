import Link from "next/link";
import type { SeoLandingPageDef } from "@/config/seo-landing-pages";
import { seoLandingJsonLd } from "@/config/seo-landing-pages";
import { GROWTH_SYSTEM_SLUG } from "@/config/growth-funnel.config";

export function SeoKeywordLanding({ def }: { def: SeoLandingPageDef }) {
  const jsonLd = seoLandingJsonLd(def);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#1A1A1A] text-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <nav className="mb-10 text-sm text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-[#D4537E]">
              Home
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <Link href="/shop" className="transition hover:text-[#D4537E]">
              Shop
            </Link>
          </nav>

          <header className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D4537E]">
              Templates &amp; systems
            </p>
            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-[2.35rem]">
              {def.h1}
            </h1>
            {def.introParagraphs && def.introParagraphs.length > 0 ? (
              <div
                className="mt-6 space-y-4 text-lg leading-relaxed text-gray-400"
                aria-label="Introduction"
              >
                {def.introParagraphs.map((p, i) => (
                  <p key={`intro-${i}`}>{p}</p>
                ))}
              </div>
            ) : null}
          </header>

          <div className="space-y-12">
            {def.sections.map((section) => (
              <section key={section.heading} aria-labelledby={headingId(section.heading)}>
                <h2
                  id={headingId(section.heading)}
                  className="font-serif text-xl font-semibold text-white sm:text-2xl"
                >
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-400">
                  {section.paragraphs.map((p, i) => (
                    <p key={`${section.heading}-${i}`}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section
            className="mt-14 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
            aria-labelledby="seo-landing-next-steps"
          >
            <h2 id="seo-landing-next-steps" className="font-serif text-xl font-semibold text-white">
              Shop next steps
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-gray-300 sm:text-base">
              <li>
                <Link href="/shop" className="font-medium text-[#D4537E] underline-offset-2 hover:underline">
                  Browse the full template shop
                </Link>
                <span className="text-gray-500"> — all products, same checkout and instant delivery.</span>
              </li>
              <li>
                <Link
                  href={`/shop/${GROWTH_SYSTEM_SLUG}`}
                  className="font-medium text-[#D4537E] underline-offset-2 hover:underline"
                >
                  NPA Growth System (300+ templates)
                </Link>
                <span className="text-gray-500"> — largest bundled library in one cart.</span>
              </li>
              {def.familyLinks.map((f) => (
                <li key={f.familySlug}>
                  <Link
                    href={`/shop/families/${f.familySlug}`}
                    className="font-medium text-[#D4537E] underline-offset-2 hover:underline"
                  >
                    {f.label}
                  </Link>
                </li>
              ))}
              {def.productLinks?.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="font-medium text-[#D4537E] underline-offset-2 hover:underline">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

function headingId(text: string): string {
  return `section-${text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)}`;
}
