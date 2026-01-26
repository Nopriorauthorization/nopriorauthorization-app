import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface FadeContainerProps {
  children: React.ReactNode;
  startFrame: number;
  endFrame: number;
  durationInFrames: number;
}

export const FadeContainer: React.FC<FadeContainerProps> = ({
  children,
  startFrame,
  endFrame,
  durationInFrames
}) => {
  const frame = useCurrentFrame();

  const fadeInEnd = startFrame + durationInFrames;
  const fadeOutStart = endFrame - durationInFrames;

  let opacity: number;

  if (fadeInEnd < fadeOutStart) {
    // Separate fade in and fade out
    opacity = interpolate(
      frame,
      [startFrame, fadeInEnd, fadeOutStart, endFrame],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  } else {
    // Overlapping fades - use a single fade in/out
    const midPoint = (startFrame + endFrame) / 2;
    opacity = interpolate(
      frame,
      [startFrame, midPoint, endFrame],
      [0, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }

  // Ensure opacity is clamped between 0 and 1
  const clampedOpacity = Math.max(0, Math.min(1, opacity));

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: clampedOpacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};