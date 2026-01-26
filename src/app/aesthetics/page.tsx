"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPlay, FiPause, FiMessageCircle, FiVolume2, FiVolumeX } from "react-icons/fi";

const aestheticsMascots = [
  {
    id: "beau-tox",
    name: "Beau-Tox™",
    specialty: "Botox & Injectables",
    description: "Expert in cosmetic injectables, facial aesthetics, and non-surgical rejuvenation procedures.",
    image: "/characters/beau.png",
    video: "/videos/mascots/beau-tox.mp4",
    credentials: "Certified Injector",
    personality: "Sassy, honest, tells it like it is",
    chatPrompt: "Get real talk about injectables and cosmetic procedures"
  },
  {
    id: "filla-grace",
    name: "Filla-Grace",
    specialty: "Dermal Fillers",
    description: "Specialist in dermal filler treatments, facial contouring, and volume restoration.",
    image: "/characters/filla-grace.png",
    video: "/videos/mascots/filla-grace.mp4",
    credentials: "Filler Expert",
    personality: "Graceful, detailed, anatomy-focused",
    chatPrompt: "Learn about fillers, facial anatomy, and realistic expectations"
  }
];

export default function AestheticsPage() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [loadingChat, setLoadingChat] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleVideoPlay = (mascotId: string) => {
    const videoElement = videoRefs.current[mascotId];
    if (!videoElement) return;

    if (playingVideo === mascotId) {
      // Stop current video
      videoElement.pause();
      videoElement.currentTime = 0;
      setPlayingVideo(null);
    } else {
      // Stop any currently playing video
      if (playingVideo) {
        const currentVideo = videoRefs.current[playingVideo];
        if (currentVideo) {
          currentVideo.pause();
          currentVideo.currentTime = 0;
        }
      }
      // Play the new video
      videoElement.play();
      setPlayingVideo(mascotId);
    }
  };

  const handleVideoEnd = () => {
    setPlayingVideo(null);
  };

  const toggleMute = () => {
    setMuted(!muted);
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.muted = !muted;
      }
    });
  };

  const startChat = async (mascot: typeof aestheticsMascots[0]) => {
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
      {/* Hero Section - No Sound */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Aesthetics
              </span>
              <br />
              <span className="text-white">Intelligence</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Expert guidance on cosmetic injectables, dermal fillers, and non-surgical facial rejuvenation.
              Get personalized recommendations from our certified aesthetics specialists.
            </p>
          </div>
        </div>
      </div>

      {/* Mascot Sections */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {aestheticsMascots.map((mascot, index) => (
          <div key={mascot.id} className="mb-20">
            {/* Mascot Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8 mb-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Mascot Image */}
                <div className="flex-shrink-0">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gradient-to-r from-purple-500 to-pink-500">
                    <Image
                      src={mascot.image}
                      alt={mascot.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Mascot Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl font-bold mb-2">{mascot.name}</h2>
                  <p className="text-purple-400 font-semibold mb-2">{mascot.credentials}</p>
                  <p className="text-gray-300 mb-4">{mascot.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      {mascot.specialty}
                    </span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">
                      {mascot.personality}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video and Chat Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Learn with Video */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <FiPlay className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Learn with {mascot.name}</h3>
                </div>

                <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4">
                  <video
                    ref={(el) => { videoRefs.current[mascot.id] = el; }}
                    src={mascot.video}
                    className="w-full h-full object-cover"
                    onEnded={handleVideoEnd}
                    muted={muted}
                    playsInline
                  />
                  {playingVideo !== mascot.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <button
                        onClick={() => handleVideoPlay(mascot.id)}
                        className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition"
                      >
                        <FiPlay className="w-8 h-8 text-white" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleVideoPlay(mascot.id)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition"
                  >
                    {playingVideo === mascot.id ? (
                      <>
                        <FiPause className="w-5 h-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <FiPlay className="w-5 h-5" />
                        Play Video
                      </>
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                  >
                    {muted ? <FiVolumeX className="w-5 h-5" /> : <FiVolume2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Ask Chat */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <FiMessageCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Ask {mascot.name}</h3>
                </div>

                <p className="text-gray-300 mb-6">{mascot.chatPrompt}</p>

                <button
                  onClick={() => startChat(mascot)}
                  disabled={loadingChat === mascot.id}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingChat === mascot.id ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Starting Chat...
                    </>
                  ) : (
                    <>
                      <FiMessageCircle className="w-5 h-5" />
                      Start Conversation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Related Aesthetics Tools */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">Aesthetics Tools & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/vault/tools"
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Treatment Tracker</h3>
              <p className="text-gray-400">Track your aesthetic treatments and maintenance schedule</p>
            </Link>
            <Link
              href="/vault/tools"
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Provider Finder</h3>
              <p className="text-gray-400">Find certified aesthetic providers in your area</p>
            </Link>
            <Link
              href="/vault/tools"
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Cost Calculator</h3>
              <p className="text-gray-400">Estimate costs for aesthetic treatments and packages</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}