"use client";
export const dynamic = "force-dynamic";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { mediaController } from "@/lib/mediaController";

export default function LabDecoderPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const onPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    mediaController.stopAll();
    mediaController.play(v, "decode");
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

  const onAskDecode = () => {
    router.push(`/chat?persona=decode&source=lab-decoder`);
  };

  const onEnded = () => setIsPlaying(false);

  const getVideoStatusText = () => {
    if (isPlaying) return "Decode is explaining your lab results";
    return "Meet Decode — Your Lab Intelligence Guide";
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT COLUMN – VIDEO CARD */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full rounded-2xl border border-white/10"
                onCanPlay={() => setIsReady(true)}
                onEnded={onEnded}
                muted={isMuted}
                playsInline
                preload="metadata"
              >
                <source src="/videos/mascots/decode.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex gap-2">
                  {!isPlaying ? (
                    <button
                      onClick={onPlay}
                      disabled={!isReady}
                      className="bg-black/80 text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors disabled:opacity-50"
                    >
                      ▶ Play
                    </button>
                  ) : (
                    <button
                      onClick={onStop}
                      className="bg-black/80 text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors"
                    >
                      ⏹ Stop
                    </button>
                  )}

                  <button
                    onClick={onToggleMute}
                    className="bg-black/80 text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors"
                  >
                    {isMuted ? "🔇 Unmute" : "🔊 Mute"}
                  </button>
                </div>
              </div>
            </div>

            {/* Video Status Text */}
            <p className="text-white/70 text-sm mt-4 text-center">
              {getVideoStatusText()}
            </p>
          </div>

          {/* RIGHT COLUMN – INTRO COPY */}
          <div className="order-1 lg:order-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Decode Your Labs. Without the Panic.
            </h1>
            <div className="text-lg text-gray-300 leading-relaxed space-y-4">
              <p>
                Lab results are full of numbers, flags, and medical language that most people were never taught how to understand.
              </p>
              <p>
                Decode helps you translate your labs into clear explanations, patterns over time, and questions you can take to your provider — without fear, guessing, or Google spirals.
              </p>
              <p className="font-semibold text-cyan-400">
                This tool does not diagnose. It helps you understand.
              </p>
            </div>

            {/* PRIMARY CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={onPlay}
                disabled={!isReady}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ▶ Play: Learn How Decode Works
              </button>

              <button
                onClick={onAskDecode}
                className="border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                💬 Ask Decode Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE TOOL SECTION */}
      <div className="bg-gray-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How Decode Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🧪</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Upload Your Labs</h3>
              <p className="text-gray-300 leading-relaxed">
                Accept PDFs, images. Secure vault storage. No interpretation yet.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Decode & Organize</h3>
              <p className="text-gray-300 leading-relaxed">
                Flags explained (high / low / borderline). Labs grouped by category. Terminology translated.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Patterns Over Time</h3>
              <p className="text-gray-300 leading-relaxed">
                Repeated abnormalities surfaced. Family + history context. Blueprint intelligence updated.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST & SAFETY CALLOUT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">Important:</h3>
          <p className="text-white/90 leading-relaxed">
            Decode does not provide medical diagnoses or treatment plans. It helps you understand your lab information so you can have better conversations with your healthcare provider.
          </p>
        </div>
      </div>

      {/* SECONDARY CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-2xl font-semibold text-white mb-4">
          Have questions about your labs?
        </h3>
        <button
          onClick={onAskDecode}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-4 rounded-xl transition-colors"
        >
          Ask Decode
        </button>
      </div>
    </div>
  );
}
