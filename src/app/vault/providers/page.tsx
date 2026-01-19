"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Provider = {
  id: string;
  name: string;
  specialty: string;
  phone?: string;
  email?: string;
  address?: string;
  lastVisit?: string;
  notes?: string;
  rating?: number;
  tags?: string[];
};

type AppointmentWithProvider = {
  id: string;
  providerName: string;
  providerSpecialty: string | null;
  appointmentDate: Date;
  appointmentType: string;
  status: string;
  location: string | null;
  notes: string | null;
};

type GroupedAppointments = {
  upcoming: AppointmentWithProvider[];
  past: AppointmentWithProvider[];
  byProvider: Record<string, {
    appointments: AppointmentWithProvider[];
    count: number;
    lastVisit: Date | null;
    nextVisit: Date | null;
  }>;
};

// Function to get appointment type emoji
function getAppointmentIcon(type: string): string {
  const icons: Record<string, string> = {
    'checkup': '🩺',
    'follow-up': '🔄',
    'consultation': '💬',
    'procedure': '⚕️',
    'lab': '🧪',
    'imaging': '📊',
    'other': '📅'
  };
  return icons[type.toLowerCase()] || '📅';
}

// Function to format date
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

// Function to format time
function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

export default function ProvidersPage() {
  const [providers] = useState<Provider[]>([]);
  const [appointments, setAppointments] = useState<GroupedAppointments>({
    upcoming: [],
    past: [],
    byProvider: {}
  });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("/api/vault/appointments");
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-white/10 rounded w-2/3 mb-8"></div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-40 bg-white/5 rounded-lg"></div>
              <div className="h-40 bg-white/5 rounded-lg"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/vault"
            className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
          >
            ← Back to Sacred Vault
          </Link>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">👩‍⚕️</span>
              <h1 className="text-4xl md:text-5xl font-semibold">
                My Providers Hub
              </h1>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
            >
              + Add Provider
            </button>
          </div>
          <p className="text-gray-400 text-lg">
            Your complete provider directory — appointments, visits, and care coordination.
          </p>
        </div>

        {/* Add Provider Form */}
        {showAddForm && (
          <div className="mb-8 p-6 rounded-2xl border border-pink-400/30 bg-pink-400/5">
            <h3 className="text-xl font-semibold mb-4">Add New Provider</h3>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Provider Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Jane Smith"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Specialty *
                  </label>
                  <input
                    type="text"
                    placeholder="Dermatology, Plastic Surgery, etc."
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-pink-400 text-black font-medium hover:bg-pink-500 transition"
                >
                  Add Provider
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Upcoming Appointments */}
        {appointments.upcoming.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span>📅</span> Upcoming Appointments
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {appointments.upcoming.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg p-6 border border-white/10 hover:border-green-400/30 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getAppointmentIcon(apt.appointmentType)}</span>
                      <div>
                        <h3 className="font-semibold">{apt.providerName}</h3>
                        <p className="text-sm text-white/60">{apt.providerSpecialty}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      {apt.status}
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span>📅</span>
                      <span>{formatDate(apt.appointmentDate)}</span>
                      <span className="text-white/60">at {formatTime(apt.appointmentDate)}</span>
                    </div>
                    {apt.location && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <span>📍</span>
                        <span>{apt.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm bg-white/5 rounded px-3 py-2">
                    <span className="text-white/60">Type:</span> {apt.appointmentType}
                  </div>
                  {apt.notes && (
                    <div className="text-sm text-white/60 mt-2">
                      <span className="text-white/80">Notes:</span> {apt.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Providers by Visit History */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span>👥</span> Your Provider Network
          </h2>
          
          {Object.keys(appointments.byProvider).length === 0 ? (
            <div className="bg-white/5 rounded-lg p-8 text-center">
              <p className="text-white/60 mb-4">
                No appointments found yet. Add your first provider above or schedule an appointment.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
              >
                Add Your First Provider
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(appointments.byProvider).map(([providerName, data]) => (
                <div
                  key={providerName}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-white/10 hover:border-purple-400/30 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{providerName}</h3>
                      {data.appointments[0]?.providerSpecialty && (
                        <p className="text-white/60">{data.appointments[0].providerSpecialty}</p>
                      )}
                    </div>
                    <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                      {data.count} visits
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {data.nextVisit && (
                      <div className="flex items-center gap-2 text-sm">
                        <span>🔜</span>
                        <span className="text-green-300">Next:</span>
                        <span>{formatDate(data.nextVisit)}</span>
                      </div>
                    )}
                    {data.lastVisit && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <span>📅</span>
                        <span>Last visit:</span>
                        <span>{formatDate(data.lastVisit)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition">
                      View History
                    </button>
                    <button className="text-xs bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 px-3 py-1 rounded transition">
                      Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Visit History */}
        {appointments.past.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span>🏥</span> Recent Visits
            </h2>
            <div className="space-y-3">
              {appointments.past.slice(0, 5).map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{getAppointmentIcon(apt.appointmentType)}</span>
                    <div>
                      <div className="font-medium">{apt.providerName}</div>
                      <div className="text-sm text-white/60">
                        {apt.appointmentType} • {formatDate(apt.appointmentDate)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      apt.status === 'completed' 
                        ? 'bg-green-500/20 text-green-300'
                        : apt.status === 'cancelled' 
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}