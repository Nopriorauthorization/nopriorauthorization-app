import Image from "next/image";
import Link from "next/link";
import { GROWTH_SYSTEM_PRODUCT, GROWTH_SYSTEM_SIGNATURE } from "@/config/growth-funnel.config";
import type { ShopProduct } from "@/lib/shop/products";

type Props = {
  product: ShopProduct;
};

/**
 * Flagship band on /shop — visually distinct from the rest of the storefront.
 */
export function GrowthSystemShowcase({ product }: Props) {
  const heroPreview = product.previewImages[0];
  const sig = GROWTH_SYSTEM_SIGNATURE;

  return (
    <section className="relative border-b border-amber-500/20 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `linear-gradient(rgba(251, 191, 36, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.06) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#D4537E]/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-500/20 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-amber-600/10 blur-[80px]" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
                <span className="text-amber-300" aria-hidden>
                  ★
                </span>
                {sig.eyebrow}
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-wider text-amber-200/60 sm:inline">
                {sig.seal}
              </span>
            </div>

            <h2 className="mt-5 font-serif text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-amber-100 via-white to-amber-100/90 bg-clip-text text-transparent">
                {sig.headline}
              </span>
            </h2>
            <p className="mt-2 text-lg font-medium text-amber-200/90 sm:text-xl">{product.title}</p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">{sig.subhead}</p>

            <dl className="mt-8 grid grid-cols-3 gap-3 sm:max-w-lg sm:gap-4">
              {sig.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-center backdrop-blur-sm sm:px-4 sm:py-4"
                >
                  <dt className="font-serif text-2xl font-bold tabular-nums text-amber-100 sm:text-3xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 sm:text-[11px]">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-2">
              {sig.trustStrip.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-gray-400"
                >
                  {t}
                </span>
              ))}
            </div>

            <blockquote className="mt-8 border-l-2 border-[#D4537E]/60 pl-5 text-sm italic leading-relaxed text-gray-400 sm:text-base">
              &ldquo;{sig.quote.text}&rdquo;
              <footer className="mt-2 not-italic text-xs font-semibold text-gray-500">
                — {sig.quote.author}, {sig.quote.role}
              </footer>
            </blockquote>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-[1.35rem] bg-gradient-to-br from-amber-400/30 via-[#D4537E]/20 to-amber-600/20 opacity-80 blur-sm" />
            <div className="relative overflow-hidden rounded-3xl border border-amber-400/25 bg-gradient-to-b from-zinc-900/90 to-black shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_80px_rgba(0,0,0,0.55)]">
              {heroPreview ? (
                <div className="relative aspect-[4/3] w-full border-b border-white/10 sm:aspect-[16/11]">
                  <Image
                    src={heroPreview}
                    alt=""
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 480px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                  <p className="absolute bottom-3 left-4 right-4 text-xs font-medium text-white/90 sm:bottom-4 sm:text-sm">
                    Preview from the mega stack you receive — brand and deploy the same day.
                  </p>
                </div>
              ) : null}

              <div className="space-y-5 p-6 sm:p-8">
                <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200/80">
                  {GROWTH_SYSTEM_PRODUCT.valueAnchorLine}
                </p>
                <div className="flex flex-wrap items-baseline justify-center gap-3">
                  <span className="text-2xl text-gray-500 line-through sm:text-3xl">
                    {GROWTH_SYSTEM_PRODUCT.wasPriceLabel}
                  </span>
                  <span className="font-serif text-5xl font-bold text-white sm:text-6xl">
                    {GROWTH_SYSTEM_PRODUCT.nowPriceLabel}
                  </span>
                </div>
                <p className="text-center text-xs text-gray-500">One-time · {product.templateCount}+ files · instant email</p>
                <Link
                  href="/shop/growth-system"
                  className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 text-base font-bold text-black shadow-lg shadow-amber-500/25 transition hover:from-amber-300 hover:to-amber-400"
                >
                  {GROWTH_SYSTEM_PRODUCT.ctaLabel}
                </Link>
                <p className="text-center text-[11px] text-gray-600">
                  See the full experience, pillars, and checkout on the next screen →
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
