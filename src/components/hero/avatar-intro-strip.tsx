"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const mascots = [
  {
    id: "founder",
    name: "Founder",
    specialty: "Provider Translator",
    image: "/characters/founder.png",
    description: "Explains how providers think - without defending bad medicine",
    video: "/hero/avatars/founder-intro.mp4",
    intro: "I built No Prior Authorization because patients deserve clarity - not confusion."
  },
  {
    id: "beau-tox",
    name: "Beau-Tox™",
    specialty: "Botox & Injectables",
    image: "/characters/beau.png",
    description: "Expert in cosmetic injectables and facial aesthetics",
    video: "/hero/avatars/beau-tox-intro.mp4",
    intro: "Hey there! I'm Beau-Tox, your go-to expert for all things injectables. Ready to chat about your aesthetic goals?"
  },
  {
    id: "peppi",
    name: "Peppi",
    specialty: "Peptides & Wellness",
    image: "/characters/peppi.png",
    description: "Your holistic health companion",
    video: "/hero/avatars/peppi-intro.mp4",
    intro: "Hi! I'm Peppi, your wellness guide. Let's talk about nutrition, lifestyle, and feeling your best!"
  },
  {
    id: "f-ill",
    name: "Grace",
    specialty: "Dermal Fillers",
    image: "/characters/filla-grace.png",
    description: "Specialist in dermal filler treatments",
    video: "/hero/avatars/f-ill-intro.mp4",
    intro: "Hello! I'm Filla-Grace, your dermal filler specialist. Let's discuss your facial enhancement goals!"
  },
  {
    id: "rn-lisa-grace",
    name: "Harmony",
    specialty: "Hormones & Safety",
    image: "/characters/harmony.png",
    description: "Safety, ethics, and stopping bad medicine",
    video: "/hero/avatars/rn-lisa-grace-intro.mp4",
    intro: "I'm here for safety, ethics, and stopping bad medicine before it hurts someone."
  },
  {
    id: "slim-t",
    name: "Slim-T",
    specialty: "Metabolism & Weight",
    image: "/characters/slim-t.png",
    description: "Hormones and weight loss expert",
    video: "/hero/avatars/slim-t-intro.mp4",
    intro: "Hormones and weight loss aren't magic. I'll tell you what actually moves the needle."
  },
  {
    id: "ryan",
    name: "Ryan",
    specialty: "Provider Translator",
    image: "/characters/ryan.png",
    description: "Explains what providers really mean",
    video: "/hero/avatars/ryan-intro.mp4",
    intro: "I explain what providers really mean - and why 'it depends' isn't always a cop-out."
  }
];

