"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TimelineEvent = {
  id: string;
  type: "document" | "chat" | "milestone";
  title: string;
  category?: string;
  date: string;
  description?: string;
};

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await fetch("/api/vault/timeline");
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error("Failed to fetch timeline:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeline();
  }, []);

  const filteredEvents = filter === "all"
    ? events
    : events.filter((e) => e.category?.toLowerCase() === filter);

  const categories = ["all", "lab", "imaging", "visit_note", "other"];

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "lab":
        return "🧪";
      case "imaging":
        return "📷";
      case "visit_note":
        return "📋";
      case "discharge":
        return "🏥";
      default:
        return "📄";
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "lab":
        return "bg-blue-400/10 text-blue-400 border-blue-400/20";
      case "imaging":
        return "bg-purple-400/10 text-purple-400 border-purple-400/20";
      case "visit_note":
        return "bg-green-400/10 text-green-400 border-green-400/20";
      case "discharge":
        return "bg-orange-400/10 text-orange-400 border-orange-400/20";
      default:
        return "bg-pink-400/10 text-pink-400 border-pink-400/20";
    }
  };

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

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filter === cat
                  ? "bg-pink-400 text-black"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {cat === "all" ? "All Events" : cat.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>

        {/* Timeline */}
        {filteredEvents.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10"></div>

            {/* Timeline Events */}
            <div className="space-y-6">
              {filteredEvents.map((event, idx) => (
                <div key={event.id} className="relative pl-16">
                  {/* Timeline Dot */}
                  <div className="absolute left-4 top-3 w-5 h-5 rounded-full bg-pink-400 border-4 border-black"></div>

                  {/* Event Card */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getCategoryIcon(event.category)}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {event.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {event.date}
                          </p>
                        </div>
                      </div>
                      {event.category && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                            event.category
                          )}`}
                        >
                          {event.category.replace("_", " ")}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">📭</span>
            <p className="text-gray-500 text-lg mb-6">
              {filter === "all"
                ? "Your timeline is empty. Start uploading documents or chatting to build your health journey."
                : `No ${filter.replace("_", " ")} events found.`}
            </p>
            <Link
              href="/documents"
              className="inline-block px-6 py-3 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
            >
              Upload Your First Document
            </Link>
          </div>
        )}

        {/* Action Footer */}
        {filteredEvents.length > 0 && (
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
