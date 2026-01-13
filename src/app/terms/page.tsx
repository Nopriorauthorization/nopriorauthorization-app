import Link from "next/link";
import Button from "@/components/ui/button";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black mb-8">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing or using Ask Beau-Tox™, you agree to be bound by these Terms
              of Use. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Educational Purpose Only</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-medium">
                IMPORTANT: Ask Beau-Tox™ provides EDUCATIONAL INFORMATION ONLY.
              </p>
            </div>
            <p className="text-gray-700 mb-4">
              Our service is designed to provide general educational information about
              Botox and injectable treatments. We explicitly DO NOT provide:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Medical advice or diagnoses</li>
              <li>Treatment recommendations</li>
              <li>Dosage or unit recommendations</li>
              <li>Injection site guidance</li>
              <li>Product or brand recommendations</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Always consult a licensed healthcare provider for personalized medical
              advice and treatment decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Subscription and Payments</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Subscriptions are billed monthly at $7.99 USD</li>
              <li>You may cancel your subscription at any time</li>
              <li>Cancellation takes effect at the end of your billing period</li>
              <li>No refunds are provided for partial billing periods</li>
              <li>Payments are processed securely through Stripe</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">You agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate account information</li>
              <li>Keep your login credentials secure</li>
              <li>Use the service for personal, non-commercial purposes only</li>
              <li>Not attempt to manipulate or abuse the AI system</li>
              <li>Not share your subscription with others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700">
              "Beau-Tox" and the Beau-Tox mascot are trademarks. All content,
              including text, graphics, and AI responses, is protected by copyright
              and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Disclaimer of Warranties</h2>
            <p className="text-gray-700">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO
              NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR USEFULNESS OF ANY
              INFORMATION PROVIDED. USE OF THE SERVICE IS AT YOUR OWN RISK.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
              ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700">
              We may update these Terms of Use from time to time. Continued use of
              the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
            <p className="text-gray-700">
              For questions about these Terms, please contact us at
              legal@askbeautox.com.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
