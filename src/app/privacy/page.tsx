import Link from "next/link";
import Button from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: [Insert date]</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-700">
              No Prior Authorization ("we," "our," or "us") is committed to
              protecting your privacy. This Privacy Policy explains how we collect,
              use, store, and protect information when you use our website and
              application.
            </p>
            <p className="text-gray-700 mt-4">
              Our platform is designed to provide educational information only and
              does not provide medical advice, diagnosis, or treatment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-semibold mb-2">a. Information You Provide</h3>
            <p className="text-gray-700 mb-4">We may collect:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Email address (if you choose to provide it)</li>
              <li>Information you voluntarily enter into the app or website</li>
              <li>Messages, questions, or educational interactions you initiate</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You are not required to provide personal identifying or health
              information to use basic features.
            </p>
            <h3 className="text-lg font-semibold mb-2 mt-6">
              b. Automatically Collected Information
            </h3>
            <p className="text-gray-700 mb-4">We may collect limited technical data, such as:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Device type</li>
              <li>Browser type</li>
              <li>General usage activity (pages viewed, interactions)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              This data is used only to improve platform performance and reliability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Information</h2>
            <p className="text-gray-700 mb-4">We use information solely to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide and improve educational content</li>
              <li>Maintain platform functionality</li>
              <li>Enhance user experience</li>
              <li>Ensure security and system integrity</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We do not sell, rent, or trade personal data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              4. Health &amp; Educational Information Disclaimer
            </h2>
            <p className="text-gray-700">Any information discussed on No Prior Authorization is:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Educational in nature</li>
              <li>Not medical advice</li>
              <li>Not a diagnosis or treatment recommendation</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Users should always consult licensed healthcare professionals regarding
              medical decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Storage &amp; Security</h2>
            <p className="text-gray-700 mb-4">
              We implement reasonable technical and organizational measures to protect
              information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Secure servers</li>
              <li>Restricted access</li>
              <li>Encrypted communications where applicable</li>
            </ul>
            <p className="text-gray-700 mt-4">
              However, no system can guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
            <p className="text-gray-700">
              We may use trusted third-party services (e.g., hosting, analytics) to
              operate the platform. These providers are permitted to process data only
              as necessary to perform their services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies &amp; Tracking</h2>
            <p className="text-gray-700 mb-4">
              We may use minimal cookies or similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Maintain sessions</li>
              <li>Improve site performance</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We do not use cookies for targeted advertising.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Your Choices</h2>
            <p className="text-gray-700 mb-4">You may:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Use the website without creating an account</li>
              <li>Decline optional email collection</li>
              <li>
                Request deletion of voluntarily provided information, subject to
                technical limitations
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Requests can be sent to: support@nopriorauthorization.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Children&#39;s Privacy</h2>
            <p className="text-gray-700">
              No Prior Authorization is not intended for use by children under 13.
              We do not knowingly collect information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy periodically. Updates will be posted
              on this page with a revised "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about this Privacy Policy, contact:
            </p>
            <p className="text-gray-700 mt-4">No Prior Authorization</p>
            <p className="text-gray-700">Email: support@nopriorauthorization.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
