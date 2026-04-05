"use client";

import Image from "next/image";
import { useState } from "react";
import { STUDY_GUIDE_NCLEX } from "@/config/study-guides.config";

export function NclexStudyGuidePurchase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/study-guides/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "nclex" }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "Checkout could not start.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const price = `$${(STUDY_GUIDE_NCLEX.priceCents / 100).toFixed(0)}`;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-serif text-xl font-bold text-white sm:text-2xl">NCLEX</h2>
        <span className="rounded-full bg-[#D4537E]/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-[#D4537E]">
          $25 · Not in main shop
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">
        {STUDY_GUIDE_NCLEX.shortDescription} Below is a{" "}
        <strong className="text-gray-300">large preview only</strong> — after purchase you get a secure link to
        the full printable HTML bundle by email.
      </p>

      <div className="relative mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/40">
        <Image
          src={STUDY_GUIDE_NCLEX.previewImageSrc}
          alt="Preview of the NCLEX complete study bundle layout"
          width={3200}
          height={2000}
          className="h-auto w-full max-h-[min(85vh,1200px)] object-contain object-top"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
      </div>
      <p className="mt-2 text-center text-xs text-gray-500">Preview — purchase for full-resolution files</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-400">
          <span className="text-2xl font-bold text-white">{price}</span>
          <span className="ml-2">one-time · instant delivery email</span>
        </p>
        <button
          type="button"
          onClick={buy}
          disabled={loading}
          className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-xl bg-[#D4537E] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#D4537E]/85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Redirecting…" : `Buy NCLEX bundle — ${price}`}
        </button>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
