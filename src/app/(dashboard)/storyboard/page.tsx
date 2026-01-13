"use client";

import { useState } from "react";
import Link from "next/link";
import Providers from "@/components/layout/providers";
import Header from "@/components/layout/header";
import DashboardNav from "@/components/layout/nav";

type TreatmentStatus = "current" | "past" | "considering";
type TreatmentCategory = "treatment" | "medication" | "supplement" | "peptide";

type TreatmentItem = {
  id: string;
  name: string;
  category: TreatmentCategory;
  status: TreatmentStatus;
  addedAt: string;
  insights: Array<{ expert: string; text: string }>;
  notes: string;
};

export default function StoryboardPage() {
  const [snapshot, setSnapshot] = useState({
    ageRange: "",
    goals: "",
    allergies: "",
    meds: "",
    conditions: "",
    preferences: "",
  });
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [newTreatment, setNewTreatment] = useState({
    name: "",
    category: "treatment" as TreatmentCategory,
    status: "current" as TreatmentStatus,
    notes: "",
  });

  const hasContent =
    Object.values(snapshot).some((value) => value.trim().length > 0) ||
    treatments.length > 0;

  const addTreatment = () => {
    if (!newTreatment.name.trim()) return;
    const item: TreatmentItem = {
      id: crypto.randomUUID(),
      name: newTreatment.name.trim(),
      category: newTreatment.category,
      status: newTreatment.status,
      addedAt: new Date().toISOString(),
      insights: [],
      notes: newTreatment.notes.trim(),
    };
    setTreatments((prev) => [item, ...prev]);
    setNewTreatment({
      name: "",
      category: "treatment",
      status: "current",
      notes: "",
    });
  };

  const removeTreatment = (id: string) => {
    setTreatments((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold">
              My Storyboard
            </h1>
            <p className="mt-2 text-gray-500">
              Your personal health story — built over time, one question at a
              time.
            </p>
          </header>

          {!hasContent && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                This is where your health journey will live.
              </h2>
              <p className="mt-3 text-gray-500">
                As you ask questions, save insights, and explore topics, your
                Storyboard will grow with you — so you never have to start over.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/chat"
                  className="px-5 py-2.5 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition"
                >
                  Start Asking Questions
                </Link>
                <a
                  href="#health-snapshot"
                  className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:border-black hover:text-black transition"
                >
                  Add Your Preferences
                </a>
              </div>
            </div>
          )}

          <section id="health-snapshot" className="mt-10 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                My Health Snapshot
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Optional, user-declared context. Educational use only — not a
                medical record.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-gray-600">
                Age range
                <select
                  value={snapshot.ageRange}
                  onChange={(e) =>
                    setSnapshot((prev) => ({ ...prev, ageRange: e.target.value }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="">Select</option>
                  <option value="18-24">18–24</option>
                  <option value="25-34">25–34</option>
                  <option value="35-44">35–44</option>
                  <option value="45-54">45–54</option>
                  <option value="55-64">55–64</option>
                  <option value="65+">65+</option>
                </select>
              </label>
              <label className="text-sm text-gray-600">
                Goals
                <input
                  value={snapshot.goals}
                  onChange={(e) =>
                    setSnapshot((prev) => ({ ...prev, goals: e.target.value }))
                  }
                  placeholder="What do you want to improve or understand?"
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm text-gray-600">
                Allergies
                <input
                  value={snapshot.allergies}
                  onChange={(e) =>
                    setSnapshot((prev) => ({ ...prev, allergies: e.target.value }))
                  }
                  placeholder="Optional"
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm text-gray-600">
                Current meds or supplements
                <input
                  value={snapshot.meds}
                  onChange={(e) =>
                    setSnapshot((prev) => ({ ...prev, meds: e.target.value }))
                  }
                  placeholder="Optional"
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm text-gray-600 md:col-span-2">
                Conditions or considerations
                <input
                  value={snapshot.conditions}
                  onChange={(e) =>
                    setSnapshot((prev) => ({ ...prev, conditions: e.target.value }))
                  }
                  placeholder="Optional"
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm text-gray-600 md:col-span-2">
                Preferences
                <input
                  value={snapshot.preferences}
                  onChange={(e) =>
                    setSnapshot((prev) => ({ ...prev, preferences: e.target.value }))
                  }
                  placeholder="Your boundaries, comfort level, or priorities"
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </section>

          <section className="mt-12 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                My Treatments & Meds
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                A personal reference for what you&apos;ve tried, what you&apos;re
                using, and what you&apos;re exploring — with expert insight
                attached.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-semibold text-gray-800">
                  Add a Treatment or Med
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={addTreatment}
                    className="px-5 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition"
                  >
                    Add to My Storyboard
                  </button>
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold hover:border-black hover:text-black transition"
                  >
                    Add from a past conversation
                  </button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1.2fr_0.6fr]">
                <label className="text-sm text-gray-600">
                  Item name
                  <input
                    value={newTreatment.name}
                    onChange={(e) =>
                      setNewTreatment((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g., Botox, GLP-1, Laser, Supplements"
                    className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm text-gray-600">
                  Category
                  <select
                    value={newTreatment.category}
                    onChange={(e) =>
                      setNewTreatment((prev) => ({
                        ...prev,
                        category: e.target.value as TreatmentCategory,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="treatment">Treatment</option>
                    <option value="medication">Medication</option>
                    <option value="supplement">Supplement</option>
                    <option value="peptide">Peptide</option>
                  </select>
                </label>
                <label className="text-sm text-gray-600">
                  Status
                  <select
                    value={newTreatment.status}
                    onChange={(e) =>
                      setNewTreatment((prev) => ({
                        ...prev,
                        status: e.target.value as TreatmentStatus,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="current">Current</option>
                    <option value="past">Past</option>
                    <option value="considering">Considering</option>
                  </select>
                </label>
              </div>
              <label className="text-sm text-gray-600">
                Notes
                <textarea
                  value={newTreatment.notes}
                  onChange={(e) =>
                    setNewTreatment((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Anything you want to remember"
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  rows={3}
                />
              </label>
            </div>

            {treatments.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
                This is your personal reference space. As you explore treatments,
                meds, or supplements, you can save what matters here — so
                nothing gets lost.
              </div>
            ) : (
              <div className="space-y-4">
                {treatments.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-gray-200 bg-white p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400">
                          <span className="rounded-full border border-gray-200 px-3 py-1">
                            {item.category}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 ${
                              item.status === "current"
                                ? "bg-emerald-50 text-emerald-700"
                                : item.status === "past"
                                  ? "bg-gray-100 text-gray-600"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTreatment(item.id)}
                        className="text-sm text-gray-500 hover:text-black"
                      >
                        Remove
                      </button>
                    </div>
                    {item.notes && (
                      <p className="mt-3 text-sm text-gray-600">
                        Notes: {item.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        <DashboardNav />
      </div>
    </Providers>
  );
}
