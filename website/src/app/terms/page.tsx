import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | IntelliAttend",
  description: "IntelliAttend's terms of service - the rules and guidelines for using our platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-8">Terms of Service</h1>
          <p className="text-[#64748B] mb-8">Last updated: January 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">1. Acceptance of Terms</h2>
            <p className="text-[#64748B] mb-6">
              By accessing or using IntelliAttend, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.
            </p>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">2. Use of the Platform</h2>
            <p className="text-[#64748B] mb-6">
              You may use IntelliAttend only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials.
            </p>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">3. User Responsibilities</h2>
            <p className="text-[#64748B] mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-[#64748B] mb-6 space-y-2">
              <li>Use the platform for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the platform</li>
              <li>Interfere with or disrupt the platform&apos;s functionality</li>
              <li>Share your account credentials with others</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">4. Intellectual Property</h2>
            <p className="text-[#64748B] mb-6">
              All content, features, and functionality of IntelliAttend are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">5. Limitation of Liability</h2>
            <p className="text-[#64748B] mb-6">
              IntelliAttend shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.
            </p>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">6. Contact Us</h2>
            <p className="text-[#64748B] mb-6">
              For questions about these Terms, please contact us at legal@intelliattend.app.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
