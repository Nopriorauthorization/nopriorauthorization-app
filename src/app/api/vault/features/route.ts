import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    features: [
      {
        id: "decoder",
        title: "Document Decoder",
        description: "Upload prescriptions, lab results, and medical bills to get instant AI-powered explanations and insights.",
        tier: "instant",
        status: "active",
        href: "/vault/decoder",
        icon: "🔍",
        hasData: false
      },
      {
        id: "timeline",
        title: "Health Timeline",
        description: "Your complete medical history visualized as an interactive timeline with trends and patterns.",
        tier: "instant",
        status: "active",
        href: "/vault/timeline",
        icon: "📅",
        hasData: false
      },
      {
        id: "family-tree",
        title: "Family Health Tree",
        description: "Map your family's health history and genetic patterns to understand your risk factors.",
        tier: "capture",
        status: "active",
        href: "/vault/family-tree",
        icon: "🌳",
        hasData: false
      },
      {
        id: "lab-decoder",
        title: "Lab Result Decoder",
        description: "Upload lab results to get detailed explanations of what your numbers mean and next steps.",
        tier: "instant",
        status: "active",
        href: "/vault/lab-decoder",
        icon: "🧪",
        hasData: false
      },
      {
        id: "provider-tracker",
        title: "Provider Tracker",
        description: "Keep track of all your healthcare providers, appointments, and communication in one place.",
        tier: "capture",
        status: "active",
        href: "/vault/provider-tracker",
        icon: "👨‍⚕️",
        hasData: false
      },
      {
        id: "care-plans",
        title: "Care Plans",
        description: "Create and manage personalized care plans with your healthcare team.",
        tier: "power",
        status: "active",
        href: "/vault/care-plans",
        icon: "📋",
        hasData: false
      },
      {
        id: "trusted-circle",
        title: "Trusted Circle",
        description: "Share specific health information with family members and caregivers securely.",
        tier: "power",
        status: "active",
        href: "/vault/trusted-circle",
        icon: "👥",
        hasData: false
      },
      {
        id: "voice-memos",
        title: "Voice Memos",
        description: "Record and transcribe important conversations with your healthcare providers.",
        tier: "capture",
        status: "active",
        href: "/vault/voice-memos",
        icon: "🎤",
        hasData: false
      },
      {
        id: "red-flags",
        title: "Red Flags Monitor",
        description: "AI-powered monitoring of your health data to catch potential issues early.",
        tier: "power",
        status: "active",
        href: "/vault/red-flags",
        icon: "🚩",
        hasData: false
      },
      {
        id: "ai-insights",
        title: "AI Health Insights",
        description: "Get personalized health insights and recommendations based on your data.",
        tier: "power",
        status: "active",
        href: "/vault/ai-insights",
        icon: "🤖",
        hasData: false
      },
      {
        id: "documents",
        title: "Document Library",
        description: "Securely store and organize all your medical documents with smart search.",
        tier: "capture",
        status: "active",
        href: "/vault/documents",
        icon: "📄",
        hasData: false
      },
      {
        id: "analytics",
        title: "Health Analytics",
        description: "Advanced analytics and trends from your health data over time.",
        tier: "power",
        status: "active",
        href: "/vault/analytics",
        icon: "📊",
        hasData: false
      }
    ],
    stats: {
      documents: 0,
      chats: 0,
      appointments: 0,
      decoded: 0
    },
    vaultName: "Sacred Vault",
    isEmpty: false
  });
}
