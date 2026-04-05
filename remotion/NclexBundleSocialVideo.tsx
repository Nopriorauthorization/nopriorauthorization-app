import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/** System stack — no network during render (reliable for CI / batch exports). */
const fontFamily =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const BG = "#0d1117";
const CARD = "#11161f";
const PINK = "#D4537E";
const MUTED = "#94a3b8";

const TOPICS = [
  "Lab values",
  "Pharmacology",
  "Cardiac & EKG",
  "Acid–base",
  "Priority & delegation",
  "Infection control",
  "OB & maternity",
  "Mental health",
];

const IMG_GLANCE = staticFile("study-guides/nclex-slide-at-a-glance.png");
const IMG_DEPTH = staticFile("study-guides/nclex-slide-study-guide-depth.png");

/** Vertical = Reels/TikTok/Stories; landscape square = IG feed */
export const NclexBundleSocialVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  const hookDur = Math.round(3.5 * fps);
  const img1Dur = Math.round(6.5 * fps);
  const img2Dur = Math.round(6.5 * fps);
  const topicsDur = Math.round(7.5 * fps);
  const ctaDur = Math.round(6 * fps);

  let from = 0;
  const hookFrom = from;
  from += hookDur;
  const img1From = from;
  from += img1Dur;
  const img2From = from;
  from += img2Dur;
  const topicsFrom = from;
  from += topicsDur;
  const ctaFrom = from;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily }}>
      <Sequence from={hookFrom} durationInFrames={hookDur}>
        <HookScene />
      </Sequence>
      <Sequence from={img1From} durationInFrames={img1Dur}>
        <ProductShotScene
          src={IMG_GLANCE}
          badge="At-a-glance cheat sheet"
          subtitle="Normals, criticals & comparison tables — print and cram."
        />
      </Sequence>
      <Sequence from={img2From} durationInFrames={img2Dur}>
        <ProductShotScene
          src={IMG_DEPTH}
          badge="Full study guide depth"
          subtitle="Jump links, callouts, NCLEX-style Q&As & checklists."
        />
      </Sequence>
      <Sequence from={topicsFrom} durationInFrames={topicsDur}>
        <TopicsScene />
      </Sequence>
      <Sequence from={ctaFrom} durationInFrames={ctaDur}>
        <CtaScene />
      </Sequence>
    </AbsoluteFill>
  );
};

function useVerticalMetrics() {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  return {
    isVertical,
    pad: isVertical ? 44 : 32,
    headline: isVertical ? 46 : 34,
    sub: isVertical ? 22 : 17,
    badge: isVertical ? 11 : 10,
  };
}

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pad, headline, sub, badge } = useVerticalMetrics();

  const opacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 20], [28, 0], { extrapolateRight: "clamp" });
  const line2 = interpolate(frame, [12, 28], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: pad,
        background: `linear-gradient(180deg, ${CARD} 0%, ${BG} 55%)`,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${y}px)`,
          textAlign: "center",
          maxWidth: 920,
        }}
      >
        <p
          style={{
            color: PINK,
            fontSize: badge,
            fontWeight: 700,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          NCLEX prep · No Prior Authorization
        </p>
        <h1
          style={{
            color: "#fff",
            fontSize: headline,
            fontWeight: 800,
            lineHeight: 1.12,
            margin: 0,
          }}
        >
          Stop tab-hunting the night before NCLEX.
        </h1>
        <p
          style={{
            opacity: line2,
            color: PINK,
            fontSize: Math.round(headline * 0.78),
            fontWeight: 800,
            lineHeight: 1.15,
            marginTop: 14,
            marginBottom: 0,
          }}
        >
          Cheat sheets + full study guides — one bundle.
        </p>
        <p
          style={{
            opacity: line2,
            color: MUTED,
            fontSize: sub,
            lineHeight: 1.5,
            marginTop: 22,
            marginBottom: 0,
          }}
        >
          Eight print-ready HTML files. Same design system you preview on the site — then unlock everything after
          checkout.
        </p>
      </div>
      {/* subtle progress hint */}
      <div
        style={{
          position: "absolute",
          bottom: pad,
          left: pad,
          right: pad,
          height: 3,
          borderRadius: 2,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${interpolate(frame, [0, 3.5 * fps], [8, 100], { extrapolateRight: "clamp" })}%`,
            background: PINK,
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const PRODUCT_SHOT_SECONDS = 6.5;

