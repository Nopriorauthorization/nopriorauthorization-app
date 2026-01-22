"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react";

type Provider = {
  id: string;
  name: string;
  specialty: string | null;
  phone: string | null;
  email: string | null;
};

type CareTeamMember = {
  id: string;
  name: string;
  role: string;
  specialty: string | null;
  organization: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  isPrimary: boolean;
  linkedProviders: string[];
  providers: Provider[];
  appointmentCount: number;
  createdAt: string;
};

type CareTeamData = {
  members: CareTeamMember[];
  isEmpty: boolean;
  stats: {
    total: number;
    hasPrimary: boolean;
    specialistCount: number;
  };
};

export default function CareTeamPage() {
  const [data, setData] = useState<CareTeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    specialty: "",
    organization: "",
    phone: "",
    email: "",
    notes: "",
    isPrimary: false,
  });

  useEffect(() => {
    fetchCareTeam();
  }, []);

  const fetchCareTeam = async () => {
    try {
      const res = await fetch("/api/vault/care-team");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch care team:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId
      ? `/api/vault/care-team/${editingId}`
      : "/api/vault/care-team";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchCareTeam();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          name: "",
          role: "",
          specialty: "",
          organization: "",
          phone: "",
          email: "",
          notes: "",
          isPrimary: false,
        });
      }
    } catch (error) {
      console.error("Failed to save care team member:", error);
    }
  };

  const handleEdit = (member: CareTeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      specialty: member.specialty || "",
      organization: member.organization || "",
      phone: member.phone || "",
      email: member.email || "",
      notes: member.notes || "",
      isPrimary: member.isPrimary,
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from your care team?`)) return;

    try {
      const res = await fetch(`/api/vault/care-team/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchCareTeam();
      }
    } catch (error) {
      console.error("Failed to delete care team member:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3"></div>
          <div className="h-32 bg-white/5 rounded"></div>
          <div className="h-32 bg-white/5 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-red-400">Failed to load care team</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Care Team</h1>
          <p className="text-white/60 text-sm mt-1">
            Coordinate your healthcare team and track provider relationships
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: "",
              role: "",
              specialty: "",
              organization: "",
              phone: "",
              email: "",
              notes: "",
              isPrimary: false,
            });
          }}
          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Team Member"}
        </button>
      </div>

      {/* Stats */}
      {!data.isEmpty && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">
              {data.stats.total}
            </div>
            <div className="text-sm text-white/60">Total Team Members</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {data.stats.hasPrimary ? "Yes" : "No"}
            </div>
            <div className="text-sm text-white/60">Primary Care Provider</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {data.stats.specialistCount}
            </div>
            <div className="text-sm text-white/60">Specialists</div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-pink-400/50 rounded-lg p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white">
            {editingId ? "Edit Team Member" : "Add Team Member"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Name <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
                placeholder="Dr. Sarah Johnson"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Role <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
                placeholder="Primary Care Physician"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Specialty
              </label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
                placeholder="Internal Medicine"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Organization
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
                placeholder="City Medical Center"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
                placeholder="doctor@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
              placeholder="Coordination notes, accessibility info, etc."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrimary"
              checked={formData.isPrimary}
              onChange={(e) =>
                setFormData({ ...formData, isPrimary: e.target.checked })
              }
              className="w-4 h-4 text-pink-500 bg-white/5 border-white/20 rounded focus:ring-pink-400"
            />
            <label htmlFor="isPrimary" className="text-sm text-white/80">
              This is my primary care provider
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
            >
              {editingId ? "Update Member" : "Add Member"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Empty State */}
      {data.isEmpty && !showForm && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            No care team members yet
          </h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Build your healthcare team by adding providers, specialists, and
            care coordinators.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
          >
            Add First Team Member
          </button>
        </div>
      )}

      {/* Care Team Members */}
      {!data.isEmpty && (
        <div className="space-y-4">
          {/* Primary Care Provider */}
          {data.members.filter((m) => m.isPrimary).length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Primary Care Provider
              </h2>
              {data.members
                .filter((m) => m.isPrimary)
                .map((member) => (
                  <div
                    key={member.id}
                    className="bg-gradient-to-br from-green-400/10 to-green-400/5 border border-green-400/30 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">
                            {member.name}
                          </h3>
                          <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs font-medium rounded">
                            PRIMARY
                          </span>
                        </div>
                        <p className="text-white/80 mb-3">{member.role}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {member.specialty && (
                            <div>
                              <span className="text-white/60">Specialty:</span>
                              <span className="text-white ml-2">
                                {member.specialty}
                              </span>
                            </div>
                          )}
                          {member.organization && (
                            <div>
                              <span className="text-white/60">
                                Organization:
                              </span>
                              <span className="text-white ml-2">
                                {member.organization}
                              </span>
                            </div>
                          )}
                          {member.phone && (
                            <div>
                              <span className="text-white/60">Phone:</span>
                              <span className="text-white ml-2">
                                {member.phone}
                              </span>
                            </div>
                          )}
                          {member.email && (
                            <div>
                              <span className="text-white/60">Email:</span>
                              <span className="text-white ml-2">
                                {member.email}
                              </span>
                            </div>
                          )}
                        </div>

                        {member.notes && (
                          <div className="mt-3 p-3 bg-white/5 rounded border border-white/10">
                            <p className="text-sm text-white/80">
                              {member.notes}
                            </p>
                          </div>
                        )}

                        {member.appointmentCount > 0 && (
                          <div className="mt-3 text-sm text-white/60">
                            {member.appointmentCount} appointment
                            {member.appointmentCount !== 1 ? "s" : ""} on record
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(member)}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Specialists & Other Team Members */}
          {data.members.filter((m) => !m.isPrimary).length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Specialists & Care Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.members
                  .filter((m) => !m.isPrimary)
                  .map((member) => (
                    <div
                      key={member.id}
                      className="bg-white/5 border border-white/10 rounded-lg p-5 hover:border-pink-400/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">
                            {member.name}
                          </h3>
                          <p className="text-sm text-white/70">{member.role}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="text-xs text-white/60 hover:text-white transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(member.id, member.name)
                            }
                            className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        {member.specialty && (
                          <div className="text-white/60">
                            {member.specialty}
                          </div>
                        )}
                        {member.organization && (
                          <div className="text-white/60">
                            {member.organization}
                          </div>
                        )}
                        {member.phone && (
                          <div className="text-white/80">{member.phone}</div>
                        )}
                        {member.email && (
                          <div className="text-white/80">{member.email}</div>
                        )}
                        {member.appointmentCount > 0 && (
                          <div className="text-white/50 text-xs mt-2">
                            {member.appointmentCount} appointment
                            {member.appointmentCount !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
