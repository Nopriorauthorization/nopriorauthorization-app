"use client";

import Providers from "@/components/layout/providers";
import Header from "@/components/layout/header";
import DashboardNav from "@/components/layout/nav";
import Card, { CardContent } from "@/components/ui/card";

const myths = [
  {
    myth: "Botox will make my face look frozen and expressionless",
    truth:
      "When administered properly by a skilled provider, Botox should allow for natural facial expressions. The 'frozen' look typically results from over-treatment. A good provider aims for subtle, natural results.",
    category: "Appearance",
  },
  {
    myth: "Botox is toxic and dangerous",
    truth:
      "Botox is FDA-approved and has been used safely for decades. The amounts used in cosmetic treatments are tiny and localized. Millions of treatments are performed safely each year.",
    category: "Safety",
  },
  {
    myth: "Once you start Botox, you can't stop",
    truth:
      "You can stop Botox treatments at any time. Your muscles will gradually return to their normal function, and your skin will return to its pre-treatment appearance. There's no physical dependency.",
    category: "Treatment",
  },
  {
    myth: "Botox and fillers are the same thing",
    truth:
      "They're completely different! Botox relaxes muscles to reduce wrinkles caused by movement. Fillers add volume to areas that have lost fullness. They address different concerns and are often used together.",
    category: "Basics",
  },
  {
    myth: "Botox is only for older people",
    truth:
      "Many people in their late 20s and 30s use Botox preventatively to slow the formation of deeper lines. There's no 'right' age—it depends on individual goals and concerns.",
    category: "Treatment",
  },
  {
    myth: "Botox results are immediate",
    truth:
      "Botox typically takes 3-7 days to start working, with full results visible at around 2 weeks. Patience is key! If you have an event, plan your treatment accordingly.",
    category: "Timing",
  },
  {
    myth: "Botox is painful",
    truth:
      "Most people describe Botox as feeling like tiny pinches. The needles used are very fine, and treatments are quick—usually under 15 minutes. Some providers use ice or numbing cream for comfort.",
    category: "Experience",
  },
  {
    myth: "You need to take time off work after Botox",
    truth:
      "Botox requires little to no downtime. Most people return to normal activities immediately. Some minor redness or swelling may occur but typically resolves within hours.",
    category: "Recovery",
  },
  {
    myth: "If you stop Botox, your wrinkles will get worse",
    truth:
      "Your wrinkles won't get worse than they would have been naturally. You simply return to your baseline. In fact, regular Botox may have trained your muscles to move less, potentially slowing line formation.",
    category: "Long-term",
  },
  {
    myth: "Any provider can do Botox well",
    truth:
      "Results heavily depend on the provider's skill, experience, and understanding of facial anatomy. Research credentials, look at before/after photos, and choose someone who specializes in injectables.",
    category: "Choosing Provider",
  },
];

export default function MythVaultPage() {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 pb-24 md:pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Myth Vault</h1>
            <p className="text-gray-600">
              Separating fact from fiction. Here are the most common misconceptions
              about Botox—debunked.
            </p>
          </div>

          <div className="space-y-4">
            {myths.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                      X
                    </div>
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded mb-2">
                        {item.category}
                      </span>
                      <h3 className="font-semibold text-lg mb-2 text-red-700">
                        "{item.myth}"
                      </h3>
                      <div className="flex items-start gap-3 mt-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">
                          ✓
                        </div>
                        <p className="text-gray-700">{item.truth}</p>
                      </div>
                    </div>
                  </div>
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
