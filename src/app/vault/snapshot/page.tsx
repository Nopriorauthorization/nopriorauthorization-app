"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SnapshotData = {
  goals: string[];
  preferences: {
    tone?: string;
    depth?: string;
  };
  topicsDiscussed: string[];
  recentDocuments: {
    title: string;
    category: string;
    date: string;
  }[];
};

export default function SnapshotPage() {
  const [snapshot, setSnapshot] = useState<SnapshotData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSnapshot() {
      try {
        const res = await fetch("/api/vault/snapshot");
        if (res.ok) {
          const data = await res.json();
          setSnapshot(data);
        }
      } catch (error) {
        console.error("Failed to fetch snapshot:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSnapshot();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-white/10 rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-white/5 rounded"></div>
              <div className="h-32 bg-white/5 rounded"></div>
              <div className="h-32 bg-white/5 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/vault"
            className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
          >
            ← Back to Sacred Vault
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📸</span>
            <h1 className="text-4xl md:text-5xl font-semibold">My Snapshot</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Your complete health identity — auto-assembled from your conversations, treatments, and goals.
          </p>
        </div>

        {/* Snapshot Sections */}
        <div className="space-y-6">
          {/* Goals */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>🎯</span> My Goals
            </h2>
            {snapshot?.goals && snapshot.goals.length > 0 ? (
              <ul className="space-y-2">
                {snapshot.goals.map((goal, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <span className="text-pink-400 mt-1">•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">
                No goals captured yet. Chat with your mascots or update your Blueprint to add goals.
              </p>
            )}
          </section>

          {/* Topics Discussed */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>💬</span> Topics I've Explored
            </h2>
            {snapshot?.topicsDiscussed && snapshot.topicsDiscussed.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {snapshot.topicsDiscussed.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-pink-400/10 text-pink-400 text-sm font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Start chatting to build your topic history.
              </p>
            )}
          </section>

          {/* Preferences */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>⚙️</span> My Communication Style
            </h2>
            {snapshot?.preferences ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {snapshot.preferences.tone && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Tone
                    </p>
                    <p className="text-pink-400 font-semibold capitalize">
                      {snapshot.preferences.tone}
                    </p>
                  </div>
                )}
                {snapshot.preferences.depth && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Detail Level
                    </p>
                    <p className="text-pink-400 font-semibold capitalize">
                      {snapshot.preferences.depth}
                    </p>
                  </div>
                )}
                {!snapshot.preferences.tone && !snapshot.preferences.depth && (
                  <p className="text-gray-500 text-sm col-span-2">
                    Your communication preferences will be learned as you chat.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No preferences set yet.
              </p>
            )}
          </section>

          {/* Recent Documents */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>📄</span> Recent Documents
            </h2>
            {snapshot?.recentDocuments && snapshot.recentDocuments.length > 0 ? (
              <div className="space-y-3">
                {snapshot.recentDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5"
                  >
                    <div>
                      <p className="font-medium text-white">{doc.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {doc.category} • {doc.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm mb-4">
                  No documents uploaded yet.
                </p>
                <Link
                  href="/documents"
                  className="inline-block px-4 py-2 rounded-full bg-pink-400/10 text-pink-400 text-sm font-semibold hover:bg-pink-400/20 transition"
                >
                  Upload Your First Document
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Action Footer */}
        <div className="mt-8 p-6 rounded-xl border border-white/10 bg-white/5">
          <p className="text-sm text-gray-400 mb-4">
            <strong className="text-white">Auto-populated magic:</strong> This snapshot updates automatically as you chat, upload documents, and refine your health journey.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/chat"
              className="px-4 py-2 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
            >
              Start Chatting
            </Link>
            <Link
              href="/blueprint"
              className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition"
            >
              Update Blueprint
            </Link>
            <Link
              href="/documents"
              className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition"
            >
              Upload Documents
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
