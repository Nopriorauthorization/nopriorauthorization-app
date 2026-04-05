"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type NclexSlideshowSlide = {
  src: string;
  alt: string;
  /** Short label above title */
  badge: string;
  title: string;
  description: string;
};

const AUTO_MS = 5500;

type Props = {
  slides: NclexSlideshowSlide[];
  className?: string;
};

export function NclexPreviewSlideshow({ slides, className = "" }: Props) {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (reducedMotion || slides.length < 2) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_MS);
  }, [clearTimer, reducedMotion, slides.length]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  const go = (next: number) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
    startTimer();
  };

  const current = slides[index];
  if (!current) return null;

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#0d1117] p-4 shadow-xl sm:p-6 ${className}`}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
    >
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#11161f]">
        <div className="relative aspect-[11/9] w-full bg-[#0a1628] sm:aspect-[11/8]">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            className="object-contain object-top"
            sizes="(max-width: 768px) 100vw, 896px"
            priority={index === 0}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4537E]">{current.badge}</p>
          <h3 className="mt-1 font-serif text-xl font-bold text-white">{current.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-400">{current.description}</p>
          <p className="sr-only">
            Slide {index + 1} of {slides.length}: {current.title}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:border-[#D4537E]/50 hover:bg-white/5"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:border-[#D4537E]/50 hover:bg-white/5"
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Slideshow slides">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show slide ${i + 1}: ${s.title}`}
            onClick={() => go(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-8 bg-[#D4537E]" : "w-2.5 bg-white/25 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
