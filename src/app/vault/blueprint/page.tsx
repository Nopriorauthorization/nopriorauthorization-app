import React from "react";
import IdentitySection from "./sections/IdentitySection";
import HealthFoundationsSection from "./sections/HealthFoundationsSection";
import TreatmentsSection from "./sections/TreatmentsSection";
import TimelineSection from "./sections/TimelineSection";
import DocumentsSection from "./sections/DocumentsSection";
import ProvidersSection from "./sections/ProvidersSection";
import PreparationSection from "./sections/PreparationSection";

export default function BlueprintPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          My Health & Life Blueprint
        </h1>
        <IdentitySection />
        <HealthFoundationsSection />
        <TreatmentsSection />
        <TimelineSection />
        <DocumentsSection />
        <ProvidersSection />
        <PreparationSection />
      </div>
    </main>
  );
}
