const fs = require('fs');
const path = require('path');

const content = `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Insights = {
  documentInsights: {
    totalDocuments: number;
    categories: string[];
    recentUploads: { title: string; category: string; date: string; }[];
  };
  chatInsights: {
    totalConversations: number;
    topics: string[];
    recentTopics: { title: string; date: string; }[];
  };
  appointmentInsights: {
    totalAppointments: number;
    upcomingCount: number;
    specialists: string[];
    appointmentTypes: string[];
  };
  providerInsights: {
    totalProviders: number;
    specialties: string[];
    providers: { name: string; specialty: string | null; }[];
  };
  treatmentInsights: {
    decodedDocuments: number;
    recentDecodes: {
      documentTitle: string;
      summary: string;
      keyTermsCount: number;
      questionsCount: number;
    }[];
  };
  summary: {
    documentsUploaded: number;
    conversationsHad: number;
    appointmentsTracked: number;
    providersManaged: number;
    documentsDecoded: number;
  };
  isEmpty: boolean;
};

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch("/api/vault/insights");
        if (res.ok) {
          const data = await res.json();
          setInsights(data);
        }
      } catch (error) {
        console.error("Failed to fetch insights:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-white/10 rounded w-2/3 mb-8"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-white/5 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (insights?.isEmpty) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/vault"
            className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
          >
            ← Back to Sacred Vault
          </Link>
          <h1 className="text-4xl font-bold mb-2">AI Health Insights</h1>
          <p className="text-white/60 mb-8">
            Personalized insights generated from your health data
          </p>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-8 border border-white/10 text-center">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-2xl font-semibold mb-4">No Insights Yet</h2>
            <p className="text-white/60 mb-6">
              As you add documents, chat with Beau, and track appointments, we'll generate personalized insights about your health journey.
            </p>
            <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
              <Link
                href="/vault/decoder"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
              >
                Decode Document
              </Link>
              <Link
                href="/chat"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
              >
                Chat with Beau
              </Link>
              <Link
                href="/vault/snapshot"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
              >
                View Snapshot
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/vault"
            className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
          >
            ← Back to Sacred Vault
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🧠</span>
            <h1 className="text-4xl font-bold">AI Health Insights</h1>
          </div>
          <p className="text-white/60">
            Personalized insights generated from your {insights?.summary.documentsUploaded} documents,{" "}
            {insights?.summary.conversationsHad} conversations, and {insights?.summary.appointmentsTracked} appointments
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold">{insights?.summary.documentsUploaded}</div>
            <div className="text-sm text-white/60">Documents</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold">{insights?.summary.conversationsHad}</div>
            <div className="text-sm text-white/60">Chats</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold">{insights?.summary.appointmentsTracked}</div>
            <div className="text-sm text-white/60">Appointments</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold">{insights?.summary.providersManaged}</div>
            <div className="text-sm text-white/60">Providers</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold">{insights?.summary.documentsDecoded}</div>
            <div className="text-sm text-white/60">Decoded</div>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Document Insights */}
          {insights && insights.documentInsights.totalDocuments > 0 && (
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📄</span> Document Insights
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-white/60">Categories</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {insights.documentInsights.categories.map((cat, i) => (
                      <span key={i} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                {insights.documentInsights.recentUploads.length > 0 && (
                  <div>
                    <div className="text-sm text-white/60 mb-2">Recent Uploads</div>
                    {insights.documentInsights.recentUploads.map((doc, i) => (
                      <div key={i} className="text-sm mb-1">
                        • {doc.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chat Insights */}
          {insights && insights.chatInsights.totalConversations > 0 && (
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>💬</span> Conversation Insights
              </h2>
              <div className="space-y-3">
                {insights.chatInsights.topics.length > 0 && (
                  <div>
                    <div className="text-sm text-white/60">Topics Discussed</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {insights.chatInsights.topics.map((topic, i) => (
                        <span key={i} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded capitalize">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {insights.chatInsights.recentTopics.length > 0 && (
                  <div>
                    <div className="text-sm text-white/60 mb-2">Recent Conversations</div>
                    {insights.chatInsights.recentTopics.map((topic, i) => (
                      <div key={i} className="text-sm mb-1">
                        • {topic.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appointment Insights */}
          {insights && insights.appointmentInsights.totalAppointments > 0 && (
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📅</span> Appointment Insights
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-white/60">Upcoming</div>
                  <div className="text-2xl font-bold text-green-400">
                    {insights.appointmentInsights.upcomingCount}
                  </div>
                </div>
                {insights.appointmentInsights.specialists.length > 0 && (
                  <div>
                    <div className="text-sm text-white/60">Specialists Seen</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {insights.appointmentInsights.specialists.map((spec, i) => (
                        <span key={i} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Provider Insights */}
          {insights && insights.providerInsights.totalProviders > 0 && (
            <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>👩‍⚕️</span> Care Team Insights
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-white/60">Total Providers</div>
                  <div className="text-2xl font-bold text-pink-400">
                    {insights.providerInsights.totalProviders}
                  </div>
                </div>
                {insights.providerInsights.specialties.length > 0 && (
                  <div>
                    <div className="text-sm text-white/60">Specialties</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {insights.providerInsights.specialties.map((spec, i) => (
                        <span key={i} className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Treatment Insights */}
          {insights && insights.treatmentInsights.decodedDocuments > 0 && (
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>💊</span> Treatment Insights
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-white/60">Decoded Documents</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {insights.treatmentInsights.decodedDocuments}
                  </div>
                </div>
                {insights.treatmentInsights.recentDecodes.length > 0 && (
                  <div>
                    <div className="text-sm text-white/60 mb-2">Recent Decodes</div>
                    {insights.treatmentInsights.recentDecodes.slice(0, 2).map((decode, i) => (
                      <div key={i} className="text-sm mb-2">
                        <div className="font-medium">• {decode.documentTitle}</div>
                        <div className="text-xs text-white/60">
                          {decode.keyTermsCount} terms • {decode.questionsCount} questions
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Take Action</h3>
          <div className="grid gap-3 sm:grid-cols-4">
            <Link
              href="/vault/decoder"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-center"
            >
              Decode More
            </Link>
            <Link
              href="/chat"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-center"
            >
              Chat with Beau
            </Link>
            <Link
              href="/vault/snapshot"
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-center"
            >
              View Snapshot
            </Link>
            <Link
              href="/vault/providers"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-center"
            >
              Manage Providers
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
`;

const filePath = path.resolve(__dirname, '../src/app/vault/ai-insights/page.tsx');
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ AI Insights page successfully written to:', filePath);
