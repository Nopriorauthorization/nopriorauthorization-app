export const metadata = {
  title: "Contact Us | No Prior Authorization",
  description:
    "Have a question about a product, Pro Membership, or your practice? Real answers from someone who actually runs a med spa. Email, DM, or send a message.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F5]">
      <iframe
        src="/forms/NPA-Contact-About.html"
        className="mx-auto block w-full max-w-[900px] border-0"
        style={{ minHeight: "100vh", background: "#FAF7F5" }}
        title="Contact & About — No Prior Authorization"
      />
    </div>
  );
}
