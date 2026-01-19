"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";

type Question = {
  id: string;
  question: string;
  category: string;
  priority: "high" | "medium" | "low";
  reasoning?: string;
};

type GeneratedQuestions = {
  appointmentType?: string;
  providerSpecialty?: string;
  questions: Question[];
  generatedAt: string;
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<GeneratedQuestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());

  const generateQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/vault/questions/generate", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate questions");
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (id: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedQuestions(newSelected);
  };

  const exportQuestions = () => {
    if (!questions) return;
    const selected = questions.questions.filter((q) => selectedQuestions.has(q.id));
    const text = selected.map((q, i) => `${i + 1}. ${q.question}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appointment-questions.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!questions) return;
    const selected = questions.questions.filter((q) => selectedQuestions.has(q.id));
    const text = selected.map((q, i) => `${i + 1}. ${q.question}`).join("\n\n");
    navigator.clipboard.writeText(text);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-pink-500/30 bg-pink-500/5";
      case "medium":
        return "border-purple-500/30 bg-purple-500/5";
      case "low":
        return "border-blue-500/30 bg-blue-500/5";
      default:
        return "border-white/10 bg-white/5";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-pink-500/20 text-pink-300";
      case "medium":
        return "bg-purple-500/20 text-purple-300";
      case "low":
        return "bg-blue-500/20 text-blue-300";
      default:
        return "bg-gray-500/20 text-gray-300";
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
            Questions I Should Ask
          </h1>
          <p className="text-xl text-gray-400">
            AI-generated prep questions before appointments — based on your meds, treatments, and goals.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-300">
            {error}
          </div>
        )}

        {!questions && !loading && (
          <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">❓</div>
            <h2 className="text-2xl font-semibold mb-4">Get Personalized Questions</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Based on your health profile, medications, and upcoming appointments, we'll generate
              smart questions to help you get the most out of your provider visits.
            </p>
            <Button onClick={generateQuestions} disabled={loading}>
              Generate My Questions
            </Button>
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            <div className="animate-pulse bg-white/5 rounded-xl h-24"></div>
            <div className="animate-pulse bg-white/5 rounded-xl h-24"></div>
            <div className="animate-pulse bg-white/5 rounded-xl h-24"></div>
            <p className="text-center text-gray-400">Analyzing your health data...</p>
          </div>
        )}

        {questions && !loading && (
          <>
            <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {questions.appointmentType && (
                    <p className="text-sm text-gray-400">
                      Appointment Type:{" "}
                      <span className="text-white font-semibold">{questions.appointmentType}</span>
                    </p>
                  )}
                  {questions.providerSpecialty && (
                    <p className="text-sm text-gray-400">
                      Provider Specialty:{" "}
                      <span className="text-white font-semibold">{questions.providerSpecialty}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Generated {new Date(questions.generatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={generateQuestions}>
                  Refresh Questions
                </Button>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {questions.questions.map((q) => (
                <div
                  key={q.id}
                  className={`rounded-xl border p-6 cursor-pointer transition-all ${
                    selectedQuestions.has(q.id)
                      ? "border-pink-500/50 bg-pink-500/10 scale-[1.02]"
                      : getPriorityColor(q.priority)
                  }`}
                  onClick={() => toggleQuestion(q.id)}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.has(q.id)}
                      onChange={() => toggleQuestion(q.id)}
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-white/10 text-pink-500 focus:ring-pink-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <p className="text-lg font-medium">{q.question}</p>
                        <div className="flex gap-2 shrink-0">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(q.priority)}`}>
                            {q.priority}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                            {q.category}
                          </span>
                        </div>
                      </div>
                      {q.reasoning && (
                        <p className="text-sm text-gray-400">{q.reasoning}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedQuestions.size > 0 && (
              <div className="sticky bottom-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-lg border border-white/20 rounded-xl p-4 flex items-center justify-between">
                <p className="text-sm">
                  {selectedQuestions.size} question{selectedQuestions.size !== 1 ? "s" : ""} selected
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    Copy to Clipboard
                  </Button>
                  <Button size="sm" onClick={exportQuestions}>
                    Export as Text
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
