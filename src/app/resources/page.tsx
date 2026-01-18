import Link from "next/link";

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <p className="text-xs font-semibold tracking-[0.35em] text-pink-400 uppercase">
            Resources
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Coming Soon
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
            We're building a curated library of health resources, guides, and educational content
            to help you take authority over your healthcare journey.
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

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold mb-2">Treatment Guides</h3>
            <p className="text-sm text-gray-400">
              In-depth information about common treatments, procedures, and medications.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold mb-2">Provider Questions</h3>
            <p className="text-sm text-gray-400">
              Templates and scripts to help you communicate effectively with your healthcare team.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold mb-2">Health Literacy</h3>
            <p className="text-sm text-gray-400">
              Plain-language explanations of medical terms, procedures, and concepts.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold mb-2">Community Stories</h3>
            <p className="text-sm text-gray-400">
              Real experiences from people navigating the healthcare system.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
