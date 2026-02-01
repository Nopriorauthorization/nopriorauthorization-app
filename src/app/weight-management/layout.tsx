import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weight Management & Slim-T",
  description: "Your guide to sustainable weight management. Understand GLP-1 medications, nutrition science, and metabolic health without judgment.",
  openGraph: {
    title: "Weight Management & Slim-T | No Prior Authorization",
    description: "Your guide to sustainable weight management. Understand GLP-1 medications and metabolic health without judgment.",
    url: "https://nopriorauthorization.com/weight-management",
  },
};

export default function WeightManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
