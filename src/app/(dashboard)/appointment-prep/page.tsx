"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Providers from "@/components/layout/providers";
import Header from "@/components/layout/header";
import DashboardNav from "@/components/layout/nav";
import Card, { CardContent, CardHeader } from "@/components/ui/card";

const beforeAppointment = [
  { id: 1, text: "Research potential providers and read reviews" },
  { id: 2, text: "Prepare a list of questions (use the list below!)" },
  { id: 3, text: "Take photos of your concerns to show the provider" },
  { id: 4, text: "Avoid alcohol for 24-48 hours before" },
  { id: 5, text: "Avoid blood thinners if medically safe (ask your doctor)" },
  { id: 6, text: "Skip supplements like fish oil, vitamin E, ginkgo for 1 week" },
  { id: 7, text: "Come with a clean face (no makeup on treatment areas)" },
  { id: 8, text: "Eat a light meal beforehand to prevent lightheadedness" },
];

const questionsToAsk = [
  {
    category: "Provider Qualifications",
    questions: [
      "What is your training and experience with injectables?",
      "How many Botox treatments do you perform monthly?",
      "Can I see before and after photos of your patients?",
      "Are you board-certified? In what specialty?",
    ],
  },
  {
    category: "About the Treatment",
    questions: [
      "What areas do you recommend treating based on my concerns?",
      "How many units do you typically use for this area?",
      "What brand of neurotoxin do you use, and why?",
      "What results can I realistically expect?",
    ],
  },
  {
    category: "Safety & Side Effects",
    questions: [
      "What are the potential side effects?",
      "What should I do if I experience complications?",
      "Do you offer follow-up appointments to assess results?",
      "How can I reach you if I have concerns after treatment?",
    ],
  },
  {
    category: "Practical Matters",
    questions: [
      "What is the total cost, including all fees?",
      "How long will the appointment take?",
      "What aftercare instructions should I follow?",
      "When should I schedule my next treatment?",
    ],
  },
];

const afterCare = [
  "Stay upright for 4 hours after treatment",
  "Avoid touching, rubbing, or massaging treated areas for 24 hours",
  "Skip intense exercise for 24 hours",
  "Avoid alcohol for 24 hours",
  "Don't lie face-down for the rest of the day",
  "Avoid excessive heat (saunas, hot yoga) for 24-48 hours",
  "It's okay to apply makeup gently after a few hours",
  "Contact your provider if you notice unusual symptoms",
];

export default function AppointmentPrepPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/appointment-prep");
    }
  }, [status, router]);

  const toggleCheck = (id: number) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (status === "loading") {
    return (
      <Providers>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </Providers>
    );
  }

  if (!session) return null;

  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 pb-24 md:pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Appointment Prep Guide</h1>
            <p className="text-gray-600">
              Everything you need to know before, during, and after your appointment.
            </p>
          </div>

          {/* Before Appointment Checklist */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>📋</span> Before Your Appointment
              </h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {beforeAppointment.map((item) => (
                  <li key={item.id}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checkedItems.includes(item.id)}
                        onChange={() => toggleCheck(item.id)}
                        className="w-5 h-5 rounded border-gray-300 text-hot-pink focus:ring-hot-pink"
                      />
                      <span
                        className={`${
                          checkedItems.includes(item.id)
                            ? "line-through text-gray-400"
                            : "text-gray-700 group-hover:text-black"
                        }`}
                      >
                        {item.text}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-sm text-gray-500">
                {checkedItems.length} of {beforeAppointment.length} completed
              </div>
            </CardContent>
          </Card>

          {/* Questions to Ask */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>❓</span> Questions to Ask Your Provider
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {questionsToAsk.map((section, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-hot-pink mb-3">
                      {section.category}
                    </h3>
                    <ul className="space-y-2">
                      {section.questions.map((question, qIndex) => (
                        <li
                          key={qIndex}
                          className="flex items-start gap-2 text-gray-700"
                        >
                          <span className="text-gray-400">•</span>
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Tip:</strong> Screenshot or print this list to bring to
                  your appointment. A good provider will welcome your questions!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Aftercare */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>✨</span> Aftercare Guidelines
              </h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {afterCare.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Red Flags */}
          <Card className="mb-6 border-red-200">
            <CardHeader className="bg-red-50">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-red-700">
                <span>🚨</span> When to Contact Your Provider
              </h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-red-500">•</span>
                  Severe or worsening headache
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-red-500">•</span>
                  Vision changes or double vision
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-red-500">•</span>
                  Difficulty swallowing or breathing
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-red-500">•</span>
                  Signs of infection (increasing redness, warmth, pus)
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-red-500">•</span>
                  Significant asymmetry or drooping after 2 weeks
                </li>
              </ul>
              <p className="mt-4 text-sm text-red-600 font-medium">
                These symptoms are rare, but if you experience them, contact your
                provider immediately.
              </p>
            </CardContent>
          </Card>

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
