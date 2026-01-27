/**
 * NPA Identity Video - Remotion Explainer
 * 
 * Purpose: Explain why the NPA Number exists — emotionally, not technically.
 * Duration: 20-30 seconds
 * 
 * Script Direction:
 * - "Your health shouldn't be scattered."
 * - "Your NPA Number keeps you in control."
 * - "One identity. Your rules."
 * 
 * This video will live:
 * - On the Identity section in Settings
 * - Future onboarding
 * - Marketing later
 * 
 * STATUS: STUB - Non-blocking for NPA Number feature
 */

import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

export const NpaIdentityVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Scene timings (in frames) - 30 second video
  const scene1End = 10 * fps; // 10 seconds - Problem
  const scene2End = 20 * fps; // 10 seconds - Solution  
  const scene3End = 30 * fps; // 10 seconds - CTA

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Scene 1: The Problem */}
      <Sequence from={0} durationInFrames={scene1End}>
        <ProblemScene />
      </Sequence>

      {/* Scene 2: The Solution */}
      <Sequence from={scene1End} durationInFrames={scene2End - scene1End}>
        <SolutionScene />
      </Sequence>

      {/* Scene 3: Call to Action */}
      <Sequence from={scene2End} durationInFrames={scene3End - scene2End}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};

// Scene 1: The Problem - "Your health shouldn't be scattered"
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const textSlide = interpolate(frame, [30, 60], [50, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill 
      style={{ 
        backgroundColor: '#0f0f0f', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 60,
      }}
    >
      <div style={{ 
        opacity, 
        textAlign: 'center', 
        color: 'white',
        transform: `translateY(${textSlide}px)`,
      }}>
        <p style={{ 
          fontSize: 28, 
          color: '#6366f1', 
          marginBottom: 30,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          The Problem
        </p>
        <h1 style={{ 
          fontSize: 56, 
          marginBottom: 30,
          fontWeight: 700,
          lineHeight: 1.2,
        }}>
          Your health shouldn't<br />be scattered.
        </h1>
        <p style={{ 
          fontSize: 24, 
          maxWidth: 600, 
          color: '#a1a1aa',
          lineHeight: 1.6,
        }}>
          Different portals. Different logins. Different records.
          No single place that's truly yours.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: The Solution - "Your NPA Number keeps you in control"
const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const npaScale = interpolate(frame, [60, 90], [0.8, 1], { extrapolateRight: 'clamp' });
  const npaGlow = interpolate(frame, [90, 150], [0, 20], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill 
      style={{ 
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1e1b4b 100%)', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 60,
      }}
    >
      <div style={{ 
        opacity, 
        textAlign: 'center', 
        color: 'white',
      }}>
        <p style={{ 
          fontSize: 28, 
          color: '#818cf8', 
          marginBottom: 30,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          The Solution
        </p>
        
        {/* NPA Number Display */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          padding: '30px 60px',
          borderRadius: 20,
          marginBottom: 40,
          transform: `scale(${npaScale})`,
          boxShadow: `0 0 ${npaGlow}px rgba(99, 102, 241, 0.5)`,
        }}>
          <p style={{ 
            fontSize: 18, 
            color: 'rgba(255,255,255,0.7)', 
            marginBottom: 10,
            letterSpacing: '0.15em',
          }}>
            YOUR NPA NUMBER
          </p>
          <p style={{ 
            fontSize: 48, 
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '0.1em',
          }}>
            NPA-XXXX-XXXX
          </p>
        </div>

        <h2 style={{ 
          fontSize: 42, 
          marginBottom: 20,
          fontWeight: 600,
        }}>
          Your NPA Number keeps<br />you in control.
        </h2>
        <p style={{ 
          fontSize: 22, 
          maxWidth: 550, 
          color: '#a1a1aa',
          lineHeight: 1.6,
        }}>
          One identity. Never exposes your data.
          You decide what gets shared — and when.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: CTA - "One identity. Your rules."
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = Math.sin(frame / 15) * 5 + 5;

  return (
    <AbsoluteFill 
      style={{ 
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f0f0f 100%)', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 60,
      }}
    >
      <div style={{ 
        opacity, 
        textAlign: 'center', 
        color: 'white',
      }}>
        <h1 style={{ 
          fontSize: 64, 
          marginBottom: 30,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          One identity.<br />Your rules.
        </h1>
        
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          padding: '20px 50px',
          borderRadius: 16,
          display: 'inline-block',
          boxShadow: `0 0 ${pulse}px rgba(99, 102, 241, 0.6)`,
        }}>
          <p style={{ 
            fontSize: 24, 
            fontWeight: 600,
          }}>
            Get Your NPA Number
          </p>
        </div>

        <p style={{ 
          fontSize: 18, 
          color: '#71717a',
          marginTop: 40,
        }}>
          nopriorauthorization.com
        </p>
      </div>
    </AbsoluteFill>
  );
};

export default NpaIdentityVideo;
