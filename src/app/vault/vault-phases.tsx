"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type PhaseComponent = {
  id: string;
  name: string;
  icon: string;
  description: string;
  path: string;
  featured?: boolean;
  comingSoon?: boolean;
};

type PhaseCategory = {
  id: string;
  name: string;
  description: string;
  components: PhaseComponent[];
};

const phaseCategories: PhaseCategory[] = [
  {
    id: "phase-2a",
    name: "Phase 2A: Foundation",
    description: "Core tracking, timeline, and provider intelligence.",
    components: [
      {
        id: "timeline",
        name: "Health Timeline",
        icon: "📅",
        description: "Chronological view of every health event.",
        path: "/vault/timeline",
      },
      {
        id: "topics",
        name: "Health Topics",
        icon: "🏷️",
        description: "AI-tagged conversations and records.",
        path: "/vault/topics",
        comingSoon: true,
      },
      {
        id: "providers",
        name: "Provider Directory",
        icon: "👩‍⚕️",
        description: "Trusted provider relationships, notes, and calls-to-action.",
        path: "/vault/providers",
      },
      {
        id: "ai-categorization",
        name: "AI Categorization",
        icon: "🤖",
        description: "Automated organization of your documents and notes.",
        path: "/vault/document-analytics",
        comingSoon: true,
      },
    ],
  },
  {
    id: "phase-2b",
    name: "Phase 2B: Advanced Tracking",
    description: "Metrics, enriched timelines, and data-rich documents.",
    components: [
      {
        id: "metrics",
        name: "Health Metrics Dashboard",
        icon: "📊",
        description: "Vitals, meds, and activity LOA all in one view.",
        path: "/vault/metrics",
      },
      {
        id: "enhanced-timeline",
        name: "Enhanced Timeline",
        icon: "⏳",
        description: "Filterable timeline with search and milestones.",
        path: "/vault/timeline-enhanced",
      },
      {
        id: "journey",
        name: "Health Journey Map",
        icon: "🗺️",
        description: "Interactive map of treatments, wins, and next phases.",
        path: "/vault/journey",
      },
      {
        id: "document-analytics",
        name: "Document Analytics",
        icon: "📄",
        description: "AI-powered extraction, scoring, and insights.",
        path: "/vault/document-analytics",
      },
      {
        id: "insights",
        name: "Health Insights Cards",
        icon: "💡",
        description: "Trend cards with actionable next steps.",
        path: "/vault/insights",
      },
    ],
  },
  {
    id: "phase-2c",
    name: "Phase 2C: Collaboration",
    description: "Provider communication, care planning, and coordination.",
    components: [
      {
        id: "provider-portal",
        name: "Provider Portal",
        icon: "🔒",
        description: "Secure provider access with granular sharing.",
        path: "/vault/provider-portal",
      },
      {
        id: "care-team",
        name: "Care Team Dashboard",
        icon: "👥",
        description: "Organize the specialists keeping you supported.",
        path: "/vault/care-team",
      },
      {
        id: "communication",
        name: "Provider Communication",
        icon: "💬",
        description: "Secure messaging and attachments for your teams.",
        path: "/vault/communication",
      },
      {
        id: "care-plans",
        name: "Care Plans",
        icon: "📋",
        description: "Shared care planning and tracking with providers.",
        path: "/vault/care-plans",
      },
      {
        id: "appointments",
        name: "Appointment Coordination",
        icon: "🗓️",
        description: "Smart scheduling, reminders, and sync.",
        path: "/vault/appointments",
      },
    ],
  },
  {
    id: "phase-2d",
    name: "Phase 2D: AI Intelligence",
    description: "Predictive health intelligence and autonomy.",
    components: [
      {
        id: "ai-insights",
        name: "AI Health Insights Engine",
        icon: "🧠",
        description: "Predictive risk scoring and recommendations.",
        path: "/vault/ai-insights",
        featured: true,
      },
      {
        id: "pattern-recognition",
        name: "Health Pattern Recognition",
        icon: "📈",
        description: "Statistical anomaly detection and trends.",
        path: "/vault/patterns",
        featured: true,
      },
      {
        id: "recommendations",
        name: "Smart Care Recommendations",
        icon: "💊",
        description: "AI-sourced next-best actions with evidence.",
        path: "/vault/recommendations",
        featured: true,
      },
      {
        id: "alerts",
        name: "Smart Alerts & Notifications",
        icon: "🔔",
        description: "Intelligent reminders with personalized timing.",
        path: "/vault/alerts",
        featured: true,
      },
      {
        id: "document-ai",
        name: "Intelligent Document Analysis",
        icon: "🔍",
        description: "Clinical accuracy document processing.",
        path: "/vault/document-analytics",
        featured: true,
      },
    ],
  },
  {
    id: "phase-2e",
    name: "Phase 2E: Personalization",
    description: "Adaptive experiences, coaching, and analytics.",
    components: [
      {
        id: "personalization",
        name: "Advanced User Personalization",
        icon: "👤",
        description: "Behavioral profiling and adaptive journeys.",
        path: "/vault/personalization",
        featured: true,
      },
      {
        id: "behavioral-analytics",
        name: "Behavioral Analytics Engine",
        icon: "📊",
        description: "Usage patterns, predictions, and nudges.",
        path: "/vault/analytics",
        featured: true,
      },
      {
        id: "wellness-coach",
        name: "AI Wellness Coach",
        icon: "🤖",
        description: "Guided coaching with habit-forming prompts.",
        path: "/vault/wellness-coach",
        featured: true,
      },
      {
        id: "advanced-analytics",
        name: "Advanced Analytics Dashboard",
        icon: "📈",
        description: "Deep reporting for your team and providers.",
        path: "/vault/advanced-analytics",
        comingSoon: true,
      },
      {
        id: "dynamic-ux",
        name: "Dynamic UX Adaptation",
        icon: "✨",
        description: "Interface that bends to your day.",
        path: "/vault/dynamic-ux",
        comingSoon: true,
      },
    ],
  },
];

