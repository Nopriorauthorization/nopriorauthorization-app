"use client";

import { useState } from "react";
import Button from "@/components/ui/button";

type ViewMode = "provider" | "patient";

export default function ClinicalSummaryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("provider");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [providerNotes, setProviderNotes] = useState("");
  
  const [packetData, setPacketData] = useState({
    personalInfo: {
      name: "",
      dob: "",
      height: "",
      weight: "",
      allergies: "",
    },
    chiefConcern: "",
    primaryConcerns: "",
    patientQuestions: "",
    currentMedications: "",
    supplements: "",
    medicalHistory: "",
    labsVitals: "",
    priorTherapies: "",
  });

  // Auto-generate clinical snapshot from patient data
  const generateClinicalSnapshot = () => {
    const age = packetData.personalInfo.dob 
      ? Math.floor((Date.now() - new Date(packetData.personalInfo.dob).getTime()) / 3.15576e10)
      : null;
    
    const bullets = [];
    
    if (age) bullets.push(`${age}yo presenting with ${packetData.chiefConcern || "unspecified concern"}`);
    if (packetData.personalInfo.allergies) bullets.push(`Drug allergies: ${packetData.personalInfo.allergies}`);
    if (packetData.currentMedications) bullets.push(`Active meds: ${packetData.currentMedications.substring(0, 60)}...`);
    if (packetData.medicalHistory) bullets.push(`PMH: ${packetData.medicalHistory.substring(0, 80)}...`);
    if (packetData.primaryConcerns) bullets.push(`Patient priorities: ${packetData.primaryConcerns.substring(0, 60)}...`);
    
    return bullets.length > 0 ? bullets : ["Patient has not yet completed clinical summary."];
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/provider-packet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...packetData, providerNotes }),
      });

      if (!response.ok) {
        throw new Error("Failed to save clinical summary");
      }

      setSuccess("Clinical summary saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const isEditMode = viewMode === "patient";
  const hasContent = (value: string) => value && value.trim().length > 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">Clinical Summary</p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            {isEditMode ? "Edit Your Clinical Information" : "Patient Clinical Summary"}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            This clinical summary was completed by the patient prior to the visit to support efficient, informed clinical decision-making.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={viewMode === "provider" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("provider")}
          >
            Provider View
          </Button>
          <Button
            variant={viewMode === "patient" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("patient")}
          >
            Patient Edit View
          </Button>
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

        {/* CLINICAL SNAPSHOT - Above the fold, provider view only */}
        {!isEditMode && (
          <div className="mb-6 rounded-2xl border-2 border-hot-pink/40 bg-hot-pink/5 p-6">
            <h2 className="mb-3 text-lg font-semibold text-hot-pink">Clinical Snapshot</h2>
            <ul className="space-y-1.5 text-sm text-gray-200">
              {generateClinicalSnapshot().map((bullet, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-hot-pink">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI-GENERATED SUMMARY - Provider view only */}
        {!isEditMode && (
          <div className="mb-6 rounded-2xl border border-blue-500/40 bg-blue-500/5 p-6">
            <h2 className="mb-3 text-lg font-semibold text-blue-400">AI-Generated Clinical Summary</h2>
            <p className="text-sm italic text-gray-300">
              [Placeholder] Based on the patient's submitted information, key clinical considerations include risk stratification for reported allergies, medication interactions review, and alignment of patient-stated goals with evidence-based treatment options. Recommend reviewing labs/vitals for baseline assessment.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* SECTION 1: WHY THIS VISIT MATTERS */}
          <div className="space-y-6">
            <h3 className="border-b border-white/20 pb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Why This Visit Matters
            </h3>

            {/* Chief Concern */}
            {(isEditMode || hasContent(packetData.chiefConcern)) && (
              <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="mb-3 text-lg font-semibold text-hot-pink">
                  Chief Concern <span className="text-xs text-gray-500">(Patient-Stated)</span>
                </h2>
                {isEditMode ? (
                  <textarea
                    value={packetData.chiefConcern}
                    onChange={(e) => setPacketData({ ...packetData, chiefConcern: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                    rows={2}
                    placeholder="What brings you in today? (e.g., persistent headaches, follow-up for diabetes)"
                  />
                ) : (
                  <p className="text-sm text-gray-200">{packetData.chiefConcern}</p>
                )}
              </section>
            )}

            {/* Primary Clinical Concerns */}
            {(isEditMode || hasContent(packetData.primaryConcerns)) && (
              <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="mb-3 text-lg font-semibold text-hot-pink">Primary Clinical Concerns</h2>
                {isEditMode ? (
                  <textarea
                    value={packetData.primaryConcerns}
                    onChange={(e) => setPacketData({ ...packetData, primaryConcerns: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                    rows={3}
                    placeholder="Top 3 things you want addressed today"
                  />
                ) : (
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{packetData.primaryConcerns}</p>
                )}
              </section>
            )}

            {/* Patient Questions / Goals */}
            {(isEditMode || hasContent(packetData.patientQuestions)) && (
              <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="mb-3 text-lg font-semibold text-hot-pink">Patient Questions / Goals</h2>
                {isEditMode ? (
                  <textarea
                    value={packetData.patientQuestions}
                    onChange={(e) => setPacketData({ ...packetData, patientQuestions: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                    rows={3}
                    placeholder="Specific questions or outcomes you're hoping for"
                  />
                ) : (
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{packetData.patientQuestions}</p>
                )}
              </section>
            )}
          </div>

          {/* SECTION 2: RISK & SAFETY */}
          {(isEditMode || hasContent(packetData.personalInfo.allergies) || hasContent(packetData.currentMedications) || hasContent(packetData.medicalHistory)) && (
            <details open className="group">
              <summary className="cursor-pointer border-b border-white/20 pb-2 text-sm font-semibold uppercase tracking-wider text-gray-400 list-none">
                <span className="inline-flex items-center gap-2">
                  Risk & Safety
                  <svg className="h-4 w-4 transition-transform group-open:rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              
              <div className="mt-6 space-y-6">
                {/* Allergies */}
                {(isEditMode || hasContent(packetData.personalInfo.allergies)) && (
                  <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="mb-3 text-lg font-semibold text-hot-pink">Known Allergies</h2>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={packetData.personalInfo.allergies}
                        onChange={(e) =>
                          setPacketData({
                            ...packetData,
                            personalInfo: { ...packetData.personalInfo, allergies: e.target.value },
                          })
                        }
                        className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                        placeholder="e.g., Penicillin, latex, NKDA"
                      />
                    ) : (
                      <p className="text-sm text-gray-200">{packetData.personalInfo.allergies}</p>
                    )}
                  </section>
                )}

                {/* Current Medications */}
                {(isEditMode || hasContent(packetData.currentMedications)) && (
                  <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="mb-3 text-lg font-semibold text-hot-pink">Active Medications</h2>
                    {isEditMode ? (
                      <textarea
                        value={packetData.currentMedications}
                        onChange={(e) => setPacketData({ ...packetData, currentMedications: e.target.value })}
                        className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                        rows={4}
                        placeholder="List all current medications with dosages (e.g., Metformin 500mg BID)"
                      />
                    ) : (
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{packetData.currentMedications}</p>
                    )}
                  </section>
                )}

                {/* Medical History */}
                {(isEditMode || hasContent(packetData.medicalHistory)) && (
                  <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="mb-3 text-lg font-semibold text-hot-pink">Relevant Medical History</h2>
                    {isEditMode ? (
                      <textarea
                        value={packetData.medicalHistory}
                        onChange={(e) => setPacketData({ ...packetData, medicalHistory: e.target.value })}
                        className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                        rows={5}
                        placeholder="Past diagnoses, surgeries, chronic conditions, family history..."
                      />
                    ) : (
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{packetData.medicalHistory}</p>
                    )}
                  </section>
                )}
              </div>
            </details>
          )}

          {/* SECTION 3: CLINICAL CONTEXT */}
          {(isEditMode || hasContent(packetData.labsVitals) || hasContent(packetData.priorTherapies)) && (
            <details open className="group">
              <summary className="cursor-pointer border-b border-white/20 pb-2 text-sm font-semibold uppercase tracking-wider text-gray-400 list-none">
                <span className="inline-flex items-center gap-2">
                  Clinical Context
                  <svg className="h-4 w-4 transition-transform group-open:rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              
              <div className="mt-6 space-y-6">
                {/* Labs / Vitals */}
                {(isEditMode || hasContent(packetData.labsVitals)) && (
                  <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="mb-3 text-lg font-semibold text-hot-pink">Available Objective Data</h2>
                    {isEditMode ? (
                      <textarea
                        value={packetData.labsVitals}
                        onChange={(e) => setPacketData({ ...packetData, labsVitals: e.target.value })}
                        className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                        rows={4}
                        placeholder="Recent labs, vitals, test results (e.g., BP 130/85, A1C 6.8%)"
                      />
                    ) : (
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{packetData.labsVitals}</p>
                    )}
                  </section>
                )}

                {/* Prior Therapies */}
                {(isEditMode || hasContent(packetData.priorTherapies)) && (
                  <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="mb-3 text-lg font-semibold text-hot-pink">Prior / Active Therapies</h2>
                    {isEditMode ? (
                      <textarea
                        value={packetData.priorTherapies}
                        onChange={(e) => setPacketData({ ...packetData, priorTherapies: e.target.value })}
                        className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                        rows={4}
                        placeholder="Current and past treatments (e.g., physical therapy for back pain 2022, tried ibuprofen - ineffective)"
                      />
                    ) : (
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{packetData.priorTherapies}</p>
                    )}
                  </section>
                )}
              </div>
            </details>
          )}

          {/* SECTION 4: LIFESTYLE / ADJUNCTS */}
          {(isEditMode || hasContent(packetData.supplements)) && (
            <details open className="group">
              <summary className="cursor-pointer border-b border-white/20 pb-2 text-sm font-semibold uppercase tracking-wider text-gray-400 list-none">
                <span className="inline-flex items-center gap-2">
                  Lifestyle / Adjuncts
                  <svg className="h-4 w-4 transition-transform group-open:rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              
              <div className="mt-6 space-y-6">
                {/* Supplements */}
                {(isEditMode || hasContent(packetData.supplements)) && (
                  <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="mb-3 text-lg font-semibold text-hot-pink">Supplements & OTC</h2>
                    {isEditMode ? (
                      <textarea
                        value={packetData.supplements}
                        onChange={(e) => setPacketData({ ...packetData, supplements: e.target.value })}
                        className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                        rows={3}
                        placeholder="Vitamins, supplements, over-the-counter medications"
                      />
                    ) : (
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{packetData.supplements}</p>
                    )}
                  </section>
                )}
              </div>
            </details>
          )}

          {/* PROVIDER NOTES - Provider view only, editable by provider */}
          {!isEditMode && (
            <section className="rounded-2xl border-2 border-purple-500/40 bg-purple-500/5 p-6">
              <h2 className="mb-3 text-lg font-semibold text-purple-400">Provider Notes</h2>
              <textarea
                value={providerNotes}
                onChange={(e) => setProviderNotes(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-black/30 px-3 py-2 text-sm text-white focus:border-purple-400 focus:outline-none"
                rows={4}
                placeholder="Clinical notes, assessment, plan... (Provider only - not visible to patient)"
              />
            </section>
          )}

          {/* Demographics - Patient Edit View Only */}
          {isEditMode && (
            <details className="group">
              <summary className="cursor-pointer border-b border-white/20 pb-2 text-sm font-semibold uppercase tracking-wider text-gray-400 list-none">
                <span className="inline-flex items-center gap-2">
                  Demographics
                  <svg className="h-4 w-4 transition-transform group-open:rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              
              <div className="mt-6">
                <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
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
                        placeholder="e.g., 5'6&quot;"
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
                  </div>
                </section>
              </div>
            </details>
          )}
        </div>

        {/* Save Button - Patient Edit View Only */}
        {isEditMode && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={saving}
              isLoading={saving}
            >
              💾 Save Clinical Summary
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
