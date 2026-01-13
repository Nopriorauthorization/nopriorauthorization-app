"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/button";
import { trackProviderEmbedCopied } from "@/lib/analytics";

export default function EmbedGenerator() {
  const [clinicId, setClinicId] = useState("CLINIC123");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const embedCode = useMemo(() => {
    return `<iframe src="${origin}/widget?clinic_id=${clinicId}" width="100%" height="640" style="border:0;border-radius:16px;" loading="lazy"></iframe>`;
  }, [clinicId, origin]);

  const copyEmbed = async () => {
    await navigator.clipboard.writeText(embedCode);
    trackProviderEmbedCopied();
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-black/40 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <label className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Clinic ID
          </label>
          <input
            value={clinicId}
            onChange={(e) => setClinicId(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-700 bg-black px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-hot-pink"
            placeholder="CLINIC123"
          />
        </div>
        <Button variant="primary" size="sm" onClick={copyEmbed}>
          Copy Embed Code
        </Button>
      </div>
      <div className="mt-4 rounded-xl border border-gray-800 bg-black px-4 py-3 text-xs text-gray-300 font-mono">
        {embedCode}
      </div>
    </div>
  );
}
