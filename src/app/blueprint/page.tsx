"use client";
export const dynamic = 'force-dynamic';
import { useState } from "react";
import Providers from "@/components/layout/providers";
import Header from "@/components/layout/header";
import ExportModal from "@/components/export/ExportModal";
import { StoryboardSnapshot, TreatmentItem } from "@/types/storyboard";

const INITIAL_SNAPSHOT: StoryboardSnapshot = {
  ageRange: "",
  goals: "",
  allergies: "",
  meds: "",
  conditions: "",
  preferences: "",
};

export default function BlueprintPage() {
  const [snapshot] = useState<StoryboardSnapshot>(INITIAL_SNAPSHOT);
  const [treatments] = useState<TreatmentItem[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-hot-pink">
            No Prior Authorization
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-black md:text-4xl">
            My Health Blueprint
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-gray-500">
            Capture your data, protect your insights, and share it with providers
            on your terms.
          </p>
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="mt-8 rounded-full bg-hot-pink px-6 py-3 text-sm font-semibold text-black transition hover:bg-pink-500"
          >
            Export My Blueprint
          </button>
        </main>
        <ExportModal
          open={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          snapshot={snapshot}
          treatments={treatments}
        />
      </div>
    </Providers>
  );
}
