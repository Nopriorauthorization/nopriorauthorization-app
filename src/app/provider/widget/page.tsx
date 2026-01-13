import Link from "next/link";

export default function ProviderWidgetPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">
            Widget Preview
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-semibold">
            Embedded Expert Widget
          </h1>
          <p className="mt-4 text-gray-300 max-w-2xl">
            This is what patients see when the widget is embedded on a clinic
            website. Educational only. No medical advice.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-black/50 p-6">
          <iframe
            title="No Prior Authorization Widget"
            src="/widget?clinic_id=CLINIC123"
            className="w-full h-[640px] rounded-xl border border-gray-800"
          />
        </div>

        <Link href="/provider" className="text-hot-pink hover:underline">
          Back to Provider Hub
        </Link>
      </div>
    </main>
  );
}
