import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BrandIntro } from '../scenes/BrandIntro';
import { ProblemStatement } from '../scenes/ProblemStatement';
import { VaultScene } from '../scenes/VaultScene';
import { BlueprintScene } from '../scenes/BlueprintScene';
import { MascotOverview } from '../scenes/MascotOverview';
import { InteractiveDomainsScene } from '../scenes/InteractiveDomainsScene';
import { OutcomeCTA } from '../scenes/OutcomeCTA';
import { GlowText } from '../components/GlowText';
import { FadeContainer } from '../components/FadeContainer';

const NPA_Homepage_Explainer_V1: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene timings in frames (30fps)
  const scenes = {
    brandIntro: { start: 0, end: 150 }, // 0-5s
    problemStatement: { start: 150, end: 360 }, // 5-12s
    theShift: { start: 360, end: 600 }, // 12-20s
    vaultScene: { start: 600, end: 750 }, // 20-25s
    blueprintScene: { start: 750, end: 900 }, // 25-30s
    mascotOverview: { start: 900, end: 1050 }, // 30-35s
    interactiveDomains: { start: 1050, end: 1500 }, // 35-50s
    outcomeCTA: { start: 1500, end: 1710 }, // 50-57s
    finalCTA: { start: 1710, end: 1800 }, // 57-60s
  };

  const renderScene = () => {
    if (frame >= scenes.brandIntro.start && frame < scenes.brandIntro.end) {
      return <BrandIntro />;
    }

    if (frame >= scenes.problemStatement.start && frame < scenes.problemStatement.end) {
      return <ProblemStatement />;
    }

    if (frame >= scenes.theShift.start && frame < scenes.theShift.end) {
      return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
          <FadeContainer startFrame={scenes.theShift.start} endFrame={scenes.theShift.end} durationInFrames={30}>
            <div style={{ textAlign: 'center' }}>
              <GlowText size="4rem" color="#ffffff">
                Until now.
              </GlowText>

              <div style={{ marginTop: '2rem' }}>
                <GlowText size="2.5rem" color="#ec4899">
                  No Prior Authorization is a private,
                  <br />
                  intelligent health system.
                </GlowText>
              </div>
            </div>
          </FadeContainer>
        </AbsoluteFill>
      );
    }

    if (frame >= scenes.vaultScene.start && frame < scenes.vaultScene.end) {
      return <VaultScene />;
    }

    if (frame >= scenes.blueprintScene.start && frame < scenes.blueprintScene.end) {
      return <BlueprintScene />;
    }

    if (frame >= scenes.mascotOverview.start && frame < scenes.mascotOverview.end) {
      return <MascotOverview />;
    }

    if (frame >= scenes.interactiveDomains.start && frame < scenes.interactiveDomains.end) {
      return <InteractiveDomainsScene />;
    }

    if (frame >= scenes.outcomeCTA.start && frame < scenes.outcomeCTA.end) {
      return <OutcomeCTA />;
    }

    if (frame >= scenes.finalCTA.start && frame < scenes.finalCTA.end) {
      return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
          <FadeContainer startFrame={scenes.finalCTA.start} endFrame={scenes.finalCTA.end} durationInFrames={30}>
            <div style={{ textAlign: 'center' }}>
              <GlowText size="3rem" color="#ffffff">
                Built to grow with you.
                <br />
                Not overwhelm you.
              </GlowText>
            </div>
          </FadeContainer>
        </AbsoluteFill>
      );
    }

    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  };

  return renderScene();
};

export { NPA_Homepage_Explainer_V1 };