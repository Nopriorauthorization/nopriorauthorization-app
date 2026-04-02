export const metadata = {
  title: "Frequently Asked Questions | No Prior Authorization",
  description:
    "Common questions about NPA products, playbooks, templates, and Pro Membership. Who is this for, what format are the files, and more.",
};

const FAQS = [
  {
    category: "About NPA",
    items: [
      { q: "What is No Prior Authorization?", a: "NPA is a digital product platform built by Danielle Alcala, founder of Hello Gorgeous Med Spa in Oswego, Illinois. We create playbooks, templates, clinical kits, and marketing systems specifically for med spa owners, nurse injectors, estheticians, and aesthetic entrepreneurs." },
      { q: "Who created these products?", a: "Everything is created by Danielle Alcala (licensed esthetician, med spa owner) and Ryan Kent, FNP-BC (board-certified family nurse practitioner and aesthetic injector). These are systems we actually use in our own practice — not theory repackaged from textbooks." },
      { q: "Who is NPA for?", a: "Med spa owners, nurse practitioners, physician assistants, estheticians, injectors, practice managers, and anyone building or growing an aesthetic practice. Whether you're opening your first clinic or scaling an established practice, there's a product for where you are right now." },
      { q: "Do I need to be a nurse practitioner or physician to use these?", a: "No. Our clinical playbooks are educational resources designed for licensed providers to adapt within their scope of practice. Our business, marketing, and operations products (Social Media System, Content Strategy, Google Playbook, Patient Journey Kits) are for anyone running or marketing an aesthetic practice." },
    ],
  },
  {
    category: "Products & Format",
    items: [
      { q: "What format are the products?", a: "Most products are delivered as interactive HTML files you open in any browser — they work on desktop, tablet, and phone. Some are also available as downloadable PDF ebooks. All templates are print-ready: just open and press File → Print → Save as PDF." },
      { q: "Can I edit and customize the templates?", a: "Yes. All clinical forms, consent templates, and patient-facing documents include editable fields. Add your practice name, logo, provider credentials, and contact information before printing." },
      { q: "Do I need Canva or any special software?", a: "No. Most products work directly in your web browser. Some social media template bundles include Canva links (Canva Free works — Pro is not required). Clinical forms and playbooks need no additional software." },
      { q: "Are these HIPAA compliant?", a: "Our clinical forms and consent templates are designed with HIPAA awareness built in. However, compliance requirements vary by state and practice type. We always recommend having a licensed attorney in your jurisdiction review clinical documents before use. Our HIPAA Compliance Kit and Medical Disclaimer System help you build the right foundation." },
      { q: "Can I use these for multiple locations?", a: "Products are licensed for use within your own practice or business. You may print unlimited copies for your staff and patients. Redistribution, resale, or sharing the original files with other practices is not permitted." },
    ],
  },
  {
    category: "Purchasing & Delivery",
    items: [
      { q: "How does delivery work?", a: "After purchase, you receive an email with a secure download link. Click the link to access all your templates and files instantly. Links are valid for 365 days." },
      { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards via Square secure checkout. Your payment information is never stored on our servers." },
      { q: "Can I get a refund?", a: "Due to the digital nature of our products, all sales are final once the download link has been accessed. If you experience a technical issue, contact us at hello@nopriorauthorization.com and we'll make it right." },
      { q: "I didn't receive my email — what do I do?", a: "Check your spam/junk folder first. If it's not there, email hello@nopriorauthorization.com with your order details and we'll resend your delivery link within 24 hours." },
    ],
  },
  {
    category: "Pro Membership",
    items: [
      { q: "What is the NPA Pro Membership?", a: "Pro Membership gives you access to every product in the NPA catalog — all playbooks, kits, templates, and tools — plus new products added monthly. It's $47/month or $397/year (save 30%)." },
      { q: "What's included in the membership?", a: "All current playbooks (10+), all patient journey kits (8), all clinical form bundles, all marketing systems, the digital audit tool, and every new product we release. Members get first access before public launch." },
      { q: "Can I cancel anytime?", a: "Yes. Cancel anytime — no contracts, no cancellation fees. You keep access through the end of your billing period." },
      { q: "Is the annual plan worth it?", a: "The annual plan is $397/year ($33/month) vs $47/month ($564/year). You save $167 per year — and you lock in the price even as we add more products." },
    ],
  },
  {
    category: "Clinical Content Disclaimer",
    items: [
      { q: "Is this medical advice?", a: "No. NPA products are educational resources and operational templates. They are not a substitute for professional medical advice, diagnosis, or treatment. All clinical content should be reviewed and adapted by a licensed provider within their scope of practice." },
      { q: "Should I have an attorney review the legal templates?", a: "Yes. Our legal templates (contracts, HIPAA forms, disclaimers) are designed as starting points. Your jurisdiction may have specific requirements. We always recommend having a licensed attorney review and customize before use." },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4537E]">
            Help Center
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-400">
            Can&apos;t find what you&apos;re looking for? Email us at{" "}
            <a href="mailto:hello@nopriorauthorization.com" className="text-[#D4537E] underline">
              hello@nopriorauthorization.com
            </a>
          </p>
        </div>

        {FAQS.map((section) => (
          <div key={section.category} className="mb-10">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#D4537E]">
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <h3 className="mb-2 text-sm font-bold text-white">
                    {faq.q}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
