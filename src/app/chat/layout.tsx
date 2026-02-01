import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Health Chat | No Prior Authorization",
  description: "Chat with AI health guides who help you understand your health. Educational, personalized, and always available.",
  openGraph: {
    title: "AI Health Chat | No Prior Authorization",
    description: "Chat with AI health guides who help you understand your health. Educational, personalized, and always available.",
    url: "https://nopriorauthorization.com/chat",
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
