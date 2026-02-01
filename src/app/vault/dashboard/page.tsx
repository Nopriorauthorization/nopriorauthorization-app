"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/ui/button";

/**
 * NPA Vault Dashboard
 * 
 * The main hub after login. Shows:
 * - NPA Health ID
 * - Core stats (documents, shares, contributions)
 * - Quick actions (upload, share, timeline, governance)
 * - Recent activity
 */

type DashboardData = {
  npaId: string | null;
  npaIdAlias: string | null;
  stats: {
    documents: number;
    activeShares: number;
    providerContributions: number;
    totalShares: number;
  };
  recentDocuments: Array<{
    id: string;
    title: string;
    category: string;
    uploadedAt: string;
    source: string;
  }>;
  recentActivity: Array<{
    action: string;
    timestamp: string;
    description: string;
  }>;
};

export default function DashboardPage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status || "loading";
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      loadDashboard();
    }
  }, [status]);

  async function loadDashboard() {
    try {
      // Fetch NPA dashboard data
      const [identityRes, docsRes, sharesRes] = await Promise.all([
        fetch("/api/identity"),
        fetch("/api/vault?limit=5"),
        fetch("/api/share?status=active"),
      ]);

      const identity = identityRes.ok ? await identityRes.json() : null;
      const docs = docsRes.ok ? await docsRes.json() : { documents: [] };
      const shares = sharesRes.ok ? await sharesRes.json() : { sessions: [], stats: {} };

      setData({
        npaId: identity?.npaId || null,
        npaIdAlias: identity?.npaIdAlias || null,
        stats: {
          documents: docs.documents?.length || 0,
          activeShares: shares.stats?.active || 0,
          providerContributions: shares.stats?.contributions || 0,
          totalShares: shares.stats?.total || 0,
        },
        recentDocuments: docs.documents?.slice(0, 5) || [],
        recentActivity: [],
      });
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-white/10 rounded w-1/2 mb-8"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access your vault</h1>
          <Link href="/login">
            <Button variant="primary">Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = data?.stats || { documents: 0, activeShares: 0, providerContributions: 0, totalShares: 0 };
  const isEmpty = stats.documents === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header with NPA ID */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Your Health Vault
              </h1>
              <p className="text-slate-400">
                Patient-owned health records and continuity
              </p>
            </div>
            
            {/* NPA ID Badge */}
            {data?.npaIdAlias && (
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-xl px-6 py-3">
                <p className="text-xs text-purple-300 mb-1">Your NPA Health ID</p>
                <p className="text-lg font-mono font-bold text-white tracking-wider">
                  {data.npaIdAlias}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📄</span>
              <span className="text-3xl font-bold text-blue-400">{stats.documents}</span>
            </div>
            <p className="text-sm text-slate-400">Documents</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">🔗</span>
              <span className="text-3xl font-bold text-green-400">{stats.activeShares}</span>
            </div>
            <p className="text-sm text-slate-400">Active Shares</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">👨‍⚕️</span>
              <span className="text-3xl font-bold text-purple-400">{stats.providerContributions}</span>
            </div>
            <p className="text-sm text-slate-400">Provider Uploads</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📊</span>
              <span className="text-3xl font-bold text-pink-400">{stats.totalShares}</span>
            </div>
            <p className="text-sm text-slate-400">Total Shares</p>
          </div>
        </div>

        {/* Empty State or Quick Actions */}
        {isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <QuickAction
                  href="/vault/documents"
                  icon="📤"
                  title="Upload Records"
                  description="Add health documents"
                  color="blue"
                />
                <QuickAction
                  href="/vault/timeline"
                  icon="📅"
                  title="View Timeline"
                  description="See your health journey"
                  color="purple"
                />
                <QuickAction
                  href="/share/create"
                  icon="🔗"
                  title="Share with Provider"
                  description="Generate secure link"
                  color="green"
                />
                <QuickAction
                  href="/vault/governance"
                  icon="🔒"
                  title="Governance"
                  description="Manage access & export"
                  color="pink"
                />
              </div>
            </div>

            {/* Recent Documents */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recent Documents</h2>
                  <Link href="/vault/timeline" className="text-sm text-purple-400 hover:text-purple-300">
                    View All →
                  </Link>
                </div>
                {data?.recentDocuments && data.recentDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {data.recentDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-white/5 rounded-xl border border-white/10 p-4 hover:bg-white/10 transition cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium mb-1">{doc.title}</h3>
                            <p className="text-xs text-slate-400">
                              {new Date(doc.uploadedAt).toLocaleDateString()} • {doc.category}
                            </p>
                          </div>
                          <span className="text-xl">📄</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl border border-white/10 p-8 text-center">
                    <p className="text-slate-400 mb-4">No documents yet</p>
                    <Link href="/vault/documents">
                      <Button variant="primary" size="sm">
                        Upload First Document
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Getting Started / Tips */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
                <div className="space-y-3">
                  <TipCard
                    icon="📤"
                    title="Upload Your Records"
                    description="Start by uploading PDFs from MyChart, lab results, or visit summaries."
                    done={stats.documents > 0}
                  />
                  <TipCard
                    icon="🔗"
                    title="Share with a Provider"
                    description="Generate a secure link to share records with any doctor—no app needed for them."
                    done={stats.totalShares > 0}
                  />
                  <TipCard
                    icon="🔒"
                    title="Review Your Governance"
                    description="See who has access to your records and manage permissions."
                    done={false}
                  />
                  <TipCard
                    icon="📦"
                    title="Export Your Data"
                    description="You can export all your data anytime. Your data, your control."
                    done={false}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Trust Footer */}
        <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-slate-400">
            🔒 Your data is encrypted and patient-owned. 
            <Link href="/vault/governance" className="text-purple-400 hover:text-purple-300 ml-1">
              View governance dashboard →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Quick Action Card Component
function QuickAction({ href, icon, title, description, color }: {
  href: string;
  icon: string;
  title: string;
  description: string;
  color: "blue" | "purple" | "green" | "pink";
}) {
  const colors = {
    blue: "bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50",
    purple: "bg-purple-500/10 border-purple-500/30 hover:border-purple-500/50",
    green: "bg-green-500/10 border-green-500/30 hover:border-green-500/50",
    pink: "bg-pink-500/10 border-pink-500/30 hover:border-pink-500/50",
  };

  return (
    <Link
      href={href}
      className={`block p-5 rounded-xl border ${colors[color]} transition-all hover:scale-[1.02]`}
    >
      <span className="text-3xl mb-3 block">{icon}</span>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </Link>
  );
}

// Tip Card Component
function TipCard({ icon, title, description, done }: {
  icon: string;
  title: string;
  description: string;
  done: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl border ${done ? "bg-green-500/5 border-green-500/20" : "bg-white/5 border-white/10"}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{done ? "✅" : icon}</span>
        <div>
          <h3 className={`font-medium ${done ? "text-green-400" : "text-white"}`}>
            {title}
          </h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl border border-purple-500/20 p-8 md:p-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
          <span className="text-4xl">📋</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Your Vault is Ready
        </h2>
        <p className="text-slate-300 mb-8">
          Start building your patient-owned health record. Upload your first document
          to see your timeline come to life.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4">
            <span className="text-2xl mb-2 block">1️⃣</span>
            <p className="text-sm font-medium">Upload Records</p>
            <p className="text-xs text-slate-400">MyChart PDFs, labs, summaries</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <span className="text-2xl mb-2 block">2️⃣</span>
            <p className="text-sm font-medium">Build Timeline</p>
            <p className="text-xs text-slate-400">Watch your history organize</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <span className="text-2xl mb-2 block">3️⃣</span>
            <p className="text-sm font-medium">Share Securely</p>
            <p className="text-xs text-slate-400">Send links to any provider</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/vault/documents">
            <Button
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Upload Your First Document
            </Button>
          </Link>
          <Link href="/vault/timeline">
            <Button variant="secondary" size="lg">
              View Timeline
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
