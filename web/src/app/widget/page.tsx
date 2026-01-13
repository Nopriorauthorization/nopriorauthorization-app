import Link from "next/link";

export default function WidgetPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">
            Provider widget
          </p>
          <h1 className="font-display text-4xl md:text-6xl">
            Embedded expert education, hosted by us.
          </h1>
          <p className="max-w-2xl text-base text-white/70 md:text-lg">
            Patients ask the questions before the consult. Your staff stays
            focused. Trust goes up.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/70 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Widget Preview</h2>
              <p className="mt-2 text-sm text-white/70">
                Hosted by No Prior Authorization. Educational only.
              </p>
            </div>
            <Link
              href="/install"
              className="rounded-full bg-hot-pink px-6 py-3 text-sm font-semibold text-black"
            >
              Install Widget
            </Link>
          </div>
          <div className="mt-8 h-[520px] rounded-2xl border border-white/10 bg-black/50" />
        </div>
      </div>
    </main>
  );
}
