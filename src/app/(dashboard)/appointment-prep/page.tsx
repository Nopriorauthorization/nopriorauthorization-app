"use client";
export const dynamic = 'force-dynamic';export const runtime = "edge";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type VisitPrepData = {
  upcomingAppointments: any[];
  questionsToAsk: any[];
  thingsToBring: any[];
  pendingFollowUps: any[];
  recentChanges: any[];
  discussionItems: any[];
  careTeamContext: any[];
  isEmpty: boolean;
  generatedAt: string;
};

export default function VisitPrepPage() {
  const { status } = useSession();
  const [data, setData] = useState<VisitPrepData | null>(null);
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [calendarConnected, setCalendarConnected] = useState(false);

  const demoVisitPrep: VisitPrepData = {
    upcomingAppointments: [],
    questionsToAsk: [],
    thingsToBring: [],
    pendingFollowUps: [],
    recentChanges: [],
    discussionItems: [],
    careTeamContext: [],
    isEmpty: true,
    generatedAt: new Date().toISOString(),
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchVisitPrep();
      fetchCalendarEvents();
      return;
    }

    if (status === "unauthenticated") {
      setData(demoVisitPrep);
      setCalendarEvents([]);
      setCalendarConnected(false);
      setLoading(false);
    }
  }, [status, demoVisitPrep]);

  const fetchVisitPrep = async () => {
    try {
      const res = await fetch("/api/vault/visit-prep");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch visit prep:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      const res = await fetch("/api/vault/calendar/sync");
      if (res.ok) {
        const json = await res.json();
        setCalendarEvents(json.events || []);
        setCalendarConnected(json.connected || false);
      }
    } catch (error) {
      console.error("Failed to fetch calendar events:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/5 rounded w-1/3"></div>
            <div className="h-32 bg-white/5 rounded"></div>
            <div className="h-32 bg-white/5 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-400">Failed to load visit preparation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Visit Preparation
          </h1>
          <p className="text-white/60 text-sm">
            Feel prepared and confident for your healthcare visits
          </p>
        </div>

        {/* Calm Intelligence Banner */}
        <div className="bg-gradient-to-r from-blue-400/10 to-purple-400/10 border border-blue-400/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🧘</span>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Your Visit Assistant
              </h2>
              <p className="text-white/80 text-sm leading-relaxed">
                This is an educational preparation tool that organizes your thoughts and materials—not a clinical advisor. 
                We synthesize your appointments, priorities, care team, and documents to help you feel ready.
              </p>
              <p className="text-white/60 text-xs mt-2">
                Last updated: {new Date(data.generatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {data.isEmpty && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No upcoming visits scheduled
            </h2>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Schedule an appointment to start preparing for your healthcare visits.
            </p>
            <Link
              href="/vault/appointments"
              className="inline-block px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
            >
              Schedule Appointment
            </Link>
          </div>
        )}

        {/* Upcoming Appointments */}
        {!data.isEmpty && data.upcomingAppointments.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>📅</span>
              Upcoming Appointments
            </h2>
            <div className="space-y-3">
              {data.upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-gradient-to-r from-green-400/10 to-green-400/5 border border-green-400/30 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">
                        {apt.providerName}
                      </h3>
                      <p className="text-sm text-white/70">{apt.appointmentType}</p>
                      <p className="text-sm text-green-400 mt-1">
                        {new Date(apt.appointmentDate).toLocaleDateString()} at{" "}
                        {new Date(apt.appointmentDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {apt.location && (
                        <p className="text-xs text-white/50 mt-1">
                          📍 {apt.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

        {/* Calendar Events (From Google Calendar) */}
        {calendarConnected && calendarEvents.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                📅 Calendar Events
              </h2>
              <Link
                href="/vault/settings"
                className="text-sm text-blue-400 hover:text-blue-300 transition"
              >
                Manage →
              </Link>
            </div>
            <div className="space-y-3">
              {calendarEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="bg-gradient-to-r from-blue-400/10 to-blue-400/5 border border-blue-400/30 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{event.summary}</h3>
                      <p className="text-sm text-blue-300 mt-1">
                        {new Date(event.startTime).toLocaleDateString()} at{" "}
                        {new Date(event.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-blue-400/20 text-blue-300 rounded text-xs font-medium">
                      From Google Calendar
                    </span>
                  </div>
                  {event.location && (
                    <p className="text-sm text-white/60 mt-2">
                      📍 {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="text-sm text-white/60 mt-2">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40 text-center">
              Calendar events are read-only and filtered for health-related appointments
            </p>
          </div>
        )}

        {/* Calendar Not Connected Banner */}
        {!calendarConnected && (
          <div className="bg-gradient-to-r from-purple-400/10 to-blue-400/10 border border-purple-400/30 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📅</span>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Optional: Connect Your Calendar
                  </h3>
                  <p className="text-white/70 text-sm mb-3">
                    See your Google Calendar appointments here alongside your manual entries. Read-only access—we never modify your calendar.
                  </p>
                  <Link
                    href="/vault/settings"
                    className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition text-sm"
                  >
                    Connect Calendar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
            </div>
          </div>
        )}

        {/* Questions to Ask */}
        {data.questionsToAsk.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>❓</span>
              Questions to Ask
            </h2>
            <div className="space-y-2">
              {data.questionsToAsk.map((q: any, idx: number) => (
                <div
                  key={q.id}
                  className="flex items-start gap-3 p-3 bg-white/5 rounded border border-white/10"
                >
                  <span className="text-blue-400 font-semibold">{idx + 1}.</span>
                  <div className="flex-1">
                    <p className="text-white">{q.question}</p>
                    {q.carePlanTitle && (
                      <p className="text-xs text-white/50 mt-1">
                        From care plan: {q.carePlanTitle}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/vault/priority"
              className="inline-block mt-4 text-sm text-pink-400 hover:text-pink-300 transition-colors"
            >
              + Add more questions →
            </Link>
          </div>
        )}

        {/* Things to Bring */}
        {data.thingsToBring.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>🎒</span>
              Things to Bring
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.thingsToBring.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded border border-white/10"
                >
                  <span className="text-2xl">
                    {item.category === "INSURANCE_CARD"
                      ? "🏥"
                      : item.category === "GOVERNMENT_ID"
                      ? "🪪"
                      : item.category === "REFERRAL"
                      ? "📋"
                      : "✓"}
                  </span>
                  <div>
                    <p className="text-white text-sm">{item.item}</p>
                    {item.isDocument && (
                      <p className="text-xs text-white/50">From your vault</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/vault/priority"
              className="inline-block mt-4 text-sm text-pink-400 hover:text-pink-300 transition-colors"
            >
              + Add items to bring →
            </Link>
          </div>
        )}

        {/* Discussion Items (Care Plan Goals) */}
        {data.discussionItems.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>💬</span>
              Items Worth Discussing
            </h2>
            <div className="space-y-3">
              {data.discussionItems.map((item: any) => (
                <div
                  key={item.id}
                  className="p-4 bg-purple-400/5 rounded border border-purple-400/20"
                >
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.goal}</p>
                  {item.targetDate && (
                    <p className="text-xs text-white/50 mt-2">
                      Target: {new Date(item.targetDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Changes */}
        {data.recentChanges.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>📝</span>
              WhatWhat's Changedapos;s Changed Recently
            </h2>
            <div className="space-y-3">
              {data.recentChanges.map((change: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-white/5 rounded border border-white/10"
                >
                  <p className="text-white">{change.message}</p>
                  {change.type === "documents" && change.documents && (
                    <div className="mt-2 space-y-1">
                      {change.documents.slice(0, 3).map((doc: any) => (
                        <p key={doc.id} className="text-xs text-white/60">
                          • {doc.title}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Follow-ups */}
        {data.pendingFollowUps.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>📞</span>
              Pending Follow-ups
            </h2>
            <div className="space-y-2">
              {data.pendingFollowUps.map((followUp: any) => (
                <div
                  key={followUp.id}
                  className="p-3 bg-white/5 rounded border border-white/10"
                >
                  <p className="text-white">{followUp.task}</p>
                  {followUp.description && (
                    <p className="text-sm text-white/60 mt-1">
                      {followUp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Care Team Context */}
        {data.careTeamContext && data.careTeamContext.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>👥</span>
              Your Care Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.careTeamContext.map((member: any) => (
                <div
                  key={member.id}
                  className="p-3 bg-white/5 rounded border border-white/10"
                >
                  <p className="font-semibold text-white text-sm">
                    {member.name}
                  </p>
                  <p className="text-xs text-white/60">{member.role}</p>
                  {member.isPrimary && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-400/20 text-green-400 text-xs rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
            <Link
              href="/vault/care-team"
              className="inline-block mt-4 text-sm text-pink-400 hover:text-pink-300 transition-colors"
            >
              View full care team →
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/vault/appointments"
            className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-pink-400/30 transition-colors text-center"
          >
            <span className="text-2xl block mb-2">📅</span>
            <span className="text-sm text-white">Appointments</span>
          </Link>
          <Link
            href="/vault/priority"
            className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-pink-400/30 transition-colors text-center"
          >
            <span className="text-2xl block mb-2">✅</span>
            <span className="text-sm text-white">Priorities</span>
          </Link>
          <Link
            href="/vault/documents"
            className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-pink-400/30 transition-colors text-center"
          >
            <span className="text-2xl block mb-2">📄</span>
            <span className="text-sm text-white">Documents</span>
          </Link>
          <Link
            href="/vault/care-plans"
            className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-pink-400/30 transition-colors text-center"
          >
            <span className="text-2xl block mb-2">📋</span>
            <span className="text-sm text-white">Care Plans</span>
          </Link>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchVisitPrep}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
          >
            Refresh Preparation
          </button>
        </div>
      </div>
    </div>
  );
}
