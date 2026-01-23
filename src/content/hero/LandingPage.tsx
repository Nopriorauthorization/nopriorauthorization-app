'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight, FiHeart, FiTrendingUp, FiShield, FiTarget } from 'react-icons/fi';

// Scroll-triggered section component
const ScrollSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <section className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        {children}
      </div>
    </section>
  );
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Hero Section - Above the Fold */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your health.<br />
            Your family.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Finally in one place.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            No Prior Authorization gives you clarity, organization, and insight — without the confusion, paperwork, or waiting.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/vault"
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              Enter the Sacred Vault
              <FiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/blueprint"
              className="border-2 border-pink-500/50 text-pink-400 hover:bg-pink-500/10 px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105"
            >
              Build Your Blueprint
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Section 1: The Problem */}
      <ScrollSection className="bg-gradient-to-b from-slate-900 to-slate-800">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Most people don't have a health plan.
            <br />
            They have files.
          </h2>

          <div className="text-xl text-white/80 space-y-4 max-w-2xl mx-auto">
            <p>Your records are scattered.</p>
            <p>Your history lives in portals you don't control.</p>
            <p>Your family history is incomplete — or forgotten entirely.</p>
            <p className="mt-8 italic">And when something matters, you're left searching.</p>
          </div>
        </div>
      </ScrollSection>

      {/* Section 2: Sacred Vault */}
      <ScrollSection className="bg-gradient-to-b from-slate-800 to-purple-900">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            This is where your health lives.
          </h2>

          <div className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            <p>The Sacred Vault securely stores everything that matters:</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6">
              <FiHeart className="w-8 h-8 text-pink-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Medical documents</h3>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6">
              <FiTrendingUp className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Treatment history</h3>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6">
              <FiShield className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Insurance and records</h3>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6">
              <FiTarget className="w-8 h-8 text-green-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Personal health context</h3>
            </div>
          </div>

          <p className="text-lg text-white/70 italic">
            All in one place. Always accessible. Always yours.
          </p>

          <p className="text-sm text-white/50 mt-4">
            Because clarity shouldn't depend on memory — or emergencies.
          </p>
        </div>
      </ScrollSection>

      {/* Section 3: Family Health Tree */}
      <ScrollSection className="bg-gradient-to-b from-purple-900 to-pink-900">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Your health didn't start with you.
          </h2>

          <div className="text-xl text-white/80 space-y-4 max-w-2xl mx-auto mb-8">
            <p>Patterns run through families.</p>
            <p>Conditions repeat quietly across generations.</p>
            <p>Most people never see them — until it's too late.</p>
          </div>

          <div className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            The Family Health Tree helps you understand what runs in your family
            so nothing comes as a surprise.
          </div>

          <div className="text-lg text-pink-300 font-medium">
            Especially when it comes to your children.
          </div>

          <p className="text-xl font-semibold text-white mt-8">
            What you understand today can change tomorrow.
          </p>
        </div>
      </ScrollSection>

      {/* Section 4: Intelligence */}
      <ScrollSection className="bg-gradient-to-b from-pink-900 to-red-900">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            No predictions.
            <br />
            No overwhelm.
            <br />
            Just understanding.
          </h2>

          <div className="text-xl text-white/80 space-y-4 max-w-2xl mx-auto">
            <p>We don't diagnose.</p>
            <p>We don't speculate.</p>
            <p>We help you see connections — and understand what matters sooner.</p>
          </div>

          <div className="mt-8 text-lg text-white/70">
            Clear insights.
            <br />
            Plain language.
            <br />
            Built around you.
          </div>
        </div>
      </ScrollSection>

      {/* Section 5: Blueprint */}
      <ScrollSection className="bg-gradient-to-b from-red-900 to-orange-900">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Now you know what to focus on.
          </h2>

          <div className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            The Blueprint brings everything together.
          </div>

          <div className="text-lg text-white/70 space-y-2">
            <p>It helps you understand:</p>
            <ul className="space-y-2 mt-4">
              <li>• What matters now</li>
              <li>• What to pay attention to next</li>
              <li>• How to move forward with confidence</li>
            </ul>
          </div>

          <div className="mt-8 text-xl font-semibold text-white">
            No guessing.
            <br />
            No noise.
            <br />
            Just direction.
          </div>
        </div>
      </ScrollSection>

      {/* Section 6: Emotional Close */}
      <ScrollSection className="bg-gradient-to-b from-orange-900 to-yellow-900">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            This isn't about reacting to problems.
          </h2>

          <div className="text-xl text-white/80 space-y-4 max-w-2xl mx-auto mb-8">
            <p>It's about protecting your future.</p>
            <p>Your family.</p>
            <p>Your peace of mind.</p>
          </div>

          <div className="text-lg text-white/70 italic">
            Once you have it, you won't know how you lived without it.
          </div>
        </div>
      </ScrollSection>

      {/* Final CTA Section */}
      <ScrollSection className="bg-gradient-to-b from-yellow-900 to-slate-900">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Start with one step.
          </h2>

          <div className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Build your Vault.
            <br />
            Add your family.
            <br />
            Create your Blueprint.
          </div>

          <p className="text-lg text-white/70 mb-12">
            Everything else gets easier from there.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/vault"
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              Enter the Sacred Vault
              <FiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/vault/family-tree"
              className="border-2 border-pink-500/50 text-pink-400 hover:bg-pink-500/10 px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105"
            >
              Start Your Family Health Tree
            </Link>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
};

export default LandingPage;