import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Micro 270 study hub",
  description:
    "Launch chapter quizzes and track progress locally — companion to the Micro 270 question bank.",
  robots: { index: false, follow: false },
};

export default function Micro270HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
