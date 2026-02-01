import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Family Health Tree",
  description: "Map your family health history across generations. Understand inherited conditions and health patterns to make informed decisions.",
  openGraph: {
    title: "Family Health Tree | No Prior Authorization",
    description: "Map your family health history across generations. Understand inherited conditions and health patterns.",
    url: "https://nopriorauthorization.com/family-health",
  },
};

export default function FamilyHealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
