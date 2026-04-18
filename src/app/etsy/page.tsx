import type { Metadata } from "next";
import Link from "next/link";
import { NPA_SITE_URL } from "@/config/npa-brand.config";
import { fetchActiveEtsyListings } from "@/lib/etsy/fetch-shop-listings";

const ETSY_STOREFRONT = "https://nopriorauthorization.etsy.com";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Etsy shop — live listings | No Prior Authorization",
  description:
    "Browse digital templates and study tools on Etsy, synced from your connected seller account when OAuth is complete.",
  alternates: { canonical: `${NPA_SITE_URL}/etsy` },
  robots: { index: true, follow: true },
};

export default async function EtsyShopPage() {
  const data = await fetchActiveEtsyListings();

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="border-b border-white/10 bg-gradient-to-b from-[#1A1A1A] to-[#141414]">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">No Prior Authorization</p>
          <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Our Etsy shop</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
            Same products you know from NPA — purchase on{" "}
            <a
              href={ETSY_STOREFRONT}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#D4537E] underline decoration-[#D4537E]/40 underline-offset-2 hover:decoration-[#D4537E]"
            >
              Etsy
            </a>
            . When the API is connected, active listings also appear below.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={ETSY_STOREFRONT}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-[#D4537E] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#D4537E]/20 transition hover:bg-[#D4537E]/88"
            >
              Open Etsy storefront →
            </a>
            <a
              href="/api/etsy/auth"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition hover:border-[#D4537E]/50"
            >
              Connect API (for listing sync)
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-white/30 hover:text-white"
            >
              NPA digital shop
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        {!data.ok ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-100/95 sm:p-8">
            <p className="font-serif text-lg font-semibold text-white">Listings are not loading yet</p>
            <p className="mt-3 text-sm leading-relaxed text-amber-100/85">{data.error}</p>
            <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-amber-100/80">
              <li>
                Confirm <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">ETSY_API_KEYSTRING</code>,{" "}
                <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">ETSY_API_SHARED_SECRET</code>, and{" "}
                <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">ETSY_OAUTH_REDIRECT_URI</code> are set on
                Vercel.
              </li>
              <li>
                Set <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">ETSY_SHOP_ID</code> to your numeric shop
                id (from Etsy Shop Manager URL or from{" "}
                <Link href="/api/etsy/shops" className="font-medium text-white underline">
                  /api/etsy/shops
                </Link>{" "}
                after OAuth).
              </li>
              <li>
                Run OAuth once:{" "}
                <a href="/api/etsy/auth" className="font-medium text-white underline">
                  /api/etsy/auth
                </a>{" "}
                while signed into Etsy (scopes must include <code className="text-xs">listings_r</code>).
              </li>
            </ol>
            <p className="mt-6 text-sm text-gray-400">
              JSON debug:{" "}
              <Link href="/api/etsy/listings" className="text-[#D4537E] hover:underline">
                /api/etsy/listings
              </Link>
            </p>
          </div>
        ) : data.listings.length === 0 ? (
          <p className="text-center text-gray-400">
            Etsy returned no active listings. Add listings on Etsy or check that this shop ID matches{" "}
            <span className="text-gray-300">nopriorauthorization</span>.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              {data.count} active listing{data.count === 1 ? "" : "s"} — opens on Etsy in a new tab.
            </p>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.listings.map((L) => (
                <li key={L.listingId}>
                  <a
                    href={L.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-[#D4537E]/40 hover:bg-white/[0.05]"
                  >
                    <div className="relative aspect-[4/3] w-full bg-black/40">
                      {L.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- dynamic Etsy CDN hostnames
                        <img
                          src={L.imageUrl}
                          alt=""
                          className="h-full w-full object-cover transition group-hover:opacity-95"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">No image</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="line-clamp-2 font-medium text-white group-hover:text-[#D4537E]">{L.title}</p>
                      {L.priceDisplay ? (
                        <p className="mt-2 text-sm font-semibold text-[#D4537E]">{L.priceDisplay}</p>
                      ) : null}
                      <span className="mt-3 text-xs font-semibold text-gray-500 group-hover:text-gray-400">
                        View on Etsy →
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
