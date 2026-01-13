import Link from "next/link";
import Image from "next/image";
import AvatarIntroStrip from "@/components/hero/avatar-intro-strip";

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

        <AvatarIntroStrip />

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
