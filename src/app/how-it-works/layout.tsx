import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn how No Prior Authorization helps you organize, decode, and understand your family's health. Your complete health operating system.",
  openGraph: {
    title: "How It Works | No Prior Authorization",
    description: "Learn how No Prior Authorization helps you organize, decode, and understand your family's health.",
    url: "https://nopriorauthorization.com/how-it-works",
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
