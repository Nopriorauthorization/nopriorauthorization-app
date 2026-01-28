import "./globals.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import MainNavigation from "@/components/layout/main-navigation";
import { MascotControllerProvider } from "@/context/MascotController";

export const metadata = {
  title: "No Prior Authorization - Family Health Operating System",
  description: "The complete family health operating system with AI health guides, secure vault, and comprehensive health management. Take control of your family's health journey.",
  openGraph: {
    title: "No Prior Authorization - Family Health Operating System",
    description: "Take control of your family's health journey with AI-powered health guides, secure document vault, and comprehensive health management tools.",
    url: "https://nopriorauthorization.com",
    siteName: "No Prior Authorization",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "No Prior Authorization - Family Health Operating System",
    description: "Take control of your family's health journey with AI-powered health guides and secure health management.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <MascotControllerProvider>
          <ErrorBoundary>
            <MainNavigation />
            <main className="pt-16">{children}</main>
          </ErrorBoundary>
        </MascotControllerProvider>
      </body>
    </html>
  );
}
