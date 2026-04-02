export const metadata = {
  title: "Med Spa Ebook Library | 8 Professional Ebooks — NPA",
  description:
    "Beautifully designed PDF ebooks for aesthetic providers — Google SEO, Botox & Filler, Hormone Therapy, Peptides, Social Media, and more. Instant download.",
  openGraph: {
    title: "Med Spa Ebook Library | No Prior Authorization",
    description: "8 professional ebooks built from a real med spa practice. Instant PDF download.",
  },
};

export default function EbooksPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F5]">
      <iframe
        src="/forms/NPA-Ebook-Collection.html"
        className="mx-auto block w-full max-w-[900px] border-0"
        style={{ minHeight: "100vh", background: "#FAF7F5" }}
        title="NPA Ebook Collection"
      />
    </div>
  );
}
