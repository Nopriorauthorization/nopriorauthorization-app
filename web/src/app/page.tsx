import Image from "next/image";
import Link from "next/link";
import { EXPERTS } from "@/content/experts";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-20 pt-16 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-hot-pink">
            No Prior Authorization
          </p>
          <h1 className="font-display text-4xl leading-tight md:text-6xl">
            We tell you the juicy stuff you don&apos;t want to ask providers — and
            what Google won&apos;t.
          </h1>
          <p className="text-base text-white/70 md:text-lg">
            Expert-led clarity for people who want to understand before they
            decide. Calm, direct, and free from hype.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="https://app.nopriorauthorization.com"
              className="rounded-full bg-hot-pink px-6 py-3 text-sm font-semibold text-black"
            >
              Start Asking Questions
            </Link>
            <Link
              href="/experts"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80"
            >
              Meet the Experts
            </Link>
          </div>
        </div>
        <div className="relative w-full max-w-lg">
          <div className="absolute -inset-8 rounded-3xl bg-hot-pink/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/50 p-4">
            <Image
              src="/hero.png"
              alt="No Prior Authorization hero"
              width={640}
              height={760}
              className="h-auto w-full rounded-2xl object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Why this exists",
              text: "Patients are overwhelmed, upsold, or confused. We translate the truth without pressure.",
            },
            {
              title: "How it works",
              text: "Ask a question. Get a clear explanation. Walk into appointments informed.",
            },
            {
              title: "Trust-first",
              text: "No hype, no sales, no medical advice. Just expert-led education.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold text-hot-pink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-white/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Meet the experts</h2>
          <Link href="/experts" className="text-sm text-hot-pink">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {EXPERTS.slice(0, 3).map((expert) => (
            <div
              key={expert.id}
              className="rounded-2xl border border-white/10 bg-black/50 p-6"
            >
              <div className="h-48 overflow-hidden rounded-2xl bg-black/50">
                <Image
                  src={expert.image}
                  alt={expert.name}
                  width={320}
                  height={320}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{expert.name}</h3>
              <p className="text-sm text-white/60">{expert.role}</p>
              {expert.credentials && (
                <p className="mt-2 text-xs text-hot-pink">
                  {expert.credentials}
                </p>
              )}
              <p className="mt-3 text-sm text-white/70">
                {expert.description}
              </p>
              <Link
                href={expert.ctaHref}
                className="mt-4 inline-flex text-sm font-semibold text-hot-pink"
              >
                {expert.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Consumer pricing preview</h2>
              <p className="mt-3 text-sm text-white/70">
                Start free. Upgrade for deeper answers and full access.
              </p>
            </div>
            <Link
              href="/pricing"
              className="rounded-full bg-hot-pink px-6 py-3 text-sm font-semibold text-black"
            >
              View Pricing
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { name: "Free", price: "$0", detail: "Limited access" },
              { name: "Premium", price: "$19/mo", detail: "Full access" },
              { name: "Annual", price: "$149/yr", detail: "Best value" },
            ].map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl border border-white/10 bg-black/60 p-6"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                  {plan.name}
                </p>
                <p className="mt-4 text-3xl font-semibold">{plan.price}</p>
                <p className="mt-2 text-xs text-white/60">{plan.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
