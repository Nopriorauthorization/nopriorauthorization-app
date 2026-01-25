"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPlay, FiPause, FiMessageCircle, FiX } from "react-icons/fi";
import { mascotVideoController } from "@/lib/mascotVideoController";

const mascots = [
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
  }
];

export default function MascotsPage() {
  const [selectedMascot, setSelectedMascot] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loadingChat, setLoadingChat] = useState(null);
  const videoRefs = useRef({});

  const handleVideoPlay = (mascotId) => {
    if (playingVideo === mascotId) {
      // Stop the current video
      mascotVideoController.stopActiveMascotVideo();
      setPlayingVideo(null);
    } else {
      // Stop any currently playing video first
      if (playingVideo) {
        mascotVideoController.stopActiveMascotVideo();
      }
      // Play the new video
      mascotVideoController.playMascotVideo(mascotId, videoRefs.current[mascotId]);
      setPlayingVideo(mascotId);
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-pink-400 hover:text-pink-300">
            ← Back Home
          </Link>
          <h1 className="text-2xl font-bold">Meet Your Expert Team</h1>
          <div></div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your <span className="text-pink-500">AI Healthcare Team</span>
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Watch intro videos and chat with our AI-powered healthcare specialists.
            Each mascot brings unique expertise to guide your wellness journey.
          </p>
          <Link
            href="/chat"
            className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all"
          >
            Start Chatting
          </Link>
        </div>
      </section>

      {/* Mascots Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mascots.map((mascot) => (
              <div
                key={mascot.id}
                className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-pink-500/30 transition-all group"
              >
                {/* Video/Image Section */}
                <div className="relative mb-6 rounded-lg overflow-hidden bg-gray-800">
                  <div className="aspect-video relative">
                    <Image
                      src={mascot.image}
                      alt={mascot.name}
                      fill
                      className="object-cover"
                    />

                    {/* Video Overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <button
                        onClick={() => handleVideoPlay(mascot.id)}
                        className="bg-pink-500/80 hover:bg-pink-500 text-white p-4 rounded-full transition-all transform hover:scale-110"
                      >
                        {playingVideo === mascot.id ? (
                          <FiPause className="w-6 h-6" />
                        ) : (
                          <FiPlay className="w-6 h-6 ml-1" />
                        )}
                      </button>
                    </div>

                    {/* Hidden Video Element */}
                    <video
                      ref={(el) => (videoRefs.current[mascot.id] = el)}
                      className={`absolute inset-0 w-full h-full object-cover ${
                        playingVideo === mascot.id ? 'opacity-100' : 'opacity-0'
                      }`}
                      src={mascot.video}
                      onEnded={() => {
                        mascotVideoController.stopActiveMascotVideo();
                        setPlayingVideo(null);
                      }}
                      playsInline
                      controls
                      preload="metadata"
                    />
                  </div>
                </div>

                {/* Mascot Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{mascot.name}</h3>
                  <p className="text-pink-400 font-medium mb-2">{mascot.specialty}</p>
                  {mascot.credentials && (
                    <p className="text-sm text-white/60 mb-3">{mascot.credentials}</p>
                  )}
                  <p className="text-white/80 text-sm leading-relaxed mb-4">
                    {mascot.description}
                  </p>

                  {/* Personality Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-xs">
                      {mascot.personality}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => startChat(mascot)}
                      disabled={loadingChat === mascot.id}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <button
                      onClick={() => setSelectedMascot(mascot)}
                      className="px-4 py-2 border border-white/30 text-white hover:bg-white/10 rounded-lg transition"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8">
            Connect with any of our expert mascots for personalized healthcare guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/chat"
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all"
            >
              Chat with Experts
            </Link>
            <Link
              href="/vault"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Enter Sacred Vault
            </Link>
          </div>
        </div>
      </section>

      {/* Mascot Detail Modal */}
      {selectedMascot && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={selectedMascot.image}
                    alt={selectedMascot.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="text-2xl font-bold">{selectedMascot.name}</h3>
                    <p className="text-pink-400">{selectedMascot.specialty}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMascot(null)}
                  className="text-white/60 hover:text-white"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">About</h4>
                  <p className="text-white/80">{selectedMascot.description}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2">Personality</h4>
                  <p className="text-white/80">{selectedMascot.personality}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2">Credentials</h4>
                  <p className="text-white/80">{selectedMascot.credentials}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2">Chat Focus</h4>
                  <p className="text-white/80">{selectedMascot.chatPrompt}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    startChat(selectedMascot);
                    setSelectedMascot(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
                >
                  Start Chat with {selectedMascot.name}
                </button>
                <button
                  onClick={() => setSelectedMascot(null)}
                  className="px-6 py-3 border border-white/30 text-white hover:bg-white/10 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}