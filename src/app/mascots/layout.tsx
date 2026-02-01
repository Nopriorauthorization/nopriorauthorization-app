import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet Your Health Guides | No Prior Authorization",
  description: "Meet the AI health guides who help you navigate health decisions. Each specializes in a different domain - from lab results to hormones to family health.",
  openGraph: {
    title: "Meet Your Health Guides | No Prior Authorization",
    description: "Meet the AI health guides who help you navigate health decisions. Each specializes in a different domain.",
    url: "https://nopriorauthorization.com/mascots",
  },
};

export default function MascotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
