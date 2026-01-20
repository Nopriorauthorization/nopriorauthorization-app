"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type RedFlag = {
  id: string;
  type: "interaction" | "contraindication" | "timing" | "safety";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  medications?: string[];
  detectedAt: string;
  dismissed: boolean;
};

export default function RedFlagsPage() {
  const [flags, setFlags] = useState<RedFlag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      const res = await fetch("/api/vault/red-flags");
      if (res.ok) {
        const data = await res.json();
        setFlags(data.flags || []);
      }
    } catch (error) {
      console.error("Failed to load flags:", error);
    } finally {
      setLoading(false);
    }
  };

  const dismissFlag = async (id: string) => {
    try {
      const res = await fetch(`/api/vault/red-flags/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dismissed: true }),
      });

      if (res.ok) {
        setFlags((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (error) {
      console.error("Failed to dismiss:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500/50 bg-red-500/10";
      case "warning":
        return "border-yellow-500/50 bg-yellow-500/10";
      case "info":
        return "border-blue-500/50 bg-blue-500/10";
      default:
        return "border-white/10 bg-white/5";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return "🚨";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "🚩";
    }
  };

  const activeFlags = flags.filter((f) => !f.dismissed);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/vault"
            className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
          >
            ← Back to Sacred Vault
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Red Flags Monitor
          </h1>
          <p className="text-xl text-gray-400">
            AI watches for drug interactions, timing conflicts, and safety issues — before they become problems.
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Scanning for safety issues...</p>
          </div>
        )}

        {!loading && activeFlags.length === 0 && (
          <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold mb-2">All Clear!</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              No safety concerns detected based on your current health profile and medications.
            </p>
          </div>
        )}

        {!loading && activeFlags.length > 0 && (
          <div className="space-y-4">
            {activeFlags.map((flag) => (
              <div
                key={flag.id}
                className={`rounded-xl border p-6 ${getSeverityColor(flag.severity)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{getSeverityIcon(flag.severity)}</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{flag.title}</h3>
                      <span className="text-xs uppercase tracking-wide text-gray-400">
                        {flag.type} • {flag.severity}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissFlag(flag.id)}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Dismiss
                  </button>
                </div>

                <p className="text-gray-300 mb-4">{flag.description}</p>

                {flag.medications && flag.medications.length > 0 && (
                  <div className="bg-black/30 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Related Medications:</p>
                    <div className="flex flex-wrap gap-2">
                      {flag.medications.map((med, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-white/10 text-sm"
                        >
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-4">
                  Detected {new Date(flag.detectedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span>💡</span> How It Works
          </h3>
          <p className="text-sm text-gray-300">
            Our AI continuously monitors your health profile, medications, and documents for
            potential safety concerns. When something is flagged, we'll show it here so you can
            discuss it with your provider.
          </p>
        </div>
      </div>
    </div>
  );
}
