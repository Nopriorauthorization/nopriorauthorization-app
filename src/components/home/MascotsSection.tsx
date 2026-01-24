'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FiPlay, FiPause, FiMessageCircle, FiX } from 'react-icons/fi';

const mascots = [
  {
    id: "founder",
    name: "Founder",
    specialty: "Provider Translator",
    description: "I built No Prior Authorization because patients deserve clarity - not confusion.",
    image: "/characters/founder.png",
    video: "/hero/avatars/founder-intro.mp4",
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
    video: "/hero/avatars/beau-tox-intro.mp4",
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
    video: "/hero/avatars/peppi-intro.mp4",
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
    video: "/hero/avatars/f-ill-intro.mp4",
    credentials: "Filler Expert",
    personality: "Graceful, detailed, anatomy-focused",
    chatPrompt: "Learn about fillers, facial anatomy, and realistic expectations"
  },
  {
    id: "rn-lisa-grace",
    name: "Harmony",
    specialty: "Nursing Care",
    description: "Registered nurse providing medical guidance, treatment coordination, and patient care.",
    image: "/characters/founder.png",
    video: "/hero/avatars/rn-lisa-grace-intro.mp4",
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
    video: "/hero/avatars/slim-t-intro.mp4",
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
    video: "/hero/avatars/ryan-intro.mp4",
    credentials: "FNP-BC | Full Authority Nurse Practitioner",
    personality: "Clear communicator, bridge between providers and patients",
    chatPrompt: "Translate medical language and provider thinking"
  }
];

