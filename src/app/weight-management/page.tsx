"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPlay, FiPause, FiMessageCircle, FiVolume2, FiVolumeX } from "react-icons/fi";

const weightManagementMascot = {
  id: "slim-t",
  name: "Slim-T",
  specialty: "Weight Management & Hormone Optimization",
  description: "Expert in weight management, hormone optimization, and sustainable lifestyle changes for long-term health.",
  image: "/characters/slim-t.png",
  video: "/videos/mascots/slim-t.mp4",
  credentials: "Weight Management Specialist",
  personality: "Motivational, science-based, results-focused",
  chatPrompt: "Get personalized weight management and hormone optimization guidance"
};

export default function WeightManagementPage() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [loadingChat, setLoadingChat] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoPlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (playingVideo === weightManagementMascot.id) {
      // Stop current video
      videoElement.pause();
      videoElement.currentTime = 0;
      setPlayingVideo(null);
    } else {
      // Stop any currently playing video (though there's only one here)
      if (playingVideo) {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
      // Play the video
      videoElement.play();
      setPlayingVideo(weightManagementMascot.id);
    }
  };

  const handleVideoEnd = () => {
    setPlayingVideo(null);
  };

  const toggleMute = () => {
    setMuted(!muted);
    if (videoRef.current) {
      videoRef.current.muted = !muted;
    }
  };

  const startChat = async (mascot: typeof weightManagementMascot) => {
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
      <div className="relative overflow-hidden bg-gradient-to-br from-green-900/20 to-blue-900/20">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Weight Management
              </span>
              <br />
              <span className="text-white">Intelligence</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Expert guidance on sustainable weight management, hormone optimization, and metabolic health.
              Get personalized strategies from our weight management specialist.
            </p>
          </div>
        </div>
      </div>

      {/* Slim-T Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Mascot Card */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Mascot Image */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gradient-to-r from-green-500 to-blue-500">
                <Image
                  src={weightManagementMascot.image}
                  alt={weightManagementMascot.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Mascot Info */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-2">{weightManagementMascot.name}</h2>
              <p className="text-green-400 font-semibold mb-2">{weightManagementMascot.credentials}</p>
              <p className="text-gray-300 mb-4">{weightManagementMascot.description}</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                  {weightManagementMascot.specialty}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  {weightManagementMascot.personality}
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 text-white">
                <FiPlay className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Learn with {weightManagementMascot.name}</h3>
            </div>

            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4">
              <video
                ref={videoRef}
                src={weightManagementMascot.video}
                className="w-full h-full object-cover"
                onEnded={handleVideoEnd}
                muted={muted}
                playsInline
              />
              {playingVideo !== weightManagementMascot.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <button
                    onClick={() => handleVideoPlay()}
                    className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition"
                  >
                    <FiPlay className="w-8 h-8 text-white" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => handleVideoPlay()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition"
              >
                {playingVideo === weightManagementMascot.id ? (
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 text-white">
                <FiMessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Ask {weightManagementMascot.name}</h3>
            </div>

            <p className="text-gray-300 mb-6">{weightManagementMascot.chatPrompt}</p>

            <button
              onClick={() => startChat(weightManagementMascot)}
              disabled={loadingChat === weightManagementMascot.id}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingChat === weightManagementMascot.id ? (
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

        {/* Weight & Hormone Tools */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">Weight & Hormone Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/vault/tools"
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Metabolic Health Score</h3>
              <p className="text-gray-400">Assess your metabolic health with comprehensive biomarkers</p>
            </Link>
            <Link
              href="/vault/tools"
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Hormone Tracker</h3>
              <p className="text-gray-400">Track hormone levels and optimize your hormonal health</p>
            </Link>
            <Link
              href="/vault/tools"
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">BMI Calculator</h3>
              <p className="text-gray-400">Calculate your BMI and get personalized health insights</p>
            </Link>
            <Link
              href="/vault/tools"
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Nutrient Analyzer</h3>
              <p className="text-gray-400">Analyze nutrient deficiencies from lab results</p>
            </Link>
            <Link
              href="/vault/tools"
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Meal Planner</h3>
              <p className="text-gray-400">Get personalized meal plans for weight management</p>
            </Link>
            <Link
              href="/vault/tools"
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Progress Tracker</h3>
              <p className="text-gray-400">Track your weight loss progress and milestones</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}