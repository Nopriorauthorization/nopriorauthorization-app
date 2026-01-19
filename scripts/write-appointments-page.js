const fs = require('fs');
const path = require('path');

const appointmentsPageContent = `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Appointment = {
  id: string;
  providerName: string;
  providerSpecialty: string | null;
  appointmentDate: Date;
  appointmentType: string;
  status: string;
  location: string | null;
  notes: string | null;
};

type AppointmentsData = {
  upcoming: Appointment[];
  past: Appointment[];
  byProvider: Record<string, {
    appointments: Appointment[];
    count: number;
    lastVisit: Date | null;
    nextVisit: Date | null;
  }>;
  isEmpty: boolean;
};

export default function AppointmentsPage() {
  const [data, setData] = useState<AppointmentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    providerName: "",
    providerSpecialty: "",
    appointmentDate: "",
    appointmentType: "checkup",
    status: "scheduled",
    location: "",
    notes: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const res = await fetch("/api/vault/appointments");
      if (res.ok) {
        const appointmentsData = await res.json();
        setData(appointmentsData);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingId 
        ? \`/api/vault/appointments/\${editingId}\` 
        : "/api/vault/appointments";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData({
          providerName: "",
          providerSpecialty: "",
          appointmentDate: "",
          appointmentType: "checkup",
          status: "scheduled",
          location: "",
          notes: "",
        });
        fetchAppointments();
      }
    } catch (error) {
      console.error("Failed to save appointment:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const res = await fetch(\`/api/vault/appointments/\${id}\`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  }

  function handleEdit(appointment: Appointment) {
    setEditingId(appointment.id);
    setFormData({
      providerName: appointment.providerName,
      providerSpecialty: appointment.providerSpecialty || "",
      appointmentDate: new Date(appointment.appointmentDate).toISOString().slice(0, 16),
      appointmentType: appointment.appointmentType,
      status: appointment.status,
      location: appointment.location || "",
      notes: appointment.notes || "",
    });
    setShowForm(true);
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(date: Date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-white/10 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-32 bg-white/5 rounded"></div>
              <div className="h-32 bg-white/5 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!data || data.isEmpty) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/vault"
            className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
          >
            ← Back to Sacred Vault
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">📅</span>
            <h1 className="text-4xl md:text-5xl font-semibold">Appointments</h1>
          </div>

          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🗓️</span>
            <p className="text-gray-500 text-lg mb-6">
              No appointments scheduled yet. Start organizing your healthcare visits.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
            >
              Schedule First Appointment
            </button>
          </div>
        </div>
      </main>
    );
  }

  const { upcoming, past, byProvider } = data;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/vault"
          className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
        >
          ← Back to Sacred Vault
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📅</span>
            <h1 className="text-4xl md:text-5xl font-semibold">Appointments</h1>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                providerName: "",
                providerSpecialty: "",
                appointmentDate: "",
                appointmentType: "checkup",
                status: "scheduled",
                location: "",
                notes: "",
              });
            }}
            className="px-4 py-2 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
          >
            + New Appointment
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8 p-6 rounded-xl border border-pink-400/30 bg-pink-400/5">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Appointment" : "Schedule New Appointment"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Provider Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.providerName}
                    onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-pink-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Specialty</label>
                  <input
                    type="text"
                    value={formData.providerSpecialty}
                    onChange={(e) => setFormData({ ...formData, providerSpecialty: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-pink-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-pink-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Type *</label>
                  <select
                    required
                    value={formData.appointmentType}
                    onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-pink-400 focus:outline-none"
                  >
                    <option value="checkup">Checkup</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="consultation">Consultation</option>
                    <option value="procedure">Procedure</option>
                    <option value="lab">Lab Work</option>
                    <option value="imaging">Imaging</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-pink-400 focus:outline-none"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-pink-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-pink-400 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
                >
                  {editingId ? "Update" : "Schedule"} Appointment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-6 py-2 rounded-full bg-white/5 text-white text-sm font-semibold hover:bg-white/10 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Upcoming Appointments */}
        {upcoming.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
            <div className="space-y-3">
              {upcoming.map((apt: any) => (
                <div
                  key={apt.id}
                  className="p-5 rounded-xl border border-green-400/20 bg-green-400/5 hover:bg-green-400/10 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📅</span>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{apt.providerName}</h3>
                          {apt.providerSpecialty && (
                            <p className="text-sm text-gray-400">{apt.providerSpecialty}</p>
                          )}
                        </div>
                      </div>
                      <div className="ml-11 space-y-1">
                        <p className="text-sm text-white">
                          <span className="text-gray-400">Date:</span> {formatDate(apt.appointmentDate)} at {formatTime(apt.appointmentDate)}
                        </p>
                        <p className="text-sm text-white">
                          <span className="text-gray-400">Type:</span> {apt.appointmentType}
                        </p>
                        {apt.location && (
                          <p className="text-sm text-white">
                            <span className="text-gray-400">Location:</span> {apt.location}
                          </p>
                        )}
                        {apt.notes && (
                          <p className="text-sm text-gray-400 mt-2">{apt.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(apt)}
                        className="px-3 py-1 rounded-full text-xs bg-white/5 hover:bg-white/10 text-white transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(apt.id)}
                        className="px-3 py-1 rounded-full text-xs bg-red-400/10 hover:bg-red-400/20 text-red-400 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Appointments */}
        {past.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Past Appointments</h2>
            <div className="space-y-3">
              {past.slice(0, 10).map((apt: any) => (
                <div
                  key={apt.id}
                  className="p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl opacity-50">✓</span>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{apt.providerName}</h3>
                          {apt.providerSpecialty && (
                            <p className="text-sm text-gray-400">{apt.providerSpecialty}</p>
                          )}
                        </div>
                      </div>
                      <div className="ml-11 space-y-1">
                        <p className="text-sm text-gray-400">
                          {formatDate(apt.appointmentDate)} • {apt.appointmentType}
                        </p>
                        {apt.notes && (
                          <p className="text-sm text-gray-500 mt-2">{apt.notes}</p>
                        )}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-400">
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* By Provider Summary */}
        {Object.keys(byProvider).length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">By Provider</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(byProvider).map(([providerName, info]: any) => (
                <div
                  key={providerName}
                  className="p-5 rounded-xl border border-white/10 bg-white/5"
                >
                  <h3 className="font-semibold text-white mb-2">{providerName}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-400">
                      <span className="text-white">{info.count}</span> appointment{info.count !== 1 ? 's' : ''}
                    </p>
                    {info.nextVisit && (
                      <p className="text-green-400">
                        Next: {formatDate(info.nextVisit)}
                      </p>
                    )}
                    {info.lastVisit && (
                      <p className="text-gray-500">
                        Last: {formatDate(info.lastVisit)}
                      </p>
                    )}
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
`;

const targetPath = path.join(process.cwd(), 'src/app/vault/appointments/page.tsx');
fs.writeFileSync(targetPath, appointmentsPageContent, 'utf8');
console.log('✅ Appointments page successfully written to:', targetPath);
