import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hormone Health & Harmony",
  description: "Understand your hormones, thyroid health, and metabolic wellness. Get clarity on hormone testing, symptoms, and treatment options.",
  openGraph: {
    title: "Hormone Health & Harmony | No Prior Authorization",
    description: "Understand your hormones, thyroid health, and metabolic wellness. Get clarity on hormone testing and treatment options.",
    url: "https://nopriorauthorization.com/hormones",
  },
};

export default function HormonesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
