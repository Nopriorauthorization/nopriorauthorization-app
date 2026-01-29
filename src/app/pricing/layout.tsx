import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | No Prior Authorization",
  description: "Simple, transparent pricing for your family health operating system. Start free, upgrade when you're ready.",
  openGraph: {
    title: "Pricing | No Prior Authorization",
    description: "Simple, transparent pricing for your family health operating system. Start free, upgrade when you're ready.",
    url: "https://nopriorauthorization.com/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
