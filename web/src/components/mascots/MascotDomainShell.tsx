"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay, FiPause, FiVolume2, FiVolumeX } from "react-icons/fi";

// =============================================================================
// MASCOT THEMES - Static Tailwind classes (no dynamic construction)
// =============================================================================
export const MASCOT_THEMES = {
  root: {
    gradient: "from-emerald-500/10 via-green-500/5 to-teal-500/10",
    border: "border-emerald-500/30",
    hoverBorder: "hover:border-emerald-500/50",
    buttonGradient: "from-emerald-500 via-green-500 to-teal-500",
    buttonHover: "hover:from-emerald-600 hover:via-green-600 hover:to-teal-600",
    buttonShadow: "hover:shadow-emerald-500/30",
    accent: "text-emerald-400",
    accentHover: "hover:text-emerald-300",
    featureBg: "from-emerald-500/20 to-green-500/10",
    featureBorder: "border-emerald-500/30",
    featureHoverBg: "hover:from-emerald-500/30 hover:to-green-500/20",
    featureHoverShadow: "hover:shadow-emerald-500/20",
    iconBg: "from-emerald-500 to-green-600",
    iconShadow: "shadow-emerald-500/25",
    divider: "from-emerald-400 to-green-500",
    badge: "from-emerald-500 via-green-500 to-teal-500",
    glow: "from-emerald-400/20 to-green-400/10",
    glowAlt: "from-teal-400/10 to-emerald-400/5",
  },
  decode: {
    gradient: "from-blue-500/10 via-indigo-500/5 to-purple-500/10",
    border: "border-blue-500/30",
    hoverBorder: "hover:border-blue-500/50",
    buttonGradient: "from-blue-500 via-indigo-500 to-purple-500",
    buttonHover: "hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600",
    buttonShadow: "hover:shadow-blue-500/30",
    accent: "text-blue-400",
    accentHover: "hover:text-blue-300",
    featureBg: "from-blue-500/20 to-indigo-500/10",
    featureBorder: "border-blue-500/30",
    featureHoverBg: "hover:from-blue-500/30 hover:to-indigo-500/20",
    featureHoverShadow: "hover:shadow-blue-500/20",
    iconBg: "from-blue-500 to-indigo-600",
    iconShadow: "shadow-blue-500/25",
    divider: "from-blue-400 to-indigo-500",
    badge: "from-blue-500 via-indigo-500 to-purple-500",
    glow: "from-blue-400/20 to-indigo-400/10",
    glowAlt: "from-purple-400/10 to-blue-400/5",
  },
  "slim-t": {
    gradient: "from-red-500/10 via-orange-500/5 to-amber-500/10",
    border: "border-red-500/30",
    hoverBorder: "hover:border-red-500/50",
    buttonGradient: "from-red-500 via-orange-500 to-amber-500",
    buttonHover: "hover:from-red-600 hover:via-orange-600 hover:to-amber-600",
    buttonShadow: "hover:shadow-red-500/30",
    accent: "text-red-400",
    accentHover: "hover:text-red-300",
    featureBg: "from-red-500/20 to-orange-500/10",
    featureBorder: "border-red-500/30",
    featureHoverBg: "hover:from-red-500/30 hover:to-orange-500/20",
    featureHoverShadow: "hover:shadow-red-500/20",
    iconBg: "from-red-500 to-orange-600",
    iconShadow: "shadow-red-500/25",
    divider: "from-red-400 to-orange-500",
    badge: "from-red-500 via-orange-500 to-amber-500",
    glow: "from-red-400/20 to-orange-400/10",
    glowAlt: "from-amber-400/10 to-red-400/5",
  },
  "beau-tox": {
    gradient: "from-yellow-400/10 via-amber-400/5 to-orange-400/10",
    border: "border-yellow-500/30",
    hoverBorder: "hover:border-yellow-500/50",
    buttonGradient: "from-yellow-400 via-amber-400 to-orange-400",
    buttonHover: "hover:from-yellow-500 hover:via-amber-500 hover:to-orange-500",
    buttonShadow: "hover:shadow-yellow-500/30",
    accent: "text-yellow-400",
    accentHover: "hover:text-yellow-300",
    featureBg: "from-yellow-400/20 to-amber-400/10",
    featureBorder: "border-yellow-500/30",
    featureHoverBg: "hover:from-yellow-400/30 hover:to-amber-400/20",
    featureHoverShadow: "hover:shadow-yellow-500/20",
    iconBg: "from-yellow-400 to-amber-500",
    iconShadow: "shadow-yellow-500/25",
    divider: "from-yellow-400 to-amber-400",
    badge: "from-yellow-400 via-amber-400 to-orange-400",
    glow: "from-yellow-400/20 to-amber-400/10",
    glowAlt: "from-orange-400/10 to-yellow-400/5",
  },
  "filla-grace": {
    gradient: "from-pink-500/10 via-rose-500/5 to-fuchsia-500/10",
    border: "border-pink-500/30",
    hoverBorder: "hover:border-pink-500/50",
    buttonGradient: "from-pink-500 via-rose-500 to-fuchsia-500",
    buttonHover: "hover:from-pink-600 hover:via-rose-600 hover:to-fuchsia-600",
    buttonShadow: "hover:shadow-pink-500/30",
    accent: "text-pink-400",
    accentHover: "hover:text-pink-300",
    featureBg: "from-pink-500/20 to-rose-500/10",
    featureBorder: "border-pink-500/30",
    featureHoverBg: "hover:from-pink-500/30 hover:to-rose-500/20",
    featureHoverShadow: "hover:shadow-pink-500/20",
    iconBg: "from-pink-500 to-rose-600",
    iconShadow: "shadow-pink-500/25",
    divider: "from-pink-400 to-rose-500",
    badge: "from-pink-500 via-rose-500 to-fuchsia-500",
    glow: "from-pink-400/20 to-rose-400/10",
    glowAlt: "from-fuchsia-400/10 to-pink-400/5",
  },
  harmony: {
    gradient: "from-purple-500/10 via-violet-500/5 to-indigo-500/10",
    border: "border-purple-500/30",
    hoverBorder: "hover:border-purple-500/50",
    buttonGradient: "from-purple-500 via-violet-500 to-indigo-500",
    buttonHover: "hover:from-purple-600 hover:via-violet-600 hover:to-indigo-600",
    buttonShadow: "hover:shadow-purple-500/30",
    accent: "text-purple-400",
    accentHover: "hover:text-purple-300",
    featureBg: "from-purple-500/20 to-violet-500/10",
    featureBorder: "border-purple-500/30",
    featureHoverBg: "hover:from-purple-500/30 hover:to-violet-500/20",
    featureHoverShadow: "hover:shadow-purple-500/20",
    iconBg: "from-purple-500 to-violet-600",
    iconShadow: "shadow-purple-500/25",
    divider: "from-purple-400 to-violet-500",
    badge: "from-purple-500 via-violet-500 to-indigo-500",
    glow: "from-purple-400/20 to-violet-400/10",
    glowAlt: "from-indigo-400/10 to-purple-400/5",
  },
  peppi: {
    gradient: "from-cyan-500/10 via-blue-500/5 to-teal-500/10",
    border: "border-cyan-500/30",
    hoverBorder: "hover:border-cyan-500/50",
    buttonGradient: "from-cyan-500 via-blue-500 to-teal-500",
    buttonHover: "hover:from-cyan-600 hover:via-blue-600 hover:to-teal-600",
    buttonShadow: "hover:shadow-cyan-500/30",
    accent: "text-cyan-400",
    accentHover: "hover:text-cyan-300",
    featureBg: "from-cyan-500/20 to-blue-500/10",
    featureBorder: "border-cyan-500/30",
    featureHoverBg: "hover:from-cyan-500/30 hover:to-blue-500/20",
    featureHoverShadow: "hover:shadow-cyan-500/20",
    iconBg: "from-cyan-500 to-blue-600",
    iconShadow: "shadow-cyan-500/25",
    divider: "from-cyan-400 to-blue-500",
    badge: "from-cyan-500 via-blue-500 to-teal-500",
    glow: "from-cyan-400/20 to-blue-400/10",
    glowAlt: "from-teal-400/10 to-cyan-400/5",
  },
} as const;

