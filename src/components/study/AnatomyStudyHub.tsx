"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ANATOMY_FREE_LECTURE_IDS,
  ANATOMY_STUDY_PRICE_DISPLAY,
  anatomyStudyShopHref,
} from "@/config/anatomy-study.config";
import { anatomyCourse } from "@/lib/study/anatomy-data";
import LectureCheatSheet from "./LectureCheatSheet";
import LectureFlashcards from "./LectureFlashcards";
import LectureQuiz from "./LectureQuiz";

const COURSE_ID = anatomyCourse.id;

type Tab = "cheat" | "quiz" | "cards";

type Row = {
  quizScores: Record<string, boolean>;
  flashcardIdx: number;
  cheatViewed: boolean;
};

function parseQuizScores(raw: unknown): Record<string, boolean> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const o: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === "boolean") o[k] = v;
    else if (v === "true") o[k] = true;
    else if (v === "false") o[k] = false;
  }
  return o;
}

function emptyRow(): Row {
  return { quizScores: {}, flashcardIdx: 0, cheatViewed: false };
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(100, Math.max(0, pct)) / 100);
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="shrink-0">
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke="rgb(31 41 55)"
        strokeWidth="3"
      />
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        className="stroke-[#FF69B4]"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform="rotate(-90 18 18)"
      />
    </svg>
  );
}

function lectureUnlocked(fullAccess: boolean | null, lectureId: string): boolean {
  if (fullAccess === true) return true;
  return ANATOMY_FREE_LECTURE_IDS.has(lectureId);
}

