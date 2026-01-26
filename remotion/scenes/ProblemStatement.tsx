import React from 'react';
import { AbsoluteFill } from 'remotion';
import { GlowText } from '../components/GlowText';
import { FadeContainer } from '../components/FadeContainer';

export const ProblemStatement: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <FadeContainer startFrame={0} endFrame={210} durationInFrames={30}>
        <div style={{ textAlign: 'center', lineHeight: '1.8' }}>
          <FadeContainer startFrame={0} endFrame={60} durationInFrames={30}>
            <GlowText size="2.5rem" color="#ffffff">
              Labs you don't understand.
            </GlowText>
          </FadeContainer>

          <FadeContainer startFrame={60} endFrame={120} durationInFrames={30}>
            <div style={{ marginTop: '1rem' }}>
              <GlowText size="2.5rem" color="#ffffff">
                Family history you can't track.
              </GlowText>
            </div>
          </FadeContainer>

          <FadeContainer startFrame={120} endFrame={180} durationInFrames={30}>
            <div style={{ marginTop: '1rem' }}>
              <GlowText size="2.5rem" color="#ffffff">
                Healthcare that reacts too late.
              </GlowText>
            </div>
          </FadeContainer>

          <FadeContainer startFrame={180} endFrame={210} durationInFrames={30}>
            <div style={{ marginTop: '2rem' }}>
              <GlowText size="2.5rem" color="#ec4899">
                The information exists.
                <br />
                The insight doesn't.
              </GlowText>
            </div>
          </FadeContainer>
        </div>
      </FadeContainer>
    </AbsoluteFill>
  );
};