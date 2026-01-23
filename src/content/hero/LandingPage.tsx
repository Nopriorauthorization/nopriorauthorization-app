'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainNavigation from '@/components/layout/main-navigation';
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

const LandingPage: React.FC = () => {
  const [selectedMascot, setSelectedMascot] = useState(null);
  const [loadingChat, setLoadingChat] = useState(null);
  const videoRefs = useRef({});

  const [videosMuted, setVideosMuted] = useState(true);
  const [videosLoaded, setVideosLoaded] = useState(false);

  useEffect(() => {
    // Auto-start all videos when component mounts (muted initially)
    const startVideos = async () => {
      const promises = [];
      for (const mascot of mascots) {
        const video = videoRefs.current[mascot.id];
        if (video) {
          promises.push(
            new Promise((resolve) => {
              video.addEventListener('loadeddata', () => {
                video.muted = true;
                video.play().then(() => {
                  console.log('Video started for:', mascot.name);
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
        }
      }
      await Promise.all(promises);
      setVideosLoaded(true);
    };

    startVideos();
  }, []);

  const unmuteVideos = () => {
    setVideosMuted(false);
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.muted = false;
        video.volume = 0.7; // Set a reasonable volume
      }
    });
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
      {/* Navigation Panel */}
      <MainNavigation />

      {/* Hero Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            No Prior <span className="text-pink-500">Authorization</span>
          </h1>

          {/* Hero Image Section - Desktop only, underneath heading */}
          <div className="relative w-full max-w-5xl mx-auto mb-8">
            <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl shadow-pink-500/20 border border-pink-500/30">
              <img
                src="/nopriorhero.png"
                alt="No Prior Authorization Hero"
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-transparent to-purple-500/10" />
            </div>
          </div>

          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Your AI-powered healthcare companion. Skip the bureaucracy and get direct access to
            expert medical insights, personalized treatment plans, and AI-powered wellness guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/vault'}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all"
            >
              Enter Sacred Vault
            </button>
            <button
              onClick={() => window.location.href = '/chat'}
              className="border-2 border-pink-500/50 text-pink-400 hover:bg-pink-500/10 px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Chat with Experts
            </button>
          </div>
        </div>
      </section>

      {/* MASCOTS LIVE HERE - FRONT AND CENTER */}
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
            <div className="flex items-center justify-center gap-4 text-pink-300 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live & Interactive</span>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
              </div>
              <button
                onClick={unmuteVideos}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm font-medium transition-all text-white shadow-lg"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.414 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.414l3.969-3.816a1 1 0 011.616.193zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
                Enable Sound
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

                    {/* Unmute Button Overlay */}
                    {videosMuted && videosLoaded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Individual unmute button clicked');
                          unmuteVideos();
                        }}
                        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-all z-30 shadow-lg border-2 border-white/30 animate-pulse"
                        title="Click to enable sound"
                      >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.414 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.414l3.969-3.816a1 1 0 011.616.193zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 011.414-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}

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
      </section>

      {/* Navigation Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Explore Your Healthcare Journey</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/vault"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg hover:shadow-lg transition-all block"
            >
              <h3 className="text-xl font-semibold mb-2">🏰 Sacred Vault</h3>
              <p className="text-sm">Your complete healthcare dashboard with 21+ features</p>
            </a>
            <a
              href="/vault/family-tree"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-lg hover:shadow-lg transition-all block"
            >
              <h3 className="text-xl font-semibold mb-2">🌳 Family Tree</h3>
              <p className="text-sm">Interactive family health history visualization</p>
            </a>
            <a
              href="/chat"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg hover:shadow-lg transition-all block"
            >
              <h3 className="text-xl font-semibold mb-2">💬 AI Chat</h3>
              <p className="text-sm">Real-time conversations with healthcare experts</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400">
            © 2026 Beau-Tox Healthcare. HIPAA compliant, AI-powered wellness platform.
          </p>
        </div>
      </footer>

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
};

export default LandingPage;