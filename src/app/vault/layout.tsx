import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Vault | No Prior Authorization",
  description: "Your secure, encrypted health vault. Store medical records, lab results, medications, and family health history in one protected place.",
  openGraph: {
    title: "Health Vault | No Prior Authorization",
    description: "Your secure, encrypted health vault. Store medical records, lab results, medications, and family health history in one protected place.",
    url: "https://nopriorauthorization.com/vault",
  },
};

export default function VaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
