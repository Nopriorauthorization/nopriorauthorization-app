"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/ui/button";

/**
 * NPA Health Timeline
 * 
 * The longitudinal view of a patient's health journey.
 * Shows documents organized chronologically with:
 * - Patient uploads
 * - Provider contributions
 * - Source attribution
 */

type TimelineEvent = {
  id: string;
  type: "document" | "provider_contribution" | "share";
  title: string;
  category: string;
  date: string;
  source: "PATIENT" | "PROVIDER";
  providerInfo?: {
    name: string;
    organization: string;
    role: string;
  };
  metadata?: {
    mimeType?: string;
    sizeKB?: number;
    downloadUrl?: string;
  };
};

type TimelineStats = {
  total: number;
  patientUploads: number;
  providerContributions: number;
};

export default function TimelinePage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status || "loading";
  
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [stats, setStats] = useState<TimelineStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "patient" | "provider">("all");

  useEffect(() => {
    if (status === "authenticated") {
      fetchTimeline();
    }
  }, [status, filter]);

  async function fetchTimeline() {
    try {
      const sourceParam = filter === "all" ? "" : `?source=${filter}`;
      const res = await fetch(`/api/vault/timeline${sourceParam}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error("Failed to fetch timeline:", error);
    } finally {
      setLoading(false);
    }
  }

  function getSourceIcon(source: string) {
    return source === "PROVIDER" ? "👨‍⚕️" : "📄";
  }

  function getSourceColor(source: string) {
    return source === "PROVIDER"
      ? "bg-green-500/10 text-green-400 border-green-500/30"
      : "bg-blue-500/10 text-blue-400 border-blue-500/30";
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-white/10 rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
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
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <Link href="/login">
            <Button variant="primary">Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/vault/dashboard"
            className="text-sm text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← Back to Vault
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Your Health Timeline
          </h1>
          <p className="text-slate-400">
            Your complete health journey — patient uploads and provider contributions in one place.
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-slate-400 mt-1">Total Records</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{stats.patientUploads}</div>
              <div className="text-xs text-slate-400 mt-1">Your Uploads</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{stats.providerContributions}</div>
              <div className="text-xs text-slate-400 mt-1">Provider Added</div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { value: "all", label: "All Records" },
            { value: "patient", label: "My Uploads" },
            { value: "provider", label: "Provider Added" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === opt.value
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        {events.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-indigo-500 opacity-30"></div>

            {/* Events */}
            <div className="space-y-6">
              {events.map((event) => (
                <div key={event.id} className="relative pl-16">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-4 top-4 w-5 h-5 rounded-full border-4 border-slate-900 ${
                      event.source === "PROVIDER" ? "bg-green-500" : "bg-blue-500"
                    }`}
                  />

                  {/* Event Card */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl">{getSourceIcon(event.source)}</span>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <p className="text-sm text-slate-400">
                            {event.category} • {formatDate(event.date)}
                          </p>
                          {event.providerInfo && (
                            <p className="text-sm text-green-400 mt-1">
                              Added by {event.providerInfo.name}, {event.providerInfo.role} — {event.providerInfo.organization}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSourceColor(event.source)}`}>
                        {event.source === "PROVIDER" ? "Provider" : "Patient"}
                      </span>
                    </div>

                    {event.metadata && (
                      <div className="flex items-center gap-4 mt-3">
                        {event.metadata.sizeKB && (
                          <span className="text-xs text-slate-500">
                            {event.metadata.sizeKB} KB
                          </span>
                        )}
                        {event.metadata.mimeType && (
                          <span className="text-xs text-slate-500">
                            {event.metadata.mimeType.split("/")[1]?.toUpperCase()}
                          </span>
                        )}
                        {event.metadata.downloadUrl && (
                          <a
                            href={event.metadata.downloadUrl}
                            className="text-xs text-purple-400 hover:text-purple-300 ml-auto"
                          >
                            Download →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <span className="text-4xl">📋</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Your Timeline is Empty</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              {filter === "all"
                ? "Upload your first health document to start building your timeline."
                : filter === "patient"
                ? "You haven't uploaded any documents yet."
                : "No provider contributions yet. Share your records with a provider to get started."}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/documents">
                <Button variant="primary" className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  Upload Documents
                </Button>
              </Link>
              <Link href="/share/create">
                <Button variant="secondary">
                  Share with Provider
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {events.length > 0 && (
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-semibold mb-1">Build Your Timeline</p>
                <p className="text-sm text-slate-400">
                  Every document you upload and every provider contribution adds to your health story.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/documents">
                  <Button variant="secondary" size="sm">
                    Upload More
                  </Button>
                </Link>
                <Link href="/share/create">
                  <Button variant="primary" size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600">
                    Share with Provider
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Trust Footer */}
        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-slate-400">
            🔒 Your timeline is patient-owned and encrypted.
            <Link href="/vault/governance" className="text-purple-400 hover:text-purple-300 ml-1">
              Manage access →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
