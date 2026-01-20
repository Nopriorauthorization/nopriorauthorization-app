"use client";

import { useState, useEffect } from "react";

type Priority = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  linkedAppointment: string | null;
  linkedCareTeam: string | null;
  linkedCarePlan: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
};

type PriorityData = {
  priorities: Priority[];
  isEmpty: boolean;
  stats: {
    total: number;
    active: number;
    completed: number;
    byType: {
      question: number;
      bringItem: number;
      followUp: number;
      other: number;
    };
  };
};

export const dynamic = "force-dynamic";

const PRIORITY_TYPES = [
  { value: "question", label: "Questions to Ask", icon: "❓", color: "blue" },
  { value: "bring-item", label: "Things to Bring", icon: "🎒", color: "green" },
  { value: "follow-up", label: "Pending Follow-ups", icon: "📞", color: "purple" },
  { value: "other", label: "Other", icon: "📌", color: "pink" },
];

export default function PriorityPage() {
  const [data, setData] = useState<PriorityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "question",
    dueDate: "",
  });

  useEffect(() => {
    fetchPriorities();
  }, []);

  const emptyPriorityData: PriorityData = {
    priorities: [],
    isEmpty: true,
    stats: {
      total: 0,
      active: 0,
      completed: 0,
      byType: {
        question: 0,
        bringItem: 0,
        followUp: 0,
        other: 0,
      },
    },
  };

  const fetchPriorities = async () => {
    try {
      const res = await fetch("/api/vault/priority");

      if (res.status === 401 || res.status === 403) {
        setData(emptyPriorityData);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch priorities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId
      ? `/api/vault/priority/${editingId}`
      : "/api/vault/priority";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          dueDate: formData.dueDate || undefined,
        }),
      });

      if (res.ok) {
        await fetchPriorities();
        setShowForm(false);
        setEditingId(null);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save priority:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "question",
      dueDate: "",
    });
  };

  const handleEdit = (priority: Priority) => {
    setFormData({
      title: priority.title,
      description: priority.description || "",
      type: priority.type,
      dueDate: priority.dueDate
        ? new Date(priority.dueDate).toISOString().split("T")[0]
        : "",
    });
    setEditingId(priority.id);
    setShowForm(true);
  };

  const handleComplete = async (id: string) => {
    try {
      const res = await fetch(`/api/vault/priority/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (res.ok) {
        await fetchPriorities();
      }
    } catch (error) {
      console.error("Failed to complete priority:", error);
    }
  };

  const handleReopen = async (id: string) => {
    try {
      const res = await fetch(`/api/vault/priority/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });
      if (res.ok) {
        await fetchPriorities();
      }
    } catch (error) {
      console.error("Failed to reopen priority:", error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/vault/priority/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchPriorities();
      }
    } catch (error) {
      console.error("Failed to delete priority:", error);
    }
  };

  const getTypeInfo = (type: string) => {
    return PRIORITY_TYPES.find((t) => t.value === type) || PRIORITY_TYPES[3];
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
        <p className="text-red-400">Failed to load priorities</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Care Priorities</h1>
          <p className="text-white/60 text-sm mt-1">
            Track what you need to bring, ask, or follow up on for your care
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            resetForm();
          }}
          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Priority"}
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <h3 className="font-semibold text-white mb-1">
              Healthcare Task Tracking
            </h3>
            <p className="text-sm text-white/80">
              This is not a productivity tool—it's for keeping track of healthcare-specific tasks like questions for your provider, items to bring to appointments, or pending follow-ups.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {!data.isEmpty && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">
              {data.stats.byType.question}
            </div>
            <div className="text-sm text-white/60">Questions</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {data.stats.byType.bringItem}
            </div>
            <div className="text-sm text-white/60">To Bring</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {data.stats.byType.followUp}
            </div>
            <div className="text-sm text-white/60">Follow-ups</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-pink-400">
              {data.stats.active}
            </div>
            <div className="text-sm text-white/60">Active</div>
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
            {editingId ? "Edit Priority" : "Add Priority"}
          </h2>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              What do you need to track? <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
              placeholder="e.g., Ask about side effects of new medication"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Type <span className="text-pink-400">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-pink-400"
            >
              {PRIORITY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Additional Details
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
              placeholder="Any additional context..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-pink-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
            >
              {editingId ? "Update" : "Add Priority"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                resetForm();
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
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            No priorities yet
          </h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Add your first priority to keep track of questions, things to bring, or follow-ups for your care.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
          >
            Add First Priority
          </button>
        </div>
      )}

      {/* Active Priorities */}
      {!data.isEmpty && (
        <div className="space-y-6">
          {/* Active Priorities */}
          {data.priorities.filter((p) => p.status === "active").length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Active Priorities ({data.stats.active})
              </h2>
              <div className="space-y-3">
                {data.priorities
                  .filter((p) => p.status === "active")
                  .map((priority) => {
                    const typeInfo = getTypeInfo(priority.type);
                    return (
                      <div
                        key={priority.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-pink-400/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{typeInfo.icon}</span>
                              <h3 className="font-semibold text-white">
                                {priority.title}
                              </h3>
                              <span
                                className={`px-2 py-1 bg-${typeInfo.color}-400/20 text-${typeInfo.color}-400 text-xs font-medium rounded`}
                              >
                                {typeInfo.label}
                              </span>
                            </div>

                            {priority.description && (
                              <p className="text-sm text-white/70 mb-2">
                                {priority.description}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-white/50">
                              {priority.dueDate && (
                                <span>
                                  Due: {new Date(priority.dueDate).toLocaleDateString()}
                                </span>
                              )}
                              <span>
                                Added {new Date(priority.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleComplete(priority.id)}
                              className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm rounded transition-colors"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleEdit(priority)}
                              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(priority.id, priority.title)
                              }
                              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Completed Priorities */}
          {data.priorities.filter((p) => p.status === "completed").length >
            0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Completed ({data.stats.completed})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.priorities
                  .filter((p) => p.status === "completed")
                  .map((priority) => {
                    const typeInfo = getTypeInfo(priority.type);
                    return (
                      <div
                        key={priority.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl line-through opacity-50">
                              {typeInfo.icon}
                            </span>
                            <h3 className="font-medium text-white line-through">
                              {priority.title}
                            </h3>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleReopen(priority.id)}
                              className="text-xs text-white/60 hover:text-white"
                            >
                              Reopen
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(priority.id, priority.title)
                              }
                              className="text-xs text-red-400/60 hover:text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        {priority.completedAt && (
                          <div className="text-xs text-white/50">
                            ✓ Completed{" "}
                            {new Date(priority.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