export default function AvatarIntroStrip() {
  const [activeMascot, setActiveMascot] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Start with videos playing
  const [hoveredMascot, setHoveredMascot] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentMascot = mascots[activeMascot];

  useEffect(() => {
    // Auto-start videos when component mounts
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.load(); // Reload video source when mascot changes
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay failed:', error);
        // Keep trying to play - don't fallback to image
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(() => {
              // Silent fail - videos should work
            });
          }
        }, 1000);
      });
    }
  }, [isPlaying, activeMascot]);

  const handleMascotClick = (index: number) => {
    setActiveMascot(index);
    setIsPlaying(true); // Always play when mascot is clicked
  };

  const toggleVideo = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Interactive Expert Team</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-4">
            Click any mascot below to see them come alive with personalized video introductions.
            Each AI specialist brings unique expertise to guide your wellness journey.
          </p>
          <div className="flex items-center justify-center gap-2 text-pink-300">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live & Interactive</span>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Featured Mascot Video Section - FRONT AND CENTER */}
        <div className="mb-16 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl p-8 border border-pink-500/20 shadow-2xl">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Large Video Display - FRONT AND CENTER */}
            <div className="lg:col-span-2 relative">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border-2 border-pink-500/30">
                <video
                  ref={videoRef}
                  src={currentMascot.video}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onError={(e) => {
                    console.log('Video failed to load:', currentMascot.video);
                    // Don't show fallback image - keep trying
                    setTimeout(() => {
                      if (videoRef.current) {
                        videoRef.current.load();
                        videoRef.current.play().catch(() => {});
                      }
                    }, 2000);
                  }}
                  onLoadedData={() => {
                    console.log('Video loaded successfully:', currentMascot.video);
                  }}
                />
                
                {/* Interactive Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Mascot Name Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-3xl font-bold text-white mb-2">{currentMascot.name}</h3>
                  <p className="text-pink-300 font-medium text-lg">{currentMascot.specialty}</p>
                </div>

                {/* Play/Pause Button - More Prominent */}
                <button
                  onClick={toggleVideo}
                  className="absolute top-4 right-4 bg-pink-500/90 hover:bg-pink-500 text-white rounded-full p-3 transition-all hover:scale-110 shadow-lg"
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zM14 4h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mascot Info & Actions */}
            <div className="space-y-6">
              <div>
                <p className="text-white/90 text-lg leading-relaxed mb-6">{currentMascot.intro}</p>
                <p className="text-white/70 text-sm">{currentMascot.description}</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <Link
                  href={`/chat?mascot=${currentMascot.id}`}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all text-center hover:scale-105"
                >
                  💬 Chat with {currentMascot.name}
                </Link>
                <button
                  onClick={toggleVideo}
                  className="border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold transition-all"
                >
                  {isPlaying ? '⏸️ Pause Video' : '▶️ Play Video'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Mascot Grid - ALIVE AND INTERACTIVE */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {mascots.map((mascot, index) => (
            <div
              key={mascot.id}
              onClick={() => handleMascotClick(index)}
              onMouseEnter={() => setHoveredMascot(index)}
              onMouseLeave={() => setHoveredMascot(null)}
              className={`bg-white/5 rounded-xl p-6 border-2 transition-all cursor-pointer transform hover:scale-105 hover:shadow-2xl ${
                activeMascot === index
                  ? "border-pink-500 bg-pink-500/20 shadow-pink-500/20 shadow-lg scale-105"
                  : "border-white/10 hover:border-pink-400/50"
              }`}
            >
              <div className="mb-4 relative">
                <div className={`h-20 w-20 rounded-full overflow-hidden border-2 mx-auto transition-all duration-300 ${
                  activeMascot === index
                    ? "border-pink-500 shadow-lg shadow-pink-500/30"
                    : hoveredMascot === index
                    ? "border-pink-400/70 shadow-md shadow-pink-400/20"
                    : "border-pink-500/30"
                }`}>
                  <Image
                    src={mascot.image}
                    alt={mascot.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                  {/* Active indicator */}
                  {activeMascot === index && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                
                {/* Hover video preview hint */}
                {hoveredMascot === index && activeMascot !== index && (
                  <div className="absolute inset-0 bg-pink-500/10 rounded-full animate-pulse"></div>
                )}
              </div>
              
              <h3 className={`text-lg font-semibold mb-1 text-center transition-colors ${
                activeMascot === index ? "text-pink-300" : "text-white"
              }`}>
                {mascot.name}
              </h3>
              <p className={`text-sm font-medium mb-2 text-center transition-colors ${
                activeMascot === index ? "text-pink-400" : "text-pink-400/80"
              }`}>
                {mascot.specialty}
              </p>
              <p className="text-white/70 text-sm leading-relaxed text-center">
                {mascot.description}
              </p>
              
              {/* Interactive indicator */}
              <div className="mt-3 flex justify-center">
                {activeMascot === index ? (
                  <div className="flex items-center gap-1 text-pink-400 text-xs font-medium">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
                    ACTIVE
                  </div>
                ) : (
                  <div className="text-white/40 text-xs">
                    Click to activate
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/mascots"
            className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all"
          >
            View All Experts
          </Link>
        </div>
      </div>
    </div>
  );
}
