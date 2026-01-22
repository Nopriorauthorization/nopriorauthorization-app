import "./globals.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export const metadata = {
  title: "Ask Beau-Tox",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <ErrorBoundary>
          <main>{children}</main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
