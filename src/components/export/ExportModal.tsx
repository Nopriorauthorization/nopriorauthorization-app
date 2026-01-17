"use client";

import { useEffect, useMemo, useState } from "react";
import { ProviderPacketPayload, ProviderPacketTemplate } from "@/lib/provider-packet/types";
import { StoryboardSnapshot, TreatmentItem } from "@/types/storyboard";

type ExportModalProps = {
  open: boolean;
  onClose: () => void;
  snapshot: StoryboardSnapshot;
  treatments: TreatmentItem[];
};

const TEMPLATE_OPTIONS: Array<{ value: ProviderPacketTemplate; label: string }> = [
  { value: "primary", label: "Primary / Urgent" },
  { value: "specialist", label: "Specialist" },
  { value: "urgent", label: "Urgent" },
];

const EXPIRY_OPTIONS = [
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
];

export default function ExportModal({
  open,
  onClose,
  snapshot,
  treatments,
}: ExportModalProps) {
  const [mode, setMode] = useState<"blueprint" | "provider">("blueprint");
  const [visitReason, setVisitReason] = useState("");
  const [topConcerns, setTopConcerns] = useState(["", "", ""]);
  const [questions, setQuestions] = useState("");
  const [allergies, setAllergies] = useState(snapshot.allergies);
  const [conditions, setConditions] = useState(snapshot.conditions);
  const [medications, setMedications] = useState(snapshot.meds);
  const [supplements, setSupplements] = useState("");
  const [labs, setLabs] = useState("");
  const [vitals, setVitals] = useState("");
  const [template, setTemplate] = useState<ProviderPacketTemplate>("primary");
  const [expiresIn, setExpiresIn] = useState("7d");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [shareResult, setShareResult] = useState<{
    url: string;
    expiresAt: string;
  } | null>(null);

  const treatmentSummary = useMemo(
    () =>
      treatments
        .map((item) => `${item.name} — ${item.status}`)
        .join("\n") || "No treatments saved yet",
    [treatments]
  );

  useEffect(() => {
    if (!open) return;
    setMode("blueprint");
    setVisitReason("");
    setTopConcerns(["", "", ""]);
    setQuestions("");
    setAllergies(snapshot.allergies);
    setConditions(snapshot.conditions);
    setMedications(snapshot.meds);
    setSupplements("");
    setLabs("");
    setVitals("");
    setTemplate("primary");
    setExpiresIn("7d");
    setShareResult(null);
    setError("");
  }, [open, snapshot]);

  const handleConcernChange = (index: number, value: string) => {
    setTopConcerns((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const buildPayload = (): ProviderPacketPayload => ({
    visitReason: visitReason.trim(),
    topConcerns: topConcerns.map((value) => value.trim()).filter(Boolean),
    questions: questions.trim() || undefined,
    allergies: allergies.trim() || undefined,
    conditions: conditions.trim() || undefined,
    medications: medications.trim() || undefined,
    supplements: supplements.trim() || undefined,
    labs: labs.trim() || undefined,
    vitals: vitals.trim() || undefined,
    treatments: treatments.map((item) => ({
      name: item.name,
      status: `${item.status}${item.category ? ` — ${item.category}` : ""}`,
      notes: item.notes || undefined,
    })),
  });

  const handleShare = async () => {
    setError("");
    setShareResult(null);
    if (!visitReason.trim()) {
      setError("Please describe your reason for visit.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      const response = await fetch("/api/provider-packet/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template,
          expiresIn,
          payload,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to generate packet.");
      }
      setShareResult({
        url: data.url,
        expiresAt: data.expiresAt,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate packet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadPdf = () => {
    if (!shareResult?.url) return;
    window.open(shareResult.url, "_blank");
  };

  const copyLink = async () => {
    if (!shareResult?.url) return;
    await navigator.clipboard.writeText(shareResult.url);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6">
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-black p-6 text-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white"
        >
          Close
        </button>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">My Health Blueprint</h2>
          <p className="text-sm text-white/60">
            Export your experience in a format that matches your provider conversations.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("blueprint")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "blueprint"
                ? "bg-hot-pink text-black"
                : "border border-white/30 text-white"
            }`}
          >
            My Health Blueprint
          </button>
          <button
            type="button"
            onClick={() => setMode("provider")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "provider"
                ? "bg-hot-pink text-black"
                : "border border-white/30 text-white"
            }`}
          >
            Provider Packet
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {mode === "blueprint" ? (
            <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold">Blueprint snapshot</h3>
              <p className="text-sm text-white/70">
                Existing export behavior is preserved in this mode. Use this view for context.
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Goals:</span> {snapshot.goals || "Not set"}
                </p>
                <p>
                  <span className="font-semibold">Preferences:</span> {snapshot.preferences || "Not set"}
                </p>
                <p>
                  <span className="font-semibold">Age range:</span> {snapshot.ageRange || "Not specified"}
                </p>
                <p className="whitespace-pre-line">
                  <span className="font-semibold">Treatments:</span> {treatmentSummary}
                </p>
              </div>
              <button
                type="button"
                disabled
                title="Blueprint export uses the pre-existing workflow."
                className="w-full cursor-not-allowed rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-hot-pink transition"
              >
                Download My Health Blueprint
              </button>
            </section>
          ) : (
            <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  Reason for visit
                  <textarea
                    value={visitReason}
                    onChange={(event) => setVisitReason(event.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-black/60 p-3 text-sm text-white placeholder:text-white/40"
                    placeholder="What do you need your provider to understand immediately?"
                  />
                </label>

                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Top 3 concerns</p>
                  {topConcerns.map((concern, index) => (
                    <input
                      key={index}
                      value={concern}
                      onChange={(event) => handleConcernChange(index, event.target.value)}
                      className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-sm text-white placeholder:text-white/40"
                      placeholder={`Concern ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  Questions for my provider
                  <textarea
                    value={questions}
                    onChange={(event) => setQuestions(event.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-black/60 p-3 text-sm text-white placeholder:text-white/40"
                    placeholder="Optional questions you'd like to ask"
                  />
                </label>
                <label className="text-sm">
                  Allergies / sensitivities
                  <input
                    value={allergies}
                    onChange={(event) => setAllergies(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    placeholder="List any reactions or intolerances"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  Conditions / history
                  <input
                    value={conditions}
                    onChange={(event) => setConditions(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    placeholder="Previous surgeries or ongoing diagnoses"
                  />
                </label>
                <label className="text-sm">
                  Medications
                  <textarea
                    value={medications}
                    onChange={(event) => setMedications(event.target.value)}
                    rows={2}
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-black/60 p-3 text-sm text-white placeholder:text-white/40"
                    placeholder="Current medications or supplements"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  Supplements
                  <input
                    value={supplements}
                    onChange={(event) => setSupplements(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    placeholder="Optional supplements or vitamins"
                  />
                </label>
                <label className="text-sm">
                  Labs / vitals
                  <input
                    value={labs}
                    onChange={(event) => setLabs(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    placeholder="Optional lab/vital numbers"
                  />
                </label>
              </div>

              <label className="text-sm">
                Treatments (current + past)
                <textarea
                  value={treatmentSummary}
                  readOnly
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-black/60 p-3 text-sm text-white placeholder:text-white/40"
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  Packet template
                  <select
                    value={template}
                    onChange={(event) => setTemplate(event.target.value as ProviderPacketTemplate)}
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-sm text-white"
                  >
                    {TEMPLATE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  Share expiry
                  <select
                    value={expiresIn}
                    onChange={(event) => setExpiresIn(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-sm text-white"
                  >
                    {EXPIRY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {error && (
                <p className="text-sm font-semibold text-hot-pink">{error}</p>
              )}

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={isSubmitting}
                  className="flex-1 rounded-2xl bg-hot-pink px-4 py-3 text-sm font-semibold text-black transition hover:bg-pink-500 disabled:opacity-60"
                >
                  {isSubmitting ? "Generating..." : "Generate Provider Packet"}
                </button>
                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={!shareResult}
                  className="flex-1 rounded-2xl border border-white/30 px-4 py-3 text-sm font-semibold text-white disabled:text-white/40"
                >
                  Download PDF
                </button>
              </div>

              {shareResult && (
                <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                  <p className="text-white/70">Secure share link ready</p>
                  <p className="break-all text-white">{shareResult.url}</p>
                  <p className="text-white/60">
                    Expires {new Date(shareResult.expiresAt).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={copyLink}
                      className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white"
                    >
                      Copy link
                    </button>
                    <a
                      href={shareResult.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white"
                    >
                      Open link
                    </a>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
