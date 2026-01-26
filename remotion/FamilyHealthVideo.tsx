import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

const FamilyHealthVideo: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timings (in frames)
  const scene1End = 10 * fps; // 10 seconds
  const scene2End = 25 * fps; // 25 seconds
  const scene3End = 45 * fps; // 45 seconds
  const scene4End = 65 * fps; // 65 seconds
  const scene5End = 80 * fps; // 80 seconds
  const scene6End = 90 * fps; // 90 seconds

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Background Music - Add audio file later */}
      {/* <Audio src={staticFile('background-music.mp3')} /> */}

      {/* Scene 1: Hook */}
      <Sequence from={0} durationInFrames={scene1End}>
        <Scene1 />
      </Sequence>

      {/* Scene 2: The Family Connection */}
      <Sequence from={scene1End} durationInFrames={scene2End - scene1End}>
        <Scene2 />
      </Sequence>

      {/* Scene 3: Understanding Patterns */}
      <Sequence from={scene2End} durationInFrames={scene3End - scene2End}>
        <Scene3 />
      </Sequence>

      {/* Scene 4: Prevention & Action */}
      <Sequence from={scene3End} durationInFrames={scene4End - scene3End}>
        <Scene4 />
      </Sequence>

      {/* Scene 5: The Root Difference */}
      <Sequence from={scene4End} durationInFrames={scene5End - scene4End}>
        <Scene5 />
      </Sequence>

      {/* Scene 6: Call to Action */}
      <Sequence from={scene5End} durationInFrames={scene6End - scene5End}>
        <Scene6 />
      </Sequence>
    </AbsoluteFill>
  );
};

// Scene Components
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity, textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 48, marginBottom: 20 }}>Your Health is Written in Your Family's DNA</h1>
        <p style={{ fontSize: 24, maxWidth: 600 }}>
          Understanding your family's health patterns can help you prevent disease and live healthier.
        </p>
      </div>
    </AbsoluteFill>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity, textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 48, marginBottom: 20, background: 'linear-gradient(45deg, #059669, #0D9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Meet Root™
        </h1>
        <p style={{ fontSize: 24, maxWidth: 600 }}>
          Your family health pattern analyst who connects the dots between generations.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 40 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, color: '#059669' }}>🌳</div>
            <p style={{ fontSize: 18 }}>Rooted in History</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, color: '#0D9488' }}>🔍</div>
            <p style={{ fontSize: 18 }}>Pattern Recognition</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, color: '#10B981' }}>🛡️</div>
            <p style={{ fontSize: 18 }}>Prevention Focus</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const features = [
    { icon: '📊', title: 'Family Health Mapping', desc: 'Visualize patterns across generations' },
    { icon: '🎯', title: 'Risk Assessment', desc: 'Identify inherited health risks early' },
    { icon: '💡', title: 'Prevention Strategies', desc: 'Actionable steps based on family history' },
    { icon: '🔗', title: 'Connection Insights', desc: 'How lifestyle and genetics interact' }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', padding: 40 }}>
      <h1 style={{ fontSize: 42, color: '#059669', textAlign: 'center', marginBottom: 40 }}>
        Understanding Family Health Patterns
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        {features.map((feature, index) => {
          const delay = index * 30;
          const opacity = interpolate(frame, [delay, delay + 30], [0, 1], { extrapolateRight: 'clamp' });
          return (
            <div key={index} style={{ opacity, backgroundColor: '#1e293b', padding: 30, borderRadius: 16, border: '1px solid #334155' }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>{feature.icon}</div>
              <h3 style={{ fontSize: 24, color: 'white', marginBottom: 10 }}>{feature.title}</h3>
              <p style={{ fontSize: 16, color: '#94a3b8' }}>{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const stats = [
    { value: 'Early', label: 'Detection of genetic risks', color: '#059669' },
    { value: 'Personalized', label: 'Prevention plans', color: '#0D9488' },
    { value: 'Better', label: 'Health outcomes for families', color: '#10B981' }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white', maxWidth: 800 }}>
        <h1 style={{ fontSize: 42, marginBottom: 40, color: '#059669' }}>
          Prevention Through Understanding
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 60, marginBottom: 40 }}>
          {stats.map((stat, index) => {
            const delay = index * 45;
            const opacity = interpolate(frame, [delay, delay + 30], [0, 1]);
            return (
              <div key={index} style={{ opacity, textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 'bold', color: stat.color, marginBottom: 10 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 18, color: '#94a3b8' }}>{stat.label}</div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: 24, lineHeight: 1.6 }}>
          When you understand your family's health patterns, you can take proactive steps to protect yourself and your loved ones.
        </p>
      </div>
    </AbsoluteFill>
  );
};

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const futures = [
    'Comprehensive family health history analysis',
    'AI-powered pattern recognition across generations',
    'Personalized prevention recommendations',
    'Ongoing support as your family health evolves'
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', padding: 40 }}>
      <h1 style={{ fontSize: 42, color: '#0D9488', textAlign: 'center', marginBottom: 40 }}>
        The Root™ Advantage
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        {futures.map((future, index) => {
          const delay = index * 30;
          const opacity = interpolate(frame, [delay, delay + 30], [0, 1]);
          return (
            <div key={index} style={{ opacity, backgroundColor: '#1e293b', padding: 30, borderRadius: 16, border: '1px solid #334155' }}>
              <h3 style={{ fontSize: 22, color: 'white', marginBottom: 10 }}>🌱 {future}</h3>
              <p style={{ fontSize: 16, color: '#94a3b8' }}>
                Advanced analysis that helps you understand and protect your family's health legacy.
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity, textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 48, marginBottom: 20, background: 'linear-gradient(45deg, #059669, #0D9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Discover Your Family's Health Story
        </h1>
        <p style={{ fontSize: 24, marginBottom: 40 }}>
          Start your family health journey with Root™ today.
        </p>
        <div style={{ fontSize: 32, marginBottom: 20 }}>askbeau.com</div>
        <div style={{ fontSize: 18, color: '#94a3b8' }}>
          Chat with Root • Map your family health • Prevent disease • Protect your legacy
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { FamilyHealthVideo };