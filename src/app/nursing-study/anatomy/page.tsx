import { Metadata } from "next";
import AnatomyLanding from "@/components/study/AnatomyLanding";

export const metadata: Metadata = {
  title: "Anatomy & Physiology Study Hub | No Prior Authorization",
  description:
    "Nursing A&P study tool — cheat sheets, quizzes, and flashcards. Open the hub to start.",
  robots: { index: true, follow: true },
};

export default function AnatomyLandingPage() {
  return <AnatomyLanding />;
}
