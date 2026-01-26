"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { mediaController } from "@/lib/mediaController";

type VaultStyleMascotSectionProps = {
  mascotId: "root" | "decode" | "slim-t" | "beau-tox" | "filla-grace" | "harmony" | "peppi";
  displayName: string;
  tagline: string;
  description: string;
  imageSrc: string;
  videoSrc: string;
  chatPersona: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  ctaText: string;
  ctaHref: string;
  source?: string;
  // Color theme configuration
  primaryColor: string; // e.g., "emerald", "blue", "red", etc.
  secondaryColor: string; // e.g., "green", "indigo", "orange", etc.
  accentColor: string; // e.g., "teal", "cyan", "yellow", etc.
};

export default function VaultStyleMascotSection({
  mascotId,
  displayName,
  tagline,
  description,
  imageSrc,
  videoSrc,
  chatPersona,
  features,
  ctaText,
  ctaHref,
  source,
  primaryColor,
  secondaryColor,
  accentColor,
}: VaultStyleMascotSectionProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const onLearn = () => {
    const v = videoRef.current;
    if (!v) return;
    mediaController.play(v);
    setIsVideoPlaying(true);
  };

  const onStop = () => {
    mediaController.stopAll();
    setIsVideoPlaying(false);
    const v = videoRef.current;
    if (!v) return;
    try {
      v.pause();
      v.currentTime = 0;
    } catch {}
  };

  const onAsk = () => {
    router.push(`/chat?persona=${encodeURIComponent(chatPersona)}&source=${encodeURIComponent(source || mascotId)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-16"
    >
      <div className={`relative bg-gradient-to-br from-${primaryColor}-500/10 via-${secondaryColor}-500/5 to-${accentColor}-500/10 border border-${primaryColor}-500/30 rounded-3xl p-8 lg:p-12 overflow-hidden`}>
        {/* Decorative background elements */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-${primaryColor}-400/10 to-${secondaryColor}-400/5 rounded-full blur-3xl -translate-y-32 translate-x-32`}></div>
        <div className={`absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-${accentColor}-400/10 to-${primaryColor}-400/5 rounded-full blur-2xl translate-y-24 -translate-x-24`}></div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-xl bg-gradient-to-br from-${primaryColor}-500 to-${secondaryColor}-600 text-white shadow-lg shadow-${primaryColor}-500/25`}>
                <span className="text-2xl">{getMascotIcon(mascotId)}</span>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white">{displayName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-12 h-1 bg-gradient-to-r from-${primaryColor}-400 to-${secondaryColor}-500 rounded-full`}></div>
                  <span className={`text-${primaryColor}-400 text-sm font-medium`}>{tagline}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {description}
            </p>

            {/* Enhanced feature tabs */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.slice(0, 4).map((feature, index) => (
                <div key={index} className={`group bg-gradient-to-br from-${primaryColor}-500/20 to-${secondaryColor}-500/10 border border-${primaryColor}-500/30 rounded-xl p-4 hover:from-${primaryColor}-500/30 hover:to-${secondaryColor}-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-${primaryColor}-500/20`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-${primaryColor}-400 group-hover:text-${primaryColor}-300 transition-colors text-lg`}>{feature.icon}</span>
                    <span className={`text-${primaryColor}-400 font-semibold text-sm group-hover:text-${primaryColor}-300`}>{feature.title}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-tight">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={onLearn}
                className={`inline-flex items-center gap-3 bg-gradient-to-r from-${primaryColor}-500 via-${secondaryColor}-500 to-${accentColor}-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-${primaryColor}-600 hover:via-${secondaryColor}-600 hover:to-${accentColor}-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-${primaryColor}-500/30`}
              >
                <span>▶ Learn with {displayName}</span>
              </button>

              <button
                onClick={onAsk}
                className={`inline-flex items-center gap-3 border border-${primaryColor}-500/30 bg-${primaryColor}-500/10 text-${primaryColor}-400 px-6 py-3 rounded-xl font-semibold hover:bg-${primaryColor}-500/20 hover:border-${primaryColor}-500/50 transition-all duration-300 hover:scale-105`}
              >
                <span>💬 Ask {displayName}</span>
              </button>

              {isVideoPlaying && (
                <button
                  onClick={onStop}
                  className="inline-flex items-center gap-3 border border-gray-500/30 bg-gray-500/10 text-gray-400 px-6 py-3 rounded-xl font-semibold hover:bg-gray-500/20 hover:border-gray-500/50 transition-all duration-300"
                >
                  <span>⏹ Stop Video</span>
                </button>
              )}
            </div>

            {/* Video Player (hidden but functional) */}
            <div className="hidden">
              <video
                ref={videoRef}
                src={videoSrc}
                preload="metadata"
                playsInline
                muted={isVideoMuted}
                onEnded={() => setIsVideoPlaying(false)}
                className="w-full h-auto"
              />
            </div>

            <Link
              href={ctaHref}
              className={`inline-flex items-center gap-3 bg-gradient-to-r from-${primaryColor}-500 via-${secondaryColor}-500 to-${accentColor}-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-${primaryColor}-600 hover:via-${secondaryColor}-600 hover:to-${accentColor}-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-${primaryColor}-500/30`}
            >
              <span>{ctaText}</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-start">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-br from-${primaryColor}-400/20 to-${secondaryColor}-400/10 rounded-3xl blur-xl scale-110`}></div>
              <Image
                src={imageSrc}
                alt={`${displayName} - ${tagline}`}
                width={400}
                height={400}
                className="relative rounded-3xl shadow-2xl border border-white/20"
                priority
              />
              <div className={`absolute -bottom-6 -left-6 bg-gradient-to-r from-${primaryColor}-500 via-${secondaryColor}-500 to-${accentColor}-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl border border-white/10`}>
                {getDomainBadge(mascotId)}
              </div>
              <div className={`absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-${primaryColor}-400 to-${secondaryColor}-500 rounded-full flex items-center justify-center shadow-lg`}>
                <span className="text-white text-sm">✨</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper functions
function getMascotIcon(mascotId: string): string {
  const icons: Record<string, string> = {
    root: "🌳",
    decode: "🔬",
    "slim-t": "⚖️",
    "beau-tox": "💉",
    "filla-grace": "💄",
    harmony: "🌸",
    peppi: "🧪",
  };
  return icons[mascotId] || "🤖";
}

function getDomainBadge(mascotId: string): string {
  const badges: Record<string, string> = {
    root: "🌳 Family Intelligence",
    decode: "🔬 Lab Intelligence",
    "slim-t": "⚖️ Weight Intelligence",
    "beau-tox": "💉 Aesthetics Intelligence",
    "filla-grace": "💄 Beauty Intelligence",
    harmony: "🌸 Hormone Intelligence",
    peppi: "🧪 Peptide Intelligence",
  };
  return badges[mascotId] || "AI Intelligence";
}