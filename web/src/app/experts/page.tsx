import Image from "next/image";
import { EXPERTS } from "@/content/experts";
import ExpertChat from "@/components/experts/expert-chat";

export default function ExpertsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">
            Experts
          </p>
          <h1 className="font-display text-4xl md:text-6xl">
            Built to answer what patients are afraid to ask.
          </h1>
          <p className="max-w-2xl text-base text-white/70 md:text-lg">
            Every expert is a specialist with boundaries, tone rules, and
            responsibilities. No hype. No medical advice.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {EXPERTS.map((expert) => (
            <div
              key={expert.id}
              className="rounded-2xl border border-white/10 bg-black/70 p-6"
            >
              <div className="h-56 overflow-hidden rounded-2xl bg-black/70">
                <Image
                  src={expert.image}
                  alt={expert.name}
                  width={360}
                  height={420}
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
              <a
                href={expert.ctaHref}
                className="mt-4 inline-flex text-sm font-semibold text-hot-pink"
              >
                {expert.cta}
              </a>
            </div>
          ))}
        </div>

        <ExpertChat />
      </div>
    </main>
  );
}
