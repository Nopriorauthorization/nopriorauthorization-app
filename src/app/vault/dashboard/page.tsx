"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import Link from "next/link";
import { DocumentCategory } from "@prisma/client";

type DashboardStats = {
  documents: number;
  chats: number;
  appointments: number;
  decoded: number;
};

type Document = {
  id: string;
  title: string;
  category: DocumentCategory;
  createdAt: string;
  mimeType: string | null;
};

type Chat = {
  id: string;
  createdAt: string;
};

type Appointment = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  provider: string | null;
};

type DashboardData = {
  stats: DashboardStats;
  recentActivity: {
    documents: Document[];
    chats: Chat[];
    appointments: Appointment[];
  };
  isEmpty: boolean;
};

const QuickActionCard = ({ title, description, href, icon, color }: {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}) => (
  <Link
    href={href}
    className={`block p-6 rounded-xl border ${color} hover:scale-105 transition-transform duration-200`}
  >
    <div className="flex items-start gap-4">
      <span className="text-4xl">{icon}</span>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  </Link>
);

const EmptyState = () => (
  <div className="min-h-screen bg-black text-white px-6 py-16">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Welcome to Your Sacred Vault
        </h1>
        <p className="text-xl text-gray-400">
          Your personal health intelligence center - private, secure, and completely yours.
        </p>
      </div>

      <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span>🚀</span> Get Started
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <QuickActionCard
            title="Upload a Document"
            description="Add your first medical record, lab result, or prescription"
            href="/vault/decoder"
            icon="📄"
            color="bg-blue-500/10 border-blue-500/30"
          />
          <QuickActionCard
            title="Chat with Beau-Tox"
            description="Ask health questions and get personalized guidance"
            href="/chat"
            icon="💬"
            color="bg-purple-500/10 border-purple-500/30"
          />
          <QuickActionCard
            title="Add an Appointment"
            description="Track upcoming doctor visits and procedures"
            href="/vault/providers"
            icon="📅"
            color="bg-green-500/10 border-green-500/30"
          />
          <QuickActionCard
            title="View Your Timeline"
            description="See your health journey unfold chronologically"
            href="/vault/timeline"
            icon="⏱️"
            color="bg-pink-500/10 border-pink-500/30"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="text-3xl mb-3">🔐</div>
          <h3 className="font-semibold mb-2">Private & Secure</h3>
          <p className="text-sm text-gray-400">
            Your data is encrypted and only accessible to you. No sharing, no selling.
          </p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
          <p className="text-sm text-gray-400">
            Decode medical jargon, track patterns, and get personalized recommendations.
          </p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold mb-2">Complete Control</h3>
          <p className="text-sm text-gray-400">
            Export snapshots, share with providers, and own your health data.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/vault/dashboard");
        if (res.ok) {
          const dashboardData = await res.json();
          setData(dashboardData);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-white/10 rounded w-1/2 mb-8"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="h-32 bg-white/5 rounded-xl"></div>
              <div className="h-32 bg-white/5 rounded-xl"></div>
              <div className="h-32 bg-white/5 rounded-xl"></div>
              <div className="h-32 bg-white/5 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data?.isEmpty) {
    return <EmptyState />;
  }

  const stats = data?.stats || { documents: 0, chats: 0, appointments: 0, decoded: 0 };
  const recent = data?.recentActivity || { documents: [], chats: [], appointments: [] };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/vault"
            className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
          >
            ← Back to Sacred Vault
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
            My Health Dashboard
          </h1>
          <p className="text-xl text-gray-400">
            Your personal health intelligence at a glance
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">📄</span>
              <span className="text-3xl font-bold text-blue-400">{stats.documents}</span>
            </div>
            <p className="text-sm text-gray-400">Documents</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">💬</span>
              <span className="text-3xl font-bold text-purple-400">{stats.chats}</span>
            </div>
            <p className="text-sm text-gray-400">Conversations</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">📅</span>
              <span className="text-3xl font-bold text-green-400">{stats.appointments}</span>
            </div>
            <p className="text-sm text-gray-400">Appointments</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-xl border border-pink-500/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">🔍</span>
              <span className="text-3xl font-bold text-pink-400">{stats.decoded}</span>
            </div>
            <p className="text-sm text-gray-400">Decoded Docs</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <QuickActionCard
              title="Decode Document"
              description="Upload & decode instantly"
              href="/vault/decoder"
              icon="🔍"
              color="bg-blue-500/10 border-blue-500/30"
            />
            <QuickActionCard
              title="View Timeline"
              description="Your complete journey"
              href="/vault/timeline"
              icon="📅"
              color="bg-purple-500/10 border-purple-500/30"
            />
            <QuickActionCard
              title="Providers"
              description="Manage appointments"
              href="/vault/providers"
              icon="👩‍⚕️"
              color="bg-green-500/10 border-green-500/30"
            />
            <QuickActionCard
              title="Create Snapshot"
              description="Export your data"
              href="/vault/snapshot"
              icon="📸"
              color="bg-pink-500/10 border-pink-500/30"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Recent Documents</h2>
              <Link href="/vault/timeline?type=documents" className="text-sm text-pink-400 hover:text-pink-300">
                View All →
              </Link>
            </div>
            {recent.documents.length > 0 ? (
              <div className="space-y-3">
                {recent.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white/5 rounded-lg border border-white/10 p-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium mb-1">{doc.title}</h3>
                        <p className="text-xs text-gray-400">
                          {new Date(doc.createdAt).toLocaleDateString()} • {doc.category}
                        </p>
                      </div>
                      <span className="text-2xl">📄</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg border border-white/10 p-8 text-center">
                <p className="text-gray-400 mb-4">No documents yet</p>
                <Link
                  href="/vault/decoder"
                  className="inline-block px-4 py-2 bg-blue-500 rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
                >
                  Upload First Document
                </Link>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
              <Link href="/vault/providers" className="text-sm text-pink-400 hover:text-pink-300">
                Manage →
              </Link>
            </div>
            {recent.appointments.length > 0 ? (
              <div className="space-y-3">
                {recent.appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white/5 rounded-lg border border-white/10 p-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium mb-1">{apt.title}</h3>
                        <p className="text-xs text-gray-400">
                          {new Date(apt.date).toLocaleString()}
                          {apt.provider && ` • ${apt.provider}`}
                        </p>
                        {apt.location && (
                          <p className="text-xs text-gray-500 mt-1">📍 {apt.location}</p>
                        )}
                      </div>
                      <span className="text-2xl">📅</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg border border-white/10 p-8 text-center">
                <p className="text-gray-400 mb-4">No upcoming appointments</p>
                <Link
                  href="/vault/providers"
                  className="inline-block px-4 py-2 bg-green-500 rounded-lg text-sm font-semibold hover:bg-green-600 transition"
                >
                  Schedule Appointment
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
