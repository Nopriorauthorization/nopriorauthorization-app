import Link from "next/link";
import {
  micro270PricingHref,
  micro270ShopCheckout,
} from "@/config/micro270-sales.config";
import "./landing.css";

export default function Micro270LandingPage() {
  return (
    <div className="micro270-land min-h-screen">
      <nav>
        <Link href="/" className="nav-logo">
          No Prior Authorization
        </Link>
        <div className="nav-links">
          <Link href="/shop">Shop</Link>
          <a href="#pricing">Pricing</a>
          <Link href={micro270PricingHref}>Buy</Link>
          <Link href="/micro270/hub" className="nav-cta">
            Start free →
          </Link>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">Microbiology 270 · Nursing</div>
          <h1>
            Complete Microbiology.
            <br />
            One checkout.
            <br />
            <em>Study smarter.</em>
          </h1>
          <p className="hero-sub">
            Start with the free hub preview, then grab the{" "}
            <strong>Complete Microbiology</strong> bundle (PDF + full bank +
            printables + unlimited AI cram) — or choose smaller tiers if you
            prefer.
          </p>
            <div className="hero-actions">
            <Link href="/micro270/hub" className="btn-primary">
              Try the free hub →
            </Link>
            <a href="#pricing" className="btn-outline">
              See pricing
            </a>
            <Link href={micro270ShopCheckout.completeMicrobiology} className="btn-outline">
              Buy complete — $79
            </Link>
          </div>
          <div className="hero-stats">
            <div className="h-stat">
              <div className="h-stat-num">
                1,000<span></span>
              </div>
              <div className="h-stat-lbl">Questions total</div>
            </div>
            <div className="h-stat">
              <div className="h-stat-num">
                20<span></span>
              </div>
              <div className="h-stat-lbl">Chapters covered</div>
            </div>
            <div className="h-stat">
              <div className="h-stat-num">
                2<span></span>
              </div>
              <div className="h-stat-lbl">Products in one launch</div>
            </div>
          </div>
        </div>
      </div>

      <div className="full-divider" />

      {/* Hero image + ad video side by side */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 0", display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          <img
            src="/images/micro270-hero.png"
            alt="Micro 270 Study Hub — 1,000 nursing microbiology questions, exam-trap flags, and AI cram tool"
            style={{ width: "100%", borderRadius: 16, display: "block" }}
          />
        </div>
        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          <video
            src="/videos/micro270/micro270-ad-square.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", borderRadius: 16, display: "block" }}
          />
        </div>
      </div>

      <div className="full-divider" />

      <div className="product-section">
        <div className="product-label">Product 1 — The Question Bank</div>
        <div className="product-grid">
          <div className="product-card">
            <span className="product-badge pb-pink">Micro 270 Complete Bank</span>
            <h3>
              1,000 Questions —
              <br />
              All 20 Chapters
            </h3>
            <p>
              Every chapter from Micro 270 (Ch. 1–20) built into one interactive
              HTML file. Professor-style questions, answers, full explanations,
              exam trap flags. Chapter navigation, score tracking, filter by
              topic. Download once, study forever offline.
            </p>
          </div>
          <div className="product-card">
            <span className="product-badge pb-teal">What students get</span>
            <h3>Exactly what they need for exams</h3>
            <div className="feature-dots">
              <div className="fdot">50 questions per chapter</div>
              <div className="fdot">Exam trap questions flagged</div>
              <div className="fdot">Full explanation per answer</div>
              <div className="fdot">Filter by topic</div>
              <div className="fdot">Score tracker</div>
              <div className="fdot">Works offline · Dark theme</div>
              <div className="fdot">No subscription · No login</div>
            </div>
          </div>
        </div>
      </div>

      <div className="full-divider" />

      <div className="product-section" style={{ paddingTop: 56 }}>
        <div className="product-label">Product 2 — The AI Cram Tool</div>
        <div className="product-grid">
          <div className="product-card">
            <span className="product-badge pb-purple">
              Upload Your Notes → Get Questions
            </span>
            <h3>Claude-Powered Study Generator</h3>
            <p>
              Student uploads their PDF, Word doc, or HTML study guide. Claude
              reads it and generates 50 professor-style Q&amp;A in the same
              beautiful format. Works for ANY science course — not just Micro
              270. Built on the Anthropic API.
            </p>
          </div>
          <div className="product-card">
            <span className="product-badge pb-gold">What makes it different</span>
            <h3>Personalized to their actual class</h3>
            <p>
              Every professor teaches differently. This tool generates questions
              from the student&apos;s EXACT notes — not generic content. The
              questions match their professor&apos;s style, their
              textbook&apos;s language, their exam&apos;s focus. No other tool
              does this.
            </p>
          </div>
        </div>
      </div>

      <div className="full-divider" />

      <div className="pricing-section" id="pricing">
        <div className="pricing-inner">
          <div className="section-label">Pricing strategy</div>
          <h2 className="section-title">Simple. One-time. No subscription.</h2>
          <div className="pricing-grid">
            <div className="price-card featured">
              <div className="price-popular">Best value · everything in one</div>
              <div className="price-tier">Complete Microbiology</div>
              <div className="price-amount">$79</div>
              <div className="price-desc">
                Study guide PDF + full 1,000-question hub + printable chapters +
                unlimited AI cram
              </div>
              <Link
                href={micro270ShopCheckout.completeMicrobiology}
                className="price-cta"
              >
                Buy now — $79
              </Link>
            </div>

            <div className="price-card">
              <div className="price-tier">Micro 270 Bank only</div>
              <div className="price-amount">$47</div>
              <div className="price-desc">
                1,000 questions · 20 chapters · hub access (no PDF bundle)
              </div>
              <Link href={micro270ShopCheckout.bankOnly} className="price-cta">
                Buy now — $47
              </Link>
            </div>

            <div className="price-card">
              <div className="price-tier">Bank + AI Cram Tool</div>
              <div className="price-amount">$67</div>
              <div className="price-desc">
                Bank + 3 custom cram generations (no bundled study PDF)
              </div>
              <Link href={micro270ShopCheckout.bankBundle} className="price-cta">
                Buy now — $67
              </Link>
            </div>

            <div className="price-card">
              <div className="price-tier">Full access (hub only)</div>
              <div className="price-amount">$97</div>
              <div className="price-desc">
                Bank + unlimited cram — same hub power as Complete, without the
                bundled PDF path
              </div>
              <Link href={micro270ShopCheckout.fullAccess} className="price-cta">
                Buy now — $97
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="full-divider" />

      <div className="chapters-section">
        <div className="ch-label">All 20 chapters in the bank</div>
        <div className="ch-grid">
          <div className="ch-tile">
            <div className="ch-num">Ch. 1–2</div>
            <div className="ch-name">Background &amp; Chemistry</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 3</div>
            <div className="ch-name">Prokaryotic Cells</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 4</div>
            <div className="ch-name">Eukaryotic Cells</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 5</div>
            <div className="ch-name">Genetics &amp; DNA</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 6</div>
            <div className="ch-name">Viruses</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 7</div>
            <div className="ch-name">Microbial Growth</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 8</div>
            <div className="ch-name">Metabolism</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 9</div>
            <div className="ch-name">Epidemiology</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 10</div>
            <div className="ch-name">Pathogenicity</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 11</div>
            <div className="ch-name">Innate Immunity</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 12</div>
            <div className="ch-name">Adaptive Immunity</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 13</div>
            <div className="ch-name">Immunology</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 14</div>
            <div className="ch-name">
              Vaccines &amp; Diagnostics <div className="ch-check">✓</div>
            </div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 15</div>
            <div className="ch-name">Antimicrobials</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 16</div>
            <div className="ch-name">Respiratory Infections</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 17</div>
            <div className="ch-name">Skin Infections</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 19</div>
            <div className="ch-name">GI Infections</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Ch. 20</div>
            <div className="ch-name">Urogenital Infections</div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Lab</div>
            <div className="ch-name">
              Unknown Lab + Flow Charts <div className="ch-check">✓</div>
            </div>
          </div>
          <div className="ch-tile">
            <div className="ch-num">Lab</div>
            <div className="ch-name">
              Respiratory Lab Exam <div className="ch-check">✓</div>
            </div>
          </div>
        </div>
      </div>

      <div className="full-divider" />

      <div className="trap-section">
        <div className="trap-inner">
          <div className="section-label">What exam traps look like</div>
          <h2 className="section-title">
            The questions professors
            <br />
            use to catch you.
          </h2>
          <p className="section-sub">
            Every chapter has 10 flagged exam traps — the exact misconceptions
            that show up on exams. Here are 6.
          </p>
          <div className="trap-grid">
            <div className="trap-card">
              <span className="trap-badge">⚠ Exam Trap · Ch. 13</span>
              <div className="trap-q">
                Daptomycin covers MRSA so it&apos;s a good choice for MRSA
                pneumonia. True or false?
              </div>
              <div className="trap-divider" />
              <div className="trap-a">
                <strong>False</strong> — pulmonary surfactant inactivates
                daptomycin. MRSA pneumonia needs vancomycin or linezolid only.
              </div>
            </div>
            <div className="trap-card">
              <span className="trap-badge">⚠ Exam Trap · Ch. 13</span>
              <div className="trap-q">
                Antibiotics cause bacteria to mutate and become resistant. True
                or false?
              </div>
              <div className="trap-divider" />
              <div className="trap-a">
                <strong>False</strong> — antibiotics select for pre-existing
                resistant mutants. They don&apos;t cause mutations.
              </div>
            </div>
            <div className="trap-card">
              <span className="trap-badge">⚠ Exam Trap · Ch. 9</span>
              <div className="trap-q">
                Stationary phase means bacteria have stopped growing. True or
                false?
              </div>
              <div className="trap-divider" />
              <div className="trap-a">
                <strong>False</strong> — birth rate equals death rate. Bacteria
                are still dividing, the count just plateaus.
              </div>
            </div>
            <div className="trap-card">
              <span className="trap-badge">⚠ Exam Trap · Ch. 11</span>
              <div className="trap-q">
                The first antibody produced in a primary immune response is IgG.
                True or false?
              </div>
              <div className="trap-divider" />
              <div className="trap-a">
                <strong>False</strong> — IgM is always first. IgG comes after
                class switching. IgM = acute. IgG = past/immunity.
              </div>
            </div>
            <div className="trap-card">
              <span className="trap-badge">⚠ Exam Trap · Ch. 12</span>
              <div className="trap-q">
                Anaphylaxis should be treated with diphenhydramine (Benadryl)
                first. True or false?
              </div>
              <div className="trap-divider" />
              <div className="trap-a">
                <strong>False</strong> — epinephrine IM is always first.
                Benadryl is a second-line adjunct. Delaying epi = preventable
                death.
              </div>
            </div>
            <div className="trap-card">
              <span className="trap-badge">⚠ Exam Trap · Ch. 18</span>
              <div className="trap-q">
                All asymptomatic bacteriuria should be treated with antibiotics.
                True or false?
              </div>
              <div className="trap-divider" />
              <div className="trap-a">
                <strong>False</strong> — only in pregnant women and pre-urologic
                procedure patients. Treating ASB elsewhere drives resistance.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="full-divider" />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "72px 40px" }}>
        <div
          className="about-section"
          style={{ padding: 0, maxWidth: "none" }}
        >
          <div>
            <span className="about-eyebrow">Built by Dani</span>
            <h2>
              Made while studying
              <br />
              the same material.
            </h2>
            <p>
              I&apos;m Danielle Alcala-Glazier — founder of Hello Gorgeous Med
              Spa, licensed esthetician, phlebotomist, CMAA, CNA, and current RN
              student taking Micro 270.
            </p>
            <p>
              I built this because studying from a textbook wasn&apos;t enough.
              I needed questions that felt like the exam — with traps flagged
              and clinical reasoning explained. So I made them, and now I&apos;m
              selling them.
            </p>
            <p>
              No Prior Authorization is my platform for healthcare students and
              aesthetic entrepreneurs. Everything here is built from real
              experience.
            </p>
            <div className="creds">
              <div className="cred">
                <span className="cred-dot" />
                Founder, Hello Gorgeous Med Spa — 10 years
              </div>
              <div className="cred">
                <span className="cred-dot" />
                Licensed esthetician, phlebotomist, CMAA, CNA
              </div>
              <div className="cred">
                <span className="cred-dot" />
                Current RN student — Micro 270
              </div>
              <div className="cred">
                <span className="cred-dot" />
                #1 Med Spa in Oswego, IL · 4.9 stars Google
              </div>
            </div>
          </div>
          <div className="about-card">
            <div className="ac-header">
              <div className="ac-header-label">Micro 270 · Study Hub</div>
              <div className="ac-header-title">What&apos;s inside</div>
            </div>
            <div className="ac-body">
              <div className="ac-row">
                <span className="ac-label">Total questions</span>
                <span className="ac-val pink">1,000</span>
              </div>
              <div className="ac-row">
                <span className="ac-label">Exam traps flagged</span>
                <span className="ac-val pink">200</span>
              </div>
              <div className="ac-row">
                <span className="ac-label">Chapters covered</span>
                <span className="ac-val teal">20</span>
              </div>
              <div className="ac-row">
                <span className="ac-label">Questions per chapter</span>
                <span className="ac-val">50</span>
              </div>
              <div className="ac-row">
                <span className="ac-label">Filter categories</span>
                <span className="ac-val">4–5 per chapter</span>
              </div>
              <div className="ac-row">
                <span className="ac-label">Works offline</span>
                <span className="ac-val teal">Yes</span>
              </div>
              <div className="ac-row">
                <span className="ac-label">Free hub</span>
                <span className="ac-val teal">Yes — no login</span>
              </div>
              <div className="ac-row">
                <span className="ac-label">AI cram tool</span>
                <span className="ac-val pink">$67 bundle</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-final">
        <h2>
          Ready to actually
          <br />
          <em>know</em> this material?
        </h2>
        <p>
          Start free with the hub. Upgrade when you&apos;re ready for the full
          bank and AI cram tool.
        </p>
        <div className="cta-final-actions">
          <Link href="/micro270/hub" className="btn-white">
            Start studying free →
          </Link>
          <a href="#pricing" className="btn-ghost">
            See pricing
          </a>
        </div>
      </div>

      <footer>
        <div className="footer-brand">No Prior Authorization</div>
        <div className="footer-text">
          Built by Danielle Alcala-Glazier · Oswego, IL
        </div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <a href="https://www.hellogorgeousmedspa.com">Hello Gorgeous</a>
        </div>
      </footer>
    </div>
  );
}
