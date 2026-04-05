import Link from "next/link";
import type { Metadata } from "next";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "Study Guides — NCLEX, Microbiology, A&P | No Prior Authorization",
  description:
    "Nursing and science study bundles from No Prior Authorization — NCLEX reference sheets live; microbiology and anatomy & physiology coming soon.",
  openGraph: {
    title: "Study guides | No Prior Authorization",
    description: "NCLEX bundle and more nursing & A&P resources from NPA.",
    url: `${SITE}/study-guides`,
    type: "website",
  },
  alternates: {
    canonical: `${SITE}/study-guides`,
  },
};

type GuideCard = {
  title: string;
  subtitle: string;
  status: "live" | "coming";
  href?: string;
  fileLabel?: string;
};

const GUIDES: GuideCard[] = [
  {
    title: "NCLEX",
    subtitle:
      "Complete bundle — lab values, pharmacology, clinical judgment, and quick-reference cards. Open in your browser, print, or save as PDF.",
    status: "live",
    href: "/forms/NCLEX_Complete_Bundle_NPA.html",
    fileLabel: "NCLEX_Complete_Bundle_NPA.html",
  },
  {
    title: "Microbiology",
    subtitle: "Structured review sheets and clinical correlations for nursing and allied health — launching soon.",
    status: "coming",
  },
  {
    title: "Anatomy & physiology",
    subtitle: "Body systems, pathways, and exam-ready summaries — launching soon.",
    status: "coming",
  },
];

export default function StudyGuidesPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="border-b border-white/10 bg-gradient-to-b from-[#1A1A1A] to-[#141414]">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">
            No Prior Authorization
          </p>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-[2.5rem]">
            Study guides
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-400">
            Nursing boards prep, science foundations, and clinical quick references — built with the same
            obsessive clarity as our med spa templates. More subjects roll out here as they ship.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <ul className="space-y-6">
          {GUIDES.map((g) => (
            <li
              key={g.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#D4537E]/35 sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-xl font-bold text-white sm:text-2xl">{g.title}</h2>
                    {g.status === "live" ? (
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-emerald-300">
                        Available
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-gray-400">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">{g.subtitle}</p>
                  {g.fileLabel ? (
                    <p className="mt-2 font-mono text-xs text-gray-500">{g.fileLabel}</p>
                  ) : null}
                </div>
                {g.status === "live" && g.href ? (
                  <a
                    href={g.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#D4537E] px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-[#D4537E]/85 sm:min-w-[160px]"
                  >
                    Open study bundle
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-center text-sm text-gray-500">
          <Link href="/shop" className="font-semibold text-[#D4537E] hover:underline">
            Med spa shop
          </Link>
          <span className="mx-2 text-gray-600">·</span>
          <Link href="/cheat-sheets" className="text-gray-400 hover:text-white hover:underline">
            Clinical cheat sheets
          </Link>
          <span className="mx-2 text-gray-600">·</span>
          <Link href="/contact" className="text-gray-400 hover:text-white hover:underline">
            Request a topic
          </Link>
        </p>
      </div>
    </div>
  );
}
