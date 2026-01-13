import EmbedGenerator from "@/components/provider/embed-generator";
import Link from "next/link";

export default function ProviderHubPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">
            Provider Hub
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold">
            Trust as a Service for Modern Clinics
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Embed expert education directly on your site. Reduce repetitive
            questions, build trust, and show transparency without extra staff.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/provider/widget"
              className="rounded-full bg-hot-pink px-6 py-3 text-black font-semibold"
            >
              Preview Widget
            </Link>
            <Link
              href="#pricing"
              className="rounded-full border border-gray-700 px-6 py-3 text-gray-200"
            >
              View Pricing
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Embedded expert chat",
              text: "Hosted by us. Branded by trust. Educational only.",
            },
            {
              title: "Verified badge",
              text: "Show transparency with a verified clinic marker.",
            },
            {
              title: "Insights ready",
              text: "Track widget views and engagement per clinic.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-800 bg-black/40 p-6"
            >
              <h3 className="text-lg font-semibold text-hot-pink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-gray-300">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Embed Code Generator</h2>
          <p className="text-sm text-gray-300 max-w-2xl">
            Use your clinic ID to generate a ready-to-embed widget. Payments can
            be wired later — structure matters first.
          </p>
          <EmbedGenerator />
        </section>

        <section id="pricing" className="space-y-6">
          <h2 className="text-2xl font-semibold">Provider Pricing</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
                Starter
              </p>
              <h3 className="mt-4 text-3xl font-semibold">$149–$299</h3>
              <p className="text-sm text-gray-300">per month (placeholder)</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>Embed expert widget</li>
                <li>Basic analytics</li>
                <li>Verified badge placeholder</li>
              </ul>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/provider"
                  className="rounded-full bg-hot-pink px-5 py-2 text-black text-sm font-semibold"
                >
                  Start Trial
                </Link>
                <Link
                  href="/provider"
                  className="rounded-full border border-gray-700 px-5 py-2 text-sm text-gray-200"
                >
                  Get Embed Code
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
                Verified Badge
              </p>
              <h3 className="mt-4 text-2xl font-semibold">
                Verified by No Prior Authorization
              </h3>
              <p className="mt-3 text-sm text-gray-300">
                Placeholder UI for V1. Verification workflow comes later.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-hot-pink px-4 py-2 text-sm text-hot-pink">
                Verified Badge
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
