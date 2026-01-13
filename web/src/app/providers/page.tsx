import Link from "next/link";

export default function ProvidersPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-16">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">
            Provider licensing
          </p>
          <h1 className="font-display text-4xl md:text-6xl">
            Trust your patients before they book.
          </h1>
          <p className="max-w-2xl text-base text-white/70 md:text-lg">
            Embed expert education on your website without increasing liability
            or staff workload.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/install"
              className="rounded-full bg-hot-pink px-6 py-3 text-sm font-semibold text-black"
            >
              Get the Widget
            </Link>
            <Link
              href="/widget"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80"
            >
              Preview the Widget
            </Link>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Embedded expert widget",
              text: "Hosted by us. Brand-neutral. Educational only.",
            },
            {
              title: "Reduce repetitive questions",
              text: "Let patients self-educate before the consult.",
            },
            {
              title: "Increase booking confidence",
              text: "Transparency builds trust and conversion.",
            },
            {
              title: "Ethical by design",
              text: "No hype, no rankings, no lead selling.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold text-hot-pink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-white/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-black/70 p-10">
          <h2 className="text-2xl font-semibold">Provider pricing</h2>
          <p className="mt-3 max-w-2xl text-sm text-white/70">
            License the expert system. Payments can be wired later — structure
            matters first.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/80 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Starter
              </p>
              <p className="mt-4 text-3xl font-semibold">$149–$299</p>
              <p className="mt-2 text-xs text-white/60">per month</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>Embed widget</li>
                <li>Verified badge (placeholder)</li>
                <li>Basic analytics</li>
              </ul>
              <Link
                href="/install"
                className="mt-6 inline-flex rounded-full bg-hot-pink px-5 py-2 text-sm font-semibold text-black"
              >
                Start Trial
              </Link>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/80 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Pro
              </p>
              <p className="mt-4 text-3xl font-semibold">$499–$1,500</p>
              <p className="mt-2 text-xs text-white/60">per month</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>Priority onboarding</li>
                <li>Expanded analytics</li>
                <li>Multi-clinic support</li>
              </ul>
              <Link
                href="/install"
                className="mt-6 inline-flex rounded-full border border-white/20 px-5 py-2 text-sm text-white/80"
              >
                Get the Widget
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
