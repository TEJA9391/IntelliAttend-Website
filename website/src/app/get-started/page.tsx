import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden font-sans selection:bg-teal-100 selection:text-slate-500">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-200/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-200/30 blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center min-h-[calc(100vh-6rem)]">
        
        {/* Left Side: Value Prop */}
        <div className="lg:w-1/2 w-full pt-8 lg:pt-0">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-12 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] mb-6 tracking-tight leading-[1.1]">
            Transform your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">campus operations today.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Join leading institutions using IntelliAttend to automate attendance, empower faculty, and enhance the student learning experience.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm text-xl font-bold text-slate-500">
                1
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Tell us about your campus</h3>
                <p className="text-slate-600">Provide basic details so we can tailor the platform to your scale and specific requirements.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm text-xl font-bold text-slate-500">
                2
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">See it in action</h3>
                <p className="text-slate-600">Get a personalized live demo from one of our education technology specialists.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm text-xl font-bold text-slate-500">
                3
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Deploy securely</h3>
                <p className="text-slate-600">Our enterprise team handles the heavy lifting to ensure a seamless integration.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Flow */}
        <div className="lg:w-1/2 w-full max-w-2xl mx-auto lg:mx-0">
          <OnboardingFlow />
        </div>

      </div>
    </div>
  );
}
