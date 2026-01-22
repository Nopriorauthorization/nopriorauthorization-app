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
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentMascot = mascots[activeMascot];

  useEffect(() => {
    // Auto-start the first mascot's video when component mounts
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.load(); // Reload video source when mascot changes
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay failed:', error);
        // Fallback to showing image if video fails
        setIsPlaying(false);
      });
    }
  }, [isPlaying, activeMascot]);

  const handleMascotClick = (index: number) => {
    setActiveMascot(index);
    setIsPlaying(true); // Auto-play when mascot is clicked
  };

  const toggleVideo = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Your <span className="text-pink-500">Expert Team</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Chat with our AI-powered healthcare specialists. Each mascot brings unique expertise
            to guide your wellness journey.
          </p>
        </div>

        {/* Featured Mascot Video Section */}
        <div className="mb-12 bg-white/5 rounded-lg p-8 border border-white/10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Video/Image Display */}
            <div className="relative">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                {isPlaying ? (
                  <video
                    ref={videoRef}
                    src={currentMascot.video}
                    className="w-full h-full object-contain"
                    muted
                    loop
                    playsInline
                    onError={() => {
                      console.log('Video failed to load:', currentMascot.video);
                      setIsPlaying(false);
                    }}
                  />
                ) : (
                  <Image
                    src={currentMascot.image}
                    alt={currentMascot.name}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Play/Pause Button */}
                <button
                  onClick={toggleVideo}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className="bg-pink-500/90 hover:bg-pink-500 text-white rounded-full p-4 transition-all group-hover:scale-110">
                    {isPlaying ? (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zM14 4h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Mascot Info */}
            <div>
              <h3 className="text-2xl font-bold mb-2">{currentMascot.name}</h3>
              <p className="text-pink-400 font-medium mb-4">{currentMascot.specialty}</p>
              <p className="text-white/80 mb-6">{currentMascot.intro}</p>
              <div className="flex gap-4">
                <Link
                  href={`/chat?mascot=${currentMascot.id}`}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  Chat Now
                </Link>
                <button
                  onClick={toggleVideo}
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-full font-semibold transition-all"
                >
                  {isPlaying ? 'Pause Intro' : 'Watch Intro'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mascot Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {mascots.map((mascot, index) => (
            <div
              key={mascot.id}
              onClick={() => handleMascotClick(index)}
              className={`bg-white/5 rounded-lg p-6 border transition-all cursor-pointer ${
                activeMascot === index
                  ? "border-pink-500 bg-pink-500/10"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <div className="mb-4">
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-pink-500/30 mx-auto">
                  <Image
                    src={mascot.image}
                    alt={mascot.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-1 text-center">{mascot.name}</h3>
              <p className="text-pink-400 text-sm font-medium mb-2 text-center">{mascot.specialty}</p>
              <p className="text-white/70 text-sm leading-relaxed text-center">
                {mascot.description}
              </p>
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
