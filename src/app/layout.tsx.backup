import "./globals.css";
import Providers from "@/components/layout/providers";
import MainNavigation from "@/components/layout/main-navigation";

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
        <Providers>
          <MainNavigation />
          <main className="pt-20">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
