const fs = require('fs');
const path = require('path');

const analyticsPageContent = `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AnalyticsData = {
  summary: {
    totalDocuments: number;
    totalChats: number;
    totalMessages: number;
    avgMessagesPerChat: number;
    totalAppointments: number;
    totalProviders: number;
    totalDecoded: number;
    totalStorageMB: number;
    activityScore: number;
  };
  categories: Array<{ name: string; count: number; percentage: number }>;
  uploadTrend: Array<{ month: string; count: number }>;
  chatTrend: Array<{ month: string; count: number }>;
  fileTypeBreakdown: Array<{ type: string; count: number; percentage: number }>;
  appointmentTypeBreakdown: Array<{ type: string; count: number }>;
  specialtyBreakdown: Array<{ specialty: string; count: number }>;
  recentActivity: {
    documents: number;
    chats: number;
    appointments: number;
  };
  isEmpty: boolean;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/vault/analytics");
        if (res.ok) {
          const analyticsData = await res.json();
          setData(analyticsData);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-white/10 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="h-32 bg-white/5 rounded"></div>
              <div className="h-32 bg-white/5 rounded"></div>
              <div className="h-32 bg-white/5 rounded"></div>
            </div>
            <div className="h-64 bg-white/5 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!data || data.isEmpty) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/vault"
            className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
          >
            ← Back to Sacred Vault
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">📊</span>
            <h1 className="text-4xl md:text-5xl font-semibold">Health Analytics</h1>
          </div>

          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">📈</span>
            <p className="text-gray-500 text-lg mb-6">
              No analytics data yet. Start building your health profile to see insights.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/documents"
                className="px-6 py-3 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
              >
                Upload Documents
              </Link>
              <Link
                href="/chat"
                className="px-6 py-3 rounded-full bg-white/5 text-white text-sm font-semibold hover:bg-white/10 transition border border-white/10"
              >
                Start Chatting
              </Link>
              <Link
                href="/vault/providers"
                className="px-6 py-3 rounded-full bg-white/5 text-white text-sm font-semibold hover:bg-white/10 transition border border-white/10"
              >
                Add Providers
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const { summary, categories, uploadTrend, chatTrend, fileTypeBreakdown, appointmentTypeBreakdown, specialtyBreakdown, recentActivity } = data;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Link
          href="/vault"
          className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
        >
          ← Back to Sacred Vault
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">📊</span>
          <h1 className="text-4xl md:text-5xl font-semibold">Health Analytics</h1>
        </div>

        <p className="text-gray-400 text-lg mb-8">
          Comprehensive insights into your health data, trends, and activity patterns.
        </p>

        {/* Activity Score */}
        <div className="mb-8 p-6 rounded-xl border border-pink-400/30 bg-pink-400/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Activity Score</h2>
              <p className="text-sm text-gray-400">Based on your vault engagement</p>
            </div>
            <div className="text-4xl font-bold text-pink-400">{summary.activityScore}</div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-pink-400 h-2 rounded-full transition-all"
              style={{ width: \`\${summary.activityScore}%\` }}
            ></div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-2xl font-bold text-blue-400">{summary.totalDocuments}</div>
            <div className="text-xs text-gray-400 mt-1">Documents</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-2xl font-bold text-purple-400">{summary.totalChats}</div>
            <div className="text-xs text-gray-400 mt-1">Conversations</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-2xl font-bold text-green-400">{summary.totalAppointments}</div>
            <div className="text-xs text-gray-400 mt-1">Appointments</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-2xl font-bold text-orange-400">{summary.totalProviders}</div>
            <div className="text-xs text-gray-400 mt-1">Providers</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-2xl font-bold text-pink-400">{summary.totalDecoded}</div>
            <div className="text-xs text-gray-400 mt-1">Decoded Docs</div>
          </div>
        </div>

        {/* Recent Activity (Last 30 Days) */}
        <div className="mb-8 p-6 rounded-xl border border-white/10 bg-white/5">
          <h2 className="text-xl font-semibold mb-4">Recent Activity (Last 30 Days)</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-3xl font-bold text-blue-400">{recentActivity.documents}</div>
              <div className="text-sm text-gray-400">Documents Uploaded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">{recentActivity.chats}</div>
              <div className="text-sm text-gray-400">New Chats</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">{recentActivity.appointments}</div>
              <div className="text-sm text-gray-400">Appointments Added</div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Document Categories */}
          {categories.length > 0 && (
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold mb-4">Document Categories</h2>
              <div className="space-y-3">
                {categories.slice(0, 5).map((cat: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">{cat.name}</span>
                      <span className="text-gray-400">{cat.count} ({cat.percentage}%)</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-blue-400 h-2 rounded-full"
                        style={{ width: \`\${cat.percentage}%\` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Types */}
          {fileTypeBreakdown.length > 0 && (
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold mb-4">File Types</h2>
              <div className="space-y-3">
                {fileTypeBreakdown.slice(0, 5).map((file: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">{file.type}</span>
                      <span className="text-gray-400">{file.count} ({file.percentage}%)</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-purple-400 h-2 rounded-full"
                        style={{ width: \`\${file.percentage}%\` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upload Trend */}
        {uploadTrend.length > 0 && (
          <div className="mb-8 p-6 rounded-xl border border-white/10 bg-white/5">
            <h2 className="text-xl font-semibold mb-4">Document Upload Trend (Last 12 Months)</h2>
            <div className="flex items-end justify-between gap-2 h-48">
              {uploadTrend.map((item: any, idx: number) => {
                const maxCount = Math.max(...uploadTrend.map((t: any) => t.count));
                const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-400 rounded-t transition-all hover:bg-blue-300"
                      style={{ height: \`\${height}%\`, minHeight: item.count > 0 ? "8px" : "0px" }}
                      title={\`\${item.month}: \${item.count} documents\`}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 rotate-45 origin-left whitespace-nowrap">
                      {item.month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat Activity Trend */}
        {chatTrend.length > 0 && (
          <div className="mb-8 p-6 rounded-xl border border-white/10 bg-white/5">
            <h2 className="text-xl font-semibold mb-4">Chat Activity Trend (Last 12 Months)</h2>
            <div className="flex items-end justify-between gap-2 h-48">
              {chatTrend.map((item: any, idx: number) => {
                const maxCount = Math.max(...chatTrend.map((t: any) => t.count));
                const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-purple-400 rounded-t transition-all hover:bg-purple-300"
                      style={{ height: \`\${height}%\`, minHeight: item.count > 0 ? "8px" : "0px" }}
                      title={\`\${item.month}: \${item.count} chats\`}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 rotate-45 origin-left whitespace-nowrap">
                      {item.month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Appointment Types */}
          {appointmentTypeBreakdown.length > 0 && (
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold mb-4">Appointment Types</h2>
              <div className="space-y-2">
                {appointmentTypeBreakdown.map((appt: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm text-white">{appt.type}</span>
                    <span className="text-sm font-semibold text-green-400">{appt.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Provider Specialties */}
          {specialtyBreakdown.length > 0 && (
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold mb-4">Provider Specialties</h2>
              <div className="space-y-2">
                {specialtyBreakdown.map((spec: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm text-white">{spec.specialty}</span>
                    <span className="text-sm font-semibold text-orange-400">{spec.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat Stats */}
        <div className="mb-8 p-6 rounded-xl border border-white/10 bg-white/5">
          <h2 className="text-xl font-semibold mb-4">Chat Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-3xl font-bold text-purple-400">{summary.totalMessages}</div>
              <div className="text-sm text-gray-400">Total Messages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">{summary.avgMessagesPerChat}</div>
              <div className="text-sm text-gray-400">Avg Messages/Chat</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">{summary.totalStorageMB} MB</div>
              <div className="text-sm text-gray-400">Total Storage Used</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-xl border border-white/10 bg-white/5">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/vault/timeline"
              className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-center"
            >
              <div className="text-2xl mb-2">📅</div>
              <div className="text-sm font-semibold">Timeline</div>
            </Link>
            <Link
              href="/vault/snapshot"
              className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-center"
            >
              <div className="text-2xl mb-2">📸</div>
              <div className="text-sm font-semibold">Snapshot</div>
            </Link>
            <Link
              href="/vault/ai-insights"
              className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-center"
            >
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-sm font-semibold">AI Insights</div>
            </Link>
            <Link
              href="/documents"
              className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-center"
            >
              <div className="text-2xl mb-2">📄</div>
              <div className="text-sm font-semibold">Documents</div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
`;

const targetPath = path.join(process.cwd(), 'src/app/vault/analytics/page.tsx');
fs.writeFileSync(targetPath, analyticsPageContent, 'utf8');
console.log('✅ Analytics page successfully written to:', targetPath);
