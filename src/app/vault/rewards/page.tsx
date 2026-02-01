"use client";
export const dynamic = 'force-dynamic';
import { useState } from "react";
import Link from "next/link";

type RewardProgram = {
  id: string;
  name: string;
  brand: "alle" | "evolve" | "aspire" | "other";
  accountNumber?: string;
  currentPoints: number;
  expiringPoints?: number;
  expirationDate?: string;
  lastUpdated: string;
  notes?: string;
};

const PROGRAM_INFO = {
  alle: {
    name: "Allē",
    color: "from-purple-500 to-pink-500",
    icon: "💜",
    treatments: "Botox, Juvéderm, Kybella, CoolSculpting",
  },
  evolve: {
    name: "Evolve",
    color: "from-blue-500 to-cyan-500",
    icon: "💙",
    treatments: "Jeuveau",
  },
  aspire: {
    name: "Aspire",
    color: "from-green-500 to-emerald-500",
    icon: "💚",
    treatments: "Dysport, Restylane",
  },
  other: {
    name: "Other",
    color: "from-gray-500 to-gray-600",
    icon: "🎁",
    treatments: "Custom program",
  },
};

export default function RewardsPage() {
  const [programs, setPrograms] = useState<RewardProgram[]>([
    // Placeholder - will be from DB
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<keyof typeof PROGRAM_INFO>("alle");

  const totalPoints = programs.reduce((sum, p) => sum + p.currentPoints, 0);
  const expiringTotal = programs.reduce(
    (sum, p) => sum + (p.expiringPoints || 0),
    0
  );

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
              <span className="text-4xl">🎁</span>
              <h1 className="text-4xl md:text-5xl font-semibold">
                Rewards Tracker
              </h1>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
            >
              + Add Program
            </button>
          </div>
          <p className="text-gray-400 text-lg">
            All your loyalty programs in one place — with expiration alerts so you
            never lose points.
          </p>
        </div>

        {/* Summary Cards */}
        {programs.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-6">
              <p className="text-sm text-white/70 mb-2">Total Points</p>
              <p className="text-4xl font-bold">{totalPoints.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6">
              <p className="text-sm text-white/70 mb-2">Expiring Soon</p>
              <p className="text-4xl font-bold text-orange-400">
                {expiringTotal.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6">
              <p className="text-sm text-white/70 mb-2">Active Programs</p>
              <p className="text-4xl font-bold">{programs.length}</p>
            </div>
          </div>
        )}

        {/* Add Program Form */}
        {showAddForm && (
          <div className="mb-8 p-6 rounded-2xl border border-pink-400/30 bg-pink-400/5">
            <h3 className="text-xl font-semibold mb-4">Add Rewards Program</h3>
            <form className="space-y-4">
              {/* Program Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Select Program *
                </label>
                <div className="grid gap-3 sm:grid-cols-4">
                  {(Object.keys(PROGRAM_INFO) as Array<keyof typeof PROGRAM_INFO>).map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setSelectedBrand(brand)}
                      className={`p-4 rounded-xl border-2 transition ${
                        selectedBrand === brand
                          ? "border-pink-400 bg-pink-400/10"
                          : "border-white/10 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <div className="text-3xl mb-2">
                        {PROGRAM_INFO[brand].icon}
                      </div>
                      <div className="text-sm font-semibold">
                        {PROGRAM_INFO[brand].name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Account/Member Number
                  </label>
                  <input
                    type="text"
                    placeholder="Optional"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Points *
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expiring Points
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Notes (Private)
                </label>
                <textarea
                  rows={2}
                  placeholder="Reminder: Use points before summer..."
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-pink-400 text-black font-semibold hover:bg-pink-500 transition"
                >
                  Save Program
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Programs List */}
        {programs.length > 0 ? (
          <div className="space-y-4">
            {programs.map((program) => {
              const info = PROGRAM_INFO[program.brand];
              const hasExpiring = program.expiringPoints && program.expiringPoints > 0;

              return (
                <div
                  key={program.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-pink-400/30 transition"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center text-3xl`}>
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{info.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {info.treatments}
                        </p>
                        {program.accountNumber && (
                          <p className="text-xs text-gray-500 mt-1">
                            Account: {program.accountNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">
                        {program.currentPoints.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>

                  {hasExpiring && (
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">⚠️</span>
                          <div>
                            <p className="text-sm font-semibold text-orange-400">
                              {program.expiringPoints!.toLocaleString()} points
                              expiring
                            </p>
                            <p className="text-xs text-orange-400/70">
                              {program.expirationDate}
                            </p>
                          </div>
                        </div>
                        <button className="px-3 py-1 rounded-full bg-orange-400 text-black text-xs font-semibold hover:bg-orange-500 transition">
                          Redeem Now
                        </button>
                      </div>
                    </div>
                  )}

                  {program.notes && (
                    <p className="text-sm text-gray-400 italic mb-4">
                      {program.notes}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition">
                      Update Points
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-pink-400/10 text-pink-400 text-sm font-semibold hover:bg-pink-400/20 transition">
                      View History
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Last updated: {program.lastUpdated}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5">
            <span className="text-6xl mb-4 block">🎁</span>
            <p className="text-gray-400 text-lg mb-2">
              No rewards programs added yet.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Track Allē, Evolve, Aspire, and other loyalty programs in one place.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-block px-6 py-3 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
            >
              Add Your First Program
            </button>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-8 p-6 rounded-xl border border-white/10 bg-white/5">
          <p className="text-sm text-gray-400">
            <strong className="text-white">Never lose points again:</strong> Set
            expiration dates and we'll alert you before points expire. All data is
            encrypted and private to you.
          </p>
        </div>
      </div>
    </main>
  );
}
