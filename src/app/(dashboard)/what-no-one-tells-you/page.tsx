"use client";
export const dynamic = 'force-dynamic';
import Providers from "@/components/layout/providers";
import Header from "@/components/layout/header";
import DashboardNav from "@/components/layout/nav";
import Card, { CardContent } from "@/components/ui/card";

const realTalkSections = [
  {
    title: "The First Time Can Feel Weird",
    icon: "🎭",
    content: [
      "You might feel a slight heaviness in the treated area for the first few days—this is normal.",
      "Some people describe a mild 'tight' sensation that fades as you adjust.",
      "Your face won't feel completely different, but you may notice subtle changes in how certain expressions feel.",
      "It can take 2-3 treatments to find your ideal dose and placement.",
    ],
  },
  {
    title: "Results Aren't Instant",
    icon: "⏰",
    content: [
      "Day 1-3: You probably won't see much difference yet.",
      "Day 3-7: You'll start noticing the muscles relaxing.",
      "Day 10-14: Full results are typically visible.",
      "Pro tip: Don't schedule your first treatment right before a big event. Give yourself at least 2 weeks.",
    ],
  },
  {
    title: "Bruising Happens (Sometimes)",
    icon: "💜",
    content: [
      "Bruising is possible, especially around the eye area. It's not a sign anything went wrong.",
      "Avoid blood thinners, alcohol, and certain supplements (like fish oil, vitamin E) for a few days before treatment to minimize risk.",
      "If you do bruise, it typically fades within 5-10 days.",
      "Makeup can cover most minor bruising if needed.",
    ],
  },
  {
    title: "It's Not One-Size-Fits-All",
    icon: "🎯",
    content: [
      "What works for your friend may not be right for you. Facial anatomy varies significantly.",
      "Men typically need higher doses than women due to stronger facial muscles.",
      "Your provider should customize treatment based on YOUR face, not a standard template.",
      "Communication is key—be clear about what you want (natural vs. more frozen).",
    ],
  },
  {
    title: "You Might Love It (Or Not)",
    icon: "💭",
    content: [
      "Some people love the results immediately. Others need time to adjust.",
      "It's okay if Botox isn't for you—there's no obligation to continue.",
      "If you don't like something, tell your provider. They may be able to adjust future treatments.",
      "Results fade naturally over 3-4 months if you decide not to continue.",
    ],
  },
  {
    title: "The 'Perfect' Amount Takes Time",
    icon: "📊",
    content: [
      "Your first treatment is often a starting point, not perfection.",
      "Starting conservatively is better—you can always add more at a follow-up.",
      "It typically takes 2-3 sessions to dial in exactly what you like.",
      "A good provider welcomes follow-up appointments to assess and adjust.",
    ],
  },
  {
    title: "Side Effects Are Usually Mild",
    icon: "📋",
    content: [
      "Headache: Some people experience mild headaches that resolve within 24-48 hours.",
      "Drooping: Rare, but possible if product migrates. Usually temporary (weeks, not months).",
      "Redness/swelling: Minor and typically resolves within hours.",
      "Serious complications are very rare when treatment is performed by qualified providers.",
    ],
  },
  {
    title: "The Emotional Side",
    icon: "❤️",
    content: [
      "It's normal to feel nervous before your first treatment.",
      "Some people feel a bit strange about starting cosmetic treatments—that's okay.",
      "You don't need to justify your choice to anyone.",
      "Many people find treatments empowering, not vain.",
    ],
  },
];

export default function WhatNoOneTellsYouPage() {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 pb-24 md:pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">What No One Tells You</h1>
            <p className="text-gray-600">
              The honest, real-talk details about Botox that you wonyou won't findapos;t find in most
              marketing materials.
            </p>
          </div>

          <div className="grid gap-6">
            {realTalkSections.map((section, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{section.icon}</span>
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <span className="text-hot-pink mt-1">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gray-100 rounded-xl text-center">
            <p className="text-sm text-gray-600 italic">
              This is educational information only—not medical advice. Always consult
              a licensed healthcare provider for personalized recommendations.
            </p>
          </div>
        </main>

        <DashboardNav />
      </div>
    </Providers>
  );
}
