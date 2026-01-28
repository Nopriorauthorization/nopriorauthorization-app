import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Treatments & IV Therapy",
  description: "Learn about IV therapy, infusions, and specialized treatments. Understand what to expect and how to evaluate treatment options.",
  openGraph: {
    title: "Treatments & IV Therapy | No Prior Authorization",
    description: "Learn about IV therapy, infusions, and specialized treatments. Understand what to expect.",
    url: "https://nopriorauthorization.com/treatments",
  },
};

export default function TreatmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
