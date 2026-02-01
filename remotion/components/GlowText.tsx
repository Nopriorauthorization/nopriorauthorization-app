import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface GlowTextProps {
  children: React.ReactNode;
  color?: string;
  size?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export const GlowText: React.FC<GlowTextProps> = ({
  children,
  color = '#ffffff',
  size = '3rem',
  fontWeight = '600',
  textAlign = 'center'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle glow pulse
  const glowOpacity = interpolate(
    frame % (fps * 2),
    [0, fps, fps * 2],
    [0.3, 0.8, 0.3],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        fontSize: size,
        fontWeight,
        color,
        textAlign,
        textShadow: `0 0 20px rgba(236, 72, 153, ${glowOpacity})`,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: '1.2',
      }}
    >
      {children}
    </div>
  );
};