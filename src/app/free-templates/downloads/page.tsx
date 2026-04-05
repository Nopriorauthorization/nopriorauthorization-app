import Link from "next/link";
import type { Metadata } from "next";
import {
  FREE_TEMPLATES_LEAD_MAGNET,
  freeTemplateDownloadHref,
} from "@/config/free-templates-lead-magnet.config";
import { marketingSiteOrigin } from "@/lib/leads/marketing-site-origin";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "Download your 10 free templates | No Prior Authorization",
  description:
    "Skin analysis, vitamin injection manual, patient handouts, and ops checklists — open each HTML in your browser.",
  openGraph: {
    title: "Your 10 free NPA templates",
    url: `${SITE}/free-templates/downloads`,
    type: "website",
  },
  alternates: {
    canonical: `${SITE}/free-templates/downloads`,
  },
};

export default function FreeTemplatesDownloadsPage() {
  const origin = marketingSiteOrigin();

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">
          No Prior Authorization
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Your 10 free downloads</h1>
        <p className="mt-4 text-gray-400">
          Open each link in a new tab — print or save as PDF from your browser. Same files from your welcome
          email; bookmark this page anytime.
        </p>

        <ol className="mt-10 space-y-3">
          {FREE_TEMPLATES_LEAD_MAGNET.map((row, i) => {
            const href = freeTemplateDownloadHref(origin, row.fileName);
            return (
              <li key={row.fileName}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-[#D4537E]/40 hover:bg-white/[0.06] sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D4537E]/20 text-xs font-bold text-[#D4537E]">
                      {i + 1}
                    </span>
                    <span className="font-medium text-white">{row.label}</span>
                  </span>
                  <span className="mt-3 shrink-0 text-sm font-bold text-[#D4537E] sm:mt-0">
                    Download →
                  </span>
                </a>
              </li>
            );
          })}
        </ol>

        <p className="mt-12 text-center text-sm text-gray-500">
          <Link href="/shop" className="font-semibold text-[#D4537E] hover:underline">
            Browse the full NPA catalog
          </Link>
          <span className="mx-2 text-gray-600">·</span>
          <Link href="/free-templates" className="text-gray-400 hover:text-white hover:underline">
            Free templates landing
          </Link>
        </p>
      </div>
    </div>
  );
}
