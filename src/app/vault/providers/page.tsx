"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import Link from "next/link";

type Provider = {
  id: string;
  name: string;
  specialty: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  tags: string[];
  createdAt: string;
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

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [appointments, setAppointments] = useState<GroupedAppointments>({
    upcoming: [],
    past: [],
    byProvider: {}
  });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    email: "",
    address: "",
    notes: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [providersRes, appointmentsRes] = await Promise.all([
        fetch("/api/vault/providers"),
        fetch("/api/vault/appointments")
      ]);
      
      if (providersRes.ok) {
        const data = await providersRes.json();
        setProviders(data.providers || []);
      }
      
      if (appointmentsRes.ok) {
        const data = await appointmentsRes.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const method = editingProvider ? "PUT" : "POST";
      const url = editingProvider 
        ? `/api/vault/providers/${editingProvider.id}`
        : "/api/vault/providers";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setFormData({ name: "", specialty: "", phone: "", email: "", address: "", notes: "" });
        setShowAddForm(false);
        setEditingProvider(null);
        fetchData();
      }
    } catch (error) {
      console.error("Failed to save provider:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this provider?")) return;
    
    try {
      const res = await fetch(`/api/vault/providers/${id}`, {
        method: "DELETE"
      });
      
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete provider:", error);
    }
  }

  function handleEdit(provider: Provider) {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      specialty: provider.specialty || "",
      phone: provider.phone || "",
      email: provider.email || "",
      address: provider.address || "",
      notes: provider.notes || ""
    });
    setShowAddForm(true);
  }

  function handleCancelEdit() {
    setEditingProvider(null);
    setFormData({ name: "", specialty: "", phone: "", email: "", address: "", notes: "" });
    setShowAddForm(false);
  }

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

        {/* Add/Edit Provider Form */}
        {showAddForm && (
          <div className="mb-8 p-6 rounded-2xl border border-pink-400/30 bg-pink-400/5">
            <h3 className="text-xl font-semibold mb-4">
              {editingProvider ? "Edit Provider" : "Add New Provider"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Provider Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Jane Smith"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Specialty
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="Dermatology, Plastic Surgery, etc."
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="doctor@example.com"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Medical Center Dr, Suite 100"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any important information about this provider..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-pink-400 text-black font-medium hover:bg-pink-500 transition"
                >
                  {editingProvider ? "Update Provider" : "Add Provider"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Providers List */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span>👥</span> Your Provider Network
          </h2>
          
          {providers.length === 0 ? (
            <div className="bg-white/5 rounded-lg p-8 text-center">
              <p className="text-white/60 mb-4">
                No providers found yet. Add your first provider to start building your care team.
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
              {providers.map((provider) => {
                const providerData = appointments.byProvider[provider.name];
                return (
                  <div
                    key={provider.id}
                    className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-white/10 hover:border-purple-400/30 transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{provider.name}</h3>
                        {provider.specialty && (
                          <p className="text-white/60">{provider.specialty}</p>
                        )}
                      </div>
                      {providerData && (
                        <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                          {providerData.count} visits
                        </span>
                      )}
                    </div>
                    
                    {provider.phone && (
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span>📞</span>
                        <span>{provider.phone}</span>
                      </div>
                    )}
                    
                    {provider.email && (
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span>📧</span>
                        <span>{provider.email}</span>
                      </div>
                    )}
                    
                    {provider.address && (
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span>📍</span>
                        <span>{provider.address}</span>
                      </div>
                    )}
                    
                    <div className="space-y-3 mb-4 mt-4">
                      {providerData?.nextVisit && (
                        <div className="flex items-center gap-2 text-sm">
                          <span>🔜</span>
                          <span className="text-green-300">Next:</span>
                          <span>{formatDate(providerData.nextVisit)}</span>
                        </div>
                      )}
                      {providerData?.lastVisit && (
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <span>📅</span>
                          <span>Last visit:</span>
                          <span>{formatDate(providerData.lastVisit)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(provider)}
                        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(provider.id)}
                        className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
