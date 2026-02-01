import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface FlowLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startFrame: number;
  durationInFrames: number;
  color?: string;
  width?: number;
}

export const FlowLine: React.FC<FlowLineProps> = ({
  startX,
  startY,
  endX,
  endY,
  startFrame,
  durationInFrames,
  color = 'rgba(236, 72, 153, 0.6)',
  width = 2
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const currentX = startX + (endX - startX) * progress;
  const currentY = startY + (endY - startY) * progress;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <line
        x1={startX}
        y1={startY}
        x2={currentX}
        y2={currentY}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    </svg>
  );
};