export default function MascotsSection() {
  const [selectedMascot, setSelectedMascot] = useState(null);
  const [loadingChat, setLoadingChat] = useState(null);
  const videoRefs = useRef({});

  const [allVideosMuted, setAllVideosMuted] = useState(true);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [soloMode, setSoloMode] = useState(false);
  const [activeSoloVideo, setActiveSoloVideo] = useState(null);

  // Global video audio state management - all videos share the same mute state
  useEffect(() => {
    // Auto-start all videos when component mounts (muted initially for autoplay compliance)
    const startVideos = async () => {
      // Wait a bit for videos to be rendered
      setTimeout(async () => {
        const promises = [];

        for (const mascot of mascots) {
          const video = videoRefs.current[mascot.id];
          if (video) {
            promises.push(
              new Promise((resolve) => {
                video.addEventListener('loadeddata', () => {
                  video.muted = true; // Start muted for autoplay compliance
                  video.volume = 0; // Set volume to 0 initially
                  video.play().then(() => {
                    console.log('Video started (muted) for:', mascot.name);
                    resolve();
                  }).catch((error) => {
                    console.log('Video autoplay failed for:', mascot.name, error);
                    resolve();
                  });
                });
                video.addEventListener('error', () => {
                  console.log('Video failed to load:', mascot.video);
                  resolve();
                });
              })
            );
          } else {
            console.log('Video element not found for:', mascot.id);
          }
        }

        if (promises.length > 0) {
          await Promise.all(promises);
        }
        setVideosLoaded(true);
        console.log('All videos loaded, button should appear');
      }, 1000); // Wait 1 second for videos to render
    };

    startVideos();
  }, []);

  // Toggle all video audio
  const toggleAllVideoAudio = () => {
    const newMutedState = !allVideosMuted;
    setAllVideosMuted(newMutedState);

    // Apply to all videos
    for (const mascot of mascots) {
      const video = videoRefs.current[mascot.id];
      if (video) {
        video.muted = newMutedState;
        video.volume = newMutedState ? 0 : 0.5; // Set volume when unmuting
      }
    }

    // Exit solo mode when toggling global audio
    if (soloMode) {
      setSoloMode(false);
      setActiveSoloVideo(null);
    }
  };

  // Play solo video (for individual mascot audio)
  const playSoloVideo = (mascotId) => {
    if (!soloMode) return;

    // Mute all videos first
    for (const mascot of mascots) {
      const video = videoRefs.current[mascot.id];
      if (video) {
        video.muted = true;
        video.volume = 0;
      }
    }

    // Unmute the selected video
    const selectedVideo = videoRefs.current[mascotId];
    if (selectedVideo) {
      selectedVideo.muted = false;
      selectedVideo.volume = 0.7;
      selectedVideo.currentTime = 0; // Restart from beginning
      selectedVideo.play();
    }

    setActiveSoloVideo(mascotId);
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

          {/* Audio Control Button - Positioned near mascots */}
          <div className="flex justify-center mb-8">
            <button
              onClick={videosLoaded ? toggleAllVideoAudio : undefined}
              disabled={!videosLoaded}
              className={`px-6 py-3 rounded-full shadow-lg border-2 border-white/30 transition-all hover:scale-105 flex items-center gap-2 ${
                !videosLoaded
                  ? 'bg-gray-600 animate-pulse'
                  : allVideosMuted
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                  : soloMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              title={
                !videosLoaded
                  ? "Loading videos..."
                  : allVideosMuted
                  ? "Enable solo mode - click mascots to hear them individually"
                  : "Mute all videos and exit solo mode"
              }
              aria-label={
                !videosLoaded
                  ? "Loading videos..."
                  : allVideosMuted
                  ? "Enable solo mode - click mascots to hear them individually"
                  : "Mute all videos and exit solo mode"
              }
            >
              {!videosLoaded ? (
                <>
                  <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : allVideosMuted ? (
                <>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.414 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.414l3.969-3.816a1 1 0 011.616.193zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 011.414-1.414z" clipRule="evenodd" />
                  </svg>
                  Enable Audio
                </>
              ) : soloMode ? (
                <>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Solo Mode Active
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.414 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.414l3.969-3.816a1 1 0 011.616.193zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.829a1 1 0 011.415 0A5.983 5.984 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                  Mute All
                </>
              )}
            </button>
          </div>
          {soloMode && (
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-8 max-w-md mx-auto">
              <p className="text-blue-300 text-sm">
                🎧 <strong>Solo Mode:</strong> Click on any mascot below to hear their introduction video individually.
              </p>
            </div>
          )}
        </div>

        {/* Interactive Mascots Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mascots.map((mascot) => (
            <div
              key={mascot.id}
              onClick={() => soloMode && playSoloVideo(mascot.id)}
              className={`bg-white/5 rounded-xl p-6 border-2 border-white/10 hover:border-pink-500/50 transition-all group hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 ${
                soloMode && activeSoloVideo === mascot.id ? 'ring-2 ring-green-400 border-green-400/50' : ''
              } ${soloMode ? 'cursor-pointer' : ''}`}
            >
              {/* FULL PICTURE VIDEO - ALWAYS VISIBLE */}
              <div className="relative mb-6 rounded-xl overflow-hidden bg-gray-800 shadow-lg">
                <div className="aspect-video relative">
                  {/* Video that autoplays */}
                  <video
                    ref={(el) => (videoRefs.current[mascot.id] = el)}
                    className="absolute inset-0 w-full h-full object-contain"
                    src={mascot.video}
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    controls={false}
                    onError={(e) => {
                      console.log('Video failed to load:', mascot.video);
                      // Fallback to image if video fails
                    }}
                    onLoadedData={() => {
                      console.log('Video loaded successfully:', mascot.video);
                    }}
                  />

                  {/* Fallback Image (shown if video fails) */}
                  <Image
                    src={mascot.image}
                    alt={mascot.name}
                    fill
                    className="object-cover opacity-0" // Hidden by default, shown if video fails
                  />

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
                    onClick={() => startChat(mascot)}
                    disabled={loadingChat === mascot.id}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="px-4 py-3 border border-white/30 text-white hover:bg-white/10 rounded-lg transition"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </section>
  );
}