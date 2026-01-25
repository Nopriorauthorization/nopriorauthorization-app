'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiPlay, FiPause, FiMessageCircle, FiX, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { playMascotVideo, stopActiveMascotVideo, isMascotActive } from '@/lib/mascotVideoController';

const mascots = [
  {
    id: "founder",
    name: "Founder",
    specialty: "Provider Translator",
    description: "I built No Prior Authorization because patients deserve clarity - not confusion.",
    image: "/characters/founder.png",
    video: "/mascots/founder.mp4",
    credentials: "OWNER | RN-S | CMAA",
    personality: "Direct, no-nonsense, patient advocate",
    chatPrompt: "Explain how providers really think and cut through medical jargon"
  },
  {
    id: "beau-tox",
    name: "Beau-Tox™",
    specialty: "Botox & Injectables",
    description: "Expert in cosmetic injectables, facial aesthetics, and non-surgical rejuvenation procedures.",
    image: "/characters/beau.png",
    video: "/mascots/beau-tox.mp4",
    credentials: "Certified Injector",
    personality: "Sassy, honest, tells it like it is",
    chatPrompt: "Get real talk about injectables and cosmetic procedures"
  },
  {
    id: "peppi",
    name: "Peppi",
    specialty: "General Wellness",
    description: "Your holistic health companion focused on nutrition, lifestyle, and preventive care.",
    image: "/characters/peppi.png",
    video: "/mascots/peppi.mp4",
    credentials: "Wellness Specialist",
    personality: "Friendly, knowledgeable, holistic approach",
    chatPrompt: "Discuss nutrition, lifestyle, and wellness strategies"
  },
  {
    id: "filla-grace",
    name: "Filla-Grace",
    specialty: "Dermal Fillers",
    description: "Specialist in dermal filler treatments, facial contouring, and volume restoration.",
    image: "/characters/filla-grace.png",
    video: "/mascots/filla-grace.mp4",
    credentials: "Filler Expert",
    personality: "Graceful, detailed, anatomy-focused",
    chatPrompt: "Learn about fillers, facial anatomy, and realistic expectations"
  },
  {
    id: "harmony",
    name: "Harmony",
    specialty: "Nursing Care",
    description: "Registered nurse providing medical guidance, treatment coordination, and patient care.",
    image: "/characters/founder.png",
    video: "/mascots/harmony.mp4",
    credentials: "RN, BSN",
    personality: "Caring, safety-focused, ethical",
    chatPrompt: "Get nursing perspective on treatments and safety concerns"
  },
  {
    id: "slim-t",
    name: "Slim-T",
    specialty: "Metabolism & Weight",
    description: "Hormones and weight loss aren't magic. I'll tell you what actually moves the needle.",
    image: "/characters/slim-t.png",
    video: "/mascots/slim-t.mp4",
    credentials: "Metabolism Expert",
    personality: "Straight-talking, evidence-based, no hype",
    chatPrompt: "Understand real metabolism science and weight management"
  },
  {
    id: "ryan",
    name: "Ryan",
    specialty: "Provider Translator",
    description: "I explain what providers really mean - and why 'it depends' isn't always a cop-out.",
    image: "/characters/ryan.png",
    video: "/mascots/ryan.mp4",
    credentials: "FNP-BC | Full Authority Nurse Practitioner",
    personality: "Clear communicator, bridge between providers and patients",
    chatPrompt: "Translate medical language and provider thinking"
  }
];

