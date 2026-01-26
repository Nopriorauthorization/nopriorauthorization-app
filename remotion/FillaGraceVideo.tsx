import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const FillaGraceVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene transitions
  const scene1End = 3 * fps; // 3 seconds
  const scene2End = 6 * fps; // 6 seconds
  const scene3End = 9 * fps; // 9 seconds
  const scene4End = 12 * fps; // 12 seconds
  const scene5End = 15 * fps; // 15 seconds
  const scene6End = 18 * fps; // 18 seconds

  // Current scene based on frame
  const getCurrentScene = () => {
    if (frame < scene1End) return 1;
    if (frame < scene2End) return 2;
    if (frame < scene3End) return 3;
    if (frame < scene4End) return 4;
    if (frame < scene5End) return 5;
    if (frame < scene6End) return 6;
    return 7;
  };

  const currentScene = getCurrentScene();

  // Animation helpers
  const fadeIn = (startFrame: number, duration: number = fps) => {
    return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const slideUp = (startFrame: number, duration: number = fps) => {
    return interpolate(frame, [startFrame, startFrame + duration], [50, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const scaleIn = (startFrame: number, duration: number = fps * 0.5) => {
    return interpolate(frame, [startFrame, startFrame + duration], [0.8, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* Scene 1: Opening */}
      {currentScene === 1 && (
        <AbsoluteFill>
          <div
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
            }}
          >
            <div
              style={{
                opacity: fadeIn(0),
                transform: `translateY(${slideUp(0, fps * 0.8)}px) scale(${scaleIn(0)})`,
              }}
            >
              <h1
                style={{
                  fontSize: 72,
                  fontWeight: "bold",
                  color: "#f8fafc",
                  textAlign: "center",
                  marginBottom: 20,
                  fontFamily,
                }}
              >
                Dermal Fillers
              </h1>
              <p
                style={{
                  fontSize: 28,
                  color: "#cbd5e1",
                  textAlign: "center",
                  maxWidth: "800px",
                  lineHeight: "1.4",
                  fontFamily,
                }}
              >
                Restore volume, enhance contours, and rejuvenate your natural beauty
              </p>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 2: What are Fillers */}
      {currentScene === 2 && (
        <AbsoluteFill>
          <div
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
            }}
          >
            <div
              style={{
                opacity: fadeIn(scene1End),
                transform: `translateY(${slideUp(scene1End, fps * 0.8)}px) scale(${scaleIn(scene1End)})`,
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 30 }}>
                <span style={{ fontSize: 60, marginBottom: 20, display: "block" }}>💋</span>
                <h2
                  style={{
                    fontSize: 48,
                    fontWeight: "bold",
                    color: "#f8fafc",
                    marginBottom: 20,
                    fontFamily,
                  }}
                >
                  What are Dermal Fillers?
                </h2>
              </div>
              <p
                style={{
                  fontSize: 24,
                  color: "#cbd5e1",
                  textAlign: "center",
                  maxWidth: "700px",
                  lineHeight: "1.5",
                  fontFamily,
                }}
              >
                Hyaluronic acid-based gels that restore lost volume, smooth wrinkles,
                and enhance facial contours for a naturally youthful appearance.
              </p>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: Benefits */}
      {currentScene === 3 && (
        <AbsoluteFill>
          <div
            style={{
              background: "linear-gradient(135deg, #334155 0%, #475569 50%, #1e293b 100%)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
            }}
          >
            <div
              style={{
                opacity: fadeIn(scene2End),
                transform: `translateY(${slideUp(scene2End, fps * 0.8)}px) scale(${scaleIn(scene2End)})`,
              }}
            >
              <h2
                style={{
                  fontSize: 48,
                  fontWeight: "bold",
                  color: "#f8fafc",
                  textAlign: "center",
                  marginBottom: 40,
                  fontFamily,
                }}
              >
                Why Choose Fillers?
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", maxWidth: "800px" }}>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: 40, marginBottom: 15, display: "block" }}>✨</span>
                  <h3 style={{ fontSize: 24, fontWeight: "bold", color: "#f8fafc", marginBottom: 10, fontFamily }}>
                    Instant Results
                  </h3>
                  <p style={{ fontSize: 18, color: "#cbd5e1", lineHeight: "1.4", fontFamily }}>
                    See improvements immediately after treatment
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: 40, marginBottom: 15, display: "block" }}>🌊</span>
                  <h3 style={{ fontSize: 24, fontWeight: "bold", color: "#f8fafc", marginBottom: 10, fontFamily }}>
                    Natural Hydration
                  </h3>
                  <p style={{ fontSize: 18, color: "#cbd5e1", lineHeight: "1.4", fontFamily }}>
                    Attracts and retains moisture for plump, hydrated skin
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: 40, marginBottom: 15, display: "block" }}>🎯</span>
                  <h3 style={{ fontSize: 24, fontWeight: "bold", color: "#f8fafc", marginBottom: 10, fontFamily }}>
                    Precise Enhancement
                  </h3>
                  <p style={{ fontSize: 18, color: "#cbd5e1", lineHeight: "1.4", fontFamily }}>
                    Targeted treatment for specific areas and concerns
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: 40, marginBottom: 15, display: "block" }}>🔄</span>
                  <h3 style={{ fontSize: 24, fontWeight: "bold", color: "#f8fafc", marginBottom: 10, fontFamily }}>
                    Reversible Results
                  </h3>
                  <p style={{ fontSize: 18, color: "#cbd5e1", lineHeight: "1.4", fontFamily }}>
                    Most fillers can be dissolved if needed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: Treatment Areas */}
      {currentScene === 4 && (
        <AbsoluteFill>
          <div
            style={{
              background: "linear-gradient(135deg, #475569 0%, #64748b 50%, #334155 100%)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
            }}
          >
            <div
              style={{
                opacity: fadeIn(scene3End),
                transform: `translateY(${slideUp(scene3End, fps * 0.8)}px) scale(${scaleIn(scene3End)})`,
              }}
            >
              <h2
                style={{
                  fontSize: 48,
                  fontWeight: "bold",
                  color: "#f8fafc",
                  textAlign: "center",
                  marginBottom: 40,
                  fontFamily,
                }}
              >
                Popular Treatment Areas
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "25px", maxWidth: "900px" }}>
                <div style={{ textAlign: "center", backgroundColor: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px" }}>
                  <span style={{ fontSize: 35, marginBottom: 10, display: "block" }}>😘</span>
                  <h3 style={{ fontSize: 20, fontWeight: "bold", color: "#f8fafc", marginBottom: 8, fontFamily }}>
                    Lips
                  </h3>
                  <p style={{ fontSize: 16, color: "#cbd5e1", lineHeight: "1.4", fontFamily }}>
                    Natural volume and definition
                  </p>
                </div>

                <div style={{ textAlign: "center", backgroundColor: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px" }}>
                  <span style={{ fontSize: 35, marginBottom: 10, display: "block" }}>👃</span>
                  <h3 style={{ fontSize: 20, fontWeight: "bold", color: "#f8fafc", marginBottom: 8, fontFamily }}>
                    Cheeks
                  </h3>
                  <p style={{ fontSize: 16, color: "#cbd5e1", lineHeight: "1.4", fontFamily }}>
                    Restore mid-face volume
                  </p>
                </div>

                <div style={{ textAlign: "center", backgroundColor: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px" }}>
                  <span style={{ fontSize: 35, marginBottom: 10, display: "block" }}>🙃</span>
                  <h3 style={{ fontSize: 20, fontWeight: "bold", color: "#f8fafc", marginBottom: 8, fontFamily }}>
                    Nasolabial Folds
                  </h3>
                  <p style={{ fontSize: 16, color: "#cbd5e1", lineHeight: "1.4", fontFamily }}>
                    Smooth smile lines
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: The Process */}
      {currentScene === 5 && (
        <AbsoluteFill>
          <div
            style={{
              background: "linear-gradient(135deg, #64748b 0%, #94a3b8 50%, #475569 100%)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
            }}
          >
            <div
              style={{
                opacity: fadeIn(scene4End),
                transform: `translateY(${slideUp(scene4End, fps * 0.8)}px) scale(${scaleIn(scene4End)})`,
              }}
            >
              <h2
                style={{
                  fontSize: 48,
                  fontWeight: "bold",
                  color: "#f8fafc",
                  textAlign: "center",
                  marginBottom: 40,
                  fontFamily,
                }}
              >
                Your Treatment Journey
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "700px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ width: "40px", height: "40px", backgroundColor: "#ec4899", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold", color: "white", fontFamily }}>
                    1
                  </div>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: "bold", color: "#f8fafc", marginBottom: 5, fontFamily }}>
                      Consultation
                    </h3>
                    <p style={{ fontSize: 18, color: "#cbd5e1", fontFamily }}>
                      Discuss your goals and create a personalized treatment plan
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ width: "40px", height: "40px", backgroundColor: "#ec4899", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold", color: "white", fontFamily }}>
                    2
                  </div>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: "bold", color: "#f8fafc", marginBottom: 5, fontFamily }}>
                      Treatment
                    </h3>
                    <p style={{ fontSize: 18, color: "#cbd5e1", fontFamily }}>
                      Precise injections with minimal discomfort
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ width: "40px", height: "40px", backgroundColor: "#ec4899", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold", color: "white", fontFamily }}>
                    3
                  </div>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: "bold", color: "#f8fafc", marginBottom: 5, fontFamily }}>
                      Results
                    </h3>
                    <p style={{ fontSize: 18, color: "#cbd5e1", fontFamily }}>
                      Enjoy your enhanced, natural-looking results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 6: Filla-Grace Introduction */}
      {currentScene === 6 && (
        <AbsoluteFill>
          <div
            style={{
              background: "linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #64748b 100%)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
            }}
          >
            <div
              style={{
                opacity: fadeIn(scene5End),
                transform: `translateY(${slideUp(scene5End, fps * 0.8)}px) scale(${scaleIn(scene5End)})`,
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 30 }}>
                <span style={{ fontSize: 60, marginBottom: 20, display: "block" }}>💅</span>
                <h2
                  style={{
                    fontSize: 48,
                    fontWeight: "bold",
                    color: "#0f172a",
                    marginBottom: 20,
                    fontFamily,
                  }}
                >
                  Meet Filla-Grace
                </h2>
              </div>
              <p
                style={{
                  fontSize: 24,
                  color: "#334155",
                  textAlign: "center",
                  maxWidth: "700px",
                  lineHeight: "1.5",
                  fontFamily,
                }}
              >
                Your dermal filler specialist who combines artistic vision with anatomical precision.
                Filla-Grace believes that true beauty comes from enhancing what makes you uniquely you.
              </p>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 7: Call to Action */}
      {currentScene >= 7 && (
        <AbsoluteFill>
          <div
            style={{
              background: "linear-gradient(135deg, #cbd5e1 0%, #f1f5f9 50%, #94a3b8 100%)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
            }}
          >
            <div
              style={{
                opacity: fadeIn(scene6End),
                transform: `translateY(${slideUp(scene6End, fps * 0.8)}px) scale(${scaleIn(scene6End)})`,
              }}
            >
              <h2
                style={{
                  fontSize: 52,
                  fontWeight: "bold",
                  color: "#0f172a",
                  textAlign: "center",
                  marginBottom: 30,
                  fontFamily,
                }}
              >
                Enhance Your Natural Beauty
              </h2>

              <p
                style={{
                  fontSize: 24,
                  color: "#475569",
                  textAlign: "center",
                  maxWidth: "600px",
                  lineHeight: "1.5",
                  marginBottom: 40,
                  fontFamily,
                }}
              >
                Discover how dermal fillers can restore volume and enhance your features naturally.
              </p>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    color: "#ec4899",
                    marginBottom: 10,
                    fontFamily,
                  }}
                >
                  Ask Filla-Grace Today
                </div>
                <p style={{ fontSize: 18, color: "#64748b", fontFamily }}>
                  Get expert guidance on dermal filler treatments
                </p>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default FillaGraceVideo;