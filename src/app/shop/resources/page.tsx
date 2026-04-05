import Link from "next/link";
import type { Metadata } from "next";
import { EmailCapture } from "../EmailCapture";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "Free Resources for Med Spas & Injectors | No Prior Authorization",
  description:
    "Free tools and education for aesthetic practices — practice audit, cheat sheets, ebook hub, and weekly templates. Build trust before you buy.",
  openGraph: {
    title: "Free resources for your aesthetic practice | NPA",
    description:
      "Guides, audit, and samples for med spas and injectors. No purchase required.",
    url: `${SITE}/shop/resources`,
    type: "website",
  },
  alternates: {
    canonical: `${SITE}/shop/resources`,
  },
};

const FREE_ITEMS = [
  {
    href: "/shop/free/skin-analysis-cheat-sheet",
    title: "Free Skin Analysis Cheat Sheet",
    body: "Email-unlock one page: Fitzpatrick, Glogau, zones, consult questions, contraindications — then upgrade to the $10 Facial Training Manual.",
    cta: "Get the free cheat sheet",
  },
  {
    href: "/shop/free/vitamin-injection-manual",
    title: "Free Vitamin Injection Manual",
    body: "Email-unlock doses, routes, IM steps, and vitamin cards — then upgrade to the $10 Injection Techniques Cheat Sheet.",
    cta: "Get the free manual",
  },
  {
    href: "/audit",
    title: "Free practice audit",
    body: "A structured look at gaps in marketing, ops, and patient experience — a low-pressure way to see how we think.",
    cta: "Start the audit",
  },
  {
    href: "/cheat-sheets",
    title: "Clinical cheat sheets",
    body: "Quick-reference pages for the treatment room. Affordable entry products that show layout and depth before larger bundles.",
    cta: "Browse cheat sheets",
  },
  {
    href: "/ebooks",
    title: "Ebook library hub",
    body: "Browse the collection hub — positioning, SEO, and clinical-adjacent topics built from real practice experience.",
    cta: "Open ebook hub",
  },
  {
    href: "/shop",
    title: "Full template shop",
    body: "Consent bundles, social packs, playbooks, and more — instant delivery after purchase. Preview galleries on each product.",
    cta: "Browse the shop",
  },
  {
    href: "/about",
    title: "Who we are",
    body: "Background and why NPA exists — credibility is as much voice and consistency as any single PDF.",
    cta: "Read our story",
  },
  {
    href: "/faq",
    title: "FAQ",
    body: "How delivery works, what you get, and common questions before checkout.",
    cta: "View FAQ",
  },
];

export default function ShopResourcesPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">
          No purchase required
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Free resources for your practice
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-400">
          Use these to decide if our paid templates are a fit — we&apos;d rather earn trust
          with useful public tools than hide everything behind a paywall.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {FREE_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#D4537E]/40 hover:bg-white/[0.06]"
              >
                <h2 className="font-serif text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{item.body}</p>
                <span className="mt-4 text-sm font-bold text-[#D4537E]">{item.cta} →</span>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <h2 className="font-serif text-xl font-semibold sm:text-2xl">Why we give stuff away</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-400">
            <li>
              <strong className="text-gray-300">You can judge quality</strong> — cheat sheets and
              hubs show structure and tone without handing over every page of every bundle.
            </li>
            <li>
              <strong className="text-gray-300">Operators are busy</strong> — a free audit or FAQ
              answers &ldquo;is this for me?&rdquo; faster than another generic sales page.
            </li>
            <li>
              <strong className="text-gray-300">Paid products stay the implementation layer</strong>{" "}
              — full consent stacks, social systems, and playbooks are still instant delivery after
              checkout.
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="mb-6 text-center font-serif text-2xl font-semibold">
            Get free templates by email
          </h2>
            <EmailCapture source="resources" />
        </section>

        <p className="mt-12 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-relaxed text-gray-500">
          <strong className="text-gray-400">Educational use:</strong> Nothing here is medical or
          legal advice. Templates and guides should be reviewed by your licensed professionals and
          counsel before use with patients.
        </p>

        <p className="mt-8 text-center text-sm text-gray-500">
          <Link href="/shop" className="font-semibold text-[#D4537E] hover:underline">
            ← Back to shop
          </Link>
          <span className="mx-2 text-gray-600">·</span>
          <Link href="/contact" className="text-gray-400 hover:text-white hover:underline">
            Contact
          </Link>
        </p>
      </div>
    </div>
  );
}
