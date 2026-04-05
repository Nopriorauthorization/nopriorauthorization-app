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

const fontFamily =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const BG = "#1A1A1A";
const BG_SOFT = "#faf8fb";
const PINK = "#D4537E";
const MUTED = "#94a3b8";
const MUTED_DARK = "#64748b";

/** Match `/storefront` campaign landing */
export const STOREFRONT_CAMPAIGN_PATH = "/storefront";

function useVerticalMetrics() {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  return {
    isVertical,
    pad: isVertical ? 36 : 24,
    h1: isVertical ? 52 : 40,
    body: isVertical ? 22 : 18,
  };
}

export const StorefrontSocialVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  const s1 = Math.round(4.5 * fps);
  const s2 = Math.round(5.5 * fps);
  const s3 = Math.round(6.5 * fps);
  const sSneak = Math.round(8 * fps);
  const s4 = Math.round(5.5 * fps);
  const s5 = Math.round(5.5 * fps);
  const s6 = Math.round(8.5 * fps);

  let from = 0;
  const hookFrom = from;
  from += s1;
  const statsFrom = from;
  from += s2;
  const pillarsFrom = from;
  from += s3;
  const sneakFrom = from;
  from += sSneak;
  const trustFrom = from;
  from += s4;
  const quoteFrom = from;
  from += s5;
  const ctaFrom = from;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily }}>
      <Sequence from={hookFrom} durationInFrames={s1}>
        <HookScene />
      </Sequence>
      <Sequence from={statsFrom} durationInFrames={s2}>
        <StatsScene />
      </Sequence>
      <Sequence from={pillarsFrom} durationInFrames={s3}>
        <PillarsScene />
      </Sequence>
      <Sequence from={sneakFrom} durationInFrames={sSneak}>
        <SneakPeekScene />
      </Sequence>
      <Sequence from={trustFrom} durationInFrames={s4}>
        <TrustScene />
      </Sequence>
      <Sequence from={quoteFrom} durationInFrames={s5}>
        <QuoteScene />
      </Sequence>
      <Sequence from={ctaFrom} durationInFrames={s6}>
        <CtaScene />
      </Sequence>
    </AbsoluteFill>
  );
};

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { pad, h1, body } = useVerticalMetrics();
  const op = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 22], [24, 0], { extrapolateRight: "clamp" });
  const line2 = interpolate(frame, [14, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: pad,
        background: `radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,83,126,0.2) 0%, ${BG} 65%)`,
      }}
    >
      <div style={{ opacity: op, transform: `translateY(${y}px)`, textAlign: "center", maxWidth: 920 }}>
        <p
          style={{
            display: "inline-block",
            marginBottom: 20,
            border: "1px solid rgba(212,83,126,0.35)",
            background: "rgba(212,83,126,0.12)",
            color: PINK,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            padding: "8px 18px",
            borderRadius: 999,
          }}
        >
          ✦ Built by a real provider
        </p>
        <h1
          style={{
            color: "#fff",
            fontSize: h1,
            fontWeight: 800,
            lineHeight: 1.08,
            margin: 0,
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          Stop Googling at
          <br />
          <span style={{ color: PINK, fontStyle: "italic" }}>Midnight.</span>
        </h1>
        <p
          style={{
            opacity: line2,
            color: "#fff",
            fontSize: Math.round(h1 * 0.72),
            fontWeight: 800,
            lineHeight: 1.12,
            marginTop: 12,
            marginBottom: 0,
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          Start practicing with confidence.
        </p>
        <p
          style={{
            opacity: line2,
            color: MUTED,
            fontSize: body,
            lineHeight: 1.55,
            marginTop: 20,
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Real previews: cheat sheets, playbooks, NCLEX & more — instant download.
        </p>
      </div>
    </AbsoluteFill>
  );
};

const SNEAK_TILES = [
  {
    src: staticFile("shop-previews/cheat-sheets/botox-clinical-cheat-sheet.png"),
    label: "Cheat sheets",
  },
  {
    src: staticFile("shop-previews/business-systems/facial-anatomy-nurse-injector.png"),
    label: "Playbooks & guides",
  },
  {
    src: staticFile("study-guides/nclex-slide-at-a-glance.png"),
    label: "NCLEX prep",
  },
  {
    src: staticFile("shop-previews/business-systems/phase-2-business-bundle.png"),
    label: "Business systems",
  },
] as const;

const SneakPeekScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { pad, isVertical } = useVerticalMetrics();
  const { durationInFrames } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const ken = interpolate(frame, [0, durationInFrames - 1], [1.04, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG_SOFT,
        padding: pad,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: isVertical ? 14 : 10, opacity: titleOp, flexShrink: 0 }}>
        <p
          style={{
            color: PINK,
            fontSize: isVertical ? 13 : 12,
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Sneak peek
        </p>
        <h2
          style={{
            color: "#1A1A1A",
            fontSize: isVertical ? 32 : 26,
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.12,
            fontFamily: "Georgia, serif",
          }}
        >
          Real layouts we built
        </h2>
        <p style={{ color: "#7a6b7a", fontSize: isVertical ? 17 : 15, marginTop: 8, marginBottom: 0 }}>
          Same print-ready files as the shop — not stock photos.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: isVertical ? 10 : 8,
          maxWidth: 920,
          margin: "0 auto",
          flex: 1,
          minHeight: 0,
        }}
      >
        {SNEAK_TILES.map((tile, i) => {
          const st = 10 + i * 12;
          const op = interpolate(frame, [st, st + 16], [0, 1], { extrapolateRight: "clamp" });
          const scale = interpolate(frame, [st, st + durationInFrames * 0.4], [0.96, 1], {
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={tile.label}
              style={{
                opacity: op,
                transform: `scale(${scale * ken})`,
                borderRadius: 14,
                overflow: "hidden",
                border: "2px solid #e8e0e8",
                boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
                position: "relative",
                aspectRatio: "1 / 1",
                background: "#fff",
              }}
            >
              <Img
                src={tile.src}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: isVertical ? "10px 12px" : "8px 10px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: isVertical ? 16 : 14,
                    fontWeight: 800,
                  }}
                >
                  {tile.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { pad, isVertical } = useVerticalMetrics();
  const stats = [
    { n: "50+", l: "Products" },
    { n: "$10", l: "Starting price" },
    { n: "10+", l: "Years clinical" },
    { n: "100%", l: "Instant" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: pad, justifyContent: "center" }}>
      <p
        style={{
          textAlign: "center",
          color: PINK,
          fontSize: isVertical ? 13 : 12,
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          marginBottom: 20,
        }}
      >
        No Prior Authorization
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isVertical ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
          gap: isVertical ? 14 : 12,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {stats.map((s, i) => {
          const st = 6 + i * 8;
          const op = interpolate(frame, [st, st + 14], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={s.l}
              style={{
                opacity: op,
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: isVertical ? "18px 12px" : "20px 14px",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div
                style={{
                  fontSize: isVertical ? 44 : 40,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: 2,
                  fontFamily: "Impact, Haettenschweiler, sans-serif",
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontSize: isVertical ? 13 : 12,
                  color: MUTED_DARK,
                  textTransform: "uppercase",
                  marginTop: 6,
                }}
              >
                {s.l}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const PillarsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { pad, isVertical } = useVerticalMetrics();
  const items = [
    { t: "Clinical", d: "Cheat sheets & references", c: PINK },
    { t: "Business", d: "Systems that run a real spa", c: "#c77b2a" },
    { t: "NCLEX", d: "Boards-ready HTML bundle", c: "#7b2d8b" },
    { t: "Bundles", d: "Full stack, one checkout", c: "#2a9d8f" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG_SOFT, padding: pad, justifyContent: "center" }}>
      <h2
        style={{
          textAlign: "center",
          color: "#1A1A1A",
          fontSize: isVertical ? 32 : 26,
          fontWeight: 800,
          marginBottom: 8,
          fontFamily: "Georgia, serif",
        }}
      >
        One storefront. Four pillars.
      </h2>
      <p style={{ textAlign: "center", color: "#7a6b7a", fontSize: isVertical ? 18 : 15, marginBottom: 24 }}>
        Built inside Hello Gorgeous Med Spa — not a textbook factory.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 880, margin: "0 auto" }}>
        {items.map((item, i) => {
          const st = 4 + i * 10;
          const op = interpolate(frame, [st, st + 16], [0, 1], { extrapolateRight: "clamp" });
          const x = interpolate(frame, [st, st + 16], [24, 0], { extrapolateRight: "clamp" });
          return (
            <div
              key={item.t}
              style={{
                opacity: op,
                transform: `translateX(${x}px)`,
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "#fff",
                border: "1px solid #e8e0e8",
                borderRadius: 14,
                padding: isVertical ? "16px 18px" : "12px 16px",
                borderLeft: `4px solid ${item.c}`,
              }}
            >
              <div style={{ fontSize: isVertical ? 24 : 20, fontWeight: 800, color: "#1A1A1A", minWidth: 100 }}>
                {item.t}
              </div>
              <div style={{ fontSize: isVertical ? 18 : 15, color: "#7a6b7a", flex: 1 }}>{item.d}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const TrustScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { pad } = useVerticalMetrics();
  const lines = [
    "Danielle Alcala-Glazier, RN student",
    "Medical Director: Ryan Kent, FNP-BC",
    "Hello Gorgeous · Oswego, IL",
    "Print-ready · No subscription",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FBEAF0",
        padding: pad,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p
        style={{
          color: PINK,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Why trust NPA
      </p>
      <div style={{ maxWidth: 720 }}>
        {lines.map((line, i) => {
          const st = 4 + i * 12;
          const op = interpolate(frame, [st, st + 14], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={line}
              style={{
                opacity: op,
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
                fontSize: 19,
                fontWeight: 600,
                color: "#1A1A1A",
              }}
            >
              <span style={{ color: PINK }}>✓</span>
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const QuoteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { pad, isVertical } = useVerticalMetrics();
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#fff", padding: pad, justifyContent: "center" }}>
      <div style={{ opacity: op, maxWidth: 880, margin: "0 auto" }}>
        <div style={{ color: "#c77b2a", fontSize: 15, marginBottom: 14 }}>★★★★★</div>
        <p
          style={{
            fontSize: isVertical ? 22 : 19,
            lineHeight: 1.55,
            color: "#1A1A1A",
            fontStyle: "italic",
            margin: 0,
          }}
        >
          &ldquo;The Facial Anatomy guide is the most organized clinical reference I&apos;ve ever seen. Worth every
          dollar and then some.&rdquo;
        </p>
        <p style={{ marginTop: 16, fontSize: 15, fontWeight: 700, color: "#7a6b7a" }}>
          RN, med spa owner · Nashville, TN
        </p>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { pad, isVertical } = useVerticalMetrics();
  const op = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const host = "nopriorauthorization.com";

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${PINK} 0%, #b83a68 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: pad,
      }}
    >
      <div style={{ opacity: op, textAlign: "center", maxWidth: 900 }}>
        <h2
          style={{
            color: "#fff",
            fontSize: isVertical ? 40 : 32,
            fontWeight: 800,
            lineHeight: 1.12,
            margin: 0,
            fontFamily: "Georgia, serif",
          }}
        >
          Shop the campaign
          <br />
          landing page
        </h2>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: isVertical ? 20 : 17, marginTop: 16, lineHeight: 1.5 }}>
          Full catalog, NCLEX bundle, Growth System — links that match the site.
        </p>
        <div
          style={{
            marginTop: 28,
            display: "inline-block",
            background: "#fff",
            color: PINK,
            fontWeight: 800,
            fontSize: isVertical ? 19 : 16,
            padding: isVertical ? "16px 22px" : "14px 20px",
            borderRadius: 16,
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
          }}
        >
          {host}
          {STOREFRONT_CAMPAIGN_PATH}
        </div>
      </div>
    </AbsoluteFill>
  );
};
