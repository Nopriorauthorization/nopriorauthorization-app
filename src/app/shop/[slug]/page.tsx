import { notFound } from "next/navigation";
import Link from "next/link";
import { getShopProductBySlug, getShopProducts } from "@/lib/shop/products";
import { CheckoutButton } from "./CheckoutButton";

export function generateStaticParams() {
  return getShopProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getShopProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.title} | No Prior Authorization`,
    description: product.shortDescription,
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getShopProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link
          href="/shop"
          className="mb-6 inline-block text-sm text-gray-500 transition hover:text-[#D4537E]"
        >
          &larr; Back to shop
        </Link>

        {/* Hero */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <span className="mb-3 inline-block rounded-md bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {product.category}
          </span>
          <h1 className="mb-4 font-serif text-3xl font-semibold md:text-4xl">
            {product.title}
          </h1>
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-gray-400">
            {product.shortDescription}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-4xl font-bold">{product.priceDisplay}</span>
              <span className="ml-2 text-sm text-gray-500">one-time</span>
            </div>
            <CheckoutButton slug={product.slug} label={`Buy Now — ${product.priceDisplay}`} />
          </div>
        </div>

        {/* Preview Gallery */}
        {product.previewImages.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-5 font-serif text-2xl font-semibold">
              Preview
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {product.previewImages.slice(0, 6).map((src, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${product.title} preview ${i + 1}`}
                    loading="lazy"
                    className="h-auto w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's Included */}
        <div className="mb-10">
          <h2 className="mb-5 font-serif text-2xl font-semibold">
            What&apos;s Included
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {product.features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="mt-0.5 text-[#D4537E]">&#10003;</span>
                <span className="text-sm text-gray-300">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Perfect For */}
        {product.audience.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-5 font-serif text-2xl font-semibold">
              Perfect For
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {product.audience.map((a, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="text-[#D4537E]">&#8594;</span>
                  {a}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mb-10">
          <h2 className="mb-5 font-serif text-2xl font-semibold">
            How It Works
          </h2>
          <div className="space-y-4">
            {[
              { n: "1", t: "Purchase instantly via Stripe secure checkout" },
              { n: "2", t: "Receive an email with your personal download link" },
              { n: "3", t: "Open your templates — print or save as PDF" },
              { n: "4", t: "Customize with your practice name, logo, and details" },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4537E]/20 text-sm font-bold text-[#D4537E]">
                  {step.n}
                </span>
                <span className="pt-1 text-sm text-gray-400">{step.t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="mb-5 font-serif text-2xl font-semibold">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              { q: "Can I customize the templates?", a: "Yes — all templates are fully editable. Add your practice name, logo, and details before printing." },
              { q: "What format are the files?", a: "Templates are delivered as printable HTML files you can open in any browser. Save as PDF via File → Print → Save as PDF." },
              { q: "Is this a physical product?", a: "No. This is a digital download — no physical item will be shipped." },
              { q: "Do I need Canva Pro?", a: "Some products include Canva template links (social media kits). Canva Free works for all of them." },
              { q: "Can I use these for multiple locations?", a: "Templates are licensed for use within your own practice. Redistribution or resale is not permitted." },
              { q: "How do I get support?", a: "Reply to your delivery email or message us through the shop. We respond within 24 hours." },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <h3 className="mb-2 text-sm font-bold text-white">
                  {item.q}
                </h3>
                <p className="text-sm text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div className="rounded-xl border border-[#D4537E]/30 bg-[#D4537E]/5 p-6 text-center">
          <p className="text-sm text-gray-400">
            Created by <strong className="text-white">Hello Gorgeous Med Spa</strong> (10 years in business)
            &middot; Board-certified FNP-BC
          </p>
        </div>

        {/* Sticky Buy (mobile) */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#1A1A1A]/95 px-4 py-3 backdrop-blur sm:hidden">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div>
              <span className="text-lg font-bold">{product.priceDisplay}</span>
              <span className="ml-2 text-xs text-gray-500">{product.templateCount} templates</span>
            </div>
            <CheckoutButton slug={product.slug} label="Buy Now" />
          </div>
        </div>
      </div>
    </div>
  );
}
