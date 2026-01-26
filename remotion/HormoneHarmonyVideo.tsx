import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

const HormoneHarmonyVideo: React.FC<{ title: string }> = ({ title }) => {
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

      {/* Scene 2: The Hormone Journey */}
      <Sequence from={scene1End} durationInFrames={scene2End - scene1End}>
        <Scene2 />
      </Sequence>

      {/* Scene 3: Understanding Balance */}
      <Sequence from={scene2End} durationInFrames={scene3End - scene2End}>
        <Scene3 />
      </Sequence>

      {/* Scene 4: Real Results */}
      <Sequence from={scene3End} durationInFrames={scene4End - scene3End}>
        <Scene4 />
      </Sequence>

      {/* Scene 5: The Harmony Difference */}
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
        <h1 style={{ fontSize: 48, marginBottom: 20 }}>Are Your Hormones Out of Balance?</h1>
        <p style={{ fontSize: 24, maxWidth: 600 }}>
          Fatigue, mood swings, weight changes, sleep issues... These could be signs your hormones need attention.
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
        <h1 style={{ fontSize: 48, marginBottom: 20, background: 'linear-gradient(45deg, #EC4899, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Meet Harmony™
        </h1>
        <p style={{ fontSize: 24, maxWidth: 600 }}>
          Your hormone balance educator who makes complex science simple and actionable.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 40 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, color: '#EC4899' }}>🧠</div>
            <p style={{ fontSize: 18 }}>Science-Based</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, color: '#8B5CF6' }}>💜</div>
            <p style={{ fontSize: 18 }}>Compassionate</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, color: '#10B981' }}>🎯</div>
            <p style={{ fontSize: 18 }}>Actionable</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const features = [
    { icon: '⚖️', title: 'Hormone Balance Explained', desc: 'What it really means and why it matters' },
    { icon: '🔍', title: 'Symptom Decoder', desc: 'Connect the dots between how you feel and hormone patterns' },
    { icon: '📋', title: 'Consult Preparation', desc: 'Know exactly what to ask your provider' },
    { icon: '🌱', title: 'Foundation First', desc: 'Build wellness habits that support hormone health' }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', padding: 40 }}>
      <h1 style={{ fontSize: 42, color: '#EC4899', textAlign: 'center', marginBottom: 40 }}>
        Understanding Hormone Balance
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
    { value: '85%', label: 'Report clearer thinking and better focus', color: '#EC4899' },
    { value: 'Better', label: 'Sleep quality and energy levels', color: '#8B5CF6' },
    { value: 'Improved', label: 'Mood stability and emotional balance', color: '#10B981' }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white', maxWidth: 800 }}>
        <h1 style={{ fontSize: 42, marginBottom: 40, color: '#EC4899' }}>
          Real Results from Hormone Education
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
          When people understand their hormones, they make better decisions and see real improvements in how they feel and function.
        </p>
      </div>
    </AbsoluteFill>
  );
};

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const futures = [
    'Personalized hormone insights based on your unique patterns',
    'Direct connections to qualified hormone specialists',
    'Ongoing support as your needs evolve',
    'Evidence-based education that empowers your health journey'
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', padding: 40 }}>
      <h1 style={{ fontSize: 42, color: '#8B5CF6', textAlign: 'center', marginBottom: 40 }}>
        The Harmony™ Difference
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        {futures.map((future, index) => {
          const delay = index * 30;
          const opacity = interpolate(frame, [delay, delay + 30], [0, 1]);
          return (
            <div key={index} style={{ opacity, backgroundColor: '#1e293b', padding: 30, borderRadius: 16, border: '1px solid #334155' }}>
              <h3 style={{ fontSize: 22, color: 'white', marginBottom: 10 }}>💜 {future}</h3>
              <p style={{ fontSize: 16, color: '#94a3b8' }}>
                Experience healthcare that meets you where you are and grows with you.
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
        <h1 style={{ fontSize: 48, marginBottom: 20, background: 'linear-gradient(45deg, #EC4899, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Ready to Find Your Balance?
        </h1>
        <p style={{ fontSize: 24, marginBottom: 40 }}>
          Start your hormone wellness journey with Harmony™ today.
        </p>
        <div style={{ fontSize: 32, marginBottom: 20 }}>askbeau.com</div>
        <div style={{ fontSize: 18, color: '#94a3b8' }}>
          Chat with Harmony • Get personalized insights • Connect with specialists
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { HormoneHarmonyVideo };