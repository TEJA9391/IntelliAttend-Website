import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | IntelliAttend",
  description: "IntelliAttend's cookie policy - how we use cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-8">Cookie Policy</h1>
          <p className="text-[#64748B] mb-8">Last updated: January 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">1. What Are Cookies</h2>
            <p className="text-[#64748B] mb-6">
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
            </p>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">2. How We Use Cookies</h2>
            <p className="text-[#64748B] mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc list-inside text-[#64748B] mb-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the platform to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">3. Managing Cookies</h2>
            <p className="text-[#64748B] mb-6">
              You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our platform.
            </p>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">4. Third-Party Cookies</h2>
            <p className="text-[#64748B] mb-6">
              Some cookies are placed by third-party services that appear on our pages. We do not control these third-party cookies. Please refer to the respective third party&apos;s privacy policy for more information.
            </p>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">5. Updates to This Policy</h2>
            <p className="text-[#64748B] mb-6">
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>

            <h2 className="text-2xl font-bold text-[#0F172A] mt-12 mb-4">6. Contact Us</h2>
            <p className="text-[#64748B] mb-6">
              If you have questions about our use of cookies, please contact us at privacy@intelliattend.app.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
