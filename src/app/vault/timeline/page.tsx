"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import Link from "next/link";

type TimelineEvent = {
  id: string;
  type: "document" | "chat" | "milestone";
  title: string;
  category: string;
  date: string;
  description?: string;
  metadata?: {
    mimeType?: string;
    sizeKB?: number;
    downloadUrl?: string;
    messageCount?: number;
    chatUrl?: string;
  };
};

type TimelineStats = {
  total: number;
  documents: number;
  chats: number;
  milestones: number;
};

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [stats, setStats] = useState<TimelineStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const typeParam = filter === "all" ? "" : `?type=${filter}`;
        const res = await fetch(`/api/vault/timeline${typeParam}`);
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

    fetchTimeline();
  }, [filter]);

  const filterOptions = [
    { value: "all", label: "All Events", icon: "📚" },
    { value: "documents", label: "Documents", icon: "📄" },
    { value: "chats", label: "Conversations", icon: "💬" },
    { value: "milestones", label: "Milestones", icon: "🏆" },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return "📄";
      case "chat":
        return "💬";
      case "milestone":
        return "🏆";
      default:
        return "📄";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-400/10 text-blue-400 border-blue-400/20";
      case "chat":
        return "bg-purple-400/10 text-purple-400 border-purple-400/20";
      case "milestone":
        return "bg-pink-400/10 text-pink-400 border-pink-400/20";
      default:
        return "bg-gray-400/10 text-gray-400 border-gray-400/20";
    }
  };

  function handleEventClick(event: TimelineEvent) {
    if (event.type === "document" && event.metadata?.downloadUrl) {
      window.open(event.metadata.downloadUrl, "_blank");
    } else if (event.type === "chat" && event.metadata?.chatUrl) {
      window.location.href = event.metadata.chatUrl;
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-white/10 rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-24 bg-white/5 rounded"></div>
              <div className="h-24 bg-white/5 rounded"></div>
              <div className="h-24 bg-white/5 rounded"></div>
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
            <span className="text-4xl">📅</span>
            <h1 className="text-4xl md:text-5xl font-semibold">
              My Treatment Timeline
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Your complete health journey — every document, chat, and milestone,
            organized chronologically.
          </p>
        </div>

        {/* Stats Bar */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-gray-400 mt-1">Total Events</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-bold text-blue-400">{stats.documents}</div>
              <div className="text-xs text-gray-400 mt-1">Documents</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-bold text-purple-400">{stats.chats}</div>
              <div className="text-xs text-gray-400 mt-1">Conversations</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-bold text-pink-400">{stats.milestones}</div>
              <div className="text-xs text-gray-400 mt-1">Milestones</div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2 ${
                filter === opt.value
                  ? "bg-pink-400 text-black"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Timeline */}
        {events.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10"></div>

            {/* Timeline Events */}
            <div className="space-y-6">
              {events.map((event) => {
                const isClickable = event.type === "document" || event.type === "chat";
                return (
                  <div key={event.id} className="relative pl-16">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-4 top-3 w-5 h-5 rounded-full border-4 border-black ${
                        event.type === "milestone"
                          ? "bg-pink-400"
                          : event.type === "chat"
                          ? "bg-purple-400"
                          : "bg-blue-400"
                      }`}
                    ></div>

                    {/* Event Card */}
                    <div
                      onClick={() => isClickable && handleEventClick(event)}
                      className={`rounded-xl border border-white/10 bg-white/5 p-5 transition ${
                        isClickable
                          ? "hover:bg-white/10 cursor-pointer hover:border-pink-400/30"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl">
                            {getTypeIcon(event.type)}
                          </span>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">
                              {event.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {event.date}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(
                            event.type
                          )}`}
                        >
                          {event.type}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-400 leading-relaxed mb-2">
                          {event.description}
                        </p>
                      )}
                      {event.metadata && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {event.metadata.sizeKB && (
                            <span className="text-xs bg-white/5 px-2 py-1 rounded">
                              {event.metadata.sizeKB} KB
                            </span>
                          )}
                          {event.metadata.mimeType && (
                            <span className="text-xs bg-white/5 px-2 py-1 rounded">
                              {event.metadata.mimeType.split("/")[1]?.toUpperCase()}
                            </span>
                          )}
                          {event.metadata.messageCount && (
                            <span className="text-xs bg-white/5 px-2 py-1 rounded">
                              {event.metadata.messageCount} messages
                            </span>
                          )}
                          {isClickable && (
                            <span className="text-xs text-pink-400 ml-auto">
                              Click to {event.type === "document" ? "download" : "view"} →
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">📭</span>
            <p className="text-gray-500 text-lg mb-6">
              {filter === "all"
                ? "Your timeline is empty. Start uploading documents or chatting to build your health journey."
                : `No ${filter} found. Try a different filter or upload content.`}
            </p>
            {filter === "documents" || filter === "all" ? (
              <Link
                href="/documents"
                className="inline-block px-6 py-3 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
              >
                Upload Your First Document
              </Link>
            ) : (
              <Link
                href="/chat"
                className="inline-block px-6 py-3 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
              >
                Start a Conversation
              </Link>
            )}
          </div>
        )}

        {/* Action Footer */}
        {events.length > 0 && (
          <div className="mt-8 p-6 rounded-xl border border-white/10 bg-white/5">
            <p className="text-sm text-gray-400 mb-4">
              <strong className="text-white">Auto-assembled journey:</strong>{" "}
              Every document you upload and conversation you have is
              automatically added to your timeline.
            </p>
            <Link
              href="/documents"
              className="inline-block px-4 py-2 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
            >
              Add More Documents
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
