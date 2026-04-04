"use client";

import { useState } from "react";

type Props = {
  images: string[];
  productTitle: string;
};

/**
 * Hero + thumbnail strip — closer to marketplace “mockup grid” UX than a flat 3-col gallery.
 */
export function ProductPreviewGallery({ images, productTitle }: Props) {
  const safe = images.filter(Boolean);
  if (safe.length === 0) return null;

  const [active, setActive] = useState(0);
  const main = safe[active] ?? safe[0];

  return (
    <section className="mb-10" aria-label="Product previews">
      <h2 className="mb-2 font-serif text-2xl font-semibold">Preview gallery</h2>
      <p className="mb-5 max-w-2xl text-sm text-gray-500">
        Tap a thumbnail to swap the hero image. Add more PNGs under{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-gray-300">
          public/shop-previews/
        </code>{" "}
        — the shop picks them up automatically for this product.
      </p>

      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={main}
            alt={`${productTitle} — preview ${active + 1}`}
            className="aspect-[4/3] w-full object-cover object-top sm:aspect-[16/10]"
          />
        </div>

        {safe.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto pb-1 pt-1 [scrollbar-width:thin]">
            {safe.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={`relative shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  i === active
                    ? "border-[#D4537E] ring-2 ring-[#D4537E]/30"
                    : "border-white/10 opacity-80 hover:border-white/25 hover:opacity-100"
                }`}
                aria-label={`Show preview ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-16 w-24 object-cover object-top sm:h-20 sm:w-32"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
