"use client";

import { useState } from "react";
import Button from "@/components/ui/button";

export default function ProviderPacketPage() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [packetData, setPacketData] = useState({
    personalInfo: {
      name: "",
      dob: "",
      height: "",
      weight: "",
      allergies: "",
    },
    currentMedications: "",
    supplements: "",
    medicalHistory: "",
    treatmentGoals: "",
    questions: "",
  });

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/provider-packet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packetData),
      });

      if (!response.ok) {
        throw new Error("Failed to save provider packet");
      }

      setSuccess("Provider packet saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">Provider Packet</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Your Medical Information Snapshot</h1>
          <p className="mt-2 text-gray-300">
            Create a comprehensive packet to share with healthcare providers before appointments.
          </p>
        </div>

        {success && (
          <div className="mb-6 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-semibold text-hot-pink">Personal Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-gray-300">
                Full Name
                <input
                  type="text"
                  value={packetData.personalInfo.name}
                  onChange={(e) =>
                    setPacketData({
                      ...packetData,
                      personalInfo: { ...packetData.personalInfo, name: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                  placeholder="Your full name"
                />
              </label>
              <label className="text-sm text-gray-300">
                Date of Birth
                <input
                  type="date"
                  value={packetData.personalInfo.dob}
                  onChange={(e) =>
                    setPacketData({
                      ...packetData,
                      personalInfo: { ...packetData.personalInfo, dob: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                />
              </label>
              <label className="text-sm text-gray-300">
                Height
                <input
                  type="text"
                  value={packetData.personalInfo.height}
                  onChange={(e) =>
                    setPacketData({
                      ...packetData,
                      personalInfo: { ...packetData.personalInfo, height: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                  placeholder="e.g., 5 ft 6 in"
                />
              </label>
              <label className="text-sm text-gray-300">
                Weight
                <input
                  type="text"
                  value={packetData.personalInfo.weight}
                  onChange={(e) =>
                    setPacketData({
                      ...packetData,
                      personalInfo: { ...packetData.personalInfo, weight: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                  placeholder="e.g., 150 lbs"
                />
              </label>
              <label className="col-span-2 text-sm text-gray-300">
                Known Allergies
                <input
                  type="text"
                  value={packetData.personalInfo.allergies}
                  onChange={(e) =>
                    setPacketData({
                      ...packetData,
                      personalInfo: { ...packetData.personalInfo, allergies: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                  placeholder="e.g., Penicillin, latex, none"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-semibold text-hot-pink">Current Medications</h2>
            <textarea
              value={packetData.currentMedications}
              onChange={(e) => setPacketData({ ...packetData, currentMedications: e.target.value })}
              className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
              rows={4}
              placeholder="List all current medications with dosages (e.g., Metformin 500mg 2x daily)"
            />
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-semibold text-hot-pink">Supplements & Vitamins</h2>
            <textarea
              value={packetData.supplements}
              onChange={(e) => setPacketData({ ...packetData, supplements: e.target.value })}
              className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
              rows={3}
              placeholder="List supplements, vitamins, and over-the-counter medications"
            />
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-semibold text-hot-pink">Relevant Medical History</h2>
            <textarea
              value={packetData.medicalHistory}
              onChange={(e) => setPacketData({ ...packetData, medicalHistory: e.target.value })}
              className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
              rows={5}
              placeholder="Past diagnoses, surgeries, chronic conditions, family history..."
            />
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-semibold text-hot-pink">Treatment Goals</h2>
            <textarea
              value={packetData.treatmentGoals}
              onChange={(e) => setPacketData({ ...packetData, treatmentGoals: e.target.value })}
              className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
              rows={4}
              placeholder="What are you hoping to achieve or address?"
            />
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-semibold text-hot-pink">Questions for Your Provider</h2>
            <textarea
              value={packetData.questions}
              onChange={(e) => setPacketData({ ...packetData, questions: e.target.value })}
              className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
              rows={4}
              placeholder="Questions or concerns you want to discuss"
            />
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={saving}
            isLoading={saving}
          >
            💾 Save Provider Packet
          </Button>
        </div>

        <div className="mt-8 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
          <p className="font-semibold">💡 Tip:</p>
          <p className="mt-1">
            Save your packet regularly as you update information. You can export it as a PDF to bring to
            appointments or share via secure link.
          </p>
        </div>
      </div>
    </div>
  );
}
