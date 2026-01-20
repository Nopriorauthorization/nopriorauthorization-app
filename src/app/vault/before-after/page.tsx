"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/button";

type Photo = {
  id: string;
  url: string;
  category: string;
  takenAt: string;
  notes?: string;
};

type Comparison = {
  id: string;
  beforePhoto: Photo;
  afterPhoto: Photo;
  daysBetween: number;
  notes?: string;
};

export default function BeforeAfterPage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBefore, setSelectedBefore] = useState<string | null>(null);
  const [selectedAfter, setSelectedAfter] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeComparison, setActiveComparison] = useState<Comparison | null>(null);

  useEffect(() => {
    loadPhotosAndComparisons();
  }, []);

  const loadPhotosAndComparisons = async () => {
    try {
      const [photosRes, comparisonsRes] = await Promise.all([
        fetch("/api/vault/photos"),
        fetch("/api/vault/before-after"),
      ]);

      if (photosRes.ok) {
        const photosData = await photosRes.json();
        setPhotos(photosData.photos || []);
      }

      if (comparisonsRes.ok) {
        const comparisonsData = await comparisonsRes.json();
        setComparisons(comparisonsData.comparisons || []);
      }
    } catch (error) {
      console.error("Failed to load:", error);
    } finally {
      setLoading(false);
    }
  };

  const createComparison = async () => {
    if (!selectedBefore || !selectedAfter) return;

    try {
      const res = await fetch("/api/vault/before-after", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beforePhotoId: selectedBefore,
          afterPhotoId: selectedAfter,
        }),
      });

      if (res.ok) {
        await loadPhotosAndComparisons();
        setSelectedBefore(null);
        setSelectedAfter(null);
      }
    } catch (error) {
      console.error("Failed to create comparison:", error);
    }
  };

  const deleteComparison = async (id: string) => {
    try {
      const res = await fetch(`/api/vault/before-after/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComparisons((prev) => prev.filter((c) => c.id !== id));
        if (activeComparison?.id === id) {
          setActiveComparison(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete comparison:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-white/10 rounded w-1/2"></div>
            <div className="h-96 bg-white/5 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/vault"
            className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
          >
            ← Back to Sacred Vault
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Before/After Gallery
          </h1>
          <p className="text-xl text-gray-400">
            AI compares progress photos, highlights changes, and tracks results over time.
          </p>
        </div>

        {photos.length === 0 && (
          <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">🖼️</div>
            <h2 className="text-2xl font-semibold mb-4">No Photos Yet</h2>
            <p className="text-gray-400 mb-6">
              Upload photos to your Smart Photo Vault first, then come back to create before/after comparisons.
            </p>
            <Link href="/vault/photos">
              <Button>Go to Photo Vault</Button>
            </Link>
          </div>
        )}

        {photos.length > 0 && comparisons.length === 0 && (
          <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-semibold mb-6">Create Your First Comparison</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-3">Select "Before" Photo</label>
                <div className="grid grid-cols-2 gap-3">
                  {photos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedBefore(photo.id)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                        selectedBefore === photo.id
                          ? "border-pink-500 scale-105"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      <Image
                        src={photo.url}
                        alt="Before"
                        fill
                        className="object-cover"
                      />
                      {selectedBefore === photo.id && (
                        <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                          <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Before
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Select "After" Photo</label>
                <div className="grid grid-cols-2 gap-3">
                  {photos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedAfter(photo.id)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                        selectedAfter === photo.id
                          ? "border-purple-500 scale-105"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      <Image
                        src={photo.url}
                        alt="After"
                        fill
                        className="object-cover"
                      />
                      {selectedAfter === photo.id && (
                        <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                          <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            After
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={createComparison}
              disabled={!selectedBefore || !selectedAfter}
              className="w-full"
            >
              Create Comparison
            </Button>
          </div>
        )}

        {comparisons.length > 0 && (
          <div className="space-y-8">
            {comparisons.map((comparison) => (
              <div
                key={comparison.id}
                className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {comparison.beforePhoto.category} Progress
                    </h3>
                    <p className="text-sm text-gray-400">
                      {comparison.daysBetween} days between photos
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteComparison(comparison.id)}
                  >
                    Delete
                  </Button>
                </div>

                {/* Before/After Slider */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                  <div
                    className="absolute inset-0"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <Image
                      src={comparison.beforePhoto.url}
                      alt="Before"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Before
                    </div>
                  </div>

                  <div
                    className="absolute inset-0"
                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                  >
                    <Image
                      src={comparison.afterPhoto.url}
                      alt="After"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      After
                    </div>
                  </div>

                  {/* Slider Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                    style={{ left: `${sliderPosition}%` }}
                    onMouseDown={(e) => {
                      const onMouseMove = (moveEvent: MouseEvent) => {
                        const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                        if (rect) {
                          const x = moveEvent.clientX - rect.left;
                          const percentage = (x / rect.width) * 100;
                          setSliderPosition(Math.max(0, Math.min(100, percentage)));
                        }
                      };

                      const onMouseUp = () => {
                        document.removeEventListener("mousemove", onMouseMove);
                        document.removeEventListener("mouseup", onMouseUp);
                      };

                      document.addEventListener("mousemove", onMouseMove);
                      document.addEventListener("mouseup", onMouseUp);
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {comparison.notes && (
                  <p className="mt-4 text-sm text-gray-400">{comparison.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