export default function AnatomyStudyHub() {
  const lectures = anatomyCourse.lectures;
  const [selectedId, setSelectedId] = useState(lectures[0]?.id ?? "");
  const [tab, setTab] = useState<Tab>("cheat");
  const [byLecture, setByLecture] = useState<Record<string, Row>>({});
  const [loading, setLoading] = useState(true);
  const [fullAccess, setFullAccess] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [accessRes, progRes] = await Promise.all([
          fetch("/api/study/access", { cache: "no-store" }),
          fetch(
            `/api/study/progress?courseId=${encodeURIComponent(COURSE_ID)}`,
            { cache: "no-store" }
          ),
        ]);

        let paid = false;
        if (accessRes.ok) {
          const aj = (await accessRes.json()) as { fullAccess?: boolean };
          paid = aj.fullAccess === true;
        }
        if (!alive) return;
        setFullAccess(paid);

        if (progRes.ok) {
          const data = (await progRes.json()) as {
            progress: Array<{
              lectureId: string;
              quizScores: unknown;
              flashcardIdx: number;
              cheatViewed: boolean;
            }>;
          };
          const next: Record<string, Row> = {};
          for (const p of data.progress) {
            next[p.lectureId] = {
              quizScores: parseQuizScores(p.quizScores),
              flashcardIdx: p.flashcardIdx ?? 0,
              cheatViewed: p.cheatViewed ?? false,
            };
          }
          setByLecture(next);
        } else {
          setByLecture({});
        }
      } catch {
        if (alive) {
          setByLecture({});
          setFullAccess(false);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const lecturesForStats = useMemo(() => {
    if (fullAccess === true) return lectures;
    return lectures.filter((l) => ANATOMY_FREE_LECTURE_IDS.has(l.id));
  }, [lectures, fullAccess]);

  const active = useMemo(() => {
    const cur = lectures.find((l) => l.id === selectedId);
    if (cur && lectureUnlocked(fullAccess, cur.id)) return cur;
    return (
      lectures.find((l) => ANATOMY_FREE_LECTURE_IDS.has(l.id)) ?? lectures[0]
    );
  }, [lectures, selectedId, fullAccess]);

  const totalQuestions = useMemo(
    () => lecturesForStats.reduce((s, l) => s + l.quiz.length, 0),
    [lecturesForStats]
  );

  const totalCorrect = useMemo(() => {
    return lecturesForStats.reduce((sum, lec) => {
      const scores = parseQuizScores(byLecture[lec.id]?.quizScores);
      return (
        sum +
        lec.quiz.reduce((a, _, i) => a + (scores[`q${i}`] === true ? 1 : 0), 0)
      );
    }, 0);
  }, [byLecture, lecturesForStats]);

  const overallPct =
    totalQuestions > 0
      ? Math.round((totalCorrect / totalQuestions) * 100)
      : 0;

  const selectLecture = useCallback(
    (lecId: string) => {
      if (!lectureUnlocked(fullAccess, lecId)) {
        window.location.href = anatomyStudyShopHref;
        return;
      }
      setSelectedId(lecId);
      setTab("cheat");
    },
    [fullAccess]
  );

  const rowFor = useCallback(
    (lectureId: string): Row => byLecture[lectureId] ?? emptyRow(),
    [byLecture]
  );

  const onAnswer = useCallback((lectureId: string, qIndex: number, correct: boolean) => {
    setByLecture((prev) => {
      const cur = prev[lectureId] ?? emptyRow();
      const qs = {
        ...parseQuizScores(cur.quizScores),
        [`q${qIndex}`]: correct,
      };
      return { ...prev, [lectureId]: { ...cur, quizScores: qs } };
    });
  }, []);

  const onQuizReset = useCallback((lectureId: string) => {
    setByLecture((prev) => {
      const cur = prev[lectureId] ?? emptyRow();
      return { ...prev, [lectureId]: { ...cur, quizScores: {} } };
    });
  }, []);

  const onFlashNavigate = useCallback((lectureId: string, idx: number) => {
    setByLecture((prev) => {
      const cur = prev[lectureId] ?? emptyRow();
      return { ...prev, [lectureId]: { ...cur, flashcardIdx: idx } };
    });
  }, []);

  const onCheatViewed = useCallback((lectureId: string) => {
    setByLecture((prev) => {
      const cur = prev[lectureId] ?? emptyRow();
      return { ...prev, [lectureId]: { ...cur, cheatViewed: true } };
    });
  }, []);

  if (loading || !active) {
    return (
      <div className="min-h-screen bg-black px-4 py-24 text-center text-gray-400">
        Loading study hub…
      </div>
    );
  }

  const curRow = rowFor(active.id);
  const scores = parseQuizScores(curRow.quizScores);
  const nQ = active.quiz.length;
  const correctLec = active.quiz.reduce(
    (a, _, i) => a + (scores[`q${i}`] === true ? 1 : 0),
    0
  );
  const lecPct = nQ ? Math.round((correctLec / nQ) * 100) : 0;
  const lecPerfect = nQ > 0 && correctLec === nQ;

  const tabBtn = (t: Tab, label: string) => (
    <button
      type="button"
      key={t}
      onClick={() => setTab(t)}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors md:px-4 ${
        tab === t
          ? "border border-[#FF69B4] text-[#FF69B4]"
          : "border border-transparent text-gray-400 hover:text-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <header className="border-b border-gray-800 bg-gray-950/80 px-4 py-5 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/nursing-study/anatomy"
              className="text-sm font-medium text-[#FF69B4] hover:text-[#FF1493] hover:underline"
            >
              ← A&amp;P overview
            </Link>
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-[#FF69B4]">
              No Prior Authorization
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
              Anatomy &amp; Physiology
            </h1>
            <p className="mt-1 max-w-xl text-sm text-gray-400">
              {anatomyCourse.title} — cheat sheets, quizzes, and flashcards.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {fullAccess === false && (
              <Link
                href={anatomyStudyShopHref}
                className="rounded-full bg-[#FF69B4] px-3 py-1 text-xs font-semibold text-white hover:bg-[#FF1493]"
              >
                Unlock full course {ANATOMY_STUDY_PRICE_DISPLAY}
              </Link>
            )}
            {fullAccess === true && (
              <span className="rounded-full border border-emerald-700/60 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-400">
                Full access
              </span>
            )}
            {fullAccess === false && (
              <span className="rounded-full border border-amber-600/50 bg-amber-950/30 px-3 py-1 text-xs font-medium text-amber-200">
                Preview · Lecture 1 free
              </span>
            )}
            <Link
              href="/login?callbackUrl=/nursing-study/anatomy/hub"
              className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs font-medium text-gray-300 hover:border-[#FF69B4]/50 hover:text-[#FF69B4]"
            >
              Log in to save progress
            </Link>
            <span className="rounded-full border border-[#FF69B4]/40 bg-[#FF69B4]/10 px-3 py-1 text-xs font-semibold text-[#FF69B4]">
              {COURSE_ID}
            </span>
          </div>
        </div>

        {fullAccess === false && (
          <div className="mx-auto mt-4 max-w-6xl rounded-lg border border-amber-600/40 bg-amber-950/25 px-4 py-3 text-sm text-amber-100">
            <strong className="text-amber-50">Free preview:</strong> Lecture 1 only
            (cheat sheet, quiz, flashcards). Purchase unlocks lectures 2–12 and all{" "}
            {anatomyCourse.lectures.reduce((s, l) => s + l.quiz.length, 0)} questions.{" "}
            <Link
              href={anatomyStudyShopHref}
              className="font-semibold text-[#FF69B4] underline hover:text-[#FF1493]"
            >
              Buy full course ({ANATOMY_STUDY_PRICE_DISPLAY})
            </Link>
            {" · "}
            After checkout, use the link in your email and click{" "}
            <em>Activate full course access</em>.
          </div>
        )}

        <div className="mx-auto mt-5 max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-400">
            <span>
              {fullAccess === false
                ? "Quiz mastery (free preview)"
                : "Overall quiz mastery"}
            </span>
            <span className="font-semibold text-white">
              {totalCorrect}/{totalQuestions}{" "}
              <span className="text-[#FF69B4]">({overallPct}%)</span>
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-[#FF69B4] transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8">
        {/* Mobile lecture strip */}
        <nav className="lg:hidden">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Lectures
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {lectures.map((lec) => {
              const unlocked = lectureUnlocked(fullAccess, lec.id);
              const r = rowFor(lec.id);
              const sc = parseQuizScores(r.quizScores);
              const c = lec.quiz.reduce(
                (a, _, i) => a + (sc[`q${i}`] === true ? 1 : 0),
                0
              );
              const pct = lec.quiz.length
                ? Math.round((c / lec.quiz.length) * 100)
                : 0;
              const perfect = lec.quiz.length > 0 && c === lec.quiz.length;
              const sel = lec.id === selectedId;
              return (
                <button
                  type="button"
                  key={lec.id}
                  onClick={() => selectLecture(lec.id)}
                  className={`flex min-w-[10.5rem] shrink-0 flex-col rounded-xl border px-3 py-2 text-left transition-colors ${
                    !unlocked
                      ? "border-gray-800 border-dashed bg-gray-950/80 opacity-75"
                      : sel
                        ? "border-[#FF69B4] bg-gray-900"
                        : "border-gray-800 bg-gray-950"
                  }`}
                >
                  <span className="text-xs text-gray-500">
                    Lec {lec.number}
                    {!unlocked && " · 🔒"}
                  </span>
                  <span className="line-clamp-2 text-sm font-medium text-white">
                    {lec.icon} {lec.title}
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <ProgressRing pct={pct} />
                    {perfect && unlocked && (
                      <span className="text-[#FF69B4]" aria-hidden>
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Desktop sidebar */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
            Lectures
          </p>
          <ul className="space-y-2">
            {lectures.map((lec) => {
              const unlocked = lectureUnlocked(fullAccess, lec.id);
              const r = rowFor(lec.id);
              const sc = parseQuizScores(r.quizScores);
              const c = lec.quiz.reduce(
                (a, _, i) => a + (sc[`q${i}`] === true ? 1 : 0),
                0
              );
              const pct = lec.quiz.length
                ? Math.round((c / lec.quiz.length) * 100)
                : 0;
              const perfect = lec.quiz.length > 0 && c === lec.quiz.length;
              const sel = lec.id === selectedId;
              return (
                <li key={lec.id}>
                  <button
                    type="button"
                    onClick={() => selectLecture(lec.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      !unlocked
                        ? "border-gray-800 border-dashed text-gray-500 hover:border-gray-600"
                        : sel
                          ? "border-[#FF69B4] text-[#FF69B4]"
                          : "border-gray-800 text-gray-300 hover:border-gray-700"
                    }`}
                  >
                    <ProgressRing pct={pct} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {lec.number}.
                          {!unlocked && " 🔒"}
                        </span>
                        {perfect && unlocked && (
                          <span className="text-[#FF69B4]" title="100% correct">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="truncate text-sm font-medium">
                        <span className="mr-1">{lec.icon}</span>
                        {lec.title}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 md:p-6">
            <div className="border-b border-gray-800 pb-4">
              <p className="text-sm text-[#FF69B4]">Lecture {active.number}</p>
              <h2 className="mt-1 text-xl font-bold text-white md:text-2xl">
                {active.icon} {active.title}
              </h2>
              <p className="mt-1 text-sm text-gray-400">{active.subtitle}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <span>
                  Quiz score this lecture:{" "}
                  <span className="font-semibold text-white">
                    {correctLec}/{nQ}
                  </span>{" "}
                  <span className="text-[#FF69B4]">({lecPct}%)</span>
                </span>
                {lecPerfect && (
                  <span className="text-[#FF69B4]">Perfect ✓</span>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-b border-gray-800 pb-4">
              {tabBtn("cheat", "Cheat Sheet")}
              {tabBtn("quiz", "Quiz")}
              {tabBtn("cards", "Flashcards")}
            </div>

            <div className="mt-6">
              {tab === "cheat" && (
                <LectureCheatSheet
                  lectureId={active.id}
                  sections={active.cheatSheet}
                  cheatViewed={curRow.cheatViewed}
                  onCheatViewed={() => onCheatViewed(active.id)}
                />
              )}
              {tab === "quiz" && (
                <LectureQuiz
                  lectureId={active.id}
                  questions={active.quiz}
                  savedAnswers={scores}
                  onAnswer={(qi, ok) => onAnswer(active.id, qi, ok)}
                  onReset={() => onQuizReset(active.id)}
                />
              )}
              {tab === "cards" && (
                <LectureFlashcards
                  lectureId={active.id}
                  cards={active.flashcards}
                  savedIndex={curRow.flashcardIdx}
                  onNavigate={(idx) => onFlashNavigate(active.id, idx)}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
