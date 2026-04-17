"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CheatSheetSection } from "@/lib/study/anatomy-data";

const COLOR_STYLES: Record<
  CheatSheetSection["color"],
  { border: string; title: string; bg: string }
> = {
  pink: {
    border: "border-pink-500/40",
    title: "text-[#FF69B4]",
    bg: "bg-pink-950/20",
  },
  teal: {
    border: "border-teal-500/40",
    title: "text-teal-400",
    bg: "bg-teal-950/20",
  },
  coral: {
    border: "border-orange-500/40",
    title: "text-orange-400",
    bg: "bg-orange-950/20",
  },
  amber: {
    border: "border-amber-500/40",
    title: "text-amber-400",
    bg: "bg-amber-950/20",
  },
  green: {
    border: "border-emerald-500/40",
    title: "text-emerald-400",
    bg: "bg-emerald-950/20",
  },
  purple: {
    border: "border-violet-500/40",
    title: "text-violet-400",
    bg: "bg-violet-950/20",
  },
};

type Props = {
  lectureId: string;
  sections: CheatSheetSection[];
  cheatViewed: boolean;
  onCheatViewed: () => void;
};

export default function LectureCheatSheet({
  lectureId,
  sections,
  cheatViewed,
  onCheatViewed,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [localViewed, setLocalViewed] = useState(cheatViewed);
  const firedRef = useRef(false);

  useEffect(() => {
    setLocalViewed(cheatViewed);
  }, [cheatViewed, lectureId]);

  const markViewed = useCallback(() => {
    if (firedRef.current || localViewed) return;
    firedRef.current = true;
    setLocalViewed(true);
    onCheatViewed();
    void fetch("/api/study/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: "anatomy-physiology",
        lectureId,
        cheatViewed: true,
      }),
    });
  }, [lectureId, localViewed, onCheatViewed]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || localViewed) return;

    const check = () => {
      const { scrollTop, clientHeight, scrollHeight } = el;
      if (scrollHeight <= 0) return;
      const ratio = (scrollTop + clientHeight) / scrollHeight;
      if (ratio >= 0.5) markViewed();
    };

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.5) {
            check();
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    obs.observe(el);
    el.addEventListener("scroll", check, { passive: true });
    check();

    return () => {
      obs.disconnect();
      el.removeEventListener("scroll", check);
    };
  }, [lectureId, localViewed, markViewed]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-400">
          Scroll through the sections. When you pass the halfway point, we mark
          this sheet as reviewed.
        </p>
        {localViewed && (
          <span className="shrink-0 rounded-full border border-[#FF69B4]/60 bg-[#FF69B4]/10 px-3 py-1 text-xs font-medium text-[#FF69B4]">
            Viewed ✓
          </span>
        )}
      </div>

      <div
        ref={scrollRef}
        className="max-h-[min(70vh,560px)] space-y-4 overflow-y-auto rounded-xl border border-gray-800 bg-gray-900/80 p-4 pr-2"
      >
        {sections.map((sec, i) => {
          const c = COLOR_STYLES[sec.color];
          return (
            <article
              key={`${sec.title}-${i}`}
              className={`rounded-lg border ${c.border} ${c.bg} p-4`}
            >
              <h3 className={`mb-2 text-lg font-semibold ${c.title}`}>
                {sec.title}
              </h3>
              <div
                className="prose prose-invert prose-sm max-w-none text-gray-300 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-gray-100"
                dangerouslySetInnerHTML={{ __html: sec.content }}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}
