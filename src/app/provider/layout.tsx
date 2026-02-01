import { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Providers",
  description: "Partner with No Prior Authorization. Embed expert health education on your clinic website. Build patient trust with verified provider tools.",
  openGraph: {
    title: "For Providers | No Prior Authorization",
    description: "Partner with No Prior Authorization. Embed expert health education on your clinic website.",
    url: "https://nopriorauthorization.com/provider",
  },
};

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
