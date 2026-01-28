import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | No Prior Authorization",
  description: "Learn how No Prior Authorization protects your privacy and handles your data. Your health information security is our priority.",
  openGraph: {
    title: "Privacy Policy | No Prior Authorization",
    description: "Learn how No Prior Authorization protects your privacy and handles your data.",
    url: "https://nopriorauthorization.com/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
