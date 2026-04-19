"use client";

import { useCallback, useEffect, useState } from "react";
import type { FlashCard } from "@/lib/study/anatomy-data";

function shuffleOrder(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type Props = {
  lectureId: string;
  cards: FlashCard[];
  savedIndex: number;
  onNavigate: (index: number) => void;
};

export default function LectureFlashcards({
  lectureId,
  cards,
  savedIndex,
  onNavigate,
}: Props) {
  const [order, setOrder] = useState<number[]>(() =>
    cards.map((_, i) => i)
  );
  const [position, setPosition] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setOrder(cards.map((_, i) => i));
    setFlipped(false);
  }, [lectureId]);

  useEffect(() => {
    const n = cards.length;
    if (!n) return;
    const clamped = Math.min(Math.max(0, savedIndex), n - 1);
    setPosition(clamped);
    setFlipped(false);
  }, [lectureId, cards.length, savedIndex]);

  const n = cards.length;
  const cardIdx = n ? order[position % n] : 0;
  const card = n ? cards[cardIdx] : { term: "", definition: "" };

  const persist = useCallback(
    (nextPos: number) => {
      onNavigate(nextPos);
      void fetch("/api/study/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: "anatomy-physiology",
          lectureId,
          flashcardIdx: nextPos,
        }),
      });
    },
    [lectureId, onNavigate]
  );

  const go = (next: number) => {
    if (!n) return;
    const wrapped = ((next % n) + n) % n;
    setFlipped(false);
    setPosition(wrapped);
    persist(wrapped);
  };

  const shuffle = () => {
    const nextOrder = shuffleOrder(n);
    setOrder(nextOrder);
    setPosition(0);
    setFlipped(false);
    persist(0);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <p className="text-center text-sm text-gray-400">
        {n ? `${position + 1} of ${n}` : "0 of 0"}
      </p>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="relative h-56 w-full [perspective:1200px] md:h-64"
        aria-label={flipped ? "Show term" : "Show definition"}
      >
        <div
          className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center rounded-xl border border-gray-800 bg-gray-900 p-6 [backface-visibility:hidden]"
          >
            <p className="text-center text-lg font-semibold text-white md:text-xl">
              {card.term}
            </p>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-[#FF69B4]/40 bg-gray-950 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <p className="text-center text-base leading-relaxed text-gray-200 md:text-lg">
              {card.definition}
            </p>
            {card.clinicalTieIn && (
              <p className="mt-4 text-center text-xs leading-relaxed text-[#FF69B4]/80 border-t border-gray-800 pt-3 w-full">
                🩺 {card.clinicalTieIn}
              </p>
            )}
          </div>
        </div>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(position - 1)}
          disabled={!n}
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:border-[#FF69B4]/50 hover:text-[#FF69B4] disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={shuffle}
          disabled={!n}
          className="rounded-lg bg-[#FF69B4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#FF1493] disabled:opacity-40"
        >
          Shuffle
        </button>
        <button
          type="button"
          onClick={() => go(position + 1)}
          disabled={!n}
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:border-[#FF69B4]/50 hover:text-[#FF69B4] disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
