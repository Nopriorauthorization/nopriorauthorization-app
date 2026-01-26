import MascotDomainCard from "@/components/mascots/MascotDomainCard";

export const metadata = {
  title: "Weight Management Intelligence | No Prior Authorization",
  description: "GLP-1s, metabolism, hormones, and sustainable progress — explained clearly.",
};

export default function WeightManagementPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-white">Weight Management Intelligence</h1>
          <p className="mt-3 max-w-2xl text-white/75">
            No hype. No shame. Get clarity on GLP-1s, hormones, metabolism, labs, and what actually moves the needle.
          </p>
        </header>

        <div className="flex flex-col gap-8">
          <MascotDomainCard
            mascotId="slim-t"
            displayName="Slim-T"
            title="Metabolism, GLP-1 clarity, realistic progress"
            description="Slim-T explains weight loss through the lens of biology: hormones, habits, labs, and the real reasons progress stalls."
            posterSrc="/characters/slim-t.png"
            mp4Src="/videos/mascots/slim-t.mp4"
            chatPersona="slim-t"
            primaryCtaLabel="Learn with Slim-T"
            chatCtaLabel="Ask Slim-T"
          />
        </div>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">What you can do here</h2>
          <ul className="mt-3 list-disc pl-5 text-white/75">
            <li>Ask questions about GLP-1s and what to monitor</li>
            <li>Connect labs + symptoms to your Blueprint</li>
            <li>Generate a provider discussion checklist</li>
            <li>Understand plateaus without panic</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
