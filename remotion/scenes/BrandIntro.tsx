import React from 'react';
import { AbsoluteFill } from 'remotion';
import { GlowText } from '../components/GlowText';
import { FadeContainer } from '../components/FadeContainer';

export const BrandIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <FadeContainer startFrame={0} endFrame={150} durationInFrames={30}>
        <GlowText size="4rem" color="#ffffff">
          NO PRIOR AUTHORIZATION
        </GlowText>
      </FadeContainer>

      <FadeContainer startFrame={60} endFrame={150} durationInFrames={30}>
        <div style={{ marginTop: '2rem' }}>
          <GlowText size="2rem" color="#ec4899">
            Your health. Your family.
            <br />
            Finally in one place.
          </GlowText>
        </div>
      </FadeContainer>
    </AbsoluteFill>
  );
};