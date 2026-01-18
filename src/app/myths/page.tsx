export default function ResourcesPage() {
  const categories = [
    {
      title: "Hormones & Metabolic Health",
      description: "Understanding hormone optimization, thyroid function, insulin sensitivity, and metabolic markers.",
    },
    {
      title: "Longevity & Preventive Care",
      description: "Evidence-based strategies for healthspan extension, biomarker tracking, and proactive health management.",
    },
    {
      title: "Labs & Biomarkers",
      description: "Plain-language explanations of common lab tests, what they measure, and why they matter for your health.",
    },
    {
      title: "Aesthetics & Injectables",
      description: "Educational overviews of cosmetic treatments, safety considerations, and how to have informed provider conversations.",
    },
    {
      title: "Peptides & Regenerative Therapies",
      description: "Current research on peptide therapies, regenerative medicine, and emerging treatment modalities.",
    },
    {
      title: "General Health Concepts",
      description: "Foundational health topics, medical terminology, and frameworks for understanding your body.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <p className="text-xs font-semibold tracking-[0.35em] text-pink-400 uppercase">
            Myths & Truths
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Myths & Truths
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
            Evidence-based insights to help you cut through the noise — and have smarter conversations with providers.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <div
              key={category.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-pink-400/30 hover:bg-white/10"
            >
              <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
              <p className="text-sm text-gray-400 mb-4">
                {category.description}
              </p>
              <button className="text-xs font-semibold text-pink-400 hover:text-pink-300 transition">
                Learn more →
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs text-gray-400">
            <strong className="text-white">Important:</strong> This information is educational only and not medical advice.
            Always discuss your health with a qualified provider.
          </p>
        </div>
      </div>
    </main>
  );
}
