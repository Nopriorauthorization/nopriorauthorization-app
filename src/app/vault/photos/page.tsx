"use client";

import { useState } from "react";
import Link from "next/link";

type Photo = {
  id: string;
  url: string;
  category: "before-after" | "progress" | "procedure" | "product" | "other";
  date: string;
  treatmentType?: string;
  aiTags?: string[];
  notes?: string;
};

const CATEGORY_INFO = {
  "before-after": { icon: "🖼️", label: "Before/After", color: "pink" },
  progress: { icon: "📈", label: "Progress", color: "blue" },
  procedure: { icon: "💉", label: "Procedure", color: "purple" },
  product: { icon: "💊", label: "Product", color: "green" },
  other: { icon: "📷", label: "Other", color: "gray" },
};

export default function PhotosPage() {
  const [photos] = useState<Photo[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [uploadMode, setUploadMode] = useState(false);

  const filteredPhotos =
    filter === "all" ? photos : photos.filter((p) => p.category === filter);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
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
              <span className="text-4xl">📷</span>
              <h1 className="text-4xl md:text-5xl font-semibold">
                Smart Photo Vault
              </h1>
            </div>
            <button
              onClick={() => setUploadMode(!uploadMode)}
              className="px-4 py-2 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
            >
              + Upload Photo
            </button>
          </div>
          <p className="text-gray-400 text-lg">
            Snap, upload, done. AI categorizes and encrypts automatically — no
            filing required.
          </p>
        </div>

        {/* Upload Section */}
        {uploadMode && (
          <div className="mb-8 p-8 rounded-2xl border-2 border-dashed border-pink-400/30 bg-pink-400/5">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📸</span>
              <h3 className="text-xl font-semibold mb-2">
                Drop photos or click to browse
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                AI will automatically categorize, timestamp, and encrypt your
                photos
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-block px-6 py-3 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition cursor-pointer"
              >
                Choose Photos
              </label>
              <button
                onClick={() => setUploadMode(false)}
                className="ml-3 inline-block px-6 py-3 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-white/5">
              <p className="text-xs text-gray-500">
                <strong className="text-white">Pro tip:</strong> Take
                before/after photos in the same lighting and angle for AI
                progress comparison.
              </p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filter === "all"
                  ? "bg-pink-400 text-black"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              All Photos
            </button>
            {Object.entries(CATEGORY_INFO).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  filter === key
                    ? "bg-pink-400 text-black"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {info.icon} {info.label}
              </button>
            ))}
          </div>
        )}

        {/* Photos Grid */}
        {filteredPhotos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-pink-400/30 transition"
              >
                {/* Photo */}
                <div className="aspect-square bg-white/10 relative">
                  <img
                    src={photo.url}
                    alt={photo.notes || "Photo"}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <button className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition">
                      View
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-white/20 text-white text-sm font-semibold hover:bg-white/30 transition">
                      Edit
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{photo.date}</span>
                    <span className="px-2 py-1 rounded-full bg-pink-400/10 text-pink-400 text-xs font-semibold">
                      {CATEGORY_INFO[photo.category].label}
                    </span>
                  </div>

                  {photo.treatmentType && (
                    <p className="text-sm font-medium mb-2">
                      {photo.treatmentType}
                    </p>
                  )}

                  {photo.aiTags && photo.aiTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {photo.aiTags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {photo.notes && (
                    <p className="text-xs text-gray-400 italic line-clamp-2">
                      {photo.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5">
            <span className="text-6xl mb-4 block">📷</span>
            <p className="text-gray-400 text-lg mb-2">No photos uploaded yet.</p>
            <p className="text-gray-500 text-sm mb-6">
              Snap a photo and let AI handle the rest — categorization,
              encryption, everything.
            </p>
            <button
              onClick={() => setUploadMode(true)}
              className="inline-block px-6 py-3 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
            >
              Upload Your First Photo
            </button>
          </div>
        )}

        {/* AI Insights Section (When photos exist) */}
        {photos.length > 0 && (
          <div className="mt-8 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>🤖</span> AI Progress Insights
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              We've detected <strong>3 before/after pairs</strong> and{" "}
              <strong>5 progress photos</strong> across 2 treatments. Ready to
              generate your progress report?
            </p>
            <button className="px-6 py-2 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition">
              Generate Progress Report
            </button>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-8 p-6 rounded-xl border border-white/10 bg-white/5">
          <p className="text-sm text-gray-400">
            <strong className="text-white">End-to-end encrypted:</strong> All
            photos are encrypted before upload and stored securely. Only you can
            view them. Share selectively through Trusted Circle.
          </p>
        </div>
      </div>
    </main>
  );
}
