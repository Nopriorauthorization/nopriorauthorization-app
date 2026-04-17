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

const BG     = "#0a0f1a";
const CARD   = "#111827";
const CARD2  = "#161f2e";
const BLUE   = "#3b82f6";
const CYAN   = "#06b6d4";
const GREEN  = "#10b981";
const MUTED  = "#94a3b8";
const BORDER = "rgba(255,255,255,0.08)";
const TRAP   = "#f59e0b";
const PURPLE = "#8b5cf6";

const CHAPTERS = [
  "Ch 1 — Intro to Micro",
  "Ch 2 — Cell Structure",
  "Ch 3 — Microbial Growth",
  "Ch 4 — Microbial Genetics",
  "Ch 5 — Viruses",
  "Ch 6 — Fungi",
  "Ch 7 — Parasites",
  "Ch 8 — Immune System",
  "Ch 9 — Innate Immunity",
  "Ch 10 — Adaptive Immunity",
  "Ch 11 — Vaccines",
  "Ch 12 — Epidemiology",
  "Ch 13 — Antimicrobial Drugs",
  "Ch 14 — Resistance",
  "Ch 15 — Skin Infections",
  "Ch 16 — Resp. Infections",
  "Ch 17 — GI Infections",
  "Ch 18 — Bloodstream",
  "Ch 19 — Nervous System",
  "Ch 20 — Sexually Transmitted",
];

const TRAP_QUESTION = {
  number: 312,
  text: "A patient on broad-spectrum antibiotics develops watery diarrhea and abdominal cramping 10 days post-discharge. Which organism is the MOST likely cause?",
  trap: "EXAM TRAP",
  trapNote: "Students pick E. coli — wrong. Key clue: antibiotics + post-discharge timing.",
  answer: "C. difficile (Clostridioides difficile)",
  explanation:
    "C. difficile thrives after antibiotic-related disruption of normal gut flora. The 10-day post-discharge window and prior broad-spectrum antibiotic use are classic hallmarks. E. coli causes acute traveler's diarrhea, not antibiotic-associated pseudomembranous colitis.",
};

const CRAM_LINES = [
  "Q: What mechanism does penicillin use to inhibit bacteria?",
  "A: Inhibits transpeptidase (PBP) → prevents peptidoglycan cross-linking → cell wall lysis.",
  "",
  "Q: Why are gram-negative bacteria often resistant to penicillin?",
  "A: Outer membrane limits drug entry; many produce beta-lactamases that hydrolyze the beta-lactam ring.",
  "",
  "Q: EXAM TRAP — A patient allergic to penicillin needs a cell-wall agent. What do you give?",
  "A: Vancomycin (glycopeptide — different mechanism, no cross-reactivity with beta-lactams).",
];

function useAdaptive() {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  return {
    isVertical,
    pad:   isVertical ? 48 : 36,
    h1:    isVertical ? 64 : 50,
    h2:    isVertical ? 42 : 32,
    h3:    isVertical ? 30 : 24,
    body:  isVertical ? 24 : 18,
    small: isVertical ? 17 : 13,
    label: isVertical ? 12 : 10,
  };
}

// ─── Shared: fade-in wrapper ──────────────────────────────────────────────────

function FadeIn({
  children,
  start = 0,
  duration = 14,
  slideY = 16,
  style = {},
}: {
  children: React.ReactNode;
  start?: number;
  duration?: number;
  slideY?: number;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [start, start + duration], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [start, start + duration], [slideY, 0], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>
      {children}
    </div>
  );
}

// ─── Scene 1: Hook line 1 (0–3s) ─────────────────────────────────────────────

const HookScene1: React.FC = () => {
  const { h1, pad } = useAdaptive();
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", padding: pad, fontFamily }}>
      <FadeIn>
        <p style={{ color: "#e2e8f0", fontSize: h1, fontWeight: 800, lineHeight: 1.15, textAlign: "center", maxWidth: 900, margin: 0 }}>
          I couldn't find a good micro study tool...
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Hook line 2 (3–8s) ─────────────────────────────────────────────

const HookScene2: React.FC = () => {
  const { h1, pad } = useAdaptive();
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", padding: pad, fontFamily }}>
      <FadeIn>
        <p style={{ color: BLUE, fontSize: h1, fontWeight: 800, lineHeight: 1.15, textAlign: "center", maxWidth: 900, margin: 0 }}>
          ...so I built one
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Stats (8–14s) ───────────────────────────────────────────────────

function useCount(target: number, startFrame: number, durationFrames: number) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], { extrapolateRight: "clamp" });
  return Math.round(t * target);
}

