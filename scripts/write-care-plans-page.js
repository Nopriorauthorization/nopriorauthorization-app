const fs = require('fs');
const path = require('path');

const pageContent = `"use client";

import { useState, useEffect } from "react";

type CarePlan = {
  id: string;
  title: string;
  goal: string;
  questionsToAsk: string[];
  linkedDocuments: string[];
  linkedAppointments: string[];
  notes: string | null;
  targetDate: string | null;
  status: string;
  documentCount: number;
  appointmentCount: number;
  questionCount: number;
  createdAt: string;
  updatedAt: string;
};

type CarePlansData = {
  plans: CarePlan[];
  isEmpty: boolean;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
};

export default function CarePlansPage() {
  const [data, setData] = useState<CarePlansData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    goal: "",
    questionsToAsk: [] as string[],
    currentQuestion: "",
    notes: "",
    targetDate: "",
    status: "active",
  });

  useEffect(() => {
    fetchCarePlans();
  }, []);

  const fetchCarePlans = async () => {
    try {
      const res = await fetch("/api/vault/care-plans");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch care plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId
      ? \`/api/vault/care-plans/\${editingId}\`
      : "/api/vault/care-plans";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          goal: formData.goal,
          questionsToAsk: formData.questionsToAsk,
          notes: formData.notes,
          targetDate: formData.targetDate || undefined,
          status: formData.status,
        }),
      });

      if (res.ok) {
        await fetchCarePlans();
        setShowForm(false);
        setEditingId(null);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save care plan:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      goal: "",
      questionsToAsk: [],
      currentQuestion: "",
      notes: "",
      targetDate: "",
      status: "active",
    });
  };

  const handleEdit = (plan: CarePlan) => {
    setFormData({
      title: plan.title,
      goal: plan.goal,
      questionsToAsk: plan.questionsToAsk || [],
      currentQuestion: "",
      notes: plan.notes || "",
      targetDate: plan.targetDate
        ? new Date(plan.targetDate).toISOString().split("T")[0]
        : "",
      status: plan.status,
    });
    setEditingId(plan.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(\`Delete care plan "\${title}"?\`)) return;

    try {
      const res = await fetch(\`/api/vault/care-plans/\${id}\`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchCarePlans();
      }
    } catch (error) {
      console.error("Failed to delete care plan:", error);
    }
  };

  const addQuestion = () => {
    if (formData.currentQuestion.trim()) {
      setFormData({
        ...formData,
        questionsToAsk: [...formData.questionsToAsk, formData.currentQuestion],
        currentQuestion: "",
      });
    }
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      questionsToAsk: formData.questionsToAsk.filter((_, i) => i !== index),
    });
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
        <p className="text-red-400">Failed to load care plans</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Care Plans</h1>
          <p className="text-white/60 text-sm mt-1">
            Track your health goals and prepare for provider visits
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
          {showForm ? "Cancel" : "+ New Care Plan"}
        </button>
      </div>

      {/* Stats */}
      {!data.isEmpty && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">
              {data.stats.total}
            </div>
            <div className="text-sm text-white/60">Total Plans</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {data.stats.active}
            </div>
            <div className="text-sm text-white/60">Active</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {data.stats.completed}
            </div>
            <div className="text-sm text-white/60">Completed</div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-semibold text-white mb-1">
              Patient-Owned Care Planning
            </h3>
            <p className="text-sm text-white/80">
              These are your personal health goals and preparation notes—not
              clinical treatment plans. Use this space to organize questions for
              your providers, track goals, and prepare for appointments.
            </p>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-pink-400/50 rounded-lg p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white">
            {editingId ? "Edit Care Plan" : "Create Care Plan"}
          </h2>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Title <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
              placeholder="e.g., Manage Blood Pressure"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Your Goal <span className="text-pink-400">*</span>
            </label>
            <textarea
              value={formData.goal}
              onChange={(e) =>
                setFormData({ ...formData, goal: e.target.value })
              }
              required
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
              placeholder="What do you want to achieve? (e.g., Lower my blood pressure to under 130/80 through lifestyle changes and medication)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Questions to Ask Your Provider
            </label>
            <div className="space-y-2">
              {formData.questionsToAsk.map((question, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded p-3"
                >
                  <span className="text-sm text-white flex-1">{question}</span>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-400/60 hover:text-red-400 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.currentQuestion}
                  onChange={(e) =>
                    setFormData({ ...formData, currentQuestion: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addQuestion();
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
                  placeholder="Type a question and click Add..."
                />
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) =>
                  setFormData({ ...formData, targetDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:border-pink-400"
              >
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
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
              placeholder="Additional context, progress updates, resources..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
            >
              {editingId ? "Update Plan" : "Create Plan"}
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
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            No care plans yet
          </h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Create personalized care plans to track your health goals and prepare
            for provider visits.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
          >
            Create First Care Plan
          </button>
        </div>
      )}

      {/* Care Plans List */}
      {!data.isEmpty && (
        <div className="space-y-4">
          {/* Active Plans */}
          {data.plans.filter((p) => p.status === "active").length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Active Plans
              </h2>
              <div className="space-y-3">
                {data.plans
                  .filter((p) => p.status === "active")
                  .map((plan) => (
                    <div
                      key={plan.id}
                      className="bg-white/5 border border-white/10 rounded-lg p-5 hover:border-pink-400/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-white">
                              {plan.title}
                            </h3>
                            <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs font-medium rounded uppercase">
                              {plan.status}
                            </span>
                          </div>
                          {plan.targetDate && (
                            <div className="text-sm text-white/60 mb-2">
                              Target:{" "}
                              {new Date(plan.targetDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(plan)}
                            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(plan.id, plan.title)}
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded p-4 mb-3">
                        <div className="text-sm font-medium text-white/80 mb-1">
                          Goal:
                        </div>
                        <p className="text-white">{plan.goal}</p>
                      </div>

                      {plan.questionCount > 0 && (
                        <div className="mb-3">
                          <div className="text-sm font-medium text-white/80 mb-2">
                            Questions to Ask ({plan.questionCount}):
                          </div>
                          <ul className="space-y-1">
                            {plan.questionsToAsk.slice(0, 3).map((q, i) => (
                              <li
                                key={i}
                                className="text-sm text-white/70 flex items-start gap-2"
                              >
                                <span className="text-pink-400 mt-1">•</span>
                                <span>{q}</span>
                              </li>
                            ))}
                            {plan.questionCount > 3 && (
                              <li className="text-sm text-white/50 italic">
                                +{plan.questionCount - 3} more questions
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {plan.notes && (
                        <div className="bg-blue-400/5 border border-blue-400/20 rounded p-3 mb-3">
                          <p className="text-sm text-white/80">{plan.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <span>
                          Created {new Date(plan.createdAt).toLocaleDateString()}
                        </span>
                        {plan.updatedAt !== plan.createdAt && (
                          <span>
                            Updated{" "}
                            {new Date(plan.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Completed & On-Hold Plans */}
          {data.plans.filter((p) => p.status !== "active").length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Completed & On-Hold
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.plans
                  .filter((p) => p.status !== "active")
                  .map((plan) => (
                    <div
                      key={plan.id}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 opacity-75 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">
                            {plan.title}
                          </h3>
                          <span
                            className={
                              plan.status === "completed"
                                ? "text-xs text-purple-400"
                                : "text-xs text-yellow-400"
                            }
                          >
                            {plan.status === "completed"
                              ? "✓ Completed"
                              : "⏸ On Hold"}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(plan)}
                            className="text-xs text-white/60 hover:text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(plan.id, plan.title)}
                            className="text-xs text-red-400/60 hover:text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-white/70 line-clamp-2">
                        {plan.goal}
                      </p>
                      {plan.questionCount > 0 && (
                        <div className="text-xs text-white/50 mt-2">
                          {plan.questionCount} question
                          {plan.questionCount !== 1 ? "s" : ""}
                        </div>
                      )}
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
`;

const outputPath = path.join(__dirname, '../src/app/vault/care-plans/page.tsx');
const dir = path.dirname(outputPath);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, pageContent, 'utf8');
console.log('✅ Care Plans page successfully written to', outputPath);
