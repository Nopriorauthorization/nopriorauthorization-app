"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HealthTopic = {
  topic: string;
  category: string;
  chatCount: number;
  lastDiscussed: string;
};

type SnapshotData = {
  goals: string[];
  preferences: {
    tone?: string;
    depth?: string;
  };
  healthTopics: HealthTopic[];
  chatSummary: {
    totalChats: number;
    topicsIdentified: number;
  };
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
          <h1 className="text-4xl font-bold mb-2">Your Sacred Snapshot</h1>
          <p className="text-white/60">
            A living document of your health identity, auto-assembled from your vault.
          </p>
        </div>

        {/* Goals Section */}
        {snapshot?.goals && snapshot.goals.length > 0 && (
          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl p-6 mb-6 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">My Health Goals</h2>
            <ul className="space-y-2">
              {snapshot.goals.map((goal, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-pink-400 mr-2">→</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Health Topics Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Health Topics I&apos;ve Explored</h2>
            {snapshot?.chatSummary && (
              <div className="text-sm text-white/60">
                {snapshot.chatSummary.totalChats} conversations •{" "}
                {snapshot.chatSummary.topicsIdentified} topics identified
              </div>
            )}
          </div>

          {snapshot?.healthTopics && snapshot.healthTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {snapshot.healthTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-lg p-4 border border-white/10 hover:border-pink-400/30 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold capitalize">{topic.topic}</h3>
                    <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded">
                      {topic.chatCount} chat{topic.chatCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="text-sm text-white/60 mb-2">{topic.category}</div>
                  <div className="text-xs text-white/40">
                    Last discussed: {topic.lastDiscussed}
                  </div>
                  <Link
                    href="/chat"
                    className="text-sm text-pink-400 hover:text-pink-300 transition mt-2 inline-block"
                  >
                    Continue discussion →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 rounded-lg p-8 text-center">
              <p className="text-white/60 mb-4">
                No health topics identified yet. Start a conversation with Beau to explore your health concerns.
              </p>
              <Link
                href="/chat"
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
              >
                Start Your First Chat
              </Link>
            </div>
          )}
        </div>

        {/* Recent Documents */}
        {snapshot?.recentDocuments && snapshot.recentDocuments.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Documents</h2>
            <div className="space-y-3">
              {snapshot.recentDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-400/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <div className="text-sm text-white/60">
                        {doc.category} • {doc.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Section */}
        {snapshot?.preferences && (
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">My Preferences</h2>
            <div className="space-y-2">
              {snapshot.preferences.tone && (
                <div>
                  <span className="text-white/60">Tone:</span> {snapshot.preferences.tone}
                </div>
              )}
              {snapshot.preferences.depth && (
                <div>
                  <span className="text-white/60">Depth:</span> {snapshot.preferences.depth}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
