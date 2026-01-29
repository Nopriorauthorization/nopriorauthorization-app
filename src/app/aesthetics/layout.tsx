import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aesthetics & Beau-Tox",
  description: "Your guide to aesthetic treatments, skincare science, and beauty procedures. Get educated about Botox, fillers, and cosmetic procedures without the sales pitch.",
  openGraph: {
    title: "Aesthetics & Beau-Tox | No Prior Authorization",
    description: "Your guide to aesthetic treatments and skincare science. Get educated about cosmetic procedures without the sales pitch.",
    url: "https://nopriorauthorization.com/aesthetics",
  },
};

export default function AestheticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
