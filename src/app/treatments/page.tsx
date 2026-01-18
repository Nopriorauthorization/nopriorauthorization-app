import Link from "next/link";

export default function TreatmentsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <p className="text-xs font-semibold tracking-[0.35em] text-pink-400 uppercase">
            Treatments
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Coming Soon
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
            We're building a comprehensive treatments timeline and tracking system
            to help you understand what you've tried, what's working, and what to explore next.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-block rounded-full bg-hot-pink px-6 py-3 text-sm font-semibold text-black transition hover:bg-pink-500"
            >
              Return Home
            </Link>
          </div>
        </div>

        <div className="mt-16 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold mb-2">Treatment Timeline</h3>
            <p className="text-sm text-gray-400 mb-4">
              Track medications, procedures, and therapies over time with notes on effectiveness and side effects.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Current medications and supplements</li>
              <li>• Past treatments and outcomes</li>
              <li>• Side effects and reactions</li>
              <li>• Provider recommendations</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold mb-2">Treatment Explorer</h3>
            <p className="text-sm text-gray-400 mb-4">
              Research potential treatments with evidence-based information and real patient experiences.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Treatment options for your conditions</li>
              <li>• Success rates and research summaries</li>
              <li>• Questions to ask your provider</li>
              <li>• Alternative and complementary approaches</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold mb-2">Export for Providers</h3>
            <p className="text-sm text-gray-400">
              Share your treatment history with new providers via secure link or PDF export.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
