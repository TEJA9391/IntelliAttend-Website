import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | IntelliAttend",
  description: "IntelliAttend's privacy policy - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-8">Privacy Policy</h1>
          <p className="text-[#64748B] mb-8">Last updated: January 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">1. Introduction</h2>
            <p className="text-[#64748B] mb-6">
              Welcome to IntelliAttend. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
            </p>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">2. Information We Collect</h2>
            <p className="text-[#64748B] mb-4">We collect information you provide directly, including:</p>
            <ul className="list-disc list-inside text-[#64748B] mb-6 space-y-2">
              <li>Account registration details (name, email, institution)</li>
              <li>Attendance and schedule data</li>
              <li>Communications you send to us</li>
              <li>Payment information (processed securely via third parties)</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">3. How We Use Your Information</h2>
            <p className="text-[#64748B] mb-6">
              We use your information to provide and improve our services, personalize your experience, communicate with you, and ensure the security of our platform.
            </p>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">4. Data Security</h2>
            <p className="text-[#64748B] mb-6">
              We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your data.
            </p>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">5. Contact Us</h2>
            <p className="text-[#64748B] mb-6">
              If you have questions about this privacy policy, please contact us at privacy@intelliattend.app.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