const ProductShotScene: React.FC<{
  src: string;
  badge: string;
  subtitle: string;
}> = ({ src, badge, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pad, isVertical } = useVerticalMetrics();
  const sceneFrames = Math.round(PRODUCT_SHOT_SECONDS * fps);

  const fade = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const ken = interpolate(frame, [0, sceneFrames - 1], [1.06, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: pad }}>
      <div style={{ opacity: fade, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <p
          style={{
            color: PINK,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            margin: "0 0 10px 0",
            textAlign: "center",
          }}
        >
          {badge}
        </p>
        <p
          style={{
            color: MUTED,
            fontSize: isVertical ? 18 : 15,
            textAlign: "center",
            margin: "0 0 16px 0",
            lineHeight: 1.45,
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          {subtitle}
        </p>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
            background: "#0a1628",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              transform: `scale(${ken})`,
              transformOrigin: "50% 0%",
            }}
          >
            <Img
              src={src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "top center",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TopicsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { pad, isVertical } = useVerticalMetrics();

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: pad }}>
      <h2
        style={{
          color: "#fff",
          fontSize: isVertical ? 32 : 26,
          fontWeight: 800,
          textAlign: "center",
          margin: "0 0 8px 0",
        }}
      >
        8 guides. Boards-ready.
      </h2>
      <p style={{ color: MUTED, fontSize: isVertical ? 17 : 14, textAlign: "center", margin: "0 0 22px 0" }}>
        Lab through mental health — quick scan or deep study.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: isVertical ? 12 : 10,
          maxWidth: 880,
          margin: "0 auto",
        }}
      >
        {TOPICS.map((t, i) => {
          const start = 4 + i * 5;
          const op = interpolate(frame, [start, start + 12], [0, 1], { extrapolateRight: "clamp" });
          const slide = interpolate(frame, [start, start + 12], [14, 0], { extrapolateRight: "clamp" });
          return (
            <div
              key={t}
              style={{
                opacity: op,
                transform: `translateY(${slide}px)`,
                background: CARD,
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: isVertical ? "14px 16px" : "10px 12px",
                color: "#e2e8f0",
                fontSize: isVertical ? 17 : 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: PINK, fontWeight: 800 }}>✓</span>
              {t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pad, isVertical } = useVerticalMetrics();

  const opacity = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const pulse = interpolate(frame, [0, 3 * fps], [0.92, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${CARD} 0%, ${BG} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: pad,
      }}
    >
      <div style={{ opacity, textAlign: "center", maxWidth: 880 }}>
        <p
          style={{
            color: PINK,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          NCLEX complete study bundle
        </p>
        <p
          style={{
            color: "#fff",
            fontSize: isVertical ? 56 : 40,
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          $49 · one-time
        </p>
        <p style={{ color: MUTED, fontSize: isVertical ? 20 : 16, marginTop: 16, lineHeight: 1.5 }}>
          Print-ready HTML · Instant email delivery
        </p>
        <div
          style={{
            marginTop: 28,
            transform: `scale(${pulse})`,
            display: "inline-block",
            background: PINK,
            color: "#fff",
            fontWeight: 800,
            fontSize: isVertical ? 20 : 16,
            padding: isVertical ? "18px 28px" : "14px 22px",
            borderRadius: 14,
            boxShadow: "0 12px 40px rgba(212, 83, 126, 0.35)",
          }}
        >
          nopriorauthorization.com/nclex-bundle
        </div>
      </div>
    </AbsoluteFill>
  );
};
