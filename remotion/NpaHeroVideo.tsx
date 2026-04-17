import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const fontFamily =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const fontSerif = 'Georgia, "Times New Roman", serif';

// ── Brand palette ──────────────────────────────────────────────────────────────
const BG      = "#07030f";
const PINK    = "#D4537E";
const PINK2   = "#ec4899";
const PURPLE  = "#9333ea";
const GOLD    = "#f59e0b";
const TEAL    = "#06b6d4";
const GREEN   = "#10b981";
const BLUE    = "#3b82f6";
const MUTED   = "#94a3b8";
const BORDER  = "rgba(255,255,255,0.08)";

// ── Adaptive sizing ────────────────────────────────────────────────────────────
function useAd() {
  const { width, height } = useVideoConfig();
  const v = height > width;
  return {
    v,
    pad:   v ? 52 : 64,
    h1:    v ? 80 : 96,
    h2:    v ? 58 : 72,
    h3:    v ? 40 : 48,
    body:  v ? 28 : 34,
    small: v ? 20 : 24,
    label: v ? 14 : 17,
  };
}

// ── Tiny helpers ───────────────────────────────────────────────────────────────
function fi(frame: number, a: number, b: number, from = 0, to = 1) {
  return interpolate(frame, [a, b], [from, to], { extrapolateRight: "clamp" });
}

