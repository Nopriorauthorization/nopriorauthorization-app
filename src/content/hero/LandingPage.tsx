'use client';

import React from 'react';
import AvatarIntroStrip from '@/components/hero/avatar-intro-strip';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Mascots */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Ask <span className="text-pink-500">Beau-Tox</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your AI-powered healthcare companion featuring expert mascots who tell you
              the truth about wellness, hormones, aesthetics, and more.
            </p>
          </div>

          {/* Avatar Intro Strip - The main mascot component with videos */}
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">🏰 Sacred Vault</h3>
              <p className="text-sm">Your complete healthcare dashboard with 21+ features</p>
            </a>
            <a
              href="/vault/family-tree"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-lg hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">🌳 Family Tree</h3>
              <p className="text-sm">Interactive family health history visualization</p>
            </a>
            <a
              href="/chat"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg hover:shadow-lg transition-all"
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