const phaseCompletion = [
  { phase: "Phase 2A", summary: "✅ Complete (4/4 features)" },
  { phase: "Phase 2B", summary: "✅ Complete (5/5 features)" },
  { phase: "Phase 2C", summary: "✅ Complete (5/5 features)" },
  { phase: "Phase 2D", summary: "✅ Complete (5/5 features)" },
  { phase: "Phase 2E", summary: "🔄 In Progress (3/5 features)" },
];

const totalPhases = phaseCategories.length;
const totalComponents = phaseCategories.reduce(
  (sum, category) => sum + category.components.length,
  0
);
const liveComponents = phaseCategories.reduce(
  (sum, category) =>
    sum +
    category.components.filter((component) => !component.comingSoon).length,
  0
);
const aiComponents = phaseCategories.reduce(
  (sum, category) => sum + category.components.filter((component) => component.featured).length,
  0
);
const featuredComponents = phaseCategories.flatMap((category) =>
  category.components.filter((component) => component.featured)
);

function PhaseStat({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 p-4`}>
      <p className="text-xs uppercase tracking-[0.4em] text-white/50">{label}</p>
      <p className={`text-2xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}

export default function VaultPhasesExplorer() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const base = selectedPhase
      ? phaseCategories.filter((category) => category.id === selectedPhase)
      : phaseCategories;

    if (!searchQuery.trim()) {
      return base;
    }

    const query = searchQuery.toLowerCase();
    return base
      .map((category) => ({
        ...category,
        components: category.components.filter(
          (component) =>
            component.name.toLowerCase().includes(query) ||
            component.description.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.components.length > 0);
  }, [searchQuery, selectedPhase]);

  return (
    <section className="mb-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-black/20 p-6 shadow-2xl shadow-pink-500/10">
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-pink-400">Wave Map</p>
            <h2 className="text-3xl font-semibold text-white">Sacred Vault Wave Phases</h2>
            <p className="text-sm text-white/70">
              Walk through every phase we designed—from the foundational waves to the AI intelligence
              layers that keep your story moving forward.
            </p>
          </div>
          <p className="text-xs text-white/60 tracking-[0.4em]">Navigate {totalPhases} waves</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <PhaseStat label="Live Waves" value={totalPhases} accent="text-pink-300" />
          <PhaseStat label="Live Features" value={liveComponents} accent="text-green-300" />
          <PhaseStat label="AI Power" value={aiComponents} accent="text-purple-300" />
          <PhaseStat label="Total Components" value={totalComponents} accent="text-blue-300" />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search waves or features..."
            className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-pink-500 focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPhase(null)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.4em] ${
                selectedPhase === null
                  ? "bg-pink-500 text-black"
                  : "border border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              All Waves
            </button>
            {phaseCategories.map((category) => {
              const shortName = category.name.split(":")[0];
              const isActive = selectedPhase === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() =>
                    setSelectedPhase((current) => (current === category.id ? null : category.id))
                  }
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.4em] ${
                    isActive
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-black"
                      : "border border-white/10 text-white/60 hover:border-pink-400/60 hover:text-white"
                  }`}
                >
                  {shortName}
                </button>
              );
            })}
          </div>
        </div>

        {!selectedPhase && !searchQuery && (
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Featured AI Intelligence</h3>
                <p className="text-sm text-white/70">
                  The cores of every wave that are already live and analyzing your health story.
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.5em] text-white/50">AI Wave</span>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredComponents.map((component) => (
                <Link
                  key={component.id}
                  href={component.path}
                  className="group rounded-2xl border border-white/10 bg-black/60 p-4 hover:border-pink-400/60 hover:scale-[1.01] transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{component.icon}</span>
                    <h4 className="text-sm font-semibold text-white group-hover:text-pink-300">
                      {component.name}
                    </h4>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{component.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 space-y-10">
        {filteredCategories.map((category) => (
          <div key={category.id}>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-white">{category.name}</h3>
                <p className="text-sm text-white/70">{category.description}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.5em] text-white/50">
                {category.components.length} features
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.components.map((component) => (
                <div
                  key={component.id}
                  className="group relative rounded-2xl border border-white/10 bg-black/50 p-5 transition hover:border-pink-500/50"
                >
                  {component.featured && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full border border-purple-500/50 bg-purple-500/20 text-[10px] uppercase tracking-[0.25em] text-purple-200">
                      AI
                    </div>
                  )}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{component.icon}</div>
                    <div>
                      <h4 className="text-xl font-semibold text-white">{component.name}</h4>
                      <p className="text-xs text-white/50 uppercase tracking-[0.35em]">
                        {category.name.split(":")[1]?.trim() || "Wave"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 mb-6">{component.description}</p>
                  {component.comingSoon ? (
                    <button
                      disabled
                      className="w-full rounded-full border border-white/10 bg-white/5 py-2 text-xs font-semibold tracking-[0.4em] text-white/50"
                    >
                      In Development
                    </button>
                  ) : (
                    <Link
                      href={component.path}
                      className="block w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 py-2 text-center text-xs font-semibold uppercase tracking-[0.4em] text-black transition hover:opacity-90"
                    >
                      Launch Feature
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="grid gap-4 md:grid-cols-3">
          {phaseCompletion.map((item) => (
            <div
              key={item.phase}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">{item.phase}</p>
              <p className="text-base font-semibold text-white mt-2">{item.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
