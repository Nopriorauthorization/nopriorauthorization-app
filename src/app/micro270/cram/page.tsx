"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CramQuestion } from "@/app/api/micro270/cram/route";
import { MICRO270_TIER_FULL } from "@/config/micro270-sales.config";

const BUNDLE_LIMIT = 3;
const STORAGE_KEY = "micro270_cram_used";

function getUsedCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10) || 0;
}

function incrementUsed() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, String(getUsedCount() + 1));
}

export default function Micro270CramPage() {
  const [notes, setNotes] = useState("");
  const [questions, setQuestions] = useState<CramQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tier, setTier] = useState<string | null>(null);
  const [usedCount, setUsedCount] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUsedCount(getUsedCount());
  }, []);

  const isUnlimited = tier === MICRO270_TIER_FULL;
  const remaining = isUnlimited ? 999 : Math.max(0, BUNDLE_LIMIT - usedCount);
  const canGenerate = remaining > 0 || isUnlimited;

  const generate = useCallback(async () => {
    if (!canGenerate) return;
    setLoading(true);
    setError(null);
    setQuestions([]);
    setRevealed(new Set());

    try {
      const res = await fetch("/api/micro270/cram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = (await res.json()) as {
        questions?: CramQuestion[];
        tier?: string;
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      if (data.tier) setTier(data.tier);
      if (data.questions) {
        setQuestions(data.questions);
        incrementUsed();
        const newCount = getUsedCount();
        setUsedCount(newCount);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }, [notes, canGenerate]);

  const toggleReveal = (i: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const revealAll = () => setRevealed(new Set(questions.map((_, i) => i)));

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <header className="border-b border-white/10 bg-[#071018]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4537E]">
            Micro270
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            AI Cram Tool
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Paste your lecture notes or textbook summary — Claude generates
            15 professor-style exam questions with explanations and exam-trap flags.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="/micro270/hub"
              className="text-sm text-[#D4537E] underline-offset-2 hover:underline"
            >
              ← Back to hub
            </a>
            {tier && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/60">
                {tier === MICRO270_TIER_FULL ? "Unlimited" : `${remaining} of ${BUNDLE_LIMIT} uses remaining`}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Notes input */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <label
            htmlFor="notes"
            className="block text-sm font-semibold text-white/80"
          >
            Your notes
          </label>
          <p className="mt-1 text-xs text-white/50">
            Paste lecture notes, textbook sections, or your own written summaries.
            The more specific your notes, the better the questions.
          </p>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={12}
            placeholder="Paste your microbiology notes here..."
            className="mt-3 w-full resize-y rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#D4537E]/50 focus:outline-none focus:ring-1 focus:ring-[#D4537E]/30"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-white/40">
            <span>{notes.length.toLocaleString()} / 20,000 characters</span>
            {!canGenerate && (
              <span className="text-amber-400">
                You&apos;ve used all {BUNDLE_LIMIT} generations.{" "}
                <a href="/shop/micro270-full-access" className="underline">
                  Upgrade to unlimited →
                </a>
              </span>
            )}
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-900/30 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="mt-4">
            <button
              type="button"
              onClick={generate}
              disabled={loading || !notes.trim() || !canGenerate}
              className="rounded-lg bg-[#D4537E] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#b83e68] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Generating questions…" : "Generate 15 questions"}
            </button>
          </div>
        </div>

        {/* Results */}
        {questions.length > 0 && (
          <div ref={resultsRef} className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold">
                {questions.length} questions generated
              </h2>
              <button
                type="button"
                onClick={revealAll}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
              >
                Reveal all answers
              </button>
            </div>

            <ol className="space-y-4">
              {questions.map((q, i) => {
                const isRevealed = revealed.has(i);
                return (
                  <li
                    key={i}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium leading-relaxed text-white">
                        <span className="mr-2 font-bold text-[#D4537E]">
                          Q{i + 1}.
                        </span>
                        {q.q}
                      </p>
                      {q.examTrap && (
                        <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                          Exam trap
                        </span>
                      )}
                    </div>

                    <ul className="mt-3 space-y-1.5">
                      {Object.entries(q.choices).map(([letter, text]) => (
                        <li
                          key={letter}
                          className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                            isRevealed && letter === q.correct
                              ? "bg-[#2a9d8f]/25 text-[#7dcdc4]"
                              : "bg-white/5 text-white/75"
                          }`}
                        >
                          <span className="font-bold">{letter}.</span> {text}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => toggleReveal(i)}
                      className="mt-3 text-xs font-semibold text-[#D4537E] hover:underline"
                    >
                      {isRevealed ? "Hide answer" : "Reveal answer & explanation"}
                    </button>

                    {isRevealed && (
                      <div className="mt-3 rounded-lg border border-[#2a9d8f]/30 bg-[#2a9d8f]/10 px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#7dcdc4]">
                          Answer: {q.correct}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-white/80">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </main>
    </div>
  );
}
