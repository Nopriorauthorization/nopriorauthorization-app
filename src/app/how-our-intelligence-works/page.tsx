import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Our Intelligence Works",
  description:
    "Learn how No Prior Authorization uses AI to help you understand and organize your health information transparently and responsibly.",
};

export default function HowOurIntelligenceWorksPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-cyan-900/20 to-black" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-blue-400 text-sm font-medium tracking-wider mb-4">
            TRANSPARENCY & TRUST
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            How Our Intelligence Works
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We believe you deserve to understand exactly how we help you make
            sense of your health information.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* What We Do */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl">
              ✓
            </div>
            <h2 className="text-3xl font-bold">What We Do</h2>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8 space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              No Prior Authorization helps you <strong className="text-white">understand and organize</strong> your health information.
            </p>

            <ul className="space-y-4">
              <ListItem color="green">
                <strong>Translate medical jargon</strong> into plain English so you understand what your documents actually say
              </ListItem>
              <ListItem color="green">
                <strong>Organize your health records</strong> in one secure, private location
              </ListItem>
              <ListItem color="green">
                <strong>Surface patterns and connections</strong> across your health data
              </ListItem>
              <ListItem color="green">
                <strong>Generate questions</strong> you can bring to your healthcare provider
              </ListItem>
              <ListItem color="green">
                <strong>Help you prepare</strong> for more informed conversations with your care team
              </ListItem>
            </ul>

            <div className="pt-4 border-t border-green-500/20">
              <p className="text-green-300 font-medium">
                Our goal is simple: help you ask better questions — not replace the answers only your doctor can provide.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do NOT Do */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-2xl">
              ✗
            </div>
            <h2 className="text-3xl font-bold">What We Do NOT Do</h2>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-8 space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              We are committed to responsible AI use. There are clear boundaries we never cross.
            </p>

            <ul className="space-y-4">
              <ListItem color="red">
                <strong>We do not diagnose conditions</strong> — only licensed healthcare providers can do that
              </ListItem>
              <ListItem color="red">
                <strong>We do not recommend treatments</strong> — treatment decisions require medical expertise and context
              </ListItem>
              <ListItem color="red">
                <strong>We do not predict outcomes</strong> — health outcomes depend on many factors we cannot assess
              </ListItem>
              <ListItem color="red">
                <strong>We do not replace your healthcare provider</strong> — we complement, not substitute, professional care
              </ListItem>
              <ListItem color="red">
                <strong>We do not use alarmist language</strong> — we explain calmly and factually
              </ListItem>
            </ul>

            <div className="pt-4 border-t border-red-500/20 bg-red-500/10 rounded-xl p-4 mt-6">
              <p className="text-red-300 font-medium text-sm">
                🚨 If you are experiencing a medical emergency, severe symptoms, chest pain, or difficulty breathing, seek immediate emergency care or call 911. This platform is not for emergencies.
              </p>
            </div>
          </div>
        </section>

        {/* How Our Explanations Are Generated */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl">
              🔍
            </div>
            <h2 className="text-3xl font-bold">How Our Explanations Work</h2>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8 space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              When we explain your health documents, our interpretations are based on:
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-xl p-5 border border-blue-500/20">
                <div className="text-3xl mb-3">📄</div>
                <h3 className="text-white font-semibold mb-2">Your Data</h3>
                <p className="text-gray-400 text-sm">
                  The actual documents you upload — we only analyze what you share
                </p>
              </div>

              <div className="bg-black/30 rounded-xl p-5 border border-blue-500/20">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-white font-semibold mb-2">Medical Knowledge</h3>
                <p className="text-gray-400 text-sm">
                  Established medical education and clinical reference standards
                </p>
              </div>

              <div className="bg-black/30 rounded-xl p-5 border border-blue-500/20">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="text-white font-semibold mb-2">Plain Language</h3>
                <p className="text-gray-400 text-sm">
                  Interpretation designed for clarity, not medical complexity
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-500/20">
              <p className="text-gray-400 text-sm">
                Our explanations reference widely accepted clinical knowledge, commonly discussed medical education principles, and information routinely evaluated in clinical care. We use phrases like "commonly understood," "often associated with," and "routinely evaluated" to be accurate about the nature of our interpretations.
              </p>
            </div>
          </div>
        </section>

        {/* How Your Data Is Used */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl">
              🔒
            </div>
            <h2 className="text-3xl font-bold">How Your Data Is Used</h2>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              Your health information is sensitive. We treat it that way.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-black/30 rounded-xl p-4 border border-purple-500/20">
                <div className="text-2xl">🛡️</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Your Data Stays Yours</h3>
                  <p className="text-gray-400 text-sm">
                    We do not sell, share, or monetize your health data. Ever.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-black/30 rounded-xl p-4 border border-purple-500/20">
                <div className="text-2xl">🚫</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">No Training on Your Data</h3>
                  <p className="text-gray-400 text-sm">
                    We do not use your personal health information to train AI models.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-black/30 rounded-xl p-4 border border-purple-500/20">
                <div className="text-2xl">🔐</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">256-bit Encryption</h3>
                  <p className="text-gray-400 text-sm">
                    All data is encrypted at rest and in transit using industry-standard protocols.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-black/30 rounded-xl p-4 border border-purple-500/20">
                <div className="text-2xl">🗑️</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">You Control Deletion</h3>
                  <p className="text-gray-400 text-sm">
                    You can delete your data at any time. When you delete it, it's gone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why It's Safe */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl">
              ✅
            </div>
            <h2 className="text-3xl font-bold">Why It's Safe</h2>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Built-In Guardrails</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Non-diagnostic language enforced system-wide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Clear disclaimers on all AI-generated content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Emergency guidance visible when relevant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Provider consultation encouraged throughout</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4 text-lg">What AI Cannot Do</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Give diagnoses or differential assessments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Prescribe or recommend medications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Make predictions about disease progression</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Access external medical records or systems</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Sponsor-Free */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-2xl">
              💰
            </div>
            <h2 className="text-3xl font-bold">Sponsor-Free & Unbiased</h2>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-2xl p-8 space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              Our recommendations are never influenced by sponsors, advertisers, or pharmaceutical companies.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🚫💊</div>
                <p className="text-gray-400 text-sm">No pharmaceutical sponsors</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🚫📺</div>
                <p className="text-gray-400 text-sm">No advertising partners</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🚫🤝</div>
                <p className="text-gray-400 text-sm">No hidden incentives</p>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-500/20">
              <p className="text-amber-300 font-medium">
                When we explain something, it's because it's relevant to your health — not because someone paid us to say it.
              </p>
            </div>
          </div>
        </section>

        {/* Who This Page Is For */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-2xl">
              👥
            </div>
            <h2 className="text-3xl font-bold">Questions?</h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <p className="text-gray-300 mb-6">
              This page was created to answer questions from users, healthcare providers, investors, journalists, and regulators. If you have additional questions about how our platform works:
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition text-white font-medium"
              >
                Privacy Policy →
              </Link>
              <Link
                href="/terms"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition text-white font-medium"
              >
                Terms of Service →
              </Link>
              <Link
                href="/science"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition text-white font-medium"
              >
                Our Science →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center pt-8 pb-16">
          <p className="text-gray-400 mb-6">
            Ready to understand your health information?
          </p>
          <Link
            href="/vault"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
          >
            Get Started
            <span>→</span>
          </Link>
        </section>
      </div>
    </div>
  );
}

function ListItem({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "green" | "red";
}) {
  const colorClasses = {
    green: "text-green-400",
    red: "text-red-400",
  };

  const icon = color === "green" ? "✓" : "✗";

  return (
    <li className="flex items-start gap-3">
      <span className={`${colorClasses[color]} mt-1 font-bold`}>{icon}</span>
      <span className="text-gray-300">{children}</span>
    </li>
  );
}
