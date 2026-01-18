"use client";

import { useState } from "react";
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

export default function ProvidersPage() {
  const [providers] = useState<Provider[]>([
    // Placeholder data - will be populated from Blueprint
  ]);
  const [showAddForm, setShowAddForm] = useState(false);

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
            Your complete provider directory — timestamped visits, contact info,
            and private notes.
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
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
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
                    placeholder="provider@clinic.com"
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
                  placeholder="123 Main St, City, State 12345"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Notes (Private)
                </label>
                <textarea
                  rows={3}
                  placeholder="Great bedside manner, always on time, explains everything..."
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-pink-400 text-black font-semibold hover:bg-pink-500 transition"
                >
                  Save Provider
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

        {/* Providers List */}
        {providers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-pink-400/30 hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{provider.name}</h3>
                    <p className="text-sm text-pink-400 mt-1">
                      {provider.specialty}
                    </p>
                  </div>
                  {provider.rating && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < provider.rating!
                              ? "text-pink-400"
                              : "text-white/20"
                          }
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {provider.phone && (
                  <p className="text-sm text-gray-400 mb-1">
                    📞 {provider.phone}
                  </p>
                )}
                {provider.email && (
                  <p className="text-sm text-gray-400 mb-1">
                    ✉️ {provider.email}
                  </p>
                )}
                {provider.address && (
                  <p className="text-sm text-gray-400 mb-3">
                    📍 {provider.address}
                  </p>
                )}

                {provider.lastVisit && (
                  <p className="text-xs text-gray-500 mb-3">
                    Last visit: {provider.lastVisit}
                  </p>
                )}

                {provider.tags && provider.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {provider.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-full bg-pink-400/10 text-pink-400 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {provider.notes && (
                  <p className="text-sm text-gray-400 italic border-t border-white/10 pt-3">
                    "{provider.notes}"
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition">
                    Edit
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-pink-400/10 text-pink-400 text-sm font-semibold hover:bg-pink-400/20 transition">
                    Log Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5">
            <span className="text-6xl mb-4 block">👩‍⚕️</span>
            <p className="text-gray-400 text-lg mb-6">
              No providers added yet. Start building your provider directory.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-block px-6 py-3 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
            >
              Add Your First Provider
            </button>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-8 p-6 rounded-xl border border-white/10 bg-white/5">
          <p className="text-sm text-gray-400">
            <strong className="text-white">Your private directory:</strong> All
            provider notes, ratings, and tags are encrypted and visible only to
            you. Share access with trusted family members through Trusted Circle.
          </p>
        </div>
      </div>
    </main>
  );
}
