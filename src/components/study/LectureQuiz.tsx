"use client";

import { useEffect, useState } from "react";
import type { QuizQuestion } from "@/lib/study/anatomy-data";

type Props = {
  lectureId: string;
  questions: QuizQuestion[];
  savedAnswers: Record<string, boolean>;
  onAnswer: (qIndex: number, correct: boolean) => void;
  onReset: () => void;
};

export default function LectureQuiz({
  lectureId,
  questions,
  savedAnswers,
  onAnswer,
  onReset,
}: Props) {
  const [pickedOption, setPickedOption] = useState<Record<number, number>>(
    {}
  );

  useEffect(() => {
    setPickedOption({});
  }, [lectureId]);

  const pick = (qIndex: number, optionIndex: number) => {
    const k = `q${qIndex}`;
    if (k in savedAnswers) return;
    const q = questions[qIndex];
    const correct = optionIndex === q.correctIndex;
    setPickedOption((prev) => ({ ...prev, [qIndex]: optionIndex }));
    onAnswer(qIndex, correct);
    void fetch("/api/study/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: "anatomy-physiology",
        lectureId,
        quizScores: { ...savedAnswers, [k]: correct },
      }),
    });
  };

  const reset = () => {
    setPickedOption({});
    void fetch("/api/study/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: "anatomy-physiology",
        lectureId,
        quizScores: {},
      }),
    });
    onReset();
  };

  const correctCount = questions.reduce((acc, _, i) => {
    const k = `q${i}`;
    return acc + (savedAnswers[k] === true ? 1 : 0);
  }, 0);

  const answeredCount = questions.reduce((acc, _, i) => {
    return acc + (`q${i}` in savedAnswers ? 1 : 0);
  }, 0);

  const pct =
    questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-400">Score</p>
          <p className="text-xl font-semibold text-white">
            {correctCount}/{questions.length}{" "}
            <span className="text-[#FF69B4]">({pct}%)</span>
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:border-[#FF69B4]/50 hover:text-[#FF69B4]"
        >
          Reset this lecture
        </button>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-[#FF69B4] transition-all"
          style={{
            width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%`,
          }}
        />
      </div>

      <ol className="space-y-8">
        {questions.map((q, qi) => {
          const k = `q${qi}`;
          const locked = k in savedAnswers;
          const picked = pickedOption[qi];

          return (
            <li
              key={qi}
              className="rounded-xl border border-gray-800 bg-gray-900 p-4 md:p-5"
            >
              <p className="font-medium text-gray-100">
                <span className="text-[#FF69B4]">Q{qi + 1}.</span> {q.question}
              </p>
              <ul className="mt-3 space-y-2">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.correctIndex;
                  const isPicked = locked && picked === oi;
                  const showResult = locked;

                  let box =
                    "border-gray-700 bg-gray-950/50 hover:border-gray-600";
                  if (showResult) {
                    if (isCorrect) {
                      box =
                        "bg-green-900/30 border-green-500 text-green-400 border";
                    } else if (isPicked && !isCorrect) {
                      box =
                        "bg-red-900/30 border-red-500 text-red-400 border";
                    }
                  }

                  return (
                    <li key={oi}>
                      <button
                        type="button"
                        disabled={locked}
                        onClick={() => pick(qi, oi)}
                        className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${box} ${
                          !locked ? "cursor-pointer" : "cursor-default"
                        }`}
                      >
                        {opt}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {locked && (
                <p className="mt-3 text-sm text-gray-400">{q.explanation}</p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
