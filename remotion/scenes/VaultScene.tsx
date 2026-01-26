import React from 'react';
import { AbsoluteFill } from 'remotion';
import { GlowText } from '../components/GlowText';
import { FadeContainer } from '../components/FadeContainer';

export const VaultScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <FadeContainer startFrame={0} endFrame={150} durationInFrames={30}>
        <div style={{ textAlign: 'center' }}>
          <GlowText size="4rem" color="#ffffff">
            🔐 Sacred Vault
          </GlowText>

          <div style={{ marginTop: '2rem' }}>
            <GlowText size="2rem" color="#ec4899">
              Your labs, records, notes, and conversations —
              <br />
              secure, organized, connected.
            </GlowText>
          </div>
        </div>
      </FadeContainer>
    </AbsoluteFill>
  );
};