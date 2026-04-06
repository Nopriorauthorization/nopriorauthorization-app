import Link from "next/link";
import { FAQ_PAGE_SECTIONS, buildFaqPageJsonLd } from "@/config/faq-page.config";
import { NPA_PRIMARY_MESSAGE, NPA_SITE_URL } from "@/config/npa-brand.config";

export const metadata = {
  title: "Frequently Asked Questions | No Prior Authorization",
  description: `${NPA_PRIMARY_MESSAGE} Products, delivery, Pro Membership, and licensing.`,
  alternates: { canonical: `${NPA_SITE_URL}/faq` },
};

export default function FaqPage() {
  const jsonLd = buildFaqPageJsonLd();

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4537E]">Help Center</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold">Frequently Asked Questions</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-400">{NPA_PRIMARY_MESSAGE}</p>
          <p className="mt-4 text-sm text-gray-500">
            More help:{" "}
            <Link href="/about" className="text-[#D4537E] hover:underline">
              About
            </Link>
            <span className="mx-2 text-gray-600">·</span>
            <Link href="/membership" className="text-[#D4537E] hover:underline">
              Pro Membership
            </Link>
            <span className="mx-2 text-gray-600">·</span>
            <Link href="/shop" className="text-[#D4537E] hover:underline">
              Shop
            </Link>
            <span className="mx-2 text-gray-600">·</span>
            <Link href="/free-templates" className="text-[#D4537E] hover:underline">
              Free resources
            </Link>
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-400">
            Email{" "}
            <a href="mailto:hello@nopriorauthorization.com" className="text-[#D4537E] underline">
              hello@nopriorauthorization.com
            </a>
          </p>
        </div>

        {FAQ_PAGE_SECTIONS.map((section) => (
          <div key={section.category} className="mb-10">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#D4537E]">
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="mb-2 text-sm font-bold text-white">{faq.q}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
