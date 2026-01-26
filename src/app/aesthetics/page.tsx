"use client";
export const dynamic = "force-dynamic";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { mediaController } from "@/lib/mediaController";

export default function AestheticsPage() {
  const router = useRouter();
  const beauToxVideoRef = useRef<HTMLVideoElement>(null);
  const fillaGraceVideoRef = useRef<HTMLVideoElement>(null);

  const [isBeauToxReady, setIsBeauToxReady] = useState(false);
  const [isFillaGraceReady, setIsFillaGraceReady] = useState(false);
  const [isBeauToxMuted, setIsBeauToxMuted] = useState(true);
  const [isFillaGraceMuted, setIsFillaGraceMuted] = useState(true);
  const [isBeauToxPlaying, setIsBeauToxPlaying] = useState(false);
  const [isFillaGracePlaying, setIsFillaGracePlaying] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const onBeauToxPlay = () => {
    const v = beauToxVideoRef.current;
    if (!v) return;
    mediaController.stopAll();
    mediaController.play(v, "beau-tox");
    setIsBeauToxPlaying(true);
    setIsFillaGracePlaying(false);
  };

  const onFillaGracePlay = () => {
    const v = fillaGraceVideoRef.current;
    if (!v) return;
    mediaController.stopAll();
    mediaController.play(v, "filla-grace");
    setIsFillaGracePlaying(true);
    setIsBeauToxPlaying(false);
  };

  const onBeauToxStop = () => {
    mediaController.stopAll();
    setIsBeauToxPlaying(false);
    const v = beauToxVideoRef.current;
    if (!v) return;
    try {
      v.pause();
      v.currentTime = 0;
    } catch {}
  };

  const onFillaGraceStop = () => {
    mediaController.stopAll();
    setIsFillaGracePlaying(false);
    const v = fillaGraceVideoRef.current;
    if (!v) return;
    try {
      v.pause();
      v.currentTime = 0;
    } catch {}
  };

  const onBeauToxToggleMute = () => {
    const v = beauToxVideoRef.current;
    if (!v) return;
    const next = !isBeauToxMuted;
    v.muted = next;
    setIsBeauToxMuted(next);
    mediaController.setMuted(next);
  };

  const onFillaGraceToggleMute = () => {
    const v = fillaGraceVideoRef.current;
    if (!v) return;
    const next = !isFillaGraceMuted;
    v.muted = next;
    setIsFillaGraceMuted(next);
    mediaController.setMuted(next);
  };

  const onAskBeauTox = () => {
    router.push(`/chat?persona=beau-tox&source=aesthetics`);
  };

  const onAskFillaGrace = () => {
    router.push(`/chat?persona=filla-grace&source=aesthetics`);
  };

  const onBeauToxEnded = () => setIsBeauToxPlaying(false);
  const onFillaGraceEnded = () => setIsFillaGracePlaying(false);

  const getBeauToxStatusText = () => {
    if (isBeauToxPlaying) return "Beau-Tox is explaining neuromodulators";
    return "Meet Beau-Tox — Botox Without the BS";
  };

  const getFillaGraceStatusText = () => {
    if (isFillaGracePlaying) return "Filla-Grace is explaining fillers & anatomy";
    return "Meet Filla-Grace — Fillers Done Right";
  };

  const tabs = [
    {
      title: "Botox Explained",
      content: [
        "What it does",
        "What it doesn't do",
        "How long it lasts",
        "Common myths Beau-Tox shuts down"
      ]
    },
    {
      title: "Fillers Explained",
      content: [
        "Structure vs volume",
        "Facial anatomy basics",
        "Why 'natural' is often misunderstood",
        "Longevity & safety"
      ]
    },
    {
      title: "Red Flags to Avoid",
      content: [
        "Overfilling",
        "Trend chasing",
        "Bad injector behavior",
        "Unsafe anatomy zones"
      ]
    },
    {
      title: "Ask Better Questions",
      content: [
        "What to ask before treatment",
        "How to spot a skilled injector",
        "When to say no"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Aesthetics Without the Guesswork
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Botox and fillers aren't the same — and confusing them leads to bad outcomes.
          Learn how they actually work before letting anyone touch your face.
        </p>
      </div>

      {/* SPLIT MASCOT LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT CARD – BEAU-TOX */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Beau-Tox</h2>
              <p className="text-pink-400 text-sm font-medium">Botox & Neuromodulators</p>
            </div>

            {/* Video */}
            <div className="relative mb-6">
              <video
                ref={beauToxVideoRef}
                className="w-full rounded-2xl border border-white/10"
                onCanPlay={() => setIsBeauToxReady(true)}
                onEnded={onBeauToxEnded}
                muted={isBeauToxMuted}
                playsInline
                preload="metadata"
              >
                <source src="/hero/avatars/beau-tox-intro.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex gap-2">
                  {!isBeauToxPlaying ? (
                    <button
                      onClick={onBeauToxPlay}
                      disabled={!isBeauToxReady}
                      className="bg-black/80 text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors disabled:opacity-50"
                    >
                      ▶ Play
                    </button>
                  ) : (
                    <button
                      onClick={onBeauToxStop}
                      className="bg-black/80 text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors"
                    >
                      ⏹ Stop
                    </button>
                  )}

                  <button
                    onClick={onBeauToxToggleMute}
                    className="bg-black/80 text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors"
                  >
                    {isBeauToxMuted ? "🔇 Unmute" : "🔊 Mute"}
                  </button>
                </div>
              </div>
            </div>

            {/* Status Text */}
            <p className="text-pink-400 text-sm mb-6 text-center font-medium">
              {getBeauToxStatusText()}
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={onBeauToxPlay}
                disabled={!isBeauToxReady}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ▶ Learn About Botox
              </button>

              <button
                onClick={onAskBeauTox}
                className="w-full border border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                💬 Ask Beau-Tox
              </button>
            </div>
          </div>

          {/* RIGHT CARD – FILLA-GRACE */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Filla-Grace</h2>
              <p className="text-pink-400 text-sm font-medium">Dermal Fillers</p>
            </div>

            {/* Video */}
            <div className="relative mb-6">
              <video
                ref={fillaGraceVideoRef}
                className="w-full rounded-2xl border border-white/10"
                onCanPlay={() => setIsFillaGraceReady(true)}
                onEnded={onFillaGraceEnded}
                muted={isFillaGraceMuted}
                playsInline
                preload="metadata"
              >
                <source src="/hero/avatars/f-ill-intro.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex gap-2">
                  {!isFillaGracePlaying ? (
                    <button
                      onClick={onFillaGracePlay}
                      disabled={!isFillaGraceReady}
                      className="bg-black/80 text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors disabled:opacity-50"
                    >
                      ▶ Play
                    </button>
                  ) : (
                    <button
                      onClick={onFillaGraceStop}
                      className="bg-black/80 text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors"
                    >
                      ⏹ Stop
                    </button>
                  )}

                  <button
                    onClick={onFillaGraceToggleMute}
                    className="bg-black/80 text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors"
                  >
                    {isFillaGraceMuted ? "🔇 Unmute" : "🔊 Mute"}
                  </button>
                </div>
              </div>
            </div>

            {/* Status Text */}
            <p className="text-pink-400 text-sm mb-6 text-center font-medium">
              {getFillaGraceStatusText()}
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={onFillaGracePlay}
                disabled={!isFillaGraceReady}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ▶ Learn About Fillers
              </button>

              <button
                onClick={onAskFillaGrace}
                className="w-full border border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                💬 Ask Filla-Grace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE EDUCATION SECTION */}
      <div className="bg-gray-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Understanding Aesthetics
          </h2>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === index
                    ? "bg-pink-600 text-white"
                    : "bg-pink-500/10 text-pink-400 hover:bg-pink-500/20"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {tabs[activeTab].title}
              </h3>
              <ul className="space-y-4">
                {tabs[activeTab].content.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <span className="text-pink-400 mr-3">
                      {activeTab === 0 ? "💉" : activeTab === 1 ? "💎" : activeTab === 2 ? "⚠️" : "🧠"}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SAFETY & TRUST CALLOUT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-pink-400 mb-4">Important:</h3>
          <p className="text-white/90 leading-relaxed">
            Beau-Tox and Filla-Grace do not replace licensed providers. They exist to help you understand treatments so you can make informed, safer decisions.
          </p>
        </div>
      </div>

      {/* FINAL CTA SECTION */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Not sure what's right for your face?
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onAskBeauTox}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Ask Beau-Tox
          </button>
          <button
            onClick={onAskFillaGrace}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Ask Filla-Grace
          </button>
        </div>
      </div>
    </div>
  );
}