export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">
          Philosophy
        </p>
        <h1 className="font-display text-4xl md:text-6xl">
          Why No Prior Authorization exists.
        </h1>
        <p className="text-base text-white/70 md:text-lg">
          Too many patients walk into appointments confused and walk out with
          more questions. We built a trust-first system that explains what is
          actually being said, what is being left out, and what you deserve to
          know before making decisions about your body.
        </p>
        <div className="rounded-3xl border border-white/10 bg-black/70 p-8">
          <h2 className="text-2xl font-semibold text-hot-pink">
            What this is
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>Expert-led education</li>
            <li>Clear, honest explanations</li>
            <li>Trust without hype</li>
            <li>Boundaries that protect patients</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/70 p-8">
          <h2 className="text-2xl font-semibold text-hot-pink">
            What this is not
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>Medical advice</li>
            <li>Provider rankings or lead selling</li>
            <li>Sales pressure or hype</li>
            <li>Influencer-style marketing</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
