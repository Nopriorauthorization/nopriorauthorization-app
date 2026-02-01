import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { GlowText } from '../components/GlowText';
import { FadeContainer } from '../components/FadeContainer';

export const InteractiveDomainsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene transitions every 3 seconds (90 frames at 30fps)
  const sceneDuration = 90;
  const currentScene = Math.floor(frame / sceneDuration);

  const renderScene = () => {
    switch (currentScene) {
      case 0: // Decode (0-90 frames)
        return (
          <FadeContainer startFrame={0} endFrame={90} durationInFrames={30}>
            <div style={{ textAlign: 'center' }}>
              <GlowText size="3rem" color="#ffffff">
                🧪 Decode your labs.
              </GlowText>
              <div style={{ marginTop: '1rem' }}>
                <GlowText size="2rem" color="#ec4899">
                  See patterns early.
                  <br />
                  Prevent life-changing surprises.
                </GlowText>
              </div>
            </div>
          </FadeContainer>
        );

      case 1: // Roots (90-180 frames)
        return (
          <FadeContainer startFrame={90} endFrame={180} durationInFrames={30}>
            <div style={{ textAlign: 'center' }}>
              <GlowText size="3rem" color="#ffffff">
                🌳 Connect generations.
              </GlowText>
              <div style={{ marginTop: '1rem' }}>
                <GlowText size="2rem" color="#ec4899">
                  Understand inherited risk.
                  <br />
                  Protect your future.
                </GlowText>
              </div>
            </div>
          </FadeContainer>
        );

      case 2: // Other Domains (180-270 frames)
        return (
          <FadeContainer startFrame={180} endFrame={270} durationInFrames={30}>
            <div style={{ textAlign: 'center' }}>
              <GlowText size="3rem" color="#ffffff">
                ⚙️ Specialists that explain.
              </GlowText>
              <div style={{ marginTop: '1rem' }}>
                <GlowText size="2rem" color="#ec4899">
                  Not overwhelm.
                </GlowText>
              </div>
            </div>
          </FadeContainer>
        );

      default:
        return null;
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {renderScene()}
    </AbsoluteFill>
  );
};