const StatsScene: React.FC = () => {
  const { fps } = useVideoConfig();
  const { isVertical, pad, h2, h3, body, small, label } = useAdaptive();

  const stats = [
    { value: 1000, suffix: "", label: "questions", color: BLUE,   start: 0 },
    { value: 20,   suffix: "", label: "chapters",  color: CYAN,   start: 10 },
    { value: 50,   suffix: "", label: "Q per chapter", color: GREEN, start: 20 },
    { value: 100,  suffix: "%", label: "explained", color: PURPLE, start: 30 },
  ];

  const q   = useCount(1000, 0,  Math.round(1.2 * fps));
  const ch  = useCount(20,   10, Math.round(0.8 * fps));
  const qpc = useCount(50,   20, Math.round(0.8 * fps));
  const pct = useCount(100,  30, Math.round(0.8 * fps));
  const counts = [q, ch, qpc, pct];

  const headFade = interpolate(useCurrentFrame(), [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.08) 0%, ${BG} 65%)`,
        fontFamily,
        justifyContent: "center",
        alignItems: "center",
        padding: pad,
        flexDirection: "column",
        gap: isVertical ? 32 : 24,
      }}
    >
      <div style={{ opacity: headFade, textAlign: "center" }}>
        <p style={{ color: BLUE, fontSize: isVertical ? label + 2 : label, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 8px 0" }}>
          What's inside
        </p>
        <h2 style={{ color: "#fff", fontSize: h2, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
          Built for Micro 270
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isVertical ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: isVertical ? 16 : 14,
          width: "100%",
          maxWidth: 860,
        }}
      >
        {stats.map((s, i) => {
          const cardFade = interpolate(useCurrentFrame(), [s.start, s.start + 14], [0, 1], { extrapolateRight: "clamp" });
          const cardY    = interpolate(useCurrentFrame(), [s.start, s.start + 14], [20, 0], { extrapolateRight: "clamp" });
          return (
            <div
              key={s.label}
              style={{
                opacity: cardFade,
                transform: `translateY(${cardY}px)`,
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: isVertical ? "22px 18px" : "18px 16px",
                textAlign: "center",
                boxShadow: `0 0 24px ${s.color}22`,
              }}
            >
              <p style={{ color: s.color, fontSize: isVertical ? h2 + 8 : h2 + 4, fontWeight: 900, margin: "0 0 4px 0", lineHeight: 1 }}>
                {counts[i]}{s.suffix}
              </p>
              <p style={{ color: MUTED, fontSize: isVertical ? small + 1 : small, margin: 0, fontWeight: 600 }}>
                {s.label}
              </p>
            </div>
          );
        })}
      </div>

      <FadeIn start={35} style={{ textAlign: "center" }}>
        <p style={{ color: MUTED, fontSize: isVertical ? body - 2 : body - 4, margin: 0 }}>
          Exam traps flagged · professor-style explanations · interactive HTML
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Hub + question demo (14–28s) ────────────────────────────────────

const HubScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isVertical, small, body } = useAdaptive();

  const gridFade   = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const ch13Glow   = interpolate(frame, [Math.round(1.5*fps), Math.round(3*fps)], [0, 1], { extrapolateRight: "clamp" });
  const panelY     = interpolate(frame, [Math.round(3*fps), Math.round(4.5*fps)], [120, 0], { extrapolateRight: "clamp" });
  const panelOp    = interpolate(frame, [Math.round(3*fps), Math.round(4.5*fps)], [0, 1],   { extrapolateRight: "clamp" });
  const answerFade = interpolate(frame, [Math.round(6*fps), Math.round(7*fps)], [0, 1], { extrapolateRight: "clamp" });
  const explainFade= interpolate(frame, [Math.round(7*fps), Math.round(8.5*fps)], [0, 1], { extrapolateRight: "clamp" });

  const cols = isVertical ? 2 : 4;
  const chSz = isVertical ? 13 : 11;

  return (
    <AbsoluteFill style={{ background: BG, fontFamily, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Nav bar */}
      <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, padding: isVertical ? "14px 28px" : "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: isVertical ? 18 : 15 }}>Micro 270 — Study Hub</span>
        <span style={{ background: BLUE, color: "#fff", fontWeight: 700, fontSize: isVertical ? 12 : 10, padding: isVertical ? "4px 10px" : "3px 8px", borderRadius: 6, letterSpacing: "0.05em" }}>
          20 CHAPTERS · 1,000 Q
        </span>
      </div>

      {/* Chapter grid */}
      <div style={{ opacity: gridFade, padding: isVertical ? "16px 20px 10px" : "12px 20px 8px", display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isVertical ? 7 : 6, flexShrink: 0 }}>
        {CHAPTERS.map((ch, i) => {
          const isActive = i === 12;
          return (
            <div
              key={ch}
              style={{
                background: isActive ? `rgba(59,130,246,${ch13Glow * 0.18})` : "rgba(255,255,255,0.03)",
                border: isActive ? `1.5px solid rgba(59,130,246,${0.4 + ch13Glow * 0.6})` : `1px solid ${BORDER}`,
                borderRadius: 7,
                padding: isVertical ? "7px 9px" : "5px 7px",
                color: isActive ? "#fff" : MUTED,
                fontSize: chSz,
                fontWeight: isActive ? 700 : 500,
                lineHeight: 1.3,
                boxShadow: isActive ? `0 0 ${10 * ch13Glow}px rgba(59,130,246,${0.28 * ch13Glow})` : "none",
              }}
            >
              {ch}
              {isActive && (
                <div style={{ marginTop: 3, opacity: ch13Glow }}>
                  <span style={{ background: BLUE, color: "#fff", fontSize: isVertical ? 9 : 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4 }}>
                    LAUNCH →
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Question panel */}
      <div
        style={{
          opacity: panelOp,
          transform: `translateY(${panelY}px)`,
          flex: 1,
          margin: isVertical ? "0 20px 20px" : "0 20px 16px",
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 14,
          padding: isVertical ? "18px 22px" : "14px 18px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: isVertical ? 12 : 9,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: TRAP, fontSize: isVertical ? 11 : 9, fontWeight: 800, padding: "3px 8px", borderRadius: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {TRAP_QUESTION.trap}
          </span>
          <span style={{ color: MUTED, fontSize: small }}>Question #{TRAP_QUESTION.number}</span>
        </div>

        <p style={{ color: "#e2e8f0", fontSize: isVertical ? body : body - 2, lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
          {TRAP_QUESTION.text}
        </p>

        <p style={{ color: TRAP, fontSize: isVertical ? small : small - 1, fontStyle: "italic", margin: 0, lineHeight: 1.4 }}>
          ⚠ {TRAP_QUESTION.trapNote}
        </p>

        <div style={{ opacity: answerFade, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.35)", borderRadius: 10, padding: isVertical ? "11px 15px" : "8px 11px" }}>
          <p style={{ color: CYAN, fontSize: isVertical ? small : small - 1, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>Answer</p>
          <p style={{ color: "#fff", fontSize: isVertical ? body : body - 2, fontWeight: 700, margin: 0 }}>{TRAP_QUESTION.answer}</p>
        </div>

        <div style={{ opacity: explainFade, background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: 10, padding: isVertical ? "11px 15px" : "8px 11px" }}>
          <p style={{ color: MUTED, fontSize: isVertical ? small : small - 1, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>Explanation</p>
          <p style={{ color: "#cbd5e1", fontSize: isVertical ? small + 2 : small, lineHeight: 1.55, margin: 0 }}>{TRAP_QUESTION.explanation}</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: AI Cram Tool (28–42s) ──────────────────────────────────────────

const CramScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isVertical, pad, h2, h3, body, small, label } = useAdaptive();

  // Phase 1: title + upload box (0–2s)
  const titleFade  = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });

  // Phase 2: "uploading" progress bar (2s–4s)
  const uploadPct  = interpolate(frame, [Math.round(2*fps), Math.round(4*fps)], [0, 100], { extrapolateRight: "clamp" });
  const uploadFade = interpolate(frame, [Math.round(1.5*fps), Math.round(2.5*fps)], [0, 1], { extrapolateRight: "clamp" });

  // Phase 3: "generating" spinner text (4s–6s)
  const genFade    = interpolate(frame, [Math.round(4*fps), Math.round(5*fps)], [0, 1], { extrapolateRight: "clamp" });
  const genDots    = Math.floor((frame / 8) % 4); // 0,1,2,3 → animate dots

  // Phase 4: output lines appear one by one (6s–14s)
  const outputFade = interpolate(frame, [Math.round(6*fps), Math.round(7*fps)], [0, 1], { extrapolateRight: "clamp" });
  const lineCount  = Math.max(0, Math.floor((frame - Math.round(6*fps)) / (fps * 0.9)));

  const dots = ".".repeat(genDots);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        padding: isVertical ? "0 0 24px" : "0 0 18px",
        overflow: "hidden",
      }}
    >
      {/* Header bar */}
      <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, padding: isVertical ? "14px 28px" : "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: isVertical ? 18 : 15 }}>AI Cram Tool</span>
        <span style={{ background: PURPLE, color: "#fff", fontWeight: 700, fontSize: isVertical ? 12 : 10, padding: isVertical ? "4px 10px" : "3px 8px", borderRadius: 6, letterSpacing: "0.05em" }}>
          BANK + AI BUNDLE
        </span>
      </div>

      <div style={{ flex: 1, padding: isVertical ? "20px 24px" : "16px 24px", display: "flex", flexDirection: "column", gap: isVertical ? 16 : 12, overflow: "hidden" }}>

        {/* Explainer */}
        <div style={{ opacity: titleFade }}>
          <p style={{ color: PURPLE, fontSize: isVertical ? label + 2 : label, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px 0" }}>
            Turn your notes into questions
          </p>
          <p style={{ color: "#e2e8f0", fontSize: isVertical ? h3 : h3 - 2, fontWeight: 800, margin: "0 0 4px 0" }}>
            Upload lecture slides or notes →
          </p>
          <p style={{ color: MUTED, fontSize: isVertical ? small + 1 : small, margin: 0 }}>
            AI generates professor-style Q&A and exam traps from your material.
          </p>
        </div>

        {/* Upload box */}
        <div
          style={{
            opacity: uploadFade,
            background: "rgba(139,92,246,0.07)",
            border: `2px dashed rgba(139,92,246,0.35)`,
            borderRadius: 14,
            padding: isVertical ? "18px 20px" : "14px 18px",
            flexShrink: 0,
          }}
        >
          <p style={{ color: "#cbd5e1", fontSize: isVertical ? body : body - 2, margin: "0 0 10px 0", fontWeight: 600 }}>
            📄 Chapter13_AntimicrobialDrugs_notes.pdf
          </p>
          {/* Progress bar */}
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, height: isVertical ? 7 : 5, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${Math.min(uploadPct, 100)}%`,
                background: PURPLE,
                borderRadius: 4,
                transition: "width 0.1s",
              }}
            />
          </div>
          <p style={{ color: MUTED, fontSize: isVertical ? small : small - 1, margin: "6px 0 0 0" }}>
            {uploadPct < 100 ? `Uploading... ${Math.round(uploadPct)}%` : "Upload complete ✓"}
          </p>
        </div>

        {/* Generating status */}
        {frame >= Math.round(4 * fps) && (
          <div style={{ opacity: genFade, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: isVertical ? 20 : 16, height: isVertical ? 20 : 16, border: `2px solid ${PURPLE}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <p style={{ color: PURPLE, fontSize: isVertical ? body : body - 2, fontWeight: 700, margin: 0 }}>
              {frame < Math.round(6 * fps) ? `Generating questions${dots}` : "Generated — 12 questions ✓"}
            </p>
          </div>
        )}

        {/* Output */}
        {frame >= Math.round(6 * fps) && (
          <div
            style={{
              opacity: outputFade,
              background: CARD2,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: isVertical ? "16px 18px" : "12px 16px",
              flex: 1,
              overflow: "hidden",
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            <p style={{ color: GREEN, fontSize: isVertical ? small : small - 1, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 10px 0", fontFamily }}>
              Generated Output
            </p>
            {CRAM_LINES.slice(0, Math.min(lineCount + 1, CRAM_LINES.length)).map((line, i) => {
              if (line === "") return <div key={i} style={{ height: isVertical ? 8 : 6 }} />;
              const isQ = line.startsWith("Q:");
              const isA = line.startsWith("A:");
              const isTrap = line.includes("EXAM TRAP");
              return (
                <p
                  key={i}
                  style={{
                    color: isTrap ? TRAP : isQ ? "#e2e8f0" : isA ? "#94a3b8" : "#cbd5e1",
                    fontSize: isVertical ? small + 1 : small - 1,
                    fontWeight: isQ ? 700 : 400,
                    margin: "0 0 2px 0",
                    lineHeight: 1.55,
                  }}
                >
                  {line}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: Free hub preview (42–49s) ──────────────────────────────────────

const FreeHubScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isVertical, pad, h2, h3, body, small, label } = useAdaptive();

  const headFade  = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const gridFade  = interpolate(frame, [12, 28], [0, 1], { extrapolateRight: "clamp" });
  const lockFade  = interpolate(frame, [Math.round(3*fps), Math.round(4*fps)], [0, 1], { extrapolateRight: "clamp" });
  const ctaFade   = interpolate(frame, [Math.round(4.5*fps), Math.round(5.5*fps)], [0, 1], { extrapolateRight: "clamp" });

  // first 4 chapters are free preview
  const FREE_COUNT = 4;
  const cols = isVertical ? 2 : 4;

  return (
    <AbsoluteFill style={{ background: BG, fontFamily, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, padding: isVertical ? "14px 28px" : "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: isVertical ? 18 : 15 }}>Micro 270 — Study Hub</span>
        <span style={{ background: GREEN, color: "#fff", fontWeight: 700, fontSize: isVertical ? 12 : 10, padding: isVertical ? "4px 10px" : "3px 8px", borderRadius: 6, letterSpacing: "0.05em" }}>
          FREE TO BROWSE
        </span>
      </div>

      <div style={{ flex: 1, padding: isVertical ? "18px 22px" : "14px 22px", display: "flex", flexDirection: "column", gap: isVertical ? 14 : 10, overflow: "hidden" }}>

        {/* Headline */}
        <div style={{ opacity: headFade }}>
          <p style={{ color: GREEN, fontSize: isVertical ? label + 2 : label, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 5px 0" }}>
            No account needed
          </p>
          <h2 style={{ color: "#fff", fontSize: isVertical ? h3 : h3 - 2, fontWeight: 800, margin: 0, lineHeight: 1.15 }}>
            Browse the hub free.
            <br />
            <span style={{ color: MUTED }}>Unlock the full bank when you're ready.</span>
          </h2>
        </div>

        {/* Chapter grid with free/locked states */}
        <div style={{ opacity: gridFade, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isVertical ? 8 : 7 }}>
          {CHAPTERS.map((ch, i) => {
            const isFree   = i < FREE_COUNT;
            const isLocked = !isFree;
            return (
              <div
                key={ch}
                style={{
                  background: isFree ? `rgba(16,185,129,0.07)` : "rgba(255,255,255,0.02)",
                  border: isFree ? "1.5px solid rgba(16,185,129,0.35)" : `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: isVertical ? "8px 10px" : "6px 8px",
                  color: isFree ? "#e2e8f0" : "#4b5563",
                  fontSize: isVertical ? 13 : 11,
                  fontWeight: isFree ? 700 : 400,
                  lineHeight: 1.3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 4,
                }}
              >
                <span>{ch}</span>
                {isFree && (
                  <span style={{ color: GREEN, fontSize: isVertical ? 10 : 8, fontWeight: 800, background: "rgba(16,185,129,0.12)", padding: "1px 5px", borderRadius: 4, whiteSpace: "nowrap" }}>
                    FREE
                  </span>
                )}
                {isLocked && (
                  <span style={{ opacity: lockFade, fontSize: isVertical ? 11 : 9 }}>🔒</span>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA row */}
        <div style={{ opacity: ctaFade, display: "flex", alignItems: "center", gap: isVertical ? 14 : 12, flexShrink: 0 }}>
          <div style={{ background: GREEN, color: "#fff", fontWeight: 800, fontSize: isVertical ? small + 2 : small, padding: isVertical ? "12px 22px" : "9px 18px", borderRadius: 10, whiteSpace: "nowrap" }}>
            Start free →
          </div>
          <p style={{ color: MUTED, fontSize: isVertical ? small : small - 1, margin: 0, lineHeight: 1.4 }}>
            Unlock all 20 chapters + 1,000 questions with any paid tier
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 7: Pricing (49–56s) ────────────────────────────────────────────────

const PricingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { isVertical, pad, h2, h3, body, small, label } = useAdaptive();

  const headFade = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  const tiers = [
    {
      name: "Question Bank",
      price: "$47",
      sub: "one-time",
      features: ["1,000 questions", "20 chapters · 50 Q each", "Exam traps + explanations", "Interactive HTML · instant delivery"],
      highlight: false,
      color: BLUE,
      delay: 8,
    },
    {
      name: "Bank + AI Cram",
      price: "$67",
      sub: "one-time",
      features: ["Everything in $47", "3 AI cram generations", "Upload your own notes", "Professor-style Q&A output"],
      highlight: true,
      color: PURPLE,
      delay: 18,
    },
    {
      name: "Full Access",
      price: "$97",
      sub: "one-time",
      features: ["Everything in $67", "Unlimited AI cram", "Any supported course", "Fair-use · personal license"],
      highlight: false,
      color: CYAN,
      delay: 28,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily,
        justifyContent: "center",
        alignItems: "center",
        padding: pad,
        flexDirection: "column",
        gap: isVertical ? 24 : 18,
      }}
    >
      <div style={{ opacity: headFade, textAlign: "center" }}>
        <p style={{ color: BLUE, fontSize: isVertical ? label + 2 : label, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 8 }}>
          Micro 270 · No Prior Authorization
        </p>
        <h2 style={{ color: "#fff", fontSize: h2, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
          Pick your level
        </h2>
        <p style={{ color: MUTED, fontSize: isVertical ? small + 2 : small, marginTop: 6 }}>
          One-time purchase · instant digital delivery · personal license
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          gap: isVertical ? 12 : 14,
          width: "100%",
          maxWidth: 880,
        }}
      >
        {tiers.map((tier) => {
          const cardFade = interpolate(frame, [tier.delay, tier.delay + 14], [0, 1], { extrapolateRight: "clamp" });
          const cardY    = interpolate(frame, [tier.delay, tier.delay + 14], [20, 0],  { extrapolateRight: "clamp" });

          return (
            <div
              key={tier.name}
              style={{
                opacity: cardFade,
                transform: `translateY(${cardY}px)`,
                flex: 1,
                background: tier.highlight
                  ? `linear-gradient(145deg, rgba(139,92,246,0.15), ${CARD})`
                  : CARD,
                border: tier.highlight
                  ? `2px solid ${tier.color}`
                  : `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: isVertical ? "18px 20px" : "16px 18px",
                position: "relative",
                boxShadow: tier.highlight ? `0 12px 40px ${tier.color}30` : "none",
              }}
            >
              {tier.highlight && (
                <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: tier.color, color: "#fff", fontSize: isVertical ? 11 : 9, fontWeight: 800, padding: "3px 12px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  Most Popular
                </div>
              )}
              <p style={{ color: MUTED, fontSize: isVertical ? small : small - 1, fontWeight: 600, margin: "0 0 3px 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {tier.name}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "0 0 14px 0" }}>
                <p style={{ color: "#fff", fontSize: isVertical ? h2 + 4 : h2, fontWeight: 900, margin: 0, lineHeight: 1 }}>{tier.price}</p>
                <p style={{ color: MUTED, fontSize: isVertical ? small : small - 1, margin: 0 }}>{tier.sub}</p>
              </div>
              {tier.features.map((f) => (
                <p key={f} style={{ color: "#cbd5e1", fontSize: isVertical ? small + 1 : small, margin: "0 0 6px 0", display: "flex", alignItems: "flex-start", gap: 7, lineHeight: 1.4 }}>
                  <span style={{ color: tier.color, fontWeight: 800, flexShrink: 0 }}>✓</span>
                  {f}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 8: End card (56–60s) ───────────────────────────────────────────────

const EndCardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isVertical, h1, h2, body, small, pad } = useAdaptive();

  const fade  = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const pulse = interpolate(frame, [0, 2*fps, 4*fps], [1, 1.03, 1], { extrapolateRight: "clamp" });

  const badges = [
    { label: "1,000 Q",        color: BLUE },
    { label: "20 chapters",    color: CYAN },
    { label: "Exam traps",     color: TRAP },
    { label: "AI cram tool",   color: PURPLE },
    { label: "Free hub",       color: GREEN },
    { label: "From $47",       color: BLUE },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 35%, rgba(59,130,246,0.12) 0%, ${BG} 70%)`,
        fontFamily,
        justifyContent: "center",
        alignItems: "center",
        padding: pad,
        flexDirection: "column",
        gap: isVertical ? 24 : 18,
      }}
    >
      <div style={{ opacity: fade, textAlign: "center", maxWidth: 860 }}>
        <p style={{ color: BLUE, fontSize: isVertical ? small + 2 : small, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px 0" }}>
          No Prior Authorization
        </p>
        <h1 style={{ color: "#fff", fontSize: isVertical ? h2 + 4 : h2, fontWeight: 800, lineHeight: 1.1, margin: "0 0 8px 0" }}>
          1,000 micro questions.
          <br />Every answer explained.
        </h1>
        <p style={{ color: MUTED, fontSize: isVertical ? body : body - 2, margin: "0 0 20px 0" }}>
          Exam traps flagged · AI cram tool · free hub to start
        </p>

        {/* Badge strip */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: isVertical ? 10 : 8, marginBottom: isVertical ? 24 : 18 }}>
          {badges.map((b, i) => {
            const bFade = interpolate(frame, [i * 4, i * 4 + 10], [0, 1], { extrapolateRight: "clamp" });
            return (
              <span
                key={b.label}
                style={{
                  opacity: bFade,
                  background: `${b.color}1a`,
                  border: `1px solid ${b.color}55`,
                  color: b.color,
                  fontWeight: 700,
                  fontSize: isVertical ? small + 1 : small - 1,
                  padding: isVertical ? "6px 14px" : "4px 10px",
                  borderRadius: 50,
                }}
              >
                {b.label}
              </span>
            );
          })}
        </div>

        {/* CTA */}
        <div
          style={{
            display: "inline-block",
            transform: `scale(${pulse})`,
            background: BLUE,
            color: "#fff",
            fontWeight: 800,
            fontSize: isVertical ? body : body - 2,
            padding: isVertical ? "18px 36px" : "14px 28px",
            borderRadius: 50,
            boxShadow: "0 12px 40px rgba(59,130,246,0.4)",
          }}
        >
          nopriorauthorization.com/micro270
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────

/** 60-second Micro 270 social ad — 9:16 (Reels) or 1:1 (Feed) */
export const Micro270AdVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  const s1Dur = Math.round(3  * fps);  // 0–3s:   hook line 1
  const s2Dur = Math.round(5  * fps);  // 3–8s:   hook line 2
  const s3Dur = Math.round(6  * fps);  // 8–14s:  stats
  const s4Dur = Math.round(14 * fps);  // 14–28s: hub + question demo
  const s5Dur = Math.round(14 * fps);  // 28–42s: AI cram tool
  const s6Dur = Math.round(7  * fps);  // 42–49s: free hub preview
  const s7Dur = Math.round(7  * fps);  // 49–56s: pricing
  const s8Dur = Math.round(4  * fps);  // 56–60s: end card

  let from = 0;
  const s1From = from; from += s1Dur;
  const s2From = from; from += s2Dur;
  const s3From = from; from += s3Dur;
  const s4From = from; from += s4Dur;
  const s5From = from; from += s5Dur;
  const s6From = from; from += s6Dur;
  const s7From = from; from += s7Dur;
  const s8From = from;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily }}>
      <Sequence from={s1From} durationInFrames={s1Dur}><HookScene1 /></Sequence>
      <Sequence from={s2From} durationInFrames={s2Dur}><HookScene2 /></Sequence>
      <Sequence from={s3From} durationInFrames={s3Dur}><StatsScene /></Sequence>
      <Sequence from={s4From} durationInFrames={s4Dur}><HubScene /></Sequence>
      <Sequence from={s5From} durationInFrames={s5Dur}><CramScene /></Sequence>
      <Sequence from={s6From} durationInFrames={s6Dur}><FreeHubScene /></Sequence>
      <Sequence from={s7From} durationInFrames={s7Dur}><PricingScene /></Sequence>
      <Sequence from={s8From} durationInFrames={s8Dur}><EndCardScene /></Sequence>
    </AbsoluteFill>
  );
};
