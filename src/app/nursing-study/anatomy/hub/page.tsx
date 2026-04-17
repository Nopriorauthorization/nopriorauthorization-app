import { Metadata } from "next";
import AnatomyStudyHub from "@/components/study/AnatomyStudyHub";

export const metadata: Metadata = {
  title: "A&P Study Hub (App) | No Prior Authorization",
  description:
    "Complete A&P study tool — cheat sheets, quizzes, and flashcards for every lecture.",
  robots: { index: false, follow: false },
};

export default function AnatomyHubPage() {
  return <AnatomyStudyHub />;
}
