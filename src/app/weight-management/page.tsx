"use client";
export const dynamic = "force-dynamic";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { mediaController } from "@/lib/mediaController";

export default function WeightManagementPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const onPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    mediaController.stopAll();
    mediaController.play(v, "slim-t");
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

  const onAskSlimT = () => {
    router.push(`/chat?persona=slim-t&source=weight-management`);
  };

  const onEnded = () => setIsPlaying(false);

  const getVideoStatusText = () => {
    if (isPlaying) return "Slim-T is explaining weight & metabolism";
    return "Meet Slim-T — Weight Loss Without the Lies";
  };

  const tabs = [
    {
      title: "Why Weight Loss Stalls",
      content: [
        "Hormonal resistance",
        "Metabolic adaptation",
        "Inflammation & stress",
        "Medication misunderstanding"
      ]
    },
    {
      title: "What Actually Moves the Needle",
      content: [
        "GLP-1s explained simply",
        "Lifestyle vs medication roles",
        "What labs matter (and why)"
      ]
    },
    {
      title: "Track What Matters",
      content: [
        "Weight trends ≠ daily scale panic",
        "Labs + symptoms + history",
        "Blueprint integration"
      ]
    },
    {
      title: "Ask Better Questions",
      content: [
        "What to ask your provider",
        "Red flags to avoid",
        "Myths Slim-T shuts down"
      ]
    }
  ];

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
                className="w-full rounded-2xl border border-red-500/20"
                onCanPlay={() => setIsReady(true)}
                onEnded={onEnded}
                muted={isMuted}
                playsInline
              >
                <source src="/videos/mascots/slim-t.mp4" type="video/mp4" />
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
            <p className="text-red-400 text-sm mt-4 text-center font-medium">
              {getVideoStatusText()}
            </p>
          </div>

          {/* RIGHT COLUMN – INTRO COPY */}
          <div className="order-1 lg:order-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Weight Loss Isn't Willpower. It's Biology.
            </h1>
            <div className="text-lg text-gray-300 leading-relaxed space-y-4">
              <p>
                If calorie math actually worked, most people wouldn't still be stuck.
              </p>
              <p>
                Slim-T explains how hormones, metabolism, medications, and lifestyle actually affect weight — and why most programs fail you.
              </p>
              <p className="font-semibold text-red-400">
                This isn't hype. It's clarity.
              </p>
            </div>

            {/* PRIMARY CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={onPlay}
                disabled={!isReady}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ▶ Play: Learn How Slim-T Works
              </button>

              <button
                onClick={onAskSlimT}
                className="border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                💬 Ask Slim-T Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE TOOL SECTION */}
      <div className="bg-gray-900/30 border-y border-red-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What Slim-T Reveals
          </h2>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === index
                    ? "bg-red-600 text-white"
                    : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/40 border border-red-500/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {tabs[activeTab].title}
              </h3>
              <ul className="space-y-4">
                {tabs[activeTab].content.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <span className="text-red-400 mr-3">🔥</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST & SAFETY CALLOUT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-red-400 mb-4">Important:</h3>
          <p className="text-white/90 leading-relaxed">
            Slim-T does not prescribe or diagnose. This tool helps you understand weight-related biology so you can make informed decisions with your provider.
          </p>
        </div>
      </div>

      {/* SECONDARY CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-2xl font-semibold text-white mb-4">
          Confused about weight loss, meds, or hormones?
        </h3>
        <button
          onClick={onAskSlimT}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
        >
          Ask Slim-T
        </button>
      </div>
    </div>
  );
}