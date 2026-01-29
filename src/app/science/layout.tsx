import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Science & Peptides",
  description: "Understand peptides, supplements, and evidence-based medicine without hype or misinformation. Your guide to cutting-edge health science.",
  openGraph: {
    title: "Science & Peptides | No Prior Authorization",
    description: "Understand peptides, supplements, and evidence-based medicine without hype or misinformation.",
    url: "https://nopriorauthorization.com/science",
  },
};

export default function ScienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
