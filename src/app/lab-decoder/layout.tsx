import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab Results Decoder",
  description: "Upload and decode your lab results instantly. Get plain-English explanations of blood work, metabolic panels, and medical tests.",
  openGraph: {
    title: "Lab Results Decoder | No Prior Authorization",
    description: "Upload and decode your lab results instantly. Get plain-English explanations of blood work and medical tests.",
    url: "https://nopriorauthorization.com/lab-decoder",
  },
};

export default function LabDecoderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
