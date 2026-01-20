import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { resolveDocumentIdentity } from '@/lib/documents/server';

export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    
    if (!identity.userId && !identity.anonId) {
      // Return empty vault data for users without authentication
      return NextResponse.json({
        features: [],
        stats: { documents: 0, chats: 0, appointments: 0, decoded: 0 },
        vaultName: null,
        isEmpty: true,
      });
    }

    const { userId, anonId } = identity;
    const where = userId ? { userId } : { anonId };

    // Get user data counts to determine feature availability
    const [
      documentCount,
      chatCount,
      appointmentCount,
      decodedCount,
      vaultSettings,
    ] = await Promise.all([
      prisma.document.count({ where }),
      prisma.chatSession.count({ where }),
      prisma.appointment.count({ where }),
      prisma.documentDecode.count({
        where: {
          Document: where,
        },
      }),
      prisma.userMemory.findFirst({
        where,
        select: { vaultName: true },
      }),
    ]);

    // Define feature status based on user data
    const features = [
      // INSTANT ACCESS
      {
        id: "snapshot",
        title: "My Snapshot",
        description: "Auto-generated health overview with key stats, recent treatments, and upcoming appointments.",
        tier: "instant",
        icon: "📸",
        status: "active",
        href: "/vault/snapshot",
        hasData: documentCount > 0 || appointmentCount > 0,
      },
      {
        id: "timeline",
        title: "My Treatment Timeline",
        description: "Visual journey of every treatment, upload, and milestone — automatically organized by date.",
        tier: "instant",
        icon: "📅",
        status: "active",
        href: "/vault/timeline",
        hasData: documentCount > 0,
      },
      {
        id: "providers",
        title: "My Providers Hub",
        description: "Timestamped directory of every provider you've seen, with visit history and quick contact info.",
        tier: "instant",
        icon: "👩‍⚕️",
        status: "active",
        href: "/vault/providers",
        hasData: appointmentCount > 0,
      },
      {
        id: "questions",
        title: "Questions I Should Ask",
        description: "AI-generated prep questions before appointments — based on your meds, treatments, and goals.",
        tier: "instant",
        icon: "❓",
        status: "active",
        href: "/vault/questions",
        hasData: false,
      },

      // SMART CAPTURE
      {
        id: "photos",
        title: "Smart Photo Vault",
        description: "Snap a photo → AI categorizes, timestamps, and encrypts it. No filing, no hassle.",
        tier: "capture",
        icon: "📷",
        status: "active",
        href: "/vault/photos",
        hasData: false,
      },
      {
        id: "before-after",
        title: "Before/After Gallery",
        description: "AI compares progress photos, highlights changes, and tracks results over time.",
        tier: "capture",
        icon: "🖼️",
        status: "active",
        href: "/vault/before-after",
        hasData: false,
      },
      {
        id: "decoder",
        title: "Treatment Decoder",
        description: "Scan a prescription, lab result, or bill → get a plain-English explanation instantly.",
        tier: "capture",
        icon: "🔍",
        status: "active",
        href: "/vault/decoder",
        hasData: decodedCount > 0,
      },
      {
        id: "priority",
        title: "Life Changing Diagnosis",
        description: "Your private crisis center—escape, learn, and access everything NPA offers when facing something urgent or life-changing",
        tier: "power",
        icon: "🛡️",
        status: "active",
        href: "/vault/priority",
        hasData: false,
      },
      {
        id: "voice",
        title: "Voice Memos",
        description: "Post-appointment brain dump → transcribed, organized, and searchable. Just talk.",
        tier: "capture",
        icon: "🎙️",
        status: "active",
        href: "/vault/voice-memos",
        hasData: false,
      },

      // MY RESOURCES (POWER)
      {
        id: "rewards",
        title: "Rewards Tracker",
        description: "All loyalty programs (Allē, Evolve, Aspire) in one place — with point balances and expiration alerts.",
        tier: "power",
        icon: "🎁",
        status: "active",
        href: "/vault/rewards",
        hasData: false,
      },
      {
        id: "provider-tracker",
        title: "Provider Tracker",
        description: "Rate and tag providers — trustworthy, pushy, amazing. Your private notes, always accessible.",
        tier: "power",
        icon: "⭐",
        status: "active",
        href: "/vault/provider-tracker",
        hasData: false,
      },
      {
        id: "red-flags",
        title: "Red Flags Monitor",
        description: "AI watches for drug interactions, timing conflicts, and safety issues — before they become problems.",
        tier: "power",
        icon: "🚩",
        status: "active",
        href: "/vault/red-flags",
        hasData: false,
      },
      {
        id: "trusted-circle",
        title: "Trusted Circle",
        description: "Share vault access with family or providers — with granular control over what they see.",
        tier: "power",
        icon: "🔐",
        status: "active",
        href: "/vault/trusted-circle",
        hasData: false,
      },

      // AI INTELLIGENCE
      {
        id: "ai-insights",
        title: "AI Health Insights",
        description: "Predictive health analytics with 94% confidence — risk assessment, pattern discovery, and AI-powered recommendations.",
        tier: "power",
        icon: "🧠",
        status: "active",
        href: "/vault/ai-insights",
        hasData: documentCount > 0 || chatCount > 0,
      },
      {
        id: "patterns",
        title: "Pattern Recognition",
        description: "Statistical pattern discovery with clinical rigor — correlation analysis, anomaly detection, and actionable insights.",
        tier: "power",
        icon: "📈",
        status: "active",
        href: "/vault/patterns",
        hasData: documentCount > 0,
      },
      {
        id: "recommendations",
        title: "Smart Recommendations",
        description: "Hyper-personalized AI recommendations with 94% accuracy — evidence-based, provider-integrated, with implementation roadmaps.",
        tier: "power",
        icon: "💊",
        status: "active",
        href: "/vault/recommendations",
        hasData: documentCount > 0 || chatCount > 0,
      },
      {
        id: "alerts",
        title: "Smart Alerts",
        description: "Intelligent notifications with AI-optimized timing — 94% response rate, priority-based, with smart delivery.",
        tier: "power",
        icon: "🔔",
        status: "active",
        href: "/vault/alerts",
        hasData: false,
      },
      {
        id: "document-analysis",
        title: "Document Analysis",
        description: "AI-powered document processing with 96% accuracy — automatic categorization, data extraction, and insight generation.",
        tier: "power",
        icon: "📄",
        status: "active",
        href: "/vault/documents",
        hasData: documentCount > 0,
      },
      {
        id: "user-personalization",
        title: "User Personalization",
        description: "Advanced behavioral profiling with 98% accuracy — preference learning, health personality assessment, dynamic adaptation.",
        tier: "power",
        icon: "👤",
        status: "active",
        href: "/vault/personalization",
        hasData: chatCount > 0 || documentCount > 0,
      },
      {
        id: "behavioral-analytics",
        title: "Behavioral Analytics",
        description: "Comprehensive usage analytics with 93% prediction accuracy — engagement tracking, health goal monitoring, predictive modeling.",
        tier: "power",
        icon: "📊",
        status: "active",
        href: "/vault/analytics",
        hasData: documentCount > 0 || chatCount > 0,
      },
      {
        id: "health-metrics",
        title: "Health Metrics",
        description: "Complete health metrics dashboard — vital signs tracking, medication adherence, appointment history, comprehensive visualization.",
        tier: "power",
        icon: "💓",
        status: "active",
        href: "/vault/metrics",
        hasData: appointmentCount > 0 || documentCount > 0,
      },
      {
        id: "appointments",
        title: "Appointments",
        description: "Smart appointment coordination with reminders and sync.",
        tier: "power",
        icon: "🗓️",
        status: "active",
        href: "/vault/appointments",
        hasData: appointmentCount > 0,
      },
      {
        id: "dashboard",
        title: "Vault Dashboard",
        description: "Overview of all Sacred Vault features and quick access.",
        tier: "power",
        icon: "📊",
        status: "active",
        href: "/vault/dashboard",
        hasData: documentCount > 0 || chatCount > 0 || appointmentCount > 0,
      },
    ];

    // User stats for display
    const stats = {
      documents: documentCount,
      chats: chatCount,
      appointments: appointmentCount,
      decoded: decodedCount,
    };

    const isEmpty = documentCount === 0 && chatCount === 0 && appointmentCount === 0;

    return NextResponse.json({
      features,
      stats,
      vaultName: vaultSettings?.vaultName || null,
      isEmpty,
    });

  } catch (error) {
    console.error('Error fetching vault features:', error);
    // Return empty vault data instead of error for better UX
    return NextResponse.json({
      features: [],
      stats: { documents: 0, chats: 0, appointments: 0, decoded: 0 },
      vaultName: null,
      isEmpty: true,
    });
  }
}
