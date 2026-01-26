import React from 'react';
import { AbsoluteFill } from 'remotion';
import { GlowText } from '../components/GlowText';
import { FadeContainer } from '../components/FadeContainer';

export const BlueprintScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <FadeContainer startFrame={0} endFrame={150} durationInFrames={30}>
        <div style={{ textAlign: 'center' }}>
          <GlowText size="4rem" color="#ffffff">
            📘 Your Blueprint
          </GlowText>

          <div style={{ marginTop: '2rem' }}>
            <GlowText size="2rem" color="#ec4899">
              Your health, translated into priorities.
              <br />
              Always evolving. Always relevant.
            </GlowText>
          </div>
        </div>
      </FadeContainer>
    </AbsoluteFill>
  );
};