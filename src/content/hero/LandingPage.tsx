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

      {/* Hero Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            No Prior <span className="text-pink-500">Authorization</span>
          </h1>
          
          {/* Hero Image Section - Desktop only, underneath heading */}
          <div className="relative w-full max-w-5xl mx-auto mb-8">
            <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl shadow-pink-500/20 border border-pink-500/30">
              <Image
                src="/nopriorhero.png"
                alt="No Prior Authorization Hero"
                fill
                className="object-cover object-center"
                priority
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