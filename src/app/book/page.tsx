import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { NPA_OG_IMAGE_PATH } from "@/config/npa-brand.config";
import { BookDigitalCheckoutPortal } from "./book-digital-checkout-portal";
import { BookShareToolbar } from "./book-share-toolbar";
import { BookSneakPeekEffects } from "./book-sneak-peek-effects";

const SITE = "https://nopriorauthorization.com";

export const dynamic = "force-static";

const bookOgTitle = "Hello Gorgeous — The Book (Sneak Peek)";
const bookOgDescription =
  "24 chapters on skin, lasers, injectables, hormones & wellness. Preview the pages — then get early access.";

export const metadata: Metadata = {
  title: { absolute: "Hello Gorgeous — The Book · Coming Soon" },
  description: bookOgDescription,
  alternates: {
    canonical: `${SITE}/book`,
  },
  openGraph: {
    type: "website",
    url: `${SITE}/book`,
    siteName: "No Prior Authorization",
    locale: "en_US",
    title: bookOgTitle,
    description: bookOgDescription,
    images: [
      {
        url: NPA_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Hello Gorgeous — The Book",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: bookOgTitle,
    description: bookOgDescription,
    images: [NPA_OG_IMAGE_PATH],
  },
  robots: { index: true, follow: true },
};

function loadSneakPeekMarkup(): { styles: string; bodyHtml: string } {
  const filePath = path.join(process.cwd(), "public/book/sneak-peek.html");
  const html = fs.readFileSync(filePath, "utf8");
  const styles = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";
  let bodyHtml = html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? "";
  bodyHtml = bodyHtml.replace(/<script>[\s\S]*?<\/script>/gi, "");
  return { styles, bodyHtml };
}

export default function BookPage() {
  const { styles, bodyHtml } = loadSneakPeekMarkup();

  const printStyles = `
@media print {
  .book-print-toolbar { display: none !important; }
  html, body, #book-sneak-peek-root { overflow: visible !important; height: auto !important; }
  section, .author-strip, .facts-strip, footer { break-inside: avoid; page-break-inside: avoid; }
  .pages-scroll { overflow: visible !important; }
}
`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <BookShareToolbar />
      <div id="book-sneak-peek-root" className="book-sneak-peek-root">
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </div>
      <BookDigitalCheckoutPortal />
      <BookSneakPeekEffects />
    </>
  );
}
