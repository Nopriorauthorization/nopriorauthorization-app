'use client';

import React from 'react';
import Image from 'next/image';
import MainNavigation from '@/components/layout/main-navigation';
import AvatarIntroStrip from '@/components/hero/avatar-intro-strip';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Panel */}
      <MainNavigation />

      {/* Hero Image Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Beau-Tox Healthcare Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Video Overlay (optional) */}
        <div className="absolute inset-0 z-0 opacity-30">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Ask <span className="text-pink-500">Beau-Tox</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your AI-powered healthcare companion featuring expert mascots who tell you
            the truth about wellness, hormones, aesthetics, and more.
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
              className="border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Chat with Experts
            </button>
          </div>
        </div>
      </section>

      {/* Mascot Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AvatarIntroStrip />
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
    </div>
  );
};

export default LandingPage;