function GlowText({
  children,
  color = PINK,
  style = {},
}: {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        color,
        textShadow: `0 0 40px ${color}88, 0 0 80px ${color}44`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Animated background particles ─────────────────────────────────────────────
function Particles({ color = PINK, count = 18 }: { color?: string; count?: number }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const seed   = i * 137.508;
        const x      = ((seed * 31) % 100);
        const y      = ((seed * 17) % 100);
        const speed  = 0.3 + (i % 5) * 0.12;
        const size   = 2 + (i % 4);
        const phase  = i * 11;
        const pulse  = 0.3 + Math.abs(Math.sin((frame * speed + phase) / 40)) * 0.7;
        const drift  = Math.sin((frame * 0.4 + phase) / 60) * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left:    `${x}%`,
              top:     `${y}%`,
              transform: `translate(${drift}px, ${-frame * speed * 0.4 % height}px)`,
              width:   size,
              height:  size,
              borderRadius: "50%",
              background: color,
              opacity: pulse * 0.5,
              boxShadow: `0 0 ${size * 3}px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Scene 1: Brand Reveal (0–5s) ───────────────────────────────────────────────
const BrandReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { h1, h3, body, small, pad, label } = useAd();

  const scale  = fi(frame, 0, 20, 0.7, 1);
  const opMain = fi(frame, 0, 18, 0, 1);
  const opSub  = fi(frame, 20, 38, 0, 1);
  const opTag  = fi(frame, 35, 50, 0, 1);
  const bgGlow = fi(frame, 0, fps * 4, 0, 1);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Radial glow behind text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 55% at 50% 50%, rgba(212,83,126,${bgGlow * 0.22}) 0%, transparent 70%)`,
        }}
      />
      <Particles color={PINK} count={22} />

      <div style={{ opacity: opMain, transform: `scale(${scale})`, textAlign: "center", zIndex: 1, maxWidth: 960, padding: `0 ${pad}px` }}>
        <p
          style={{
            color: PINK,
            fontSize: label + 2,
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            margin: "0 0 16px 0",
          }}
        >
          nopriorauthorization.com
        </p>
        <h1
          style={{
            fontFamily: fontSerif,
            fontSize: h1 * 1.15,
            fontWeight: 700,
            lineHeight: 1.05,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          <GlowText color={PINK}>No Prior</GlowText>
          <br />
          <span style={{ color: "#fff" }}>Authorization</span>
        </h1>
        <p
          style={{
            opacity: opSub,
            color: MUTED,
            fontFamily: fontSerif,
            fontStyle: "italic",
            fontSize: h3,
            marginTop: 18,
            marginBottom: 0,
          }}
        >
          You Are Your Own Authorization
        </p>
      </div>

      {/* Bottom tag */}
      <div
        style={{
          opacity: opTag,
          position: "absolute",
          bottom: pad,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        {["Med Spa", "Nursing", "Aesthetics", "Business"].map((t) => (
          <span
            key={t}
            style={{
              background: "rgba(212,83,126,0.12)",
              border: "1px solid rgba(212,83,126,0.35)",
              color: PINK,
              fontSize: small - 1,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 50,
              whiteSpace: "nowrap",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: Problem (5–10s) ────────────────────────────────────────────────────
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { h2, h3, body, small, pad } = useAd();

  const op1 = fi(frame, 0, 16, 0, 1);
  const op2 = fi(frame, 22, 38, 0, 1);
  const y2  = fi(frame, 22, 38, 18, 0);

  const hats = ["Clinician", "Owner", "Marketer", "HR", "Compliance", "Billing", "Designer", "Educator"];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0f0515 0%, ${BG} 60%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
        flexDirection: "column",
        gap: 28,
        padding: pad,
        overflow: "hidden",
      }}
    >
      <Particles color={PURPLE} count={14} />

      <div style={{ opacity: op1, textAlign: "center", zIndex: 1 }}>
        <h2
          style={{
            fontSize: h2,
            fontWeight: 800,
            lineHeight: 1.12,
            color: "#fff",
            margin: 0,
          }}
        >
          Running a med spa is a{" "}
          <GlowText color={PURPLE}>full-time job.</GlowText>
          <br />
          Building the systems{" "}
          <span style={{ color: MUTED }}>shouldn't be.</span>
        </h2>
      </div>

      <div
        style={{
          opacity: op2,
          transform: `translateY(${y2}px)`,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 10,
          maxWidth: 800,
          zIndex: 1,
        }}
      >
        {hats.map((h, i) => {
          const hFade = fi(frame, 24 + i * 3, 34 + i * 3, 0, 1);
          return (
            <div
              key={h}
              style={{
                opacity: hFade,
                background: "rgba(147,51,234,0.12)",
                border: "1px solid rgba(147,51,234,0.3)",
                color: "#e2e8f0",
                fontSize: small,
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: 50,
              }}
            >
              {h}
            </div>
          );
        })}
      </div>

      <div style={{ opacity: fi(frame, 80, 110, 0, 1), zIndex: 1 }}>
        <p style={{ color: PINK, fontWeight: 800, fontSize: body, textAlign: "center", margin: 0 }}>
          NPA gives you the systems — so you can focus on the practice.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Product Showcase (10–22s) ────────────────────────────────────────
const ProductScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { v, h3, body, small, label, pad } = useAd();

  const products = [
    { name: "Clinical Templates",    desc: "Consent forms, pre/post care, HIPAA docs",    color: PINK,   icon: "📋", delay: 0   },
    { name: "Business Playbooks",    desc: "SOPs, hiring scripts, onboarding guides",      color: PURPLE, icon: "📖", delay: 6   },
    { name: "Cheat Sheets",          desc: "Injectable dosing, filler anatomy, protocols", color: TEAL,   icon: "🧬", delay: 12  },
    { name: "Micro 270 Bank",        desc: "1,000 nursing micro Q&A · AI cram tool",       color: BLUE,   icon: "🔬", delay: 18  },
    { name: "Ebooks & Guides",       desc: "Informed Beauty Guide, GLP-1, and more",       color: GOLD,   icon: "📚", delay: 24  },
    { name: "Marketing Templates",   desc: "Social posts, campaigns, Canva packs",         color: GREEN,  icon: "📣", delay: 30  },
    { name: "Free Resources",        desc: "10 free templates — no catch",                 color: PINK2,  icon: "🎁", delay: 36  },
    { name: "Pro Membership",        desc: "Full library · new drops monthly",             color: GOLD,   icon: "⭐", delay: 42  },
  ];

  const headFade = fi(frame, 0, 16, 0, 1);
  const cols = v ? 2 : 4;

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        padding: `${v ? 32 : 36}px ${v ? 24 : 40}px`,
        gap: v ? 18 : 16,
        overflow: "hidden",
      }}
    >
      <Particles color={PINK} count={10} />

      <div style={{ opacity: headFade, textAlign: "center", zIndex: 1 }}>
        <p style={{ color: PINK, fontSize: label + 2, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 6px 0" }}>
          What's inside
        </p>
        <h2 style={{ color: "#fff", fontSize: h3, fontWeight: 800, margin: 0 }}>
          Everything a practice needs to operate, grow, and study.
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: v ? 10 : 12,
          flex: 1,
          zIndex: 1,
        }}
      >
        {products.map((p) => {
          const cardFade = fi(frame, p.delay, p.delay + 14, 0, 1);
          const cardY    = fi(frame, p.delay, p.delay + 14, 20, 0);
          const cardScale= fi(frame, p.delay, p.delay + 14, 0.92, 1);
          return (
            <div
              key={p.name}
              style={{
                opacity: cardFade,
                transform: `translateY(${cardY}px) scale(${cardScale})`,
                background: `linear-gradient(145deg, ${p.color}14, rgba(255,255,255,0.02))`,
                border: `1.5px solid ${p.color}40`,
                borderRadius: 14,
                padding: v ? "14px 16px" : "12px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                boxShadow: `0 4px 20px ${p.color}18`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: v ? 22 : 18 }}>{p.icon}</span>
                <p style={{ color: p.color, fontSize: v ? label + 2 : label + 1, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                  {p.name}
                </p>
              </div>
              <p style={{ color: MUTED, fontSize: v ? small - 1 : small - 2, lineHeight: 1.4, margin: 0 }}>
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Who It's For (22–30s) ────────────────────────────────────────────
const WhoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { v, h2, h3, body, small, pad, label } = useAd();

  const headFade = fi(frame, 0, 16, 0, 1);

  const personas = [
    { role: "Med Spa Owner",        detail: "SOPs, consent forms, hiring scripts", color: PINK,   icon: "🏥" },
    { role: "Nurse Injector / PA",  detail: "Clinical protocols, anatomy refs, patient docs", color: TEAL, icon: "💉" },
    { role: "RN / Nursing Student", detail: "Micro 270 bank, AI cram tool, study guides", color: BLUE, icon: "🔬" },
    { role: "Aesthetic Entrepreneur", detail: "Launch playbooks, marketing packs, ebooks", color: GOLD, icon: "🚀" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 20%, rgba(212,83,126,0.10) 0%, ${BG} 65%)`,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: pad,
        gap: v ? 24 : 20,
        overflow: "hidden",
      }}
    >
      <Particles color={TEAL} count={12} />

      <div style={{ opacity: headFade, textAlign: "center", zIndex: 1 }}>
        <p style={{ color: PINK, fontSize: label + 2, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 8px 0" }}>
          Built for
        </p>
        <h2 style={{ color: "#fff", fontSize: h2, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
          The people doing the real work.
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: v ? "1fr" : "1fr 1fr",
          gap: v ? 12 : 14,
          width: "100%",
          maxWidth: 860,
          zIndex: 1,
        }}
      >
        {personas.map((p, i) => {
          const cardFade = fi(frame, 16 + i * 8, 28 + i * 8, 0, 1);
          const cardX    = fi(frame, 16 + i * 8, 28 + i * 8, i % 2 === 0 ? -24 : 24, 0);
          return (
            <div
              key={p.role}
              style={{
                opacity: cardFade,
                transform: `translateX(${cardX}px)`,
                background: `linear-gradient(135deg, ${p.color}12, rgba(255,255,255,0.02))`,
                border: `1.5px solid ${p.color}40`,
                borderRadius: 16,
                padding: v ? "18px 20px" : "16px 20px",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                boxShadow: `0 8px 30px ${p.color}18`,
              }}
            >
              <span style={{ fontSize: v ? 32 : 28, flexShrink: 0 }}>{p.icon}</span>
              <div>
                <p style={{ color: p.color, fontWeight: 800, fontSize: v ? small + 2 : small + 1, margin: "0 0 4px 0" }}>
                  {p.role}
                </p>
                <p style={{ color: MUTED, fontSize: v ? small : small - 1, margin: 0, lineHeight: 1.45 }}>
                  {p.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Pro Membership (30–37s) ─────────────────────────────────────────
const MembershipScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { v, h2, h3, body, small, pad, label } = useAd();

  const shine = fi(frame, 0, fps * 6, -100, 200);
  const op    = fi(frame, 0, 18, 0, 1);

  const perks = [
    "Full template & playbook library",
    "New drops every month",
    "Clinical + business + marketing",
    "Built from a real med spa",
    "Cancel anytime",
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(145deg, #140820 0%, #0a0512 50%, #07050f 100%)`,
        fontFamily,
        justifyContent: "center",
        alignItems: "center",
        padding: pad,
        flexDirection: "column",
        gap: v ? 24 : 20,
        overflow: "hidden",
      }}
    >
      <Particles color={GOLD} count={16} />

      {/* Gold shimmer overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(105deg, transparent ${shine - 20}%, rgba(245,158,11,0.07) ${shine}%, transparent ${shine + 20}%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ opacity: op, textAlign: "center", zIndex: 1 }}>
        <p
          style={{
            color: GOLD,
            fontSize: label + 2,
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            margin: "0 0 10px 0",
          }}
        >
          ⭐ Pro Membership
        </p>
        <h2
          style={{
            fontSize: h2,
            fontWeight: 900,
            lineHeight: 1.08,
            margin: "0 0 6px 0",
          }}
        >
          <GlowText color={GOLD}>The full library.</GlowText>
          <br />
          <span style={{ color: "#fff" }}>One membership.</span>
        </h2>
        <p style={{ color: MUTED, fontSize: v ? body - 2 : body - 4, margin: "10px 0 0 0" }}>
          Every template, playbook, cheat sheet, and guide — plus new drops monthly.
        </p>
      </div>

      <div
        style={{
          opacity: op,
          background: `linear-gradient(145deg, rgba(245,158,11,0.12), rgba(255,255,255,0.03))`,
          border: `2px solid rgba(245,158,11,0.45)`,
          borderRadius: 20,
          padding: v ? "24px 28px" : "22px 28px",
          maxWidth: 600,
          width: "100%",
          zIndex: 1,
          boxShadow: `0 16px 60px rgba(245,158,11,0.18)`,
        }}
      >
        {perks.map((perk, i) => {
          const pFade = fi(frame, 18 + i * 6, 30 + i * 6, 0, 1);
          return (
            <p
              key={perk}
              style={{
                opacity: pFade,
                color: "#e2e8f0",
                fontSize: v ? small + 2 : small + 1,
                fontWeight: 600,
                margin: i === 0 ? 0 : "10px 0 0 0",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: GOLD, fontWeight: 900, fontSize: v ? small + 4 : small + 2 }}>✓</span>
              {perk}
            </p>
          );
        })}

        <div
          style={{
            marginTop: v ? 20 : 16,
            paddingTop: v ? 16 : 14,
            borderTop: "1px solid rgba(245,158,11,0.2)",
            display: "flex",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          <p style={{ color: "#fff", fontSize: v ? h3 + 4 : h3, fontWeight: 900, margin: 0 }}>From $29/mo</p>
          <p style={{ color: MUTED, fontSize: v ? small : small - 1, margin: 0 }}>· or save with annual</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Founder Credibility (37–43s) ─────────────────────────────────────
const FounderScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { v, h2, h3, body, small, pad, label } = useAd();

  const op = fi(frame, 0, 18, 0, 1);

  const creds = [
    { label: "Hello Gorgeous Med Spa",      detail: "#1 Med Spa in Oswego, IL · 4.9★ Google",    color: PINK   },
    { label: "10 years in aesthetics",       detail: "Owner, licensed esthetician & phlebotomist", color: PURPLE },
    { label: "CMAA · CNA · RN student",     detail: "Built these tools while taking Micro 270",    color: TEAL   },
    { label: "Built by a real practitioner", detail: "Every template comes from a working practice",color: GOLD  },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 70% 55% at 30% 50%, rgba(212,83,126,0.10) 0%, ${BG} 60%)`,
        fontFamily,
        display: "flex",
        flexDirection: v ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        padding: pad,
        gap: v ? 24 : 40,
        overflow: "hidden",
      }}
    >
      <Particles color={PINK} count={10} />

      {/* Left: headline */}
      <div style={{ opacity: op, flex: 1, zIndex: 1 }}>
        <p style={{ color: PINK, fontSize: label + 2, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px 0" }}>
          Who built this
        </p>
        <h2
          style={{
            fontFamily: fontSerif,
            fontSize: v ? h2 - 4 : h2,
            fontWeight: 700,
            lineHeight: 1.12,
            color: "#fff",
            margin: "0 0 12px 0",
          }}
        >
          Made while studying
          <br />
          the same material.
        </h2>
        <p style={{ color: MUTED, fontSize: v ? small + 1 : small, lineHeight: 1.55, margin: 0 }}>
          Danielle Alcala-Glazier — founder of Hello Gorgeous Med Spa,
          licensed clinician, and current RN student. Not a template agency.
          A practitioner who needed these tools and built them herself.
        </p>
      </div>

      {/* Right: cred cards */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: v ? 10 : 12, zIndex: 1 }}>
        {creds.map((c, i) => {
          const cFade = fi(frame, 14 + i * 7, 26 + i * 7, 0, 1);
          const cX    = fi(frame, 14 + i * 7, 26 + i * 7, 24, 0);
          return (
            <div
              key={c.label}
              style={{
                opacity: cFade,
                transform: `translateX(${cX}px)`,
                background: `${c.color}0f`,
                border: `1px solid ${c.color}38`,
                borderRadius: 12,
                padding: v ? "12px 16px" : "11px 16px",
              }}
            >
              <p style={{ color: c.color, fontWeight: 700, fontSize: v ? small + 1 : small, margin: "0 0 3px 0" }}>
                {c.label}
              </p>
              <p style={{ color: MUTED, fontSize: v ? small - 1 : small - 2, margin: 0 }}>
                {c.detail}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: CTA (43–48s) ─────────────────────────────────────────────────────
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { v, h1, h2, h3, body, small, pad, label } = useAd();

  const op    = fi(frame, 0, 18, 0, 1);
  const pulse = interpolate(
    frame,
    [0, fps * 1.2, fps * 2.4],
    [1, 1.04, 1],
    { extrapolateRight: "clamp" }
  );
  const bgGlow = fi(frame, 0, fps * 4, 0, 1);

  const badges = [
    { t: "Templates",  c: PINK   },
    { t: "Playbooks",  c: PURPLE },
    { t: "Cheat Sheets", c: TEAL },
    { t: "Study Tools", c: BLUE  },
    { t: "Ebooks",     c: GOLD   },
    { t: "From $47",   c: GREEN  },
  ];

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: v ? 24 : 20,
        padding: pad,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 75% 60% at 50% 50%, rgba(212,83,126,${bgGlow * 0.18}) 0%, transparent 70%)`,
        }}
      />
      <Particles color={PINK} count={24} />

      <div style={{ opacity: op, textAlign: "center", zIndex: 1, maxWidth: 880 }}>
        <p
          style={{
            color: PINK,
            fontSize: label + 2,
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            margin: "0 0 14px 0",
          }}
        >
          No Prior Authorization
        </p>

        <h1
          style={{
            fontFamily: fontSerif,
            fontSize: v ? h1 - 4 : h1,
            fontWeight: 700,
            lineHeight: 1.08,
            margin: "0 0 12px 0",
          }}
        >
          <span style={{ color: "#fff" }}>The operating system</span>
          <br />
          <GlowText color={PINK}>for your practice.</GlowText>
        </h1>

        <p style={{ color: MUTED, fontSize: v ? body - 2 : body - 4, margin: "0 0 22px 0" }}>
          Templates · Playbooks · Study Tools · Pro Membership
        </p>

        {/* Badge strip */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: v ? 10 : 8, marginBottom: v ? 28 : 22 }}>
          {badges.map((b, i) => {
            const bFade = fi(frame, i * 4, i * 4 + 12, 0, 1);
            return (
              <span
                key={b.t}
                style={{
                  opacity: bFade,
                  background: `${b.c}18`,
                  border: `1px solid ${b.c}50`,
                  color: b.c,
                  fontWeight: 700,
                  fontSize: v ? small + 1 : small,
                  padding: v ? "7px 16px" : "5px 14px",
                  borderRadius: 50,
                  whiteSpace: "nowrap",
                }}
              >
                {b.t}
              </span>
            );
          })}
        </div>

        {/* CTA button */}
        <div
          style={{
            display: "inline-block",
            transform: `scale(${pulse})`,
            background: `linear-gradient(135deg, ${PINK} 0%, ${PINK2} 100%)`,
            color: "#fff",
            fontWeight: 900,
            fontSize: v ? body + 2 : body,
            padding: v ? "20px 44px" : "18px 40px",
            borderRadius: 60,
            boxShadow: `0 0 40px ${PINK}55, 0 16px 50px rgba(212,83,126,0.35)`,
            letterSpacing: "0.01em",
          }}
        >
          nopriorauthorization.com
        </div>

        <p style={{ color: "#4b5563", fontSize: v ? small - 1 : small - 2, marginTop: 14 }}>
          Start with 10 free templates · no credit card required
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ── Root ───────────────────────────────────────────────────────────────────────

/** NPA brand hero video — 48s · 9:16 or 16:9 or 1:1 */
export const NpaHeroVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  const s1 = Math.round(5  * fps);  // 0–5s:   brand reveal
  const s2 = Math.round(7  * fps);  // 5–12s:  problem
  const s3 = Math.round(12 * fps);  // 12–24s: products
  const s4 = Math.round(9  * fps);  // 24–33s: who it's for
  const s5 = Math.round(8  * fps);  // 33–41s: membership
  const s6 = Math.round(7  * fps);  // 41–48s: founder
  const s7 = Math.round(7  * fps);  // 48–55s: CTA

  let f = 0;
  const f1 = f; f += s1;
  const f2 = f; f += s2;
  const f3 = f; f += s3;
  const f4 = f; f += s4;
  const f5 = f; f += s5;
  const f6 = f; f += s6;
  const f7 = f;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily }}>
      <Sequence from={f1} durationInFrames={s1}><BrandReveal /></Sequence>
      <Sequence from={f2} durationInFrames={s2}><ProblemScene /></Sequence>
      <Sequence from={f3} durationInFrames={s3}><ProductScene /></Sequence>
      <Sequence from={f4} durationInFrames={s4}><WhoScene /></Sequence>
      <Sequence from={f5} durationInFrames={s5}><MembershipScene /></Sequence>
      <Sequence from={f6} durationInFrames={s6}><FounderScene /></Sequence>
      <Sequence from={f7} durationInFrames={s7}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
