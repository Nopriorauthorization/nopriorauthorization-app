import "./globals.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import MainNavigation from "@/components/layout/main-navigation";

export const metadata = {
  title: "Ask Beau-Tox - Family Health Operating System",
  description: "The complete family health operating system with AI mascots, sacred vault, blueprint, and comprehensive health management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <ErrorBoundary>
          <MainNavigation />
          <main className="pt-16">{children}</main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
