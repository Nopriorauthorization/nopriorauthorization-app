import Link from "next/link";
import Image from "next/image";
import AvatarIntroStrip from "@/components/hero/avatar-intro-strip";
import BlueprintCTA from "@/components/ui/BlueprintCTA";

const featureHighlights = [
  {
    title: "One identity snapshot for every provider",
    description:
      "A single reference that shows your story, so you don’t repeat intake every time.",
  },
  {
    title: "Export to providers (PDF + secure link)",
    description:
      "Deliver a professional packet before you walk in—PDF download plus a reversible link.",
  },
  {
    title: "Medications + supplements inventory",
    description:
      "Track current meds, supplements, and notes so every provider sees the same list.",
  },
  {
    title: "Treatments timeline",
    description:
      "See what you’ve tried, what’s working, and what you want to explore next.",
  },
  {
    title: "Documents Vault (labs, imaging, visit notes)",
    description:
      "Save PDFs, labs, and visit notes beside your Blueprint for instant reference.",
  },
  {
    title: "Remembers you over time",
    description:
      "Blueprint builds as you add records, giving you a consistent snapshot to share.",
  },
];

const howItWorks = [
  {
    label: "Save",
    title: "Capture your history",
    description: "Store notes, labs, meds, docs, and questions in one spot.",
  },
  {
    label: "Organize",
    title: "Keep it consistent",
    description: "Blueprint grows over time with every update you add.",
  },
  {
    label: "Export",
    title: "Share with providers",
    description: "Create a PDF and secure link in minutes for any appointment.",
  },
  {
    label: "Repeat",
    title: "Stay prepared",
    description: "Add new data once and keep the record ready for future visits.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="px-6 py-16">
        {/* HERO */}
        <section className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[0.9fr_1.1fr] items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold tracking-[0.35em] text-pink-400 uppercase">
              No prior authorization
            </p>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              <span className="hero-pop">We tell you what providers don&apos;t.</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              We tell you the{" "}
              <span className="hero-highlight">juicy stuff</span> you don&apos;t want
              to ask providers — and what{" "}
              <span className="hero-highlight">Google won&apos;t</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/chat" className="cinematic-cta">
                Ask a Mascot
              </Link>
              <Link href="/chat?mascot=beau-tox" className="cinematic-cta-outline">
                Start with Beau-Tox
              </Link>
            </div>
          </div>

          <div className="relative max-w-xl mx-auto">
            <div className="absolute -inset-6 rounded-3xl bg-pink-500/20 blur-3xl" />
            <div className="relative rounded-3xl border border-pink-500/40 bg-black/60 p-4">
              <Image
                src="/hero.png"
                alt="Hello Gorgeous mascots"
                width={900}
                height={640}
                priority
                className="h-auto w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* MID SECTION */}
        <section
          id="blueprint"
          className="mx-auto mt-12 max-w-6xl space-y-6"
        >
          <div className="space-y-3 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-hot-pink">
              No Prior Authorization
            </p>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Your Blueprint is your lifetime health record — built for real life.
            </h2>
            <p className="text-base text-white/70">
              One place to store your history, treatments, meds, labs, and questions
              — then export it for any appointment in minutes.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4 md:grid-cols-2">
              {featureHighlights.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white"
                >
                  <h3 className="text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  How it works
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  Turn your Blueprint into a ready-to-share resource
                </h3>
              </div>
              <ol className="space-y-4">
                {howItWorks.map((step, index) => (
                  <li
                    key={step.title}
                    className="flex gap-4 rounded-2xl border border-white/5 bg-black/20 p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/5 text-sm font-semibold text-hot-pink">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                        {step.label}
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {step.title}
                      </p>
                      <p className="text-xs text-white/60">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row">
            <p className="text-xs text-white/60">
              Educational only. Not medical advice.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/subscribe"
                className="rounded-full bg-hot-pink px-6 py-3 text-sm font-semibold text-black transition hover:bg-pink-500"
              >
                View Plans
              </Link>
              <BlueprintCTA />
            </div>
          </div>
        </section>

        <section id="experts">
          <AvatarIntroStrip />
        </section>

        {/* FOOTER CTA */}
        <section className="mt-20 text-center">
          <p className="text-gray-500 mb-4">Knowledge before needles.</p>
          <Link href="/subscribe" className="text-pink-500 hover:underline">
            View Membership Options →
          </Link>
        </section>
      </div>
    </main>
  );
}
