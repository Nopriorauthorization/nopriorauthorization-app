import React from 'react';
import { AbsoluteFill } from 'remotion';
import { GlowText } from '../components/GlowText';
import { FadeContainer } from '../components/FadeContainer';

export const OutcomeCTA: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <FadeContainer startFrame={0} endFrame={210} durationInFrames={30}>
        <div style={{ textAlign: 'center' }}>
          <FadeContainer startFrame={0} endFrame={90} durationInFrames={30}>
            <GlowText size="3rem" color="#ffffff">
              This isn't about reacting to illness.
            </GlowText>
          </FadeContainer>

          <FadeContainer startFrame={90} endFrame={180} durationInFrames={30}>
            <div style={{ marginTop: '2rem' }}>
              <GlowText size="3rem" color="#ec4899">
                It's about clarity —
                <br />
                before it becomes urgent.
              </GlowText>
            </div>
          </FadeContainer>
        </div>
      </FadeContainer>
    </AbsoluteFill>
  );
};