// =============================================================================
// MASCOT ICONS & BADGES
// =============================================================================
const MASCOT_ICONS: Record<string, string> = {
  root: "🌳",
  decode: "🔬",
  "slim-t": "⚖️",
  "beau-tox": "💉",
  "filla-grace": "💄",
  harmony: "🌸",
  peppi: "🧪",
};

const MASCOT_BADGES: Record<string, string> = {
  root: "🌳 Family Intelligence",
  decode: "🔬 Lab Intelligence",
  "slim-t": "⚖️ Weight Intelligence",
  "beau-tox": "💉 Aesthetics Intelligence",
  "filla-grace": "💄 Beauty Intelligence",
  harmony: "🌸 Hormone Intelligence",
  peppi: "🧪 Peptide Intelligence",
};

// =============================================================================
// TYPES
// =============================================================================
export type MascotId = "root" | "decode" | "slim-t" | "beau-tox" | "filla-grace" | "harmony" | "peppi";

export interface MascotFeature {
  icon: string;
  title: string;
  description: string;
}

export interface MascotDomainShellProps {
  mascotId: MascotId;
  displayName: string;
  tagline: string;
  description: string;
  imageSrc: string;
  videoSrc?: string;
  videoPoster?: string;
  showVideo?: boolean;
  features: MascotFeature[];
  ctaText: string;
  ctaHref: string;
  source?: string;
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================
export default function MascotDomainShell({
  mascotId,
  displayName,
  tagline,
  description,
  imageSrc,
  videoSrc,
  videoPoster,
  showVideo = false,
  features,
  ctaText,
  ctaHref,
  source,
  className = "",
}: MascotDomainShellProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const theme = MASCOT_THEMES[mascotId] || MASCOT_THEMES.decode;
  const icon = MASCOT_ICONS[mascotId] || "🤖";
  const badge = MASCOT_BADGES[mascotId] || "AI Intelligence";

  const onPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play();
    setIsVideoPlaying(true);
  };

  const onStop = () => {
    setIsVideoPlaying(false);
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
    const next = !isVideoMuted;
    v.muted = next;
    setIsVideoMuted(next);
  };

  const onAsk = () => {
    const chatSource = source || mascotId;
    // Redirect to app for chat functionality
    window.location.href = `https://app.nopriorauthorization.com/chat?mascot=${encodeURIComponent(mascotId)}&source=${encodeURIComponent(chatSource)}`;
  };

  const onVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`mb-16 ${className}`}
    >
      <div
        className={`relative bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-3xl p-8 lg:p-12 overflow-hidden`}
      >
        <div
          className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${theme.glow} rounded-full blur-3xl -translate-y-32 translate-x-32`}
        />
        <div
          className={`absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr ${theme.glowAlt} rounded-full blur-2xl translate-y-24 -translate-x-24`}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* LEFT COLUMN - Content */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${theme.iconBg} text-white shadow-lg ${theme.iconShadow}`}
              >
                <span className="text-2xl">{icon}</span>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white">{displayName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-12 h-1 bg-gradient-to-r ${theme.divider} rounded-full`} />
                  <span className={`${theme.accent} text-sm font-medium`}>{tagline}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-6">{description}</p>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.slice(0, 4).map((feature, index) => (
                <div
                  key={index}
                  className={`group bg-gradient-to-br ${theme.featureBg} border ${theme.featureBorder} rounded-xl p-4 ${theme.featureHoverBg} transition-all duration-300 hover:scale-105 hover:shadow-lg ${theme.featureHoverShadow}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`${theme.accent} ${theme.accentHover} transition-colors text-lg`}>
                      {feature.icon}
                    </span>
                    <span className={`${theme.accent} font-semibold text-sm ${theme.accentHover}`}>
                      {feature.title}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs leading-tight">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {videoSrc && (
                <>
                  {!isVideoPlaying ? (
                    <button
                      onClick={onPlay}
                      disabled={showVideo && !isVideoReady}
                      className={`inline-flex items-center gap-3 bg-gradient-to-r ${theme.buttonGradient} text-white px-6 py-3 rounded-xl font-semibold ${theme.buttonHover} transition-all duration-300 hover:scale-105 hover:shadow-xl ${theme.buttonShadow} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <FiPlay className="w-4 h-4" />
                      <span>Learn with {displayName}</span>
                    </button>
                  ) : (
                    <button
                      onClick={onStop}
                      className="inline-flex items-center gap-3 border border-gray-500/30 bg-gray-500/10 text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-500/20 hover:border-gray-500/50 transition-all duration-300"
                    >
                      <FiPause className="w-4 h-4" />
                      <span>Stop Video</span>
                    </button>
                  )}

                  {isVideoPlaying && (
                    <button
                      onClick={onToggleMute}
                      className="inline-flex items-center gap-2 border border-gray-500/30 bg-gray-500/10 text-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-500/20 hover:border-gray-500/50 transition-all duration-300"
                    >
                      {isVideoMuted ? <FiVolumeX className="w-4 h-4" /> : <FiVolume2 className="w-4 h-4" />}
                      <span>{isVideoMuted ? "Unmute" : "Mute"}</span>
                    </button>
                  )}
                </>
              )}

              <button
                onClick={onAsk}
                className={`inline-flex items-center gap-3 border ${theme.border} bg-black/20 ${theme.accent} px-6 py-3 rounded-xl font-semibold hover:bg-black/30 ${theme.hoverBorder} transition-all duration-300 hover:scale-105`}
              >
                <span>💬 Ask {displayName}</span>
              </button>
            </div>

            {/* CTA Link */}
            <Link
              href={ctaHref.startsWith('/vault') || ctaHref.startsWith('/chat') ? `https://app.nopriorauthorization.com${ctaHref}` : ctaHref}
              className={`inline-flex items-center gap-3 bg-gradient-to-r ${theme.buttonGradient} text-white px-8 py-4 rounded-xl font-semibold ${theme.buttonHover} transition-all duration-300 hover:scale-105 hover:shadow-xl ${theme.buttonShadow}`}
            >
              <span>{ctaText}</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* RIGHT COLUMN - Mascot Image/Video */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-start">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.glow} rounded-3xl blur-xl scale-110`} />
              
              {isVideoPlaying && videoSrc ? (
                <div className="relative rounded-3xl shadow-2xl border border-white/20 overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    poster={videoPoster || imageSrc}
                    preload="metadata"
                    playsInline
                    muted={isVideoMuted}
                    onCanPlay={() => setIsVideoReady(true)}
                    onEnded={onVideoEnded}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    className="w-full h-auto max-w-[400px] rounded-3xl"
                    autoPlay
                  />
                </div>
              ) : (
                <Image
                  src={imageSrc}
                  alt={`${displayName} - ${tagline}`}
                  width={400}
                  height={400}
                  className="relative rounded-3xl shadow-2xl border border-white/20"
                  priority
                />
              )}

              {videoSrc && !isVideoPlaying && (
                <video
                  ref={videoRef}
                  src={videoSrc}
                  preload="metadata"
                  playsInline
                  muted={isVideoMuted}
                  onCanPlay={() => setIsVideoReady(true)}
                  onEnded={onVideoEnded}
                  className="hidden"
                />
              )}

              <div
                className={`absolute -bottom-6 -left-6 bg-gradient-to-r ${theme.badge} text-white px-6 py-3 rounded-2xl font-semibold shadow-xl border border-white/10`}
              >
                {badge}
              </div>
              <div
                className={`absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br ${theme.iconBg} rounded-full flex items-center justify-center shadow-lg`}
              >
                <span className="text-white text-sm">✨</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