export default function MascotsSection() {
  const [loadingChat, setLoadingChat] = useState(null);
  const [globalMuted, setGlobalMuted] = useState(false);
  const videoRefs = useRef({});

  const handlePlayVideo = (mascotId) => {
    if (isMascotActive(mascotId)) {
      stopActiveMascotVideo();
    } else {
      playMascotVideo(mascotId, videoRefs.current[mascotId]);
    }
  };

  const handleStopVideo = () => {
    stopActiveMascotVideo();
  };

  const toggleGlobalMute = () => {
    setGlobalMuted(!globalMuted);
    // Apply mute to currently playing video
    const activeMascotId = Object.keys(videoRefs.current).find(id => isMascotActive(id));
    if (activeMascotId && videoRefs.current[activeMascotId]?.current) {
      videoRefs.current[activeMascotId].current.muted = !globalMuted;
    }
  };

  const startChat = async (mascot) => {
    setLoadingChat(mascot.id);

    // Store mascot info in localStorage for chat page
    localStorage.setItem('selectedMascot', JSON.stringify({
      id: mascot.id,
      name: mascot.name,
      personality: mascot.personality,
      specialty: mascot.specialty,
      image: mascot.image
    }));

    // Add small delay for loading state visibility
    setTimeout(() => {
      // Navigate to chat with mascot parameter
      window.location.href = `/chat?mascot=${mascot.id}`;
    }, 500);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Mascots Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Meet Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">AI Healthcare Team</span>
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-4xl mx-auto">
            Watch intro videos and chat with our AI-powered healthcare specialists.
            Each mascot brings unique expertise to guide your wellness journey.
          </p>

          {/* Global Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={handleStopVideo}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all hover:scale-105 flex items-center gap-2"
              title="Stop all playing videos"
            >
              <FiX className="w-5 h-5" />
              Stop All Videos
            </button>
            <button
              onClick={toggleGlobalMute}
              className={`px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 flex items-center gap-2 ${
                globalMuted ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
              } text-white`}
              title={globalMuted ? "Unmute current video" : "Mute current video"}
            >
              {globalMuted ? <FiVolumeX className="w-5 h-5" /> : <FiVolume2 className="w-5 h-5" />}
              {globalMuted ? 'Unmute' : 'Mute'}
            </button>
          </div>
        </div>

        {/* Interactive Mascots Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mascots.map((mascot) => (
            <div
              key={mascot.id}
              className="bg-white/5 rounded-xl p-6 border-2 border-white/10 hover:border-pink-500/50 transition-all group hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20"
            >
              {/* FULL PICTURE VIDEO - ALWAYS VISIBLE */}
              <div className="relative mb-6 rounded-xl overflow-hidden bg-gray-800 shadow-lg">
                <div className="aspect-video relative">
                  {/* Video that plays on demand */}
                  <video
                    ref={(el) => (videoRefs.current[mascot.id] = el)}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={mascot.video}
                    playsInline
                    preload="metadata"
                    muted={globalMuted}
                    onEnded={() => stopActiveMascotVideo()}
                  />

                  {/* Image Thumbnail - shown when video not playing */}
                  {!isMascotActive(mascot.id) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={mascot.image}
                        alt={mascot.name}
                        width={120}
                        height={120}
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}

                  {/* Subtle overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Mascot name overlay */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-lg font-bold text-white drop-shadow-lg">{mascot.name}</h3>
                    <p className="text-pink-300 text-sm drop-shadow-lg">{mascot.specialty}</p>
                  </div>
                </div>
              </div>

              {/* Mascot Info */}
              <div className="flex-1">
                {mascot.credentials && (
                  <p className="text-sm text-white/60 mb-3">{mascot.credentials}</p>
                )}
                <p className="text-white/80 text-sm leading-relaxed mb-4">
                  {mascot.description}
                </p>

                {/* Personality Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-xs font-medium">
                    {mascot.personality}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePlayVideo(mascot.id)}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                      isMascotActive(mascot.id)
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                    }`}
                  >
                    {isMascotActive(mascot.id) ? (
                      <>
                        <FiPause className="w-4 h-4" />
                        Stop
                      </>
                    ) : (
                      <>
                        <FiPlay className="w-4 h-4" />
                        Play
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => startChat(mascot)}
                    disabled={loadingChat === mascot.id}
                    className="flex-1 bg-white/10 border border-white/30 text-white px-4 py-3 rounded-lg font-semibold hover:bg-white/20 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingChat === mascot.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <FiMessageCircle className="w-4 h-4" />
                        Chat
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}