"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";

type ProviderRating = {
  id: string;
  providerId: string;
  providerName: string;
  specialty: string;
  rating: number;
  tags: string[];
  notes: string;
  lastVisit: string;
  wouldRecommend: boolean;
};

export default function ProviderTrackerPage() {
  const [ratings, setRatings] = useState<ProviderRating[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);

  const tagOptions = [
    "Trustworthy",
    "Great Listener",
    "Pushy",
    "Rushed",
    "Thorough",
    "Expensive",
    "Affordable",
    "Easy to Reach",
    "Hard to Schedule",
    "Explains Well",
    "Dismissive",
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [providersRes, ratingsRes] = await Promise.all([
        fetch("/api/vault/providers"),
        fetch("/api/vault/provider-tracker"),
      ]);

      if (providersRes.ok) {
        const data = await providersRes.json();
        setProviders(data.providers || []);
      }

      if (ratingsRes.ok) {
        const data = await ratingsRes.json();
        setRatings(data.ratings || []);
      }
    } catch (error) {
      console.error("Failed to load:", error);
    }
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const submitRating = async () => {
    if (!selectedProvider) return;

    try {
      const res = await fetch("/api/vault/provider-tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: selectedProvider,
          rating,
          tags,
          notes,
          wouldRecommend,
        }),
      });

      if (res.ok) {
        await loadData();
        setSelectedProvider("");
        setRating(5);
        setTags([]);
        setNotes("");
        setWouldRecommend(true);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/vault"
            className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
          >
            ← Back to Sacred Vault
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Provider Tracker
          </h1>
          <p className="text-xl text-gray-400">
            Rate and tag providers — trustworthy, pushy, amazing. Your private notes, always accessible.
          </p>
        </div>

        {/* Rate a Provider */}
        <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Rate a Provider</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select Provider</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Choose a provider...</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Overall Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`text-4xl transition ${
                      r <= rating ? "text-yellow-400" : "text-gray-600"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      tags.includes(tag)
                        ? "bg-pink-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Private Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What should you remember about this provider?"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[100px]"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="recommend"
                checked={wouldRecommend}
                onChange={(e) => setWouldRecommend(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/10 text-pink-500 focus:ring-pink-500"
              />
              <label htmlFor="recommend" className="text-sm">
                I would recommend this provider to others
              </label>
            </div>

            <Button onClick={submitRating} disabled={!selectedProvider} className="w-full">
              Save Rating
            </Button>
          </div>
        </div>

        {/* Past Ratings */}
        {ratings.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Your Provider Ratings</h2>
            {ratings.map((r) => (
              <div
                key={r.id}
                className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-white/10 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold">{r.providerName}</h3>
                    <p className="text-sm text-gray-400">{r.specialty}</p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-2xl ${
                          star <= r.rating ? "text-yellow-400" : "text-gray-600"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {r.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {r.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {r.notes && (
                  <p className="text-sm text-gray-300 mb-3 bg-black/30 rounded-lg p-3">
                    {r.notes}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Last visit: {new Date(r.lastVisit).toLocaleDateString()}</span>
                  {r.wouldRecommend && (
                    <span className="text-green-400">✓ Recommended</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
