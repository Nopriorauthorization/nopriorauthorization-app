import Link from "next/link";

/**
 * NPA Phase 6: Security & Trust Page
 * 
 * Public page explaining NPA's security practices,
 * governance principles, and ethical commitments.
 * 
 * REQUIRED FOOTER LINK from login/signup pages.
 */

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Security & Trust
          </h1>
          <p className="text-lg text-slate-600">
            How No Prior Authorization protects your health data
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <p className="text-lg text-purple-900 italic text-center">
            &quot;No Prior Authorization exists to restore continuity and patient control in healthcare.
            It does not replace clinicians, does not diagnose, and does not monetize personal health data.&quot;
          </p>
        </div>

        {/* Core Principles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Core Principles
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: "👤",
                title: "Patient Remains Root Authority",
                description:
                  "You are the ultimate owner of your health data. No one can override your decisions.",
              },
              {
                icon: "👁️",
                title: "No Silent Access, Ever",
                description:
                  "Every access to your data is logged and visible to you. No hidden backdoors.",
              },
              {
                icon: "💰",
                title: "No PHI Monetization",
                description:
                  "Your health information is never sold, rented, or monetized. Your trust is not for sale.",
              },
              {
                icon: "🩺",
                title: "No Diagnostic Authority",
                description:
                  "We organize information, not interpret it medically. We don't replace your doctors.",
              },
              {
                icon: "🚪",
                title: "No Vendor Lock-In",
                description:
                  "Export all your data anytime with one click. If you can't leave, you won't trust us.",
              },
              {
                icon: "📊",
                title: "No Data Hoarding",
                description:
                  "We collect only what's necessary. Your data belongs to you, not our analytics.",
              },
            ].map((principle) => (
              <div
                key={principle.title}
                className="bg-white p-6 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{principle.icon}</span>
                  <h3 className="font-bold text-slate-900">{principle.title}</h3>
                </div>
                <p className="text-slate-600 text-sm">{principle.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security Measures */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Security Measures
          </h2>
          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-200">
            {[
              {
                title: "Encryption at Rest & Transit",
                description:
                  "All data is encrypted using industry-standard AES-256 encryption at rest and TLS 1.3 in transit.",
              },
              {
                title: "Optional Two-Factor Authentication",
                description:
                  "Enable TOTP-based MFA for an extra layer of protection on your account.",
              },
              {
                title: "Session Management",
                description:
                  "View and revoke active sessions anytime. Get alerts for unusual login activity.",
              },
              {
                title: "Immutable Audit Logs",
                description:
                  "Every action is logged and cannot be altered. Full transparency into who accessed what.",
              },
              {
                title: "Emergency Access Controls",
                description:
                  "Opt-in emergency access that's time-limited, read-only, and fully auditable.",
              },
              {
                title: "Regular Security Audits",
                description:
                  "Periodic security assessments and penetration testing to identify vulnerabilities.",
              },
            ].map((measure) => (
              <div key={measure.title} className="p-4">
                <h3 className="font-semibold text-slate-900">{measure.title}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {measure.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Do Not Build List */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What We Will Never Build
          </h2>
          <p className="text-slate-600 mb-6">
            These features will never exist in NPA, regardless of technical
            feasibility or business pressure. This list protects you and our mission.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <ul className="space-y-3">
              {[
                "Automatic provider access without your explicit consent",
                "Silent data sharing or background data collection",
                "AI diagnosis, treatment advice, or risk scoring",
                "Data resale, ad targeting, or PHI monetization",
                "Insurance decision engines or coverage influence",
                "Social features, public profiles, or sharing feeds",
                "Dark patterns, addiction mechanics, or manipulative UX",
                "Features that trap you or penalize leaving",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span className="text-red-900">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Data Policies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Data Policies
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Data Retention</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>Active account: Your control, indefinite</li>
                <li>Deleted account: 30 days maximum</li>
                <li>Audit logs: 7 years (legal requirement)</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Breach Response</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>Immediate containment</li>
                <li>Patient notification within 72 hours</li>
                <li>Public disclosure of scope</li>
                <li>Free identity protection</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Rights</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <ul className="space-y-3">
              {[
                "Access all your health data at any time",
                "Export everything with one click",
                "Delete your account and all data",
                "Revoke any permission instantly",
                "See who accessed your information",
                "Control emergency access settings",
                "Opt out of any future features",
              ].map((right) => (
                <li key={right} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-green-900">{right}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Questions or Concerns?
          </h2>
          <p className="text-slate-600 mb-6">
            We take security seriously. If you have questions or want to report
            a security issue, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:security@nopriorauthorization.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Report Security Issue
            </a>
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
            >
              View Privacy Policy
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>Last updated: February 2026</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/privacy" className="hover:text-purple-600">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-purple-600">
              Terms of Use
            </Link>
            <span>|</span>
            <Link href="/vault/governance" className="hover:text-purple-600">
              Governance Dashboard
            </Link>
          </div>
          <p className="mt-4">
            © {new Date().getFullYear()} No Prior Authorization. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
