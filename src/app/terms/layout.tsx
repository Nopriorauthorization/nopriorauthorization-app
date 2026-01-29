import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | No Prior Authorization",
  description: "Terms of Use for No Prior Authorization - the family health operating system.",
  openGraph: {
    title: "Terms of Use | No Prior Authorization",
    description: "Terms of Use for No Prior Authorization - the family health operating system.",
    url: "https://nopriorauthorization.com/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
