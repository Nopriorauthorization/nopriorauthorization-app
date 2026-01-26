import Link from "next/link";

const specialists = [
  { name: "Peppi", role: "Science & Peptides", href: "/science" },
  { name: "Harmony", role: "Hormones", href: "/hormones" },
  { name: "Beau-Tox", role: "Aesthetics", href: "/aesthetics" },
  { name: "Filla-Grace", role: "Aesthetics", href: "/aesthetics" },
  { name: "Slim-T", role: "Weight Management", href: "/weight-management" },
  { name: "Decode", role: "Labs", href: "/vault/lab-decoder" },
  { name: "Roots", role: "Family Health", href: "/family-health" },
];

export default function SpecialistsTeaser() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold text-white">Meet Your Specialists</h2>
      <p className="mt-2 text-white/70">Each specialist lives inside their domain — learn first, then ask questions.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {specialists.map((s) => (
          <Link
            key={s.name}
            href={s.href}
            className="rounded-xl border border-white/10 bg-black/30 p-5 hover:bg-black/40"
          >
            <div className="text-white font-semibold">{s.name}</div>
            <div className="text-pink-400 text-sm">{s.role}</div>
            <div className="mt-2 text-xs text-white/60">Open →</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
