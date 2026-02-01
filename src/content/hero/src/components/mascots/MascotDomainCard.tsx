"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mediaController } from "@/lib/mediaController";

type MascotDomainCardProps = {
  mascotId: "beau-tox" | "filla-grace" | "slim-t" | "root" | "decode" | "harmony" | "peppi";
  displayName: string;
  title: string;
  description: string;
  posterSrc?: string;
  mp4Src: string;
  chatPersona: string;
  primaryCtaLabel?: string;
  chatCtaLabel?: string;
  source?: string;
};

export default function MascotDomainCard({
  mascotId,
  displayName,
  title,
  description,
  posterSrc,
  mp4Src,
  chatPersona,
  primaryCtaLabel,
  chatCtaLabel,
  source,
}: MascotDomainCardProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const learnLabel = primaryCtaLabel ?? `Learn with ${displayName}`;
  const askLabel = chatCtaLabel ?? `Ask ${displayName}`;

  const onPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    mediaController.play(v);
    setIsPlaying(true);
  };

  const onStop = () => {
    mediaController.stopAll();
    setIsPlaying(false);
    const v = videoRef.current;
    if (!v) return;
    try {
      v.pause();
      v.currentTime = 0;
    } catch {}
  };

  const onToggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    v.muted = next;
    setIsMuted(next);
    mediaController.setMuted(next);
  };

  const onAsk = () => {
    router.push(`/chat?persona=${encodeURIComponent(chatPersona)}&source=${encodeURIComponent(source || mascotId)}`);
  };

  const onEnded = () => setIsPlaying(false);

  return (
    <section className="rounded-2xl border border-white/10 bg-black/40 p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
        <div className="md:w-[44%]">
          <div className="mb-2 text-2xl font-semibold text-white">{displayName}</div>
          <div className="mb-3 text-sm font-medium text-pink-400">{title}</div>
          <p className="text-white/80">{description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onPlay}
              disabled={!isReady}
              className="rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-black disabled:opacity-60"
              aria-label={`${learnLabel}`}
            >
              ▶ {learnLabel}
            </button>

            <button
              type="button"
              onClick={onAsk}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              aria-label={`${askLabel}`}
            >
              💬 {askLabel}
            </button>

            <button
              type="button"
              onClick={onStop}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              aria-label="Stop video"
            >
              ⏹ Stop
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? "🔇 Muted" : "🔊 Sound On"}
            </button>
          </div>

          <div className="mt-3 text-xs text-white/50">
            {isReady ? (isPlaying ? "Playing (one speaker enforced)" : "Ready") : "Preparing video…"}
          </div>
        </div>

        <div className="md:w-[56%]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
            <video
              ref={videoRef}
              src={mp4Src}
              poster={posterSrc}
              preload="metadata"
              playsInline
              muted={isMuted}
              controls={false}
              onCanPlay={() => setIsReady(true)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={onEnded}
              className="h-auto w-full"
            />
          </div>
          <div className="mt-2 text-xs text-white/50">
            Click "Learn" to play. Click "Ask" to open a dedicated chat for this domain.
          </div>
        </div>
      </div>
    </section>
  );
}
