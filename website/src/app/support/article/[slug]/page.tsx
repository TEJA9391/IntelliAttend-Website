import { ArrowLeft, CheckCircle2, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock database of help articles
const ARTICLES: Record<string, { title: string, content: string, category: string }> = {
  "reset-your-password": {
    category: "Account & Login",
    title: "Reset your password",
    content: `
      <h2>Forgot your password?</h2>
      <p>If you've forgotten your password, you can reset it in a few simple steps:</p>
      <ol>
        <li>Go to the <a href="/login">Login page</a>.</li>
        <li>Click on the <strong>Forgot Password?</strong> link below the login form.</li>
        <li>Enter the email address associated with your IntelliAttend account.</li>
        <li>Check your email inbox for a password reset link.</li>
        <li>Click the link and enter your new password.</li>
      </ol>
      <p>If you do not receive the email within 5 minutes, please check your spam folder or contact your IT administrator.</p>
    `
  },
  "attendance-not-recording": {
    category: "Attendance & Records",
    title: "Attendance not recording",
    content: `
      <h2>Troubleshooting Attendance Issues</h2>
      <p>If student attendance is not registering correctly, please verify the following:</p>
      <ul>
        <li><strong>Network Connection:</strong> Ensure your device or SmartBoard is connected to the internet.</li>
        <li><strong>Session Status:</strong> Check if the current class session is marked as 'Active' in your faculty dashboard.</li>
        <li><strong>Student Proximity:</strong> If using bluetooth or RFID, ensure students are within the required range.</li>
      </ul>
      <p>If the issue persists, you can perform a manual attendance override from the dashboard while our technical team investigates.</p>
    `
  },
  "smartboard-offline": {
    category: "SmartBoard",
    title: "SmartBoard offline",
    content: `
      <h2>Reconnecting your SmartBoard</h2>
      <p>A SmartBoard may appear offline for several reasons. Follow these steps to restore connectivity:</p>
      <ol>
        <li>Check the physical ethernet cable or Wi-Fi settings on the board.</li>
        <li>Restart the IntelliAttend companion app on the SmartBoard.</li>
        <li>Verify that your institution's firewall is not blocking our server ports (Contact IT).</li>
      </ol>
    `
  }
};

export function generateStaticParams() {
  return Object.keys(ARTICLES).map(slug => ({ slug }));
}

export default function HelpArticlePage({ params }: { params: { slug: string } }) {
  const article = ARTICLES[params.slug];

  if (!article) {
    // If article not found in our mock DB, show a generic one
    return (
      <div className="min-h-screen bg-white pt-24 pb-20 font-sans">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/support" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Help Center
          </Link>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Article under construction</h1>
            <p className="text-slate-500">We are currently updating this guide. Please check back later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 font-sans selection:bg-teal-100 selection:text-slate-500">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-slate-500 mb-8 space-x-2">
          <Link href="/support" className="hover:text-primary transition-colors">Help Center</Link>
          <span>/</span>
          <span className="text-slate-400">{article.category}</span>
        </nav>

        {/* Article Header */}
        <div className="mb-10 pb-10 border-b border-slate-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <LifeBuoy className="w-4 h-4 text-primary" />
            <span>Official Support Guide</span>
          </div>
        </div>

        {/* Article Body */}
        <div 
          className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#0F172A] prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-li:text-[#64748B]"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Feedback Section */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 text-center">
            <h3 className="text-lg font-bold text-[#0F172A] mb-4">Was this article helpful?</h3>
            <div className="flex items-center justify-center gap-4">
              <button className="px-6 py-2 rounded-full border border-slate-300 text-slate-700 font-medium hover:bg-white hover:border-primary hover:text-primary transition-all shadow-sm">
                Yes, thanks
              </button>
              <button className="px-6 py-2 rounded-full border border-slate-300 text-slate-700 font-medium hover:bg-white transition-all shadow-sm">
                No, not really
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
