"use client";

import { useMemo, useState } from "react";

export default function InstallPage() {
  const [clinicName, setClinicName] = useState("");
  const [clinicId, setClinicId] = useState("CLINIC123");

  const embedCode = useMemo(() => {
    return `<iframe src="https://app.nopriorauthorization.com/widget?clinic_id=${clinicId}" width="100%" height="640" style="border:0;border-radius:16px;" loading="lazy"></iframe>`;
  }, [clinicId]);

  const generateId = () => {
    const cleaned = clinicName
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "")
      .slice(0, 8);
    setClinicId(cleaned ? `CLINIC-${cleaned}` : "CLINIC123");
  };

  const copyEmbed = async () => {
    await navigator.clipboard.writeText(embedCode);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">
            Provider install
          </p>
          <h1 className="font-display text-4xl md:text-6xl">
            Generate your embed code in seconds.
          </h1>
          <p className="max-w-2xl text-base text-white/70 md:text-lg">
            Create a clinic ID, copy the iframe, and embed it on your website.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/70 p-8">
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">
              Clinic name
            </label>
            <input
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="Example Med Spa"
              className="mt-3 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-hot-pink"
            />
            <button
              type="button"
              onClick={generateId}
              className="mt-4 rounded-full border border-white/20 px-5 py-2 text-sm text-white/80"
            >
              Generate Clinic ID
            </button>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/80 p-4 text-xs text-white/70">
              <p className="uppercase tracking-[0.2em] text-white/50">
                Clinic ID
              </p>
              <p className="mt-2 text-base font-semibold text-hot-pink">
                {clinicId}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/70 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Embed code
            </p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black px-4 py-4 text-xs text-white/70 font-mono">
              {embedCode}
            </div>
            <button
              type="button"
              onClick={copyEmbed}
              className="mt-4 rounded-full bg-hot-pink px-5 py-2 text-sm font-semibold text-black"
            >
              Copy Embed Code
            </button>
            <div className="mt-6 h-[240px] rounded-2xl border border-white/10 bg-black/50" />
          </div>
        </div>
      </div>
    </main>
  );
}
