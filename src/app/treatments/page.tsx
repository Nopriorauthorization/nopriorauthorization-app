export default function TreatmentsPage() {
  const treatments = [
    {
      title: "Hormone Therapy",
      description: "Testosterone replacement, estrogen therapy, thyroid optimization, and DHEA supplementation — understanding when and why providers prescribe hormones.",
    },
    {
      title: "GLP-1 Medications",
      description: "Educational overview of semaglutide, tirzepatide, and other GLP-1 receptor agonists — how they work, common protocols, and what to discuss with your provider.",
    },
    {
      title: "Peptides",
      description: "Current research on therapeutic peptides like BPC-157, TB-500, and others — what's known, what's experimental, and how to evaluate claims.",
    },
    {
      title: "Injectables (Botox, Fillers)",
      description: "General information on neurotoxins, dermal fillers, and cosmetic injectables — safety considerations and how to choose a qualified provider.",
    },
    {
      title: "IV Therapy",
      description: "Overview of intravenous vitamin therapy, hydration treatments, and NAD+ infusions — what they are, common uses, and evidence levels.",
    },
    {
      title: "Aesthetic Devices",
      description: "Educational content on IPL, microneedling, laser treatments, and other aesthetic technologies — understanding modalities and realistic outcomes.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <p className="text-xs font-semibold tracking-[0.35em] text-pink-400 uppercase">
            Treatments
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Treatments
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
            Educational overviews of treatments people often ask about — designed to help you ask better questions with your provider.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {treatments.map((treatment) => (
            <div
              key={treatment.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-pink-400/30 hover:bg-white/10"
            >
              <h3 className="text-lg font-semibold mb-2">{treatment.title}</h3>
              <p className="text-sm text-gray-400 mb-3">
                {treatment.description}
              </p>
              <button className="text-xs font-semibold text-pink-400 hover:text-pink-300 transition">
                Learn more →
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border-2 border-pink-400/40 bg-pink-400/5 p-6">
          <p className="text-sm text-gray-300">
            <strong className="text-white">Important Disclaimer:</strong> This information is educational only and not medical advice.
            Always discuss treatments with a qualified provider. Your Circle does not recommend, prescribe, or endorse specific treatments.
          </p>
        </div>
      </div>
    </main>
